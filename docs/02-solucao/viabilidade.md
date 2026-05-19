# 2.6 Viabilidade da Proposta

A proposta do UnB App apresenta alta viabilidade técnica. A equipe está estruturada com papéis definidos, contando com desenvolvedores focados em Frontend, Backend e analistas de QA e Requisitos. O uso de tecnologias modernas como React Native, Expo e TypeScript acelera o desenvolvimento multiplataforma (Android e iOS), enquanto a utilização do Expo SQLite simplifica a implementação das funcionalidades offline.

Ademais, o acesso direto à representante dos usuários, Maria Fátima, por meio de canais como WhatsApp e Teams, garante ciclos rápidos de validação. Essa proximidade permite a entrega segura de um MVP funcional, que incluirá a consulta de grade horária e a carteirinha digital, seguindo os processos orientados a funcionalidades (FDD) até o final das iterações planejadas.

## Riscos Identificados e Planos de Ação

- **Dificuldade na integração com dados do SIGAA:** A equipe reavaliou a arquitetura de integração para garantir a viabilidade técnica e contornar os bloqueios de acesso direto ao backend da UnB. A viabilidade dessa abordagem já está comprovada por meio de uma Prova de Conceito Teórica, baseada em APIs de projetos acadêmicos consolidados (como SuaGradeUnB, NoFluxoUnB e IntegralizeiUnb). A obtenção dos dados utilizará uma estratégia mista para otimizar recursos:
  - **Leitura Automática do PDF da Grade:** O aluno irá baixar o PDF com a sua grade de horários no SIGAA e colocá-lo no nosso aplicativo. O próprio aplicativo vai "ler" esse documento automaticamente, encontrar quais são as turmas, professores e salas daquele aluno, e salvar tudo no celular. Assim, o idoso não precisará digitar nada manualmente.
  - **Web Scraping Dinâmico (Servidor Intermediário):** Para os dados que sofrem mudanças frequentes, um servidor intermediário próprio fará o web scraping diariamente e exclusivamente da página pública de 'Turmas Abertas' da UnB, cruzando essas informações com as turmas do aluno em tempo real (quando houver acesso à internet).
  - **Inserção Manual de Dados Estáticos (Calendário):** Em prol da simplicidade arquitetural, os dados do site do Calendário Acadêmico (datas de matrícula, feriados e prazos) não sofrerão web scraping, pois são informações estáticas que mudam apenas semestralmente. A própria equipe fará a inserção e manutenção manual dessas datas no banco de dados.

- **Fadiga ou falta de disponibilidade dos usuários 60+ para testes:** Como ação preventiva para este cenário e visando um fluxo de validação contínuo, serão planejadas reuniões semanais curtas via Microsoft Teams ou presenciais, além da coleta de feedbacks rápidos pelo WhatsApp e apôs aulas na própria universidade, na parte da manhã.
- **Complexidade de acessibilidade para o público-alvo:** A solução para este desafio dar-se-á através da aplicação rigorosa do *Definition of Ready* (DoR), com foco total em contraste, tipografia e simplicidade de navegação antes de iniciar a construção de qualquer funcionalidade.

## Condições para Viabilidade

- **Engajamento da Cliente:** Manutenção de uma comunicação frequente com a representante Maria Fátima para a validação semanal de cada design e funcionalidade desenvolvida.
- **Ambiente e Infraestrutura:** Garantia de uma configuração estável do ecossistema Expo e SQLite por parte da equipe técnica no aplicativo, somada à garantia de estabilidade e hospedagem do servidor intermediário responsável pela extração diária das turmas.
- **Manutenção de Dados Estáticos:** Comprometimento da equipe técnica em realizar a atualização manual do banco de dados referente ao calendário acadêmico a cada novo semestre.
- **Cumprimento do Cronograma (FDD):** Adesão rigorosa ao planejamento de iterações, estruturadas nos 5 processos principais do Feature-Driven Development.
