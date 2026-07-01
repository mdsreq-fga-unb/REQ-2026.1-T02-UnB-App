import { SQLiteDatabase } from 'expo-sqlite';
import { extractTextWithInfo } from 'expo-pdf-text-extract';
import * as FileSystem from 'expo-file-system/legacy';
import { popularGradePorDados } from '../database/queries/gradeQueries';
import { extrairDadosDoPDF } from './pdfParser';

export async function processAndSaveDocument(
  db: SQLiteDatabase,
  fileUri: string,
  fileName: string | undefined,
  mimeType: string | undefined,
  size: number | undefined,
  overrideDocId?: number,
  callbacks?: {
     onConfirmProfileSync?: (aluno: { nome: string, matricula: string, curso: string }) => Promise<{ proceed: boolean, shouldSync: boolean }>,
     updateUserProfile?: (nome: string, matricula: string) => Promise<void>
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const extractResult = await extractTextWithInfo(fileUri);
    
    if (!extractResult.success) {
      return { success: false, message: 'Falha ao extrair texto do PDF. Tente novamente ou use outro arquivo.' };
    }

    // Funções lazy para não rodar todos os includes desnecessariamente
    const text = extractResult.text;
    const checkHistorico = () => text.includes('Histórico Escolar');
    const checkPasseLivre = () => text.includes('PASSE LIVRE ESTUDANTIL') || text.includes('Passe Livre');
    const checkBoletim = () => text.includes('RELATÓRIO DE NOTAS') || text.includes('Boletim de Notas');
    const checkIndice = () => text.includes('ÍNDICES ACADÊMICOS') || text.includes('Índice de Rendimento Acadêmico');
    const checkCarteirinha = () => text.includes('VALIDADE') && (text.includes('Secretário de Administração Acadêmica') || text.includes('Secretaria de Administração Acadêmica'));

    // Salvar o arquivo na tabela de documentos
    try {
      let docRecord: { id: number, title: string } | null = null;

      if (overrideDocId) {
        docRecord = await db.getFirstAsync<{id: number, title: string}>('SELECT id, title FROM documents WHERE id = ?', [overrideDocId]);
        
        // Validação estrita de tipo de documento
        if (docRecord) {
           if (docRecord.title === "Histórico Escolar" && !checkHistorico()) {
               return { success: false, message: 'O arquivo enviado não parece ser um Histórico Escolar. Verifique se escolheu o slot correto.' };
           }
           if (docRecord.title === "Passe Livre Estudantil" && !checkPasseLivre()) {
               return { success: false, message: 'O arquivo enviado não parece ser um Passe Livre Estudantil. Verifique se escolheu o slot correto.' };
           }
           if (docRecord.title === "Boletim de Notas" && !checkBoletim()) {
               return { success: false, message: 'O arquivo enviado não parece ser um Boletim de Notas. Verifique se escolheu o slot correto.' };
           }
           if (docRecord.title === "Índice Acadêmico" && !checkIndice()) {
               return { success: false, message: 'O arquivo enviado não parece ser um Índice Acadêmico. Verifique se escolheu o slot correto.' };
           }
           if (docRecord.title === "Carteirinha Estudantil" && !checkCarteirinha()) {
               return { success: false, message: 'O arquivo enviado não parece ser uma Carteirinha Estudantil. Verifique se escolheu o slot correto.' };
           }
        }
      } else {
        const docTitle = checkHistorico() ? "Histórico Escolar" : "Passe Livre Estudantil";
        docRecord = await db.getFirstAsync<{id: number, title: string}>('SELECT id, title FROM documents WHERE title = ?', [docTitle]);
      }
      
      if (docRecord) {
        const extension = fileName?.split('.').pop()?.toUpperCase() || 'ARQUIVO';
        const newMeta = `Importado em ${new Date().toLocaleDateString('pt-BR')} · ${extension}`;
        
        let newUri = "";
        if (FileSystem) {
          const finalFileName = `${docRecord.id}_${fileName || 'documento.pdf'}`;
          newUri = FileSystem.documentDirectory + finalFileName;
          await FileSystem.copyAsync({ from: fileUri, to: newUri });
        }

        await db.runAsync(
          'UPDATE documents SET uri = ?, fileName = ?, mimeType = ?, size = ?, meta = ? WHERE id = ?',
          [newUri, fileName || 'documento.pdf', mimeType || 'application/pdf', size || 0, newMeta, docRecord.id]
        );

        // Se a chamada veio da aba Documentos (tem overrideDocId) e é um slot "burro",
        // paramos a execução aqui. Ele salva o arquivo e não altera o banco de dados.
        if (overrideDocId && docRecord.title !== "Histórico Escolar" && docRecord.title !== "Passe Livre Estudantil") {
           return { success: false, message: 'O arquivo foi salvo em seus documentos.' };
        }
      }
    } catch (err) {
      console.error('Erro ao salvar documento no storage permanente:', err);
    }
    
    // Helper para prosseguir com a lógica de sync
    const attemptSync = async (alunoInfo: any, disciplinasFormatadas: any, successMessage: string) => {
      let proceed = true;
      let shouldSync = true;
      if (callbacks?.onConfirmProfileSync) {
         const result = await callbacks.onConfirmProfileSync(alunoInfo);
         proceed = result.proceed;
         shouldSync = result.shouldSync;
      }

      if (!proceed) {
         return { success: false, message: 'Importação cancelada pelo usuário.' };
      }

      await popularGradePorDados(db, alunoInfo, disciplinasFormatadas, shouldSync);
      if (shouldSync && callbacks?.updateUserProfile) {
         await callbacks.updateUserProfile(alunoInfo.nome, alunoInfo.matricula);
      }
      return { success: true, message: successMessage };
    };

    // Detecção automática de qual documento foi enviado
    if (checkHistorico()) {
      const { extrairDadosDoHistorico } = await import('./historicoParser');
      const parsedData = extrairDadosDoHistorico(text);
      
      if (!parsedData || parsedData.disciplinas.length === 0) {
        return { success: false, message: 'Não foi possível encontrar disciplinas válidas neste Histórico.' };
      }

      // Descobrir qual é o semestre atual (o maior ano/periodo do histórico)
      let maxAno = 0;
      let maxPeriodo = 0;
      for (const d of parsedData.disciplinas) {
        if (d.situacao === 'MATR') {
          if (d.ano > maxAno || (d.ano === maxAno && d.periodo > maxPeriodo)) {
            maxAno = d.ano;
            maxPeriodo = d.periodo;
          }
        }
      }

      if (maxAno === 0) {
        for (const d of parsedData.disciplinas) {
          if (d.ano > maxAno || (d.ano === maxAno && d.periodo > maxPeriodo)) {
            maxAno = d.ano;
            maxPeriodo = d.periodo;
          }
        }
      }

      const disciplinasFormatadas = parsedData.disciplinas.map((d: any) => ({
        codigo: d.codigo,
        turma: d.turma,
        nome: d.nome,
        docentes: d.docentes,
        horarios: [], // Histórico não possui horários
        local: '',    // Histórico não possui local
        situacao: d.situacao,
        ano: d.ano,
        periodo: d.periodo
      }));

      const alunoInfo = {
        nome: parsedData.nome,
        matricula: parsedData.matricula,
        curso: parsedData.curso,
        ano: maxAno,
        semestre: maxPeriodo,
        periodoLetivo: `${maxAno}.${maxPeriodo}`,
        cpf: parsedData.cpf
      };

      return await attemptSync(alunoInfo, disciplinasFormatadas, `Grade atualizada via Histórico Escolar (Semestre ${maxAno}.${maxPeriodo})! O arquivo foi salvo na aba Documentos.`);

    } else {
      // Se não for Histórico, assume que é Passe Livre
      const { aluno, disciplinas: parsedDisciplinas } = extrairDadosDoPDF(text);
      if (parsedDisciplinas.length === 0) {
        return { success: false, message: 'Não foi possível encontrar disciplinas válidas neste PDF.' };
      }

      return await attemptSync(aluno, parsedDisciplinas, 'Grade importada com sucesso via Declaração/Passe Livre! O arquivo foi salvo na aba Documentos.');
    }
  } catch (error: any) {
    return { success: false, message: `Erro ao processar o arquivo: ${error.message}` };
  }
}
