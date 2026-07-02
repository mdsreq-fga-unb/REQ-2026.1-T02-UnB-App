# 8.2 Requisitos Não Funcionais

> Classificados pelo modelo **URPS+** — Usabilidade, Confiabilidade *(Reliability)*, Desempenho *(Performance)*, Suportabilidade, e demais restrições (+).
>
> Os RNFs voltados ao público **60+** (estudantes do vestibular 60+ da UnB) seguem as recomendações da **WCAG 2.1 nível AA**, das **Android Accessibility Guidelines** e da **Apple Human Interface Guidelines (Accessibility)**, considerando dificuldades visuais, motoras e cognitivas típicas do envelhecimento.

---

=== "Usabilidade"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | <a id="rnf01"></a>RNF01 | Aplicar Interface com Tipografia Adaptável | O sistema deve aplicar nativamente uma interface de tipografia adaptável em todas as suas telas, seguindo o padrão ABNT: texto sem serifa e justificado para a esquerda. |
    | <a id="rnf02"></a>RNF02 | Projetar Navegação de Tarefas Essenciais em Até 2 Cliques | O sistema deve permitir o acesso às tarefas essenciais do utilizador em, no máximo, 2 cliques. Definem-se como tarefas essenciais: acesso a materiais didáticos, consulta de notas, realização de matrículas, consulta de locais de aula/prova, emissão de documentos e acesso à carteirinha estudantil. |
    | <a id="rnf18"></a>RNF18 | Definir Tamanho Mínimo de Fonte Base em 18sp | O sistema deve adotar **18sp** como tamanho mínimo de fonte em todos os textos do corpo da interface, permitindo aumento opcional para 22sp ou 28sp nas configurações de acessibilidade. Títulos principais devem ter, no mínimo, **24sp**. |
    | <a id="rnf19"></a>RNF19 | Definir Razão de Contraste Mínimo de 4.5:1 | Todo par texto/fundo deve apresentar razão de contraste mínima de **4.5:1** para texto comum e **3:1** para texto grande, em conformidade com a WCAG 2.1 nível AA. Elementos não textuais essenciais devem respeitar o mínimo de **3:1**. |
    | <a id="rnf20"></a>RNF20 | Padronizar Botões e Ícones com Alvo de Toque Mínimo de 48x48dp | Todos os elementos interativos devem possuir área tocável mínima de **48x48dp** no Android e **44x44pt** no iOS, com espaçamento interno mínimo de 8dp entre alvos adjacentes. Ícones devem ser acompanhados de rótulo textual visível. |
    | <a id="rnf21"></a>RNF21 | Limitar Tarefas Essenciais a No Máximo 3 Passos Visíveis | Toda tarefa essencial deve ser concluída em, no máximo, **3 passos/telas visíveis** a partir da tela inicial, com uma ação primária clara em cada etapa. |
    | <a id="rnf22"></a>RNF22 | Fornecer Indicação Clara do Próximo Passo e do Local Atual | Toda tela deve exibir indicador de etapa, localização atual ou destaque visual do próximo elemento a ser interagido quando fizer parte de um fluxo. |
    | <a id="rnf23"></a>RNF23 | Exibir Feedback Imediato e Mensagens de Erro em Linguagem Natural | Toda ação do usuário deve gerar feedback visual e/ou tátil em até 100ms. Mensagens de erro devem ser escritas em linguagem natural, indicando o que aconteceu e o que o usuário deve fazer. |
    | <a id="rnf24"></a>RNF24 | Permitir Ajuste Persistente de Tamanho de Fonte pelo Usuário | O sistema deve disponibilizar nas configurações de acessibilidade um seletor de tamanho de fonte persistente, respeitando também as configurações nativas do sistema operacional. |
    | <a id="rnf25"></a>RNF25 | Aplicar Padrão Foco Visível em Navegação por Teclado/Leitor de Tela | Todos os elementos interativos devem possuir estado de foco visível e ser acessíveis via leitor de tela, com `accessibilityLabel`, `accessibilityRole` e `accessibilityHint` adequados. |
    | <a id="rnf26"></a>RNF26 | Evitar Dependência Exclusiva de Cor para Transmitir Informação | Nenhuma informação essencial deve ser transmitida apenas por cor. Indicadores de estado devem combinar cor, ícone e texto. |

=== "Confiabilidade"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | <a id="rnf03"></a>RNF03 | Permitir Consulta de Informações Institucionais Offline | O sistema deve permitir a consulta da grade horária, ensalamento e carteirinha estudantil de forma 100% offline, utilizando dados armazenados no cache local via SQLite. |
    | <a id="rnf04"></a>RNF04 | Sincronizar Automaticamente Dados Divergentes | O sistema deve verificar e sincronizar automaticamente informações divergentes das aulas matriculadas quando houver acesso à internet. |

=== "Desempenho"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | <a id="rnf10"></a>RNF10 | Limitar Durações de Animações de Interface a 300ms | Todas as animações de interface devem ter duração máxima de 300ms, assegurando que o sistema seja percebido como imediato. |
    | <a id="rnf11"></a>RNF11 | Omitir Animações de Entrada em Telas de Alta Frequência | Telas e fluxos essenciais não devem possuir animações de entrada, priorizando o acesso direto à informação. |
    | <a id="rnf12"></a>RNF12 | Utilizar Aceleração por Hardware em Animações | As transições visuais devem usar propriedades otimizadas para GPU, como `transform` e `opacity`, evitando recálculos de layout. |
    | <a id="rnf13"></a>RNF13 | Limitar Tempo de Processamento de Arquivos Locais | O processamento e parse estrutural de um histórico escolar em PDF deve ser concluído em até 2 segundos, de forma assíncrona. |
    | <a id="rnf14"></a>RNF14 | Garantir Resposta Imediata do Banco de Dados Local | Consultas corriqueiras ao cache local via SQLite devem ter tempo de resposta inferior a 50ms. |
    | <a id="rnf15"></a>RNF15 | Otimizar Tempo de Inicialização (Cold Start) | O aplicativo deve apresentar a primeira tela renderizada e estar interativo em até 2,5 segundos a partir de uma inicialização a frio. |
    | <a id="rnf16"></a>RNF16 | Limitar Uso de Armazenamento Local | O aplicativo deve manter o banco de dados SQLite e o cache de documentos dentro de uma pegada de armazenamento otimizada, com limite nominal de 50 MB. |
    | <a id="rnf17"></a>RNF17 | Executar Sincronização Web sem Bloqueio de UI | As rotinas de web scraping e sincronização devem rodar em segundo plano, sem bloquear a thread principal. |

=== "Suportabilidade"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | <a id="rnf05"></a>RNF05 | Garantir Compatibilidade com Android 7.0+ e iOS 15.1+ | O sistema deve suportar Android 7.0 ou superior e iOS 15.1 ou superior, conforme o mínimo exigido pela biblioteca Expo. |
    | <a id="rnf06"></a>RNF06 | Atualizar Calendário Acadêmico e Correções via OTA | O sistema deve suportar atualizações via EAS Update para corrigir dados de calendário ou bugs críticos sem publicação de nova versão nas lojas. |

=== "+ Restrições"
    | ID | Nome | Descrição |
    |----|------|-----------|
    | <a id="rnf07"></a>RNF07 | Desenvolver Aplicativo com React Native, Expo e TypeScript | O sistema deve ser desenvolvido utilizando React Native, Expo e TypeScript como stack tecnológica principal. |
    | <a id="rnf08"></a>RNF08 | Armazenar Dados Locais com Expo SQLite | O sistema deve armazenar todos os dados locais do usuário utilizando Expo SQLite, garantindo persistência e acesso offline às informações. |
    | <a id="rnf09"></a>RNF09 | Emitir Notificações sobre Eventos e Alterações Acadêmicas | O sistema deve emitir notificações proativas sobre datas críticas e alterações de professor, horário ou sala, utilizando atualizações via nuvem quando necessário. |
