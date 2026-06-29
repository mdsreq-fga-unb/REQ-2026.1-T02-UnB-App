# 8.2 Critérios de Aceite

> Para garantir que os Requisitos Funcionais descritos na seção anterior sejam validados de forma objetiva e sem ambiguidades, este documento define os **Critérios de Aceite (CA)**. 

Alinhado ao processo **FDD (Feature-Driven Development)** adotado pela equipe, os critérios estão agrupados por Funcionalidade (Feature), mapeando diretamente quais Requisitos Funcionais pertencem a ela e se a Feature faz parte do **MVP (Produto Mínimo Viável)**. 

Sempre que aplicável, os critérios utilizam a notação **BDD (Dado / Quando / Então)** para facilitar a posterior implementação de testes de software.

---

## F01: Assistente Virtual com IA
**Pertence ao MVP?** Não  
**Requisitos Validados:** RF08, RF09, RF10, RF11

| ID | Critério de Aceite (Verificável) |
|----|----------------------------------|
| **CA 8.1** | **Validação de Entrada (RF08):** O campo de mensagem não deve permitir envios vazios e deve limitar o tamanho máximo do texto a 500 caracteres. |
| **CA 9.1** | **Redirecionamento (RF09):** Se a resposta da IA indicar um tutorial, a mensagem renderizada deve conter um link clicável que redirecione o usuário exatamente para a tela daquele tutorial (F06). |
| **CA 10.1** | **Persistência de Histórico (RF10):** Ao fechar e reabrir a aplicação, as mensagens enviadas na sessão anterior devem ser carregadas cronologicamente na interface. |
| **CA 11.1** | **Áudio (RF11):** A síntese de voz (Text-to-Speech) deve ser interrompida imediatamente caso o usuário navegue para outra aba do aplicativo. |

---

## F02: Exibir QRCode da BCE
**Pertence ao MVP?** Não  
**Requisitos Validados:** RF02

| ID | Critério de Aceite (Verificável) |
|----|----------------------------------|
| **CA 2.1** | **Validação de Formato (RF02):** O conteúdo embarcado no QR Code deve ser estritamente uma *string* numérica correspondente ao CPF do usuário (11 dígitos, sem pontuação). |
| **CA 2.2** | **Cenário BDD - Geração (RF02):**<br>**Dado** que o usuário acessa a tela da Biblioteca<br>**Quando** o CPF está registrado localmente<br>**Então** o componente do QR Code deve ser renderizado instantaneamente. |

---

## F03: Acessar Carteirinha Digital
**Pertence ao MVP?** Não  
**Requisitos Validados:** RF01, RF03

| ID | Critério de Aceite (Verificável) |
|----|----------------------------------|
| **CA 1.1** | **Dados Obrigatórios (RF01):** A interface deve renderizar obrigatoriamente a Foto, Nome Completo, Matrícula e Curso extraídos do banco de dados local. |
| **CA 1.2** | **Leitura de Código (RF01):** O código de barras deve corresponder exatamente à matrícula do aluno e possuir contraste suficiente para leitura ótica. |
| **CA 3.1** | **Cenário BDD - Modo Offline (RF03):**<br>**Dado** que o dispositivo do aluno está sem conexão à internet<br>**Quando** o aluno abre a aba da carteirinha<br>**Então** o sistema deve renderizar a carteirinha completa em menos de 2 segundos, sem exibir erros de rede. |

---

## F04: Extrair, Processar e Armazenar Documentos
**Pertence ao MVP?** Não  
**Requisitos Validados:** RF04, RF05, RF06, RF07

| ID | Critério de Aceite (Verificável) |
|----|----------------------------------|
| **CA 4.1** | **Armazenamento Estruturado (RF04):** Após a extração, os dados brutos devem ser inseridos nas tabelas relacionais do Expo SQLite localmente (Aluno, Disciplinas, Turmas, Aulas). |
| **CA 5.1** | **Filtro de Arquivo (RF05):** O sistema só deve permitir o processamento de arquivos com a extensão `.pdf`. Qualquer outro formato deve disparar o alerta: "Formato de arquivo não suportado". |
| **CA 6.1** | **Cenário BDD - Extração com Sucesso (RF06):**<br>**Dado** que o usuário faz o upload de um PDF válido de Matrícula/Histórico<br>**Quando** o *parser* finaliza a leitura<br>**Então** as disciplinas devem ser exibidas na tela de Grade Horária sem duplicidades. |
| **CA 7.1** | **Validade do Passe Livre (RF07):** O sistema deve ler a data de emissão no PDF do Passe Livre. Arquivos processados com datas de validade expiradas devem ser rejeitados com aviso na tela. |

---

## F05: Exibir Fluxos de Onboarding
**Pertence ao MVP?** Sim  
**Requisitos Validados:** RF22, RF23

| ID | Critério de Aceite (Verificável) |
|----|----------------------------------|
| **CA 22.1** | **Controles de Navegação (RF22, RF23):** Os fluxos do SIGAA e do Aprender 3 devem apresentar obrigatoriamente a opção "Pular Tutorial" em todas as suas etapas. |
| **CA 22.2** | **Cenário BDD - Apresentação Única (RF22, RF23):**<br>**Dado** que o usuário finalizou ou pulou o tutorial<br>**Quando** ele abrir o aplicativo em sessões futuras<br>**Então** os fluxos de onboarding não devem ser exibidos novamente. |

---

## F06: Listar e Reproduzir Tutoriais
**Pertence ao MVP?** Não  
**Requisitos Validados:** RF12, RF13, RF14, RF15

| ID | Critério de Aceite (Verificável) |
|----|----------------------------------|
| **CA 12.1** | **Listagem Categórica (RF12):** O menu de tutoriais deve organizar os itens visualmente nas categorias mínimas: "SIGAA" e "Aprender 3". |
| **CA 13.1** | **Acessibilidade Textual (RF13):** O componente de leitura de texto do tutorial deve respeitar as configurações nativas de tamanho de fonte do dispositivo do usuário. |
| **CA 14.1** | **Reprodução (RF14):** Ao abrir um tutorial em vídeo, a propriedade de reprodução automática (*autoplay*) deve estar desabilitada por padrão para poupar dados móveis. |
| **CA 15.1** | **Interação de Expansão (RF15):** Os tópicos de dúvida devem utilizar um componente de Acordeão (*Accordion*) que inicia fechado e expande sua área de conteúdo em no máximo 500ms após o toque. |

---

## F07: Consultar Grade Horária e Ensalamento
**Pertence ao MVP?** Sim  
**Requisitos Validados:** RF16

| ID | Critério de Aceite (Verificável) |
|----|----------------------------------|
| **CA 16.1** | **Cenário BDD - Estado Vazio (RF16):**<br>**Dado** que o banco de dados local não possui disciplinas cadastradas<br>**Quando** o usuário navega para a aba de Grade Horária<br>**Então** o sistema deve exibir o título "Nenhuma disciplina encontrada" acompanhado do texto de instrução sobre o histórico escolar<br>**E** renderizar o botão "FAZER UPLOAD DA MATRÍCULA" (que deve alterar seu estado para "PROCESSANDO..." e ser desabilitado durante a leitura do arquivo). |
| **CA 16.2** | **Cenário BDD - Renderização Visual (RF16):**<br>**Dado** que existem disciplinas salvas localmente<br>**Quando** a tela de Grade é carregada<br>**Então** o sistema deve exibir *Cards* contendo: Nome da disciplina, Horário formatado (ex: "Seg/Qua · 14:00–15:50"), Local e Docente. |

---

## F08: Coletar e Atualizar Dados Acadêmicos (Sincronização)
**Pertence ao MVP?** Não  
**Requisitos Validados:** RF17, RF18, RF19

| ID | Critério de Aceite (Verificável) |
|----|----------------------------------|
| **CA 17.1** | **Sincronização Diária (RF17, RF19):** A rotina diária de coleta de aulas do SIGAA só deve ser executada em plano de fundo se o dispositivo reportar conexão via Wi-Fi, poupando os dados móveis. |
| **CA 18.1** | **Condição Semanal (RF18):** O *scraper* do Calendário Acadêmico deve calcular a diferença de tempo; o gatilho de execução só será ativado se a última sincronização bem-sucedida tiver ocorrido há 7 dias ou mais. |
| **CA 19.1** | **Cenário BDD - Tolerância a Falhas (RF19):**<br>**Dado** que o sistema tenta sincronizar os dados<br>**Quando** houver erro (ex: código 500) do servidor da UnB<br>**Então** a atualização é abortada silenciosamente e a grade local é mantida intacta. |

---

## F09: Centralizar Documentos Oficiais
**Pertence ao MVP?** Sim  
**Requisitos Validados:** RF20, RF21

| ID | Critério de Aceite (Verificável) |
|----|----------------------------------|
| **CA 20.1** | **Limite de Upload (RF20):** O sistema deve abortar o salvamento e exibir uma notificação nativa caso o usuário tente anexar um arquivo com tamanho superior a 5MB. |
| **CA 21.1** | **Cenário BDD - Acesso em Cache (RF21):**<br>**Dado** que o aplicativo não possui conexão à internet<br>**Quando** o usuário toca no ícone de um documento salvo<br>**Então** o sistema deve renderizar o PDF imediatamente utilizando o armazenamento absoluto (`FileSystem`) do dispositivo. |