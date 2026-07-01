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
  overrideDocId?: number
): Promise<{ success: boolean; message: string }> {
  try {
    const extractResult = await extractTextWithInfo(fileUri);
    
    if (!extractResult.success) {
      return { success: false, message: 'Falha ao extrair texto do PDF. Tente novamente ou use outro arquivo.' };
    }

    const text = extractResult.text;
    const isHistorico = text.includes('Histórico Escolar');
    const isPasseLivre = text.includes('PASSE LIVRE ESTUDANTIL') || text.includes('Passe Livre');
    
    // Salvar o arquivo na tabela de documentos
    try {
      let docRecord: { id: number, title: string } | null = null;

      if (overrideDocId) {
        docRecord = await db.getFirstAsync<{id: number, title: string}>('SELECT id, title FROM documents WHERE id = ?', [overrideDocId]);
        
        // Validação estrita de tipo de documento
        if (docRecord) {
           if (docRecord.title === "Histórico Escolar" && !isHistorico) {
               return { success: false, message: 'O arquivo enviado não parece ser um Histórico Escolar. Verifique se escolheu o slot correto.' };
           }
           if (docRecord.title === "Passe Livre Estudantil" && !isPasseLivre) {
               return { success: false, message: 'O arquivo enviado não parece ser um Passe Livre Estudantil. Verifique se escolheu o slot correto.' };
           }
        }
      } else {
        const docTitle = isHistorico ? "Histórico Escolar" : "Passe Livre Estudantil";
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
           return { success: false, message: 'Documento salvo (Sem Processamento Automático).' };
        }
      }
    } catch (err) {
      console.error('Erro ao salvar documento no storage permanente:', err);
    }
    
    // Detecção automática de qual documento foi enviado
    if (isHistorico) {
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

      const disciplinasFormatadas = parsedData.disciplinas.map(d => ({
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

      await popularGradePorDados(db, alunoInfo, disciplinasFormatadas);
      return { success: true, message: `Grade atualizada via Histórico Escolar (Semestre ${maxAno}.${maxPeriodo})! O arquivo foi salvo na aba Documentos.` };

    } else {
      // Se não for Histórico, assume que é Passe Livre
      const { aluno, disciplinas: parsedDisciplinas } = extrairDadosDoPDF(text);
      if (parsedDisciplinas.length === 0) {
        return { success: false, message: 'Não foi possível encontrar disciplinas válidas neste PDF.' };
      }

      await popularGradePorDados(db, aluno, parsedDisciplinas);
      return { success: true, message: 'Grade importada com sucesso via Declaração/Passe Livre! O arquivo foi salvo na aba Documentos.' };
    }
  } catch (error: any) {
    return { success: false, message: `Erro ao processar o arquivo: ${error.message}` };
  }
}
