export type HorarioParseResult = {
  diaSemana: number;
  turno: string;
  horarioBloco: number;
  horaInicio: string;
  horaFim: string;
  local: string;
};

const MAPA_HORARIOS: Record<string, Record<number, { inicio: string; fim: string }>> = {
  M: {
    1: { inicio: '08:00', fim: '08:55' },
    2: { inicio: '08:55', fim: '09:50' },
    3: { inicio: '10:00', fim: '10:55' },
    4: { inicio: '10:55', fim: '11:50' },
    5: { inicio: '12:00', fim: '12:55' },
  },
  T: {
    1: { inicio: '12:55', fim: '13:50' },
    2: { inicio: '14:00', fim: '14:55' },
    3: { inicio: '14:55', fim: '15:50' },
    4: { inicio: '16:00', fim: '16:55' },
    5: { inicio: '16:55', fim: '17:50' },
    6: { inicio: '18:00', fim: '18:55' },
  },
  N: {
    1: { inicio: '19:00', fim: '19:50' },
    2: { inicio: '19:50', fim: '20:40' },
    3: { inicio: '20:50', fim: '21:40' },
    4: { inicio: '21:40', fim: '22:30' },
  }
};

export function parseHorarioUnB(horarioStr: string, localStr: string = ''): HorarioParseResult[] {
  const blocos = horarioStr.split(/\s+/);
  const resultados: HorarioParseResult[] = [];

  // 1. Extrair dias únicos para mapear os locais (ex: 35M34 -> dias 3 e 5)
  const todosDias = new Set<number>();
  for (const bloco of blocos) {
    const match = bloco.match(/^(\d+)([MTN])(\d+)$/i);
    if (match) {
      match[1].split('').map(Number).forEach(d => todosDias.add(d));
    }
  }
  
  const uniqueDias = Array.from(todosDias).sort();
  const locais = localStr.split('/').map(s => s.trim());
  
  // 2. Mapear cada dia para o seu respectivo local
  const mapDiaLocal: Record<number, string> = {};
  for (let i = 0; i < uniqueDias.length; i++) {
     const dia = uniqueDias[i];
     let loc = locais[i] || locais[0] || '';
     
     // Inteligência para adicionar o prefixo "FCTE -" se a segunda sala for apenas "I3"
     if (locais.length > 1 && i > 0 && !loc.includes('-') && locais[0].includes('-')) {
        const prefix = locais[0].split('-')[0].trim();
        loc = `${prefix} - ${loc}`;
     }
     
     mapDiaLocal[dia] = loc;
  }

  // 3. Gerar os resultados com os locais específicos do dia
  for (const bloco of blocos) {
    const regex = /^(\d+)([MTN])(\d+)$/i;
    const match = bloco.match(regex);
    if (!match) continue;

    const dias = match[1].split('').map(Number);
    const turno = match[2].toUpperCase();
    const horas = match[3].split('').map(Number);

    for (const dia of dias) {
      for (const hora of horas) {
        const detalhes = MAPA_HORARIOS[turno]?.[hora];
        if (detalhes) {
          resultados.push({
            diaSemana: dia,
            turno,
            horarioBloco: hora,
            horaInicio: detalhes.inicio,
            horaFim: detalhes.fim,
            local: mapDiaLocal[dia]
          });
        }
      }
    }
  }

  return resultados;
}
