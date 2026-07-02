# 10.4 Lições Aprendidas — Unidade 4

!!! info "Retrospectiva da unidade"
    Nesta unidade, a equipe focou intensamente na implementação técnica do aplicativo, entregando diversas funcionalidades importantes, otimizando o desempenho e estabelecendo integrações com o SIGAA, além de reorganizar o backlog e a rastreabilidade da documentação.

---

## O que funcionou bem

- **Desenvolvimento Acelerado e Features Chaves:** Grande avanço na implementação técnica, com destaque para modo escuro nativo, biometria, notificações em modal, tela de configurações e polimento da interface de usuário.
- **Integração e Extração de Dados (SIGAA):** A implementação de scripts para sincronizar turmas, histórico escolar e extrair dados estudantis (SigaaSync) diretamente para o banco de dados local (SQLite) se mostrou muito efetiva.
- **Refatoração e Otimização:** O foco em desempenho foi claro, com a centralização da lógica de documentos em um motor universal, otimização das animações e ajustes específicos de renderização para dispositivos mais antigos (Android).
- **Rastreabilidade e Atualização da Documentação:** A reorganização da *Feature List* (Backlog), refinamento dos Requisitos Não-Funcionais e alinhamento do cronograma com as prioridades técnicas garantiram uma documentação mais coerente com a prática.

## O que pode melhorar

- **Cobertura de Testes Automatizados:** Embora testes tenham sido iniciados para o processamento de histórico escolar, a vasta maioria das novas features foi entregue sem a correspondente automação de testes, o que pode aumentar a chance de regressões.
- **Gerenciamento de Dependências:** Houve certa confusão entre gerenciadores de pacote (remoção do pnpm a favor do npm) e a necessidade de regenerar *lock files*, o que demonstra que a padronização do ambiente precisa ser reforçada na equipe.
- **Resolução de Conflitos e *Code Review*:** Foram observadas algumas resoluções de conflitos (Merge branches), indicando que os desenvolvedores podem melhorar a sincronia e o isolamento de *features* nas *branches*.

## Dificuldades encontradas

| Dificuldade | Como foi superada |
|-------------|---------------------------|
| **Lentidão e Travamento na UI em Dispositivos Android Antigos** | Foram aplicadas técnicas de otimização, como atrasar a consulta pesada no SQLite para rodar somente após a renderização da interface e a diminuição do tempo das animações de transição. |
| **Complexidade na Extração de Dados Reais do Aluno** | Foi criado um script específico (parser) para "garimpar" o HTML do SIGAA, injetando *scripts* na visualização web e salvando tudo formatado no banco de dados, protegendo o acesso *single-user*. |
| **Inconsistências na Documentação Base (RFs e Features)** | A equipe realizou uma revisão minuciosa, corrigindo os *links*, inconsistências de rastreabilidade (como entre F05 e RF07, RF22, RF23) e atualizando as evidências de execução. |

## Ações para o próximo ciclo

- [ ] Ampliar a cobertura de testes automatizados, focando inicialmente nas regras de negócio e nos parsers (extratores de dados do SIGAA);
- [ ] Solidificar o fluxo de entrega (Release) do aplicativo, preparando o terreno para testes com usuários reais e submissões em lojas (se aplicável);
- [ ] Refinar ainda mais a extração de dados do SIGAA para cobrir eventuais casos de borda e falhas de conexão;
- [ ] Revisar e finalizar toda a documentação da disciplina para a entrega final, garantindo que tudo está estritamente rastreável para o MVP construído.
