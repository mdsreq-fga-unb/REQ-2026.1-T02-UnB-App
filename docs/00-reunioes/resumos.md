# 0.3 Resumos das Reuniões

> Página para sintetizar decisões, pendências e próximos passos de cada reunião.

---

| Reunião | Data | Decisões principais | Pendências | Próximos passos |
|---------|------|---------------------|------------|-----------------|
| R01 | 13/04/2026 | Produto focado em autonomia acadêmica para discentes 60+; adoção de FDD com marcos quinzenais; validação contínua com cliente; definição dos diferenciais de acessibilidade e suporte offline. | Confirmar estratégia técnica de integração com dados institucionais; detalhar RF/RNF e critérios de aceitação da U2; organizar agenda de validações com a cliente. | Iniciar U2 com elicitação e refinamento de requisitos; montar lista de funcionalidades priorizada (MoSCoW); preparar critérios de validação e plano de testes de usabilidade com público 60+. |
| R02 | 18/05/2026 | Adoção oficial do FDD e ciclo iterativo-incremental; definição do MVP com foco nas features F9 (documentos), F5 (onboarding) e F7 (grade); restrições técnicas (React Native + Expo SQLite); definição de DoR e DoD rigorosos. | Finalizar protótipos no Figma; concluir documento de visão de produto; mapear requisitos de desempenho; agendar features incrementais e sugestões. | Finalizar Figma e visão de produto até 22/05; iniciar desenvolvimento do MVP seguindo FDD; aplicar DoR e DoD em cada ciclo; avaliar RNFs de desempenho pendentes. |

## R01 · Síntese detalhada

### Decisões principais

- O projeto UnB APP manterá foco em acessibilidade, autonomia e redução da dependência de terceiros para alunos 60+.
- O processo de trabalho seguirá FDD com ciclos de iteração de 15 dias (Planejar, Projetar e Construir por Funcionalidade).
- As interações com stakeholders ocorrerão em dois ritmos:
	- validações quinzenais (demonstração das funcionalidades construídas);
	- contato assíncrono contínuo via WhatsApp.
- O produto priorizará quatro blocos de valor:
	- identidade/acesso institucional;
	- rotina acadêmica simplificada;
	- notificações proativas;
	- acolhimento e letramento digital.

### Pendências

- Detalhar e validar os requisitos da Unidade 2 (funcionais e não funcionais).
- Definir critérios formais de aceitação, DoR e DoD para as Features priorizadas.
- Consolidar abordagem para consumo de dados institucionais (API/intermediação/web scraping, conforme viabilidade).
- Planejar as sessões de validação com usuários 60+ para reduzir risco de baixa disponibilidade.

### Próximos passos

- Estruturar backlog da U2 em Features e tarefas no GitHub Projects.
- Priorizar MVP com foco inicial em carteirinha offline e grade horária.
- Preparar roteiro de entrevistas e validações de usabilidade com Maria Fátima.
- Manter revisão quinzenal dos incrementos com feedback contínuo.

## R02 · Síntese detalhada

### Decisões principais

- Adoção confirmada do FDD (Feature-Driven Development) como metodologia com ciclo iterativo-incremental, garantindo entregas contínuas e flexibilidade de requisitos frente ao XP.
- O MVP foi definido cruzando a técnica MoSCoW e uma matriz de Valor vs Esforço baseada nos pedidos de pesquisa e na estimativa de horas.
- As três features centrais do MVP são: F9 (Central de documentos oficiais), F5 (Fluxos de onboarding) e F7 (Consulta de grade horária).
- Estão previstas a F2 (QR Code BCE) e F3 (Carteirinha digital) para o primeiro ciclo de desenvolvimento.
- A stack tecnológica foi consolidada: frontend com React Native + Expo + TypeScript, banco local com Expo SQLite e compatibilidade mínima para Android 7.0 e iOS 15.1.
- Estabelecidos critérios rigorosos de qualidade: DoR (exige requisitos claros, caber na iteração e BDD) e DoD (exige valor, testes aprovados, padronização e revisão).

### Pendências

- Finalizar o protótipo de alta fidelidade (Figma), que encontra-se atrasado.
- Concluir a elaboração do documento de Visão de Produto e Projeto até 22/05.
- Mapear os requisitos não funcionais referentes a desempenho, que não foram levantados nesta etapa.
- Reavaliar prazos e o escopo das features incrementais (F4, F6, F8) e das features de ideação/sugestão (F1, F3, F6).

### Próximos passos

- Finalizar os protótipos de interface no Figma referentes ao MVP e o documento de Visão de Produto/Projeto até a data limite de 22/05.
- Encerrar formalmente o planejamento da Unidade 2 para iniciar o desenvolvimento efetivo das features F9, F5 e F7.
- Aplicar o fluxo rígido estabelecido de DoR e DoD a cada nova entrega a fim de evitar refações (lição aprendida da migração para o FDD).
- Catalogar posteriormente os requisitos não funcionais de desempenho identificados como lacuna.
