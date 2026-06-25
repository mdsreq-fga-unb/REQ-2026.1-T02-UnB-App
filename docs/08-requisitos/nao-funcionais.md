# 8.2 Requisitos Não Funcionais

> Classificados pelo modelo **URPS+** — Usabilidade, Confiabilidade *(Reliability)*, Desempenho *(Performance)*, Suportabilidade, e demais restrições (+).

---

=== "Usabilidade"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | RNF01 | Aplicar Interface com Tipografia Adaptável | O sistema deve aplicar nativamente uma interface de tipografia adaptável em todas as suas telas, seguindo o padrão ABNT: texto sem serifa e justificado para a esquerda. |
    | RNF02 | Projetar Navegação de Tarefas Essenciais em Até 2 Cliques | O sistema deve permitir o acesso às tarefas essenciais do utilizador (aquelas realizadas frequentemente) em, no máximo, 2 cliques. Definem-se como tarefas essenciais: (1) acesso a materiais didáticos, (2) consulta de notas, (3) realização de matrículas, (4) consulta de locais de aula/prova (ensalamento), (5) emissão de documentos e (6) acesso à carteirinha estudantil. |

=== "Confiabilidade"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | RNF03 | Permitir Consulta de Informações Institucionais Offline | O sistema deve permitir a consulta da grade horária, ensalamento e carteirinha estudantil de forma 100% offline, sem dependência de internet, utilizando dados armazenados no cache local via SQLite. |
    | RNF04 | Sincronizar Automaticamente Dados Divergentes | O sistema deve possuir conexão direta com o banco de dados do web scraping toda vez que houver acesso à internet, verificando e sincronizando automaticamente informações divergentes das aulas matriculadas para salvamento local. |

=== "Desempenho"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | RNF10 | Limitar Durações de Animações de Interface a 300ms | Todas as animações de elementos de interface (ex: modais, diálogos e transições) devem ter duração máxima de 300ms, assegurando que o sistema seja percebido como imediato e não atrase as interações do usuário. |
    | RNF11 | Omitir Animações de Entrada em Telas de Alta Frequência | Telas e fluxos essenciais (acessados dezenas de vezes ao dia, como as abas principais) não devem possuir animações de entrada (entrance animations), priorizando o acesso direto à informação sem intervalos decorativos. |
    | RNF12 | Utilizar Aceleração por Hardware em Animações | As transições visuais devem ser otimizadas para rodar na GPU (utilizando estritamente propriedades como `transform` e `opacity`), evitando recálculos de layout para garantir fluidez constante sem queda de quadros (frame drops). |

=== "Suportabilidade"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | RNF05 | Garantir Compatibilidade com Android 7.0+ e iOS 15.1+ | O sistema deve suportar sistemas operacionais de acordo com o mínimo exigido pela biblioteca Expo, garantindo compatibilidade com Android 7.0 ou superior e iOS 15.1 ou superior. |
    | RNF06 | Atualizar Calendário Acadêmico e Correções via OTA | O sistema deve suportar atualizações na nuvem para mitigar problemas urgentes — como dados de calendário desatualizados ou bugs críticos — sem necessidade de publicação de nova versão nas lojas, utilizando o Send Over-the-Air Updates do EAS (Expo Application Services). |

=== "+ Restrições"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | RNF07 | Desenvolver Aplicativo com React Native, Expo e TypeScript | O sistema deve ser desenvolvido utilizando React Native, Expo e TypeScript como stack tecnológica principal. |
    | RNF08 | Armazenar Dados Locais com Expo SQLite | O sistema deve armazenar todos os dados locais do usuário utilizando a biblioteca Expo SQLite, garantindo persistência e acesso offline às informações. |
    | RNF09 | Emitir Notificações sobre Eventos e Alterações Acadêmicas | O sistema deve emitir notificações proativas sobre datas críticas — como períodos de oferta de disciplinas e matrícula — e sobre alterações de professor, horário ou sala, utilizando atualizações via nuvem para garantir que o aplicativo não perca funcionalidades por falta de atualização. |
