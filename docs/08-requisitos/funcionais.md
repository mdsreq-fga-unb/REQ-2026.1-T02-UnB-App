# 8.1 Requisitos Funcionais

> Os requisitos funcionais descrevem as funcionalidades específicas que o sistema deve implementar para atender às necessidades do negócio.
>
> Cada requisito é enriquecido com **Prioridade** (MoSCoW herdada da [Feature List](../10-feature-list/priorizacao.md)), **Feature** à qual pertence, **MVP** (se compõe o escopo mínimo), **Iteração** de planejamento ([cronograma](../06-cronograma/index.md)) e **Status** de execução (consistente com o [Acompanhamento por Feature](../10-feature-list/acompanhamento.md)).

---

## Legenda

### Prioridade (MoSCoW)

| Sigla | Significado |
|:-----:|-------------|
| **M** | Must have — indispensável, compõe o MVP. |
| **S** | Should have — importante, alto valor, mas tem contorno. |
| **C** | Could have — desejável, entra se houver tempo. |
| **W** | Won't have — fora do escopo desta release. |

### MVP / Iteração

| Sigla | Significado |
|:-----:|-------------|
| ✅ | Compõe o MVP (escopo mínimo viável). |
| — | Não compõe o MVP. |
| **I1, I2, I3, I4** | Iteração de planejamento (1 a 4). |

### Status

| Ícone | Status | Significado |
|:-----:|--------|-------------|
| 🔵 | **Proposto** | Em discussão ou elicitação, ainda não validado. |
| 🟢 | **Validado** | Confirmado pela cliente/stakeholder. |
| 🟣 | **Planejado** | Validado, alocado a uma iteração, ainda não iniciado. |
| 🟡 | **Em desenvolvimento** | Implementação em andamento. |
| ✅ | **Concluído** | Implementado, testado e aceito. |
| ⛔ | **Removido** | Descartado formalmente (cancelado ou Won't have). |

---

## Tabela Consolidada de Requisitos Funcionais

| ID | Nome | Prioridade | Feature | MVP | Iteração | Status |
|----|------|:----------:|---------|:---:|:--------:|:------:|
| RF01 | Exibir Carteirinha Estudantil Digital | **C** | [F03](../10-feature-list/feature-list-geral.md) | — | I4 | 🟡 |
| RF02 | Gerar QR Code para Acesso à BCE | **C** | [F02](../10-feature-list/feature-list-geral.md) | — | I4 | 🟡 |
| RF03 | Armazenar Carteirinha Estudantil | **C** | [F03](../10-feature-list/feature-list-geral.md) | — | I4 | 🟡 |
| RF04 | Armazenar Dados de Documentos Enviados | **S** | [F04](../10-feature-list/feature-list-geral.md) | — | I2 | 🟣 |
| RF05 | Processar Dados de Documentos Enviados | **S** | [F04](../10-feature-list/feature-list-geral.md) | — | I2 | 🟣 |
| RF06 | Extrair Dados do Histórico Escolar | **S** | [F04](../10-feature-list/feature-list-geral.md) | — | I1 | ✅ |
| RF07 | Extrair Dados da Declaração do Passe Livre Estudantil | **S** | [F04](../10-feature-list/feature-list-geral.md) | — | I2 | 🟣 |
| RF08 | Enviar Perguntas ao Assistente Virtual | **W** | [F01](../10-feature-list/feature-list-geral.md) | — | — | ⛔ |
| RF09 | Direcionar para Tutorial Específico | **W** | [F01](../10-feature-list/feature-list-geral.md) | — | — | ⛔ |
| RF10 | Manter Histórico de Conversas Visível | **W** | [F01](../10-feature-list/feature-list-geral.md) | — | — | ⛔ |
| RF11 | Consultar Resposta em Voz no Assistente Virtual (Text to Speech) | **W** | [F01](../10-feature-list/feature-list-geral.md) | — | — | ⛔ |
| RF12 | Listar Tutoriais Disponíveis | **W** | [F06](../10-feature-list/feature-list-geral.md) | — | — | ⛔ |
| RF13 | Visualizar Tutoriais em Texto | **W** | [F06](../10-feature-list/feature-list-geral.md) | — | — | ⛔ |
| RF14 | Reproduzir Tutoriais em Vídeo | **W** | [F06](../10-feature-list/feature-list-geral.md) | — | — | ⛔ |
| RF15 | Expandir Explicação de Tópico em Dúvida | **W** | [F06](../10-feature-list/feature-list-geral.md) | — | — | ⛔ |
| RF16 | Consultar Grade Horária e Ensalamento | **M** | [F07](../10-feature-list/feature-list-geral.md) | ✅ | I1 | 🟡 |
| RF17 | Coletar Dados de Aulas Diariamente via SIGAA | **S** | [F08](../10-feature-list/feature-list-geral.md) | — | I2 | 🔴 |
| RF18 | Coletar Dados do Calendário Acadêmico Semanalmente | **S** | [F08](../10-feature-list/feature-list-geral.md) | — | I2 | 🔴 |
| RF19 | Atualizar Informações de Disciplinas Matriculadas | **S** | [F08](../10-feature-list/feature-list-geral.md) | — | I2 | 🔴 |
| RF20 | Enviar Documentos Oficiais | **M** | [F09](../10-feature-list/feature-list-geral.md) | ✅ | I1 | ✅ |
| RF21 | Armazenar Documentos Oficiais para Acesso Offline | **M** | [F09](../10-feature-list/feature-list-geral.md) | ✅ | I1 | ✅ |
| RF22 | Exibir Fluxo de Onboarding para o SIGAA | **M** | [F05](../10-feature-list/feature-list-geral.md) | ✅ | I3 | 🟡 |
| RF23 | Exibir Fluxo de Onboarding para o Aprender 3 | **M** | [F05](../10-feature-list/feature-list-geral.md) | ✅ | I3 | 🟣 |

---

## Descrições Detalhadas

| ID | Nome | Descrição |
|----|------|-----------|
| RF01 | Exibir Carteirinha Estudantil Digital | O sistema deve exibir as credenciais de acesso e identidade do estudante em formato de carteirinha digital, com suporte à leitura por catracas, Restaurante Universitário (RU) e biblioteca. |
| RF02 | Gerar QR Code para Acesso à BCE | O sistema deve gerar um QR Code a partir do CPF do estudante para autenticação e acesso à Biblioteca Central (BCE). |
| RF03 | Armazenar Carteirinha Estudantil | O sistema deve armazenar localmente a carteirinha estudantil, permitindo seu acesso mesmo sem conexão com a internet. |
| RF04 | Armazenar Dados de Documentos Enviados | O sistema deve armazenar os dados extraídos dos documentos enviados pelo estudante para uso posterior nas funcionalidades do aplicativo. |
| RF05 | Processar Dados de Documentos Enviados | O sistema deve processar os documentos enviados pelo estudante, extraindo os dados para alimentar a plataforma e eliminar a necessidade de preenchimento manual de formulários. |
| RF06 | Extrair Dados do Histórico Escolar | O sistema deve obter automaticamente os dados presentes no Histórico Escolar do usuário. |
| RF07 | Extrair Dados da Declaração do Passe Livre Estudantil | O sistema deve obter automaticamente os dados presentes na Declaração do Passe Livre Estudantil do usuário. |
| RF08 | Enviar Perguntas ao Assistente Virtual | O sistema deve permitir que o estudante envie perguntas ao assistente virtual utilizando linguagem natural. |
| RF09 | Direcionar para Tutorial Específico | O sistema deve direcionar o estudante para o tutorial específico caso necessário, como citação. |
| RF10 | Manter Histórico de Conversas Visível | O sistema deve manter e exibir o histórico de conversas do estudante com o assistente virtual. |
| RF11 | Consultar Resposta em Voz no Assistente Virtual (Text to Speech) | O sistema deve permitir que o estudante consulte a resposta de texto em voz no assistente virtual. |
| RF12 | Listar Tutoriais Disponíveis | O sistema deve exibir a listagem de tutoriais disponíveis para o estudante. |
| RF13 | Visualizar Tutoriais em Texto | O sistema deve permitir a visualização de tutoriais em formato textual. |
| RF14 | Reproduzir Tutoriais em Vídeo | O sistema deve permitir a reprodução de tutoriais em formato de vídeo. |
| RF15 | Expandir Explicação de Tópico em Dúvida | O sistema deve permitir que o estudante expanda a explicação de um tópico em dúvida. |
| RF16 | Consultar Grade Horária e Ensalamento | O sistema deve permitir a consulta à grade horária do estudante, incluindo os locais das aulas e das provas (ensalamento). |
| RF17 | Coletar Dados de Aulas Diariamente via SIGAA | O sistema deve coletar diariamente, a partir da plataforma SIGAA, os dados referentes às aulas do estudante. |
| RF18 | Coletar Dados do Calendário Acadêmico Semanalmente | O sistema deve coletar semanalmente os dados das aulas a partir do calendário acadêmico oficial da universidade. |
| RF19 | Atualizar Informações de Disciplinas Matriculadas | O sistema deve atualizar diariamente as informações das disciplinas em que o estudante está matriculado, com base nos dados extraídos do SIGAA. |
| RF20 | Enviar Documentos Oficiais | O sistema deve permitir que o estudante envie e anexe documentos oficiais à sua conta no aplicativo para uso nas funcionalidades disponíveis. |
| RF21 | Armazenar Documentos Oficiais para Acesso Offline | O sistema deve centralizar os documentos oficiais da universidade, disponibilizando-os para acesso rápido e sem necessidade de conexão com a internet. |
| RF22 | Exibir Fluxo de Onboarding para o SIGAA | O sistema deve oferecer um fluxo guiado e tutorial de acolhimento para orientar o estudante no uso da plataforma oficial SIGAA. |
| RF23 | Exibir Fluxo de Onboarding para o Aprender 3 | O sistema deve oferecer um fluxo guiado e tutorial de acolhimento para orientar o estudante no uso da plataforma oficial Aprender 3. |

---

## Resumo Executivo

| Métrica | Valor |
|---------|:-----:|
| Total de RFs | 23 |
| Must have (MVP) | 4 (RF16, RF20, RF21, RF22, RF23)* |
| Should have | 7 (RF04–RF07, RF17–RF19) |
| Could have | 3 (RF01–RF03) |
| Won't have | 9 (RF08–RF15) |
| ✅ Concluídos | 3 (RF06, RF20, RF21) |
| 🟡 Em desenvolvimento | 4 (RF01, RF02, RF03, RF16, RF22) |
| 🟣 Planejados | 4 (RF04, RF05, RF07, RF23) |
| 🔴 Pendentes/Bloqueados | 3 (RF17, RF18, RF19) |
| ⛔ Removidos | 9 (RF08–RF15) |

> \* RF16 foi listado como Must have do MVP no [cronograma](../06-cronograma/index.md) e na [Feature List](../10-feature-list/feature-list-geral.md), embora esteja atualmente em desenvolvimento.

---

## Rastreabilidade e Atualização

- **Prioridade** e **MVP** derivam da [Feature List Geral](../10-feature-list/feature-list-geral.md) e da [Priorização e MVP](../10-feature-list/priorizacao.md).
- **Iteração** deriva do [Cronograma](../06-cronograma/index.md).
- **Status** deve estar consistente com o [Acompanhamento por Feature](../10-feature-list/acompanhamento.md) — ao alterar um status de feature, replicar em todos os RFs associados.

**Regra de manutenção:** ao final de cada iteração, revisar o status de todos os RFs cuja Feature esteja na iteração correspondente.
