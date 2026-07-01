# 8.2 Requisitos Não Funcionais

> Classificados pelo modelo **URPS+** — Usabilidade, Confiabilidade *(Reliability)*, Desempenho *(Performance)*, Suportabilidade, e demais restrições (+).
>
> Os RNFs voltados ao público **60+** (estudantes do vestibular 60+ da UnB) seguem as recomendações da **WCAG 2.1 nível AA**, das **Android Accessibility Guidelines** e da **Apple Human Interface Guidelines (Accessibility)**, considerando dificuldades visuais, motoras e cognitivas típicas do envelhecimento.

---

=== "Usabilidade"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | RNF01 | Aplicar Interface com Tipografia Adaptável | O sistema deve aplicar nativamente uma interface de tipografia adaptável em todas as suas telas, garantindo tamanho mínimo de fonte de 14sp com suporte a escalabilidade e taxa de contraste mínima de 4,5:1 (WCAG AA), seguindo o padrão ABNT: texto sem serifa e justificado para a esquerda. |
    | RNF02 | Projetar Navegação de Tarefas Essenciais em Até 2 Cliques | O sistema deve permitir o acesso às tarefas essenciais do utilizador (aquelas realizadas frequentemente) em, no máximo, 2 cliques. Definem-se como tarefas essenciais: (1) acesso a materiais didáticos, (2) consulta de notas, (3) realização de matrículas, (4) consulta de locais de aula/prova (ensalamento), (5) emissão de documentos e (6) acesso à carteirinha estudantil. |
    | RNF18 | Definir Tamanho Mínimo de Fonte Base em 18sp | O sistema deve adotar **18sp** como tamanho mínimo de fonte em todos os textos do corpo da interface (descrições, rótulos, legendas e placeholders), permitindo aumento opcional para 22sp ou 28sp nas configurações de acessibilidade. Títulos principais devem ter, no mínimo, **24sp**. |
    | RNF19 | Definir Razão de Contraste Mínimo de 4.5:1 | Todo par texto/fundo deve apresentar razão de contraste mínima de **4.5:1** para texto comum e **3:1** para texto grande (≥ 24sp ou 18sp em negrito), em conformidade com a WCAG 2.1 nível AA. Elementos não textuais essenciais (ícones funcionais, bordas de campos, indicadores de foco) devem respeitar o mínimo de **3:1**. |
    | RNF20 | Padronizar Botões e Ícones com Alvo de Toque Mínimo de 48x48dp | Todos os elementos interativos (botões, ícones clicáveis, itens de lista) devem possuir área tocável mínima de **48x48dp** (Android) e **44x44pt** (iOS), com espaçamento interno mínimo de 8dp entre alvos adjacentes para evitar toques acidentais. Ícones devem ser sempre acompanhados de **rótulo textual visível** (não apenas tooltip), priorizando reconhecimento sobre memorização. |
    | RNF21 | Limitar Tarefas Essenciais a No Máximo 3 Passos Visíveis | Toda tarefa essencial (consultar grade horária, acessar documentos, abrir carteirinha, baixar material) deve ser concluída em, no máximo, **3 passos/telas visíveis** a partir da tela inicial. Cada passo deve exibir **uma única ação primária de destaque** (botão CTA principal), reduzindo a carga cognitiva e a chance de erro. |
    | RNF22 | Fornecer Indicação Clara do Próximo Passo e do Local Atual | Toda tela deve exibir **breadcrumbs**, **barra de progresso** ou **indicador de etapa** quando fizer parte de um fluxo, além de **destacar visualmente** (cor, peso, ícone) o próximo elemento a ser interagido. O cabeçalho deve sempre indicar o nome da tela atual e a ação em curso. |
    | RNF23 | Exibir Feedback Imediato e Mensagens de Erro em Linguagem Natural | Toda ação do usuário deve gerar **feedback visual e/ou tátil** em até 100ms. Mensagens de erro devem ser escritas em **linguagem natural**, sem códigos técnicos, indicando *o que aconteceu* e *o que o usuário deve fazer* (ex.: "Não foi possível carregar a grade. Toque em 'Tentar novamente'"). |
    | RNF24 | Permitir Ajuste Persistente de Tamanho de Fonte pelo Usuário | O sistema deve disponibilizar nas **Configurações de Acessibilidade** um seletor de tamanho de fonte (Pequeno / Médio / Grande / Extra-grande) que se aplica de forma persistente a toda a aplicação, respeitando também as configurações nativas do sistema operacional (Dynamic Type no iOS e Font Scale no Android). |
    | RNF25 | Aplicar Padrão Foco Visível em Navegação por Teclado/Leitor de Tela | Todos os elementos interativos devem possuir **estado de foco visível** (outline ou highlight com contraste ≥ 3:1) e ser totalmente acessíveis via leitor de tela (TalkBack/VoiceOver), com `accessibilityLabel`, `accessibilityRole` e `accessibilityHint` adequados. A ordem de leitura deve seguir a sequência lógica de leitura (de cima para baixo, da esquerda para a direita). |
    | RNF26 | Evitar Dependência Exclusiva de Cor para Transmitir Informação | Nenhuma informação essencial deve ser transmitida **apenas por cor**. Indicadores de estado (sucesso, erro, alerta) devem combinar cor **+ ícone + texto**, garantindo compreensão por usuários com daltonismo ou baixa acuidade visual. |

=== "Confiabilidade"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | RNF03 | Permitir Consulta de Informações Institucionais Offline | O sistema deve permitir a consulta da grade horária, ensalamento e carteirinha estudantil de forma 100% offline, sem dependência de internet, utilizando dados armazenados no cache local via SQLite. |
    | RNF04 | Sincronizar Automaticamente Dados Divergentes | O sistema deve possuir conexão direta com o banco de dados do web scraping toda vez que houver acesso à internet, verificando e sincronizando automaticamente informações divergentes das aulas matriculadas para salvamento local a cada abertura do aplicativo e em segundo plano a cada 15 minutos, respeitando tempo máximo de resposta de 5 segundos. |

=== "Desempenho"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | RNF10 | Limitar Durações de Animações de Interface a 300ms | Todas as animações de elementos de interface (ex: modais, diálogos e transições) devem ter duração máxima de 300ms, assegurando que o sistema seja percebido como imediato e não atrase as interações do usuário. |
    | RNF11 | Omitir Animações de Entrada em Telas de Alta Frequência | Telas e fluxos essenciais (acessados dezenas de vezes ao dia, como as abas principais) não devem possuir animações de entrada (entrance animations), priorizando o acesso direto à informação sem intervalos decorativos. |
    | RNF12 | Utilizar Aceleração por Hardware em Animações | As transições visuais devem ser otimizadas para rodar na GPU (utilizando estritamente propriedades como `transform` e `opacity`), evitando recálculos de layout para garantir fluidez constante sem queda de quadros (frame drops). |
    | RNF13 | Limitar Tempo de Processamento de Arquivos Locais | O processamento, extração de texto e parse estrutural de um histórico escolar em formato PDF deve ser concluído em no máximo 2 segundos, sendo executado de forma assíncrona para não causar engasgos (freezes) na interface. |
    | RNF14 | Garantir Resposta Imediata do Banco de Dados Local | Consultas corriqueiras ao cache local via SQLite (como carregar a grade horária do dia ou listar os documentos baixados) devem ter um tempo de resposta inferior a 50ms, garantindo a percepção de instantaneidade ao trocar de abas. |
    | RNF15 | Otimizar Tempo de Inicialização (Cold Start) | O aplicativo deve apresentar a primeira tela renderizada e estar completamente interativo (Time-to-Interactive) em até 2,5 segundos a partir de uma inicialização a frio. |
    | RNF16 | Limitar Uso de Armazenamento Local | O aplicativo deve manter uma pegada de armazenamento (storage footprint) otimizada, garantindo que o banco de dados SQLite e o cache de documentos baixados não ultrapassem um limite nominal de 50 MB, visando poupar recursos dos dispositivos móveis. |
    | RNF17 | Executar Sincronização Web sem Bloqueio de UI | As rotinas de web scraping e sincronização de dados divergentes devem rodar estritamente em segundo plano, sem ocupar ou bloquear a thread principal, mantendo a navegação em 60 FPS ininterruptos. |

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
    | RNF09 | Emitir Notificações sobre Eventos e Alterações Acadêmicas | O sistema deve emitir notificações proativas sobre datas críticas — como períodos de oferta de disciplinas e matrícula (com antecedência mínima de 24 horas) — e sobre alterações de professor, horário ou sala (em até 5 minutos após a sincronização), utilizando atualizações via nuvem para garantir que o aplicativo não perca funcionalidades por falta de atualização. |
