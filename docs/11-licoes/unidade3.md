# 10.3 Lições Aprendidas — Unidade 3

!!! info "Retrospectiva da unidade"
    Nesta unidade, a equipe consolidou a adoção da metodologia Feature-Driven Development (FDD), detalhou as funcionalidades prioritárias, aprimorou a documentação de métricas e ajustou o cronograma, além de iniciar oficialmente a implementação técnica com a criação do aplicativo base.

---

## O que funcionou bem

- **Consolidação do FDD e Backlog:** A migração completa de User Stories para Features foi concluída, acompanhada do detalhamento extensivo das funcionalidades principais (como F01, F02, F03, F06, e F07) seguindo o novo padrão metodológico.
- **Métricas e Priorização Avançadas:** A integração do MathJax e a aplicação de fórmulas matemáticas para calcular esforço *vs.* valor de negócio trouxeram uma base empírica e sólida para a priorização do MVP.
- **Correção do Cronograma e Repriorização:** A adequação do cronograma do projeto, que havia sido estruturado erroneamente por feature, sendo agora reorganizado corretamente por iterações e unidades. Além dessa reestruturação estrutural, houve a alteração na ordem de desenvolvimento, onde a **Feature 07 (Consultar grade horária e ensalamento)** tomou o lugar e foi antecipada em relação à **Feature 05 (Exibir fluxos de onboarding)**, ajustando a ordem lógica e de prioridade das entregas.
- **Fundação Técnica do App:** O setup inicial do projeto foi realizado com sucesso (via template do Expo/React Native), estruturando o diretório `UnB-App` com configurações de ambiente e scripts iniciais prontos para o desenvolvimento.
- **Transparência e Comunicação:** A incorporação de links diretos para as gravações e as transcrições completas das reuniões aumentou substancialmente a rastreabilidade das decisões tomadas.

## O que pode melhorar

- **Sincronização Código-Documentação:** Com o início do desenvolvimento prático, será um desafio constante manter a rastreabilidade entre as entregas técnicas (commits/PRs no Expo) e as features documentadas no MkDocs.
- **Padronização na Formatação:** Foram necessários vários ajustes pontuais de links, CSS e quebras de tabelas de priorização. Criar uma validação ou *template* pré-definido para as tabelas mais complexas evitaria retrabalho.
- **Gerenciamento de Escopo das PRs:** Algumas PRs agruparam refatorações estruturais extensas da documentação com pequenas correções textuais, o que dificulta o processo de *code review*. 

## Dificuldades encontradas

| Dificuldade | Como foi superada |
|-------------|---------------------------|
| **Integração e Visualização de Fórmulas Matemáticas na Documentação** | Foi configurado o suporte oficial ao plugin MathJax dentro do MkDocs, permitindo a exibição adequada das matrizes e fórmulas da priorização empírica. |
| **Inicialização e Padronização do Ambiente de Desenvolvimento Mobile** | O repositório foi organizado recebendo um *script* de *reset* e um `.gitignore` ajustado, padronizando a geração de arquivos do Expo para toda a equipe. |
| **Adaptação do Modelo de Rastreabilidade para o FDD** | A equipe promoveu um longo refatoramento dos Requisitos Funcionais e Não-Funcionais e da Matriz de Rastreabilidade para alinhá-los perfeitamente com a nova terminologia de Features. |

## Ações para o próximo ciclo

- [ ] Estabelecer um fluxo de trabalho claro (como *Git Flow* ou *GitHub Flow*) ligando as tarefas de desenvolvimento front-end com os IDs das Features (F01, F02, etc);
- [ ] Aplicar no código as práticas de *Definition of Ready (DoR)* e *Definition of Done (DoD)* formuladas nas unidades anteriores;
- [ ] Iniciar a implementação contínua das interfaces no aplicativo garantindo alinhamento direto com o backlog e suas funcionalidades;
- [ ] Definir a arquitetura inicial de componentes no React Native e as bibliotecas base para navegação e estado.
