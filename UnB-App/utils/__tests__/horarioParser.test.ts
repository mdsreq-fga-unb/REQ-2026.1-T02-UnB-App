import { parseHorarioUnB } from '../horarioParser';

describe('horarioParser - parseHorarioUnB', () => {
  it('Deve parsar um horário padrão da UnB no turno da manhã (M) corretamente', () => {
    const horarioStr = '35M34';
    const localStr = 'FGA - Sala I8';

    const resultado = parseHorarioUnB(horarioStr, localStr);

    // M3 = 10:00 - 10:55, M4 = 10:55 - 11:50
    // Dias: 3 (Terça-feira), 5 (Quinta-feira)
    expect(resultado).toHaveLength(4);

    // Verifica primeiro bloco no dia 3
    const bloco1 = resultado.find(r => r.diaSemana === 3 && r.horarioBloco === 3);
    expect(bloco1).toBeDefined();
    expect(bloco1?.horaInicio).toBe('10:00');
    expect(bloco1?.horaFim).toBe('10:55');
    expect(bloco1?.local).toBe('FGA - Sala I8');

    // Verifica segundo bloco no dia 5
    const bloco2 = resultado.find(r => r.diaSemana === 5 && r.horarioBloco === 4);
    expect(bloco2).toBeDefined();
    expect(bloco2?.horaInicio).toBe('10:55');
    expect(bloco2?.horaFim).toBe('11:50');
  });

  it('Deve tratar múltiplos locais separados por barra e propagar o prefixo', () => {
    const horarioStr = '24T23 6T4';
    const localStr = 'FCTE - Sala A1 / Sala I3';

    const resultado = parseHorarioUnB(horarioStr, localStr);

    // Dias extraídos: 2, 4 e 6
    // Local index 0: FCTE - Sala A1 (Mapeado pro dia 2)
    // Local index 1: Sala I3 (Mapeado pro dia 4, com inteligência de prefixo "FCTE - Sala I3")
    // Local index 2: Não existe (Fallback para index 0 ou index 1? Mapeado pro dia 6 com fallback de locais[0] se não houver mais)
    const blocoDia2 = resultado.find(r => r.diaSemana === 2);
    expect(blocoDia2?.local).toBe('FCTE - Sala A1');

    const blocoDia4 = resultado.find(r => r.diaSemana === 4);
    expect(blocoDia4?.local).toBe('FCTE - Sala I3'); // Prefixo inteligente propagado
  });

  it('Deve ignorar blocos mal formatados sem quebrar a execução', () => {
    const horarioStr = '35M34 INVALIDO 2T12';
    const localStr = 'Sala I3';

    const resultado = parseHorarioUnB(horarioStr, localStr);

    // 35M34 -> 4 blocos
    // INVALIDO -> Ignorado
    // 2T12 -> 2 blocos (dia 2, bloco 1 e 2 no turno T)
    expect(resultado).toHaveLength(6);
  });

  it('Deve lidar com strings vazias de forma segura', () => {
    const resultado = parseHorarioUnB('');
    expect(resultado).toHaveLength(0);
  });
});
