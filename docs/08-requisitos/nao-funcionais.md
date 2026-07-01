# 8.2 Requisitos N├úo Funcionais

> Classificados pelo modelo **URPS+** ÔÇö Usabilidade, Confiabilidade *(Reliability)*, Desempenho *(Performance)*, Suportabilidade, e demais restri├º├Áes (+).
>
> Os RNFs voltados ao p├║blico **60+** (estudantes do vestibular 60+ da UnB) seguem as recomenda├º├Áes da **WCAG 2.1 n├¡vel AA**, das **Android Accessibility Guidelines** e da **Apple Human Interface Guidelines (Accessibility)**, considerando dificuldades visuais, motoras e cognitivas t├¡picas do envelhecimento.

---

=== "Usabilidade"
    | ID | Nome | Descri├º├úo |
    |----|------|-----------|
    | RNF01 | Aplicar Interface com Tipografia Adapt├ível | O sistema deve aplicar nativamente uma interface de tipografia adapt├ível em todas as suas telas, seguindo o padr├úo ABNT: texto sem serifa e justificado para a esquerda. |
    | RNF02 | Projetar Navega├º├úo de Tarefas Essenciais em At├® 2 Cliques | O sistema deve permitir o acesso ├ás tarefas essenciais do utilizador (aquelas realizadas frequentemente) em, no m├íximo, 2 cliques. Definem-se como tarefas essenciais: (1) acesso a materiais did├íticos, (2) consulta de notas, (3) realiza├º├úo de matr├¡culas, (4) consulta de locais de aula/prova (ensalamento), (5) emiss├úo de documentos e (6) acesso ├á carteirinha estudantil. |
    | RNF18 | Definir Tamanho M├¡nimo de Fonte Base em 18sp | O sistema deve adotar **18sp** como tamanho m├¡nimo de fonte em todos os textos do corpo da interface (descri├º├Áes, r├│tulos, legendas e placeholders), permitindo aumento opcional para 22sp ou 28sp nas configura├º├Áes de acessibilidade. T├¡tulos principais devem ter, no m├¡nimo, **24sp**. |
    | RNF19 | Definir Raz├úo de Contraste M├¡nimo de 4.5:1 | Todo par texto/fundo deve apresentar raz├úo de contraste m├¡nima de **4.5:1** para texto comum e **3:1** para texto grande (ÔëÑ 24sp ou 18sp em negrito), em conformidade com a WCAG 2.1 n├¡vel AA. Elementos n├úo textuais essenciais (├¡cones funcionais, bordas de campos, indicadores de foco) devem respeitar o m├¡nimo de **3:1**. |
    | RNF20 | Padronizar Bot├Áes e ├ìcones com Alvo de Toque M├¡nimo de 48x48dp | Todos os elementos interativos (bot├Áes, ├¡cones clic├íveis, itens de lista) devem possuir ├írea toc├ível m├¡nima de **48x48dp** (Android) e **44x44pt** (iOS), com espa├ºamento interno m├¡nimo de 8dp entre alvos adjacentes para evitar toques acidentais. ├ìcones devem ser sempre acompanhados de **r├│tulo textual vis├¡vel** (n├úo apenas tooltip), priorizando reconhecimento sobre memoriza├º├úo. |
    | RNF21 | Limitar Tarefas Essenciais a No M├íximo 3 Passos Vis├¡veis | Toda tarefa essencial (consultar grade hor├íria, acessar documentos, abrir carteirinha, baixar material) deve ser conclu├¡da em, no m├íximo, **3 passos/telas vis├¡veis** a partir da tela inicial. Cada passo deve exibir **uma ├║nica a├º├úo prim├íria de destaque** (bot├úo CTA principal), reduzindo a carga cognitiva e a chance de erro. |
    | RNF22 | Fornecer Indica├º├úo Clara do Pr├│ximo Passo e do Local Atual | Toda tela deve exibir **breadcrumbs**, **barra de progresso** ou **indicador de etapa** quando fizer parte de um fluxo, al├®m de **destacar visualmente** (cor, peso, ├¡cone) o pr├│ximo elemento a ser interagido. O cabe├ºalho deve sempre indicar o nome da tela atual e a a├º├úo em curso. |
    | RNF23 | Exibir Feedback Imediato e Mensagens de Erro em Linguagem Natural | Toda a├º├úo do usu├írio deve gerar **feedback visual e/ou t├ítil** em at├® 100ms. Mensagens de erro devem ser escritas em **linguagem natural**, sem c├│digos t├®cnicos, indicando *o que aconteceu* e *o que o usu├írio deve fazer* (ex.: "N├úo foi poss├¡vel carregar a grade. Toque em 'Tentar novamente'"). |
    | RNF24 | Permitir Ajuste Persistente de Tamanho de Fonte pelo Usu├írio | O sistema deve disponibilizar nas **Configura├º├Áes de Acessibilidade** um seletor de tamanho de fonte (Pequeno / M├®dio / Grande / Extra-grande) que se aplica de forma persistente a toda a aplica├º├úo, respeitando tamb├®m as configura├º├Áes nativas do sistema operacional (Dynamic Type no iOS e Font Scale no Android). |
    | RNF25 | Aplicar Padr├úo Foco Vis├¡vel em Navega├º├úo por Teclado/Leitor de Tela | Todos os elementos interativos devem possuir **estado de foco vis├¡vel** (outline ou highlight com contraste ÔëÑ 3:1) e ser totalmente acess├¡veis via leitor de tela (TalkBack/VoiceOver), com `accessibilityLabel`, `accessibilityRole` e `accessibilityHint` adequados. A ordem de leitura deve seguir a sequ├¬ncia l├│gica de leitura (de cima para baixo, da esquerda para a direita). |
    | RNF26 | Evitar Depend├¬ncia Exclusiva de Cor para Transmitir Informa├º├úo | Nenhuma informa├º├úo essencial deve ser transmitida **apenas por cor**. Indicadores de estado (sucesso, erro, alerta) devem combinar cor **+ ├¡cone + texto**, garantindo compreens├úo por usu├írios com daltonismo ou baixa acuidade visual. |

=== "Confiabilidade"
    | ID | Nome | Descri├º├úo |
    |----|------|-----------|
    | RNF03 | Permitir Consulta de Informa├º├Áes Institucionais Offline | O sistema deve permitir a consulta da grade hor├íria, ensalamento e carteirinha estudantil de forma 100% offline, sem depend├¬ncia de internet, utilizando dados armazenados no cache local via SQLite. |
    | RNF04 | Sincronizar Automaticamente Dados Divergentes | O sistema deve possuir conex├úo direta com o banco de dados do web scraping toda vez que houver acesso ├á internet, verificando e sincronizando automaticamente informa├º├Áes divergentes das aulas matriculadas para salvamento local. |

=== "Desempenho"
    | ID | Nome | Descri├º├úo |
    |----|------|-----------|
    | RNF10 | Limitar Dura├º├Áes de Anima├º├Áes de Interface a 300ms | Todas as anima├º├Áes de elementos de interface (ex: modais, di├ílogos e transi├º├Áes) devem ter dura├º├úo m├íxima de 300ms, assegurando que o sistema seja percebido como imediato e n├úo atrase as intera├º├Áes do usu├írio. |
    | RNF11 | Omitir Anima├º├Áes de Entrada em Telas de Alta Frequ├¬ncia | Telas e fluxos essenciais (acessados dezenas de vezes ao dia, como as abas principais) n├úo devem possuir anima├º├Áes de entrada (entrance animations), priorizando o acesso direto ├á informa├º├úo sem intervalos decorativos. |
    | RNF12 | Utilizar Acelera├º├úo por Hardware em Anima├º├Áes | As transi├º├Áes visuais devem ser otimizadas para rodar na GPU (utilizando estritamente propriedades como `transform` e `opacity`), evitando rec├ílculos de layout para garantir fluidez constante sem queda de quadros (frame drops). |
    | RNF13 | Limitar Tempo de Processamento de Arquivos Locais | O processamento, extra├º├úo de texto e parse estrutural de um hist├│rico escolar em formato PDF deve ser conclu├¡do em no m├íximo 2 segundos, sendo executado de forma ass├¡ncrona para n├úo causar engasgos (freezes) na interface. |
    | RNF14 | Garantir Resposta Imediata do Banco de Dados Local | Consultas corriqueiras ao cache local via SQLite (como carregar a grade hor├íria do dia ou listar os documentos baixados) devem ter um tempo de resposta inferior a 50ms, garantindo a percep├º├úo de instantaneidade ao trocar de abas. |
    | RNF15 | Otimizar Tempo de Inicializa├º├úo (Cold Start) | O aplicativo deve apresentar a primeira tela renderizada e estar completamente interativo (Time-to-Interactive) em at├® 2,5 segundos a partir de uma inicializa├º├úo a frio. |
    | RNF16 | Limitar Uso de Armazenamento Local | O aplicativo deve manter uma pegada de armazenamento (storage footprint) otimizada, garantindo que o banco de dados SQLite e o cache de documentos baixados n├úo ultrapassem um limite nominal de 50 MB, visando poupar recursos dos dispositivos m├│veis. |
    | RNF17 | Executar Sincroniza├º├úo Web sem Bloqueio de UI | As rotinas de web scraping e sincroniza├º├úo de dados divergentes devem rodar estritamente em segundo plano, sem ocupar ou bloquear a thread principal, mantendo a navega├º├úo em 60 FPS ininterruptos. |

=== "Suportabilidade"
    | ID | Nome | Descri├º├úo |
    |----|------|-----------|
    | RNF05 | Garantir Compatibilidade com Android 7.0+ e iOS 15.1+ | O sistema deve suportar sistemas operacionais de acordo com o m├¡nimo exigido pela biblioteca Expo, garantindo compatibilidade com Android 7.0 ou superior e iOS 15.1 ou superior. |
    | RNF06 | Atualizar Calend├írio Acad├¬mico e Corre├º├Áes via OTA | O sistema deve suportar atualiza├º├Áes na nuvem para mitigar problemas urgentes ÔÇö como dados de calend├írio desatualizados ou bugs cr├¡ticos ÔÇö sem necessidade de publica├º├úo de nova vers├úo nas lojas, utilizando o Send Over-the-Air Updates do EAS (Expo Application Services). |

=== "+ Restri├º├Áes"
    | ID | Nome | Descri├º├úo |
    |----|------|-----------|
    | RNF07 | Desenvolver Aplicativo com React Native, Expo e TypeScript | O sistema deve ser desenvolvido utilizando React Native, Expo e TypeScript como stack tecnol├│gica principal. |
    | RNF08 | Armazenar Dados Locais com Expo SQLite | O sistema deve armazenar todos os dados locais do usu├írio utilizando a biblioteca Expo SQLite, garantindo persist├¬ncia e acesso offline ├ás informa├º├Áes. |
    | RNF09 | Emitir Notifica├º├Áes sobre Eventos e Altera├º├Áes Acad├¬micas | O sistema deve emitir notifica├º├Áes proativas sobre datas cr├¡ticas ÔÇö como per├¡odos de oferta de disciplinas e matr├¡cula ÔÇö e sobre altera├º├Áes de professor, hor├írio ou sala, utilizando atualiza├º├Áes via nuvem para garantir que o aplicativo n├úo perca funcionalidades por falta de atualiza├º├úo. |

