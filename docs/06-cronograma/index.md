# 6. Cronograma e Entregas

> Página dedicada a apresentar o **planejamento temporal** do projeto e o **status real de execução** de cada fase, feature e requisito.
>
> 📌 **Esta página foi reestruturada** para tornar explícito **o que foi executado**, **o que está pendente** e **quais evidências comprovam cada etapa**, conforme as boas práticas de rastreabilidade do FDD.
>
> 🔗 Para o detalhamento por processo FDD, consulte a [tela de evidências de execução](../05-er/evidencias-execucao.md). Para as evidências visuais e vídeos, consulte a [tela de evidências da implementação](../00-reunioes/evidencias.md).

---

## 1. Legenda de Status

> Categorias oficiais usadas em todo o projeto para indicar o estado de cada fase, feature ou requisito.

| Ícone | Categoria | Significado |
|:-----:|-----------|-------------|
| ⬜ | **Planejado** | Previsto no cronograma, ainda não iniciado. |
| 🟡 | **Em andamento** | Trabalho ativo na iteração corrente. |
| ✅ | **Concluído** | Finalizado, validado e com evidência anexada. |
| 🟠 | **Parcial** | Iniciado, mas apenas uma parte das subatividades/entregas previstas foi concluída. |
| 🔴 | **Atrasado** | Não concluído no prazo original, com replanejamento documentado. |
| ❌ | **Cancelado** | Descartado por decisão formal, com justificativa registrada. |

---

## 2. Visão Geral — Status por Fase do Cronograma

> Snapshot consolidado do cronograma. Cada fase traz **status global**, **período planejado × realizado**, **features impactadas** e **link direto para as evidências**.

| # | Fase / Iteração | Período Planejado | Período Realizado | Status Global | Features | Evidências |
|:-:|-----------------|-------------------|-------------------|:-------------:|----------|------------|
| 0 | **Planejamento e idealização do escopo** | 13/04 – 22/05/2026 | 13/04 – 22/05/2026 | ✅ Concluído | F01–F09 (contexto) | [5.3 Evidências §1](../05-er/evidencias-execucao.md) |
| 1 | **Iteração 1 — F09 + F07 (MVP)** | até 08/06/2026 | até 10/06/2026 (+2 dias) | 🟠 Parcial (c/ atraso) | F07, F09 | [5.3 §2.4–2.5](../05-er/evidencias-execucao.md); [Evidências U3](../00-reunioes/evidencias.md) |
| 2 | **Iteração 2 — F08 + F04 (Should)** | até 24/06/2026 | em execução | 🟡 Em andamento | F04, F08 | [5.3 §2.5 F04/F08](../05-er/evidencias-execucao.md) |
| 3 | **Iteração 3 — F05 (Onboarding MVP)** | até 30/06/2026 | em execução | 🟡 Em andamento | F05 | [5.3 §2.4 F05](../05-er/evidencias-execucao.md) |
| 4 | **Iteração 4 — F02 + F03 (pós-MVP)** | até 07/07/2026 | em execução | 🟡 Em andamento | F02, F03 | [5.3 §2.5 F02/F03](../05-er/evidencias-execucao.md) |

---

## 3. Como acessar as evidências

> Para acessar a evidência de um item concluído, utilize o link presente na coluna **🔗 Evidência** de cada tabela abaixo. Os links apontam para:
>
> - 📂 **[Tela de Evidências de Execução (5.3)](../05-er/evidencias-execucao.md)** — status por processo FDD, ADRs, features, pendências.
> - 🖼️ **[Tela de Evidências da Implementação (0.3)](../00-reunioes/evidencias.md)** — capturas de tela, vídeos e PRs da Unidade 3.
> - 📑 **Atas/Decisões** — documentos `.docx` na pasta `00-reunioes/docx/`.

---

## 4. Detalhamento por Fase

### 4.1 Fase 0 — Planejamento e Idealização do Escopo ✅

> 📅 **Planejado:** 13/04 – 22/05/2026 | **Realizado:** 13/04 – 22/05/2026 | **Desvio:** 0 dias

| Item | Status | Feature | Requisitos | Evidência |
|------|:------:|---------|------------|-----------|
| Visão do Produto e Projeto (contexto + solução) | ✅ | Transversal | OE1, OE2 | [5.3 §1](../05-er/evidencias-execucao.md); [01-cenario](../01-cenario/index.md); [02-solucao](../02-solucao/index.md) |
| Estratégias de ESW e ER | ✅ | Transversal | — | [04-estrategias](../04-estrategias/index.md) |
| Elicitação e descoberta dos requisitos | ✅ | F01–F09 | Todos os RFs | [5.3 §2.1](../05-er/evidencias-execucao.md); [01-cenario](../01-cenario/index.md) |
| Formação da Feature List + Priorização + MVP | ✅ | F01–F09 | Todos os RFs | [10.1 Feature List](../10-feature-list/feature-list-geral.md); [10.2 Priorização](../10-feature-list/priorizacao.md) |
| Validação com a cliente (Maria Fátima) | ✅ | Transversal | Stakeholder | [5.3 §2.1 entrevistas](../05-er/evidencias-execucao.md); [01-cenario/cliente](../01-cenario/cliente.md) |

---

### 4.2 Iteração 1 — F09 + F07 (MVP) 🟠 Parcial (c/ atraso)

> 📅 **Planejado:** até 08/06/2026 | **Realizado:** até 10/06/2026 | **Desvio:** +2 dias (testes)
>
> **Justificativa do desvio:** prioridade em adicionar suíte de testes do parser de PDF, estendendo a entrega em 2 dias sem comprometer o MVP.
>
> 🔗 **Evidências principais:** [5.3 §2.4 F07/F09](../05-er/evidencias-execucao.md) · [5.3 §2.5 F07/F09](../05-er/evidencias-execucao.md) · [Evidências U3 — vídeos e capturas](../00-reunioes/evidencias.md) · [Vídeo Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link) · [Vídeo Buscas e Filtros](https://drive.google.com/file/d/1EOVQwvk7PbyRCCIwI105-FQpBcUWR342/view?usp=drive_link) · [Captura tela-inicial](../../assets/evidencias/tela-inicial.png) · [Captura tela-documentos](../../assets/evidencias/tela-documentos.png)

| Item | Status | Feature | Requisitos | Evidência |
|------|:------:|---------|------------|-----------|
| RF20 — Enviar Documentos Oficiais | ✅ | F09 | RF20 | [5.3 §2.5 F09](../05-er/evidencias-execucao.md); [Vídeo Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link) |
| RF21 — Armazenar Documentos Oficiais para Acesso Offline | ✅ | F09 | RF21, RNF08 | [5.3 §2.5 F09](../05-er/evidencias-execucao.md); [Evidências U3 §1](../00-reunioes/evidencias.md) |
| RF16 — Consultar Grade Horária e Ensalamento | 🟠 | F07 | RF16, RNF03 | [5.3 §2.5 F07](../05-er/evidencias-execucao.md); [Vídeo Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link) |
| Tela inicial com grade horária (exemplos fakes) | ✅ | F05, F07 | RF16, RNF02 | [Captura tela-inicial](../../assets/evidencias/tela-inicial.png); [Evidências U3 §1](../00-reunioes/evidencias.md) |
| RNF01 — Interface com Tipografia Adaptável | 🟠 | Transversal | RNF01, RNF18–RNF26 | [5.3 §2.4 Design System](../05-er/evidencias-execucao.md); [checklist-acessibilidade](../08-requisitos/checklist-acessibilidade.md) |
| RNF03 — Consulta Offline | ✅ | F09 | RNF03 | [5.3 §2.5 F09 SQLite](../05-er/evidencias-execucao.md) |
| RNF08 — Armazenamento Local com Expo SQLite | ✅ | F09 | RNF08 | [5.3 §2.5 F09 SQLite](../05-er/evidencias-execucao.md); ADR-02 |
| RNF06 — Atualização OTA (antecipado p/ Iteração 1) | ✅ | F04 | RNF06 | [5.3 §4 ADR-06](../05-er/evidencias-execucao.md) |
| RF06 — Extrair Dados do Histórico Escolar/Passe Livre | ✅ | F04 | RF06 | [5.3 §2.5 F04](../05-er/evidencias-execucao.md) |

---

### 4.3 Iteração 2 — F08 + F04 (Should) 🟡 Em andamento

> 📅 **Planejado:** até 24/06/2026 | **Status:** em execução no ciclo atual
>
> 🔗 **Evidências parciais:** [5.3 §2.5 F04](../05-er/evidencias-execucao.md) (RF06 já commitado) · [5.3 §5 Pendências (F08)](../05-er/evidencias-execucao.md)

| Item | Status | Feature | Requisitos | Evidência |
|------|:------:|---------|------------|-----------|
| RF17 — Coletar Dados de Aulas Diariamente via SIGAA | 🔴 | F08 | RF17, RNF09 | [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md) — **bloqueada** |
| RF18 — Coletar Dados do Calendário Acadêmico Semanalmente | 🔴 | F08 | RF18, RNF06 | [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md) — **bloqueada** |
| RF19 — Atualizar Informações de Disciplinas Matriculadas | 🔴 | F08 | RF19 | [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md) — **bloqueada** |
| RF04 — Armazenar Dados de Documentos Enviados | ⬜ | F04 | RF04 | Sem evidência ainda |
| RF05 — Processar Dados de Documentos Enviados | ⬜ | F04 | RF05 | Sem evidência ainda |
| RF07 — Parser do Passe Livre Estudantil | ⬜ | F04 | RF07 | Sem evidência ainda |
| RNF09 — Notificações sobre Eventos/Alterações Acadêmicas | ⬜ | F07, F08 | RNF09 | Sem evidência ainda |

> **⚠️ Desvio Planejado × Realizado (Iteração 2):** a F08 está **bloqueada por falta de credenciais SIGAA** válidas para testes (decisão registrada em [5.3 §5](../05-er/evidencias-execucao.md)). Mitigação: solicitar credenciais de homologação ou mockar dados com `MSW`/fixture para destravar o desenvolvimento. A F04 também está atrasada — apenas o RF06 foi concluído nesta iteração; RF04/RF05/RF07 seguem pendentes.

---

### 4.4 Iteração 3 — F05 Onboarding (MVP) 🟡 Em andamento

> 📅 **Planejado:** até 30/06/2026 | **Status:** em execução
>
> 🔗 **Evidências parciais:** [5.3 §2.4 F05](../05-er/evidencias-execucao.md) · [5.3 §2.5 F05](../05-er/evidencias-execucao.md) · [Captura tela-inicial](../../assets/evidencias/tela-inicial.png)

| Item | Status | Feature | Requisitos | Evidência |
|------|:------:|---------|------------|-----------|
| RF07 — Exibir Fluxos de Onboarding para Plataformas Oficiais | 🟠 | F05 | RF07/RF22 | [5.3 §2.4 F05](../05-er/evidencias-execucao.md); [Captura tela-inicial](../../assets/evidencias/tela-inicial.png) |
| RF22/RF23 — Fluxos de Onboarding SIGAA + Aprender 3 | ⬜ | F05 | RF22, RF23 | Sem evidência ainda |
| Splash Screen configurada | ✅ | F05 | RNF01 | [10.3 F05 card](../10-feature-list/acompanhamento.md) |
| RNF01 — Tipografia Adaptável | 🟠 | Transversal | RNF01, RNF18 | [5.3 §2.4 Design System](../05-er/evidencias-execucao.md); [checklist-acessibilidade](../08-requisitos/checklist-acessibilidade.md) |
| RNF02 — Navegação de Tarefas Essenciais em ≤ 2 Cliques | 🟡 | F05, F07, F09 | RNF02, RNF21 | [5.3 §2.4 Design System](../05-er/evidencias-execucao.md); [Vídeo Tela Inicial](https://drive.google.com/file/d/1J5pvcoWDN1ZcXoa7kzQK8vBnkqCwdqLL/view?usp=drive_link) |

> **⚠️ Desvio Planejado × Realizado (Iteração 3):** a tela inicial/Home foi entregue **antecipadamente na Iteração 1** (com exemplos fakes) para viabilizar a demonstração do MVP. Os fluxos completos de onboarding SIGAA/Aprender 3 seguem pendentes dentro desta iteração.

---

### 4.5 Iteração 4 — F02 + F03 (pós-MVP) 🟡 Em andamento

> 📅 **Planejado:** até 07/07/2026 | **Status:** em execução
>
> 🔗 **Evidências parciais:** [5.3 §2.5 F02/F03](../05-er/evidencias-execucao.md) · [10.3 cards F02/F03](../10-feature-list/acompanhamento.md)

| Item | Status | Feature | Requisitos | Evidência |
|------|:------:|---------|------------|-----------|
| RF01 — Exibir Carteirinha Estudantil Digital | 🟡 | F03 | RF01 | [10.3 F03 card](../10-feature-list/acompanhamento.md) — branch em desenvolvimento |
| RF02 — Gerar QR Code para Acesso à BCE | 🟡 | F02 | RF02 | [10.3 F02 card](../10-feature-list/acompanhamento.md) — branch em desenvolvimento |
| RF03 — Armazenar Carteirinha Estudantil | 🟡 | F03 | RF03, RNF08 | [10.3 F03 card](../10-feature-list/acompanhamento.md) |
| RNF01 — Tipografia Adaptável | 🟡 | F02, F03 | RNF01, RNF18 | [checklist-acessibilidade](../08-requisitos/checklist-acessibilidade.md) |
| RNF03 — Consulta Offline | 🟡 | F02, F03 | RNF03, RNF08 | [10.3 cards F02/F03](../10-feature-list/acompanhamento.md) |
| RNF08 — Armazenamento Local com Expo SQLite | 🟡 | F03 | RNF08 | [10.3 F03 card](../10-feature-list/acompanhamento.md) |

---

## 5. Matriz Cronograma × Features × Requisitos × Evidências

> Cruzamento explícito entre **iteração**, **feature**, **requisitos**, **status** e **evidência direta**. Use esta tabela como índice rápido para auditoria.

| Iteração | Período | Feature | MoSCoW | Requisitos | Status | Evidência Direta |
|:-:|---------|---------|:------:|------------|:------:|------------------|
| Fase 0 | 13/04–22/05 | F01–F09 | — | Todos RFs/RNFs | ✅ | [5.3 §1](../05-er/evidencias-execucao.md) · [10.1](../10-feature-list/feature-list-geral.md) · [10.2](../10-feature-list/priorizacao.md) |
| Iteração 1 | até 08/06 | **F09** | Must (MVP) | RF20, RF21, RNF03, RNF08 | 🟠 | [Vídeo Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link) · [Vídeo Buscas e Filtros](https://drive.google.com/file/d/1EOVQwvk7PbyRCCIwI105-FQpBcUWR342/view?usp=drive_link) · [Captura tela-documentos](../../assets/evidencias/tela-documentos.png) · [5.3 §2.5 F09](../05-er/evidencias-execucao.md) |
| Iteração 1 | até 08/06 | **F07** | Must (MVP) | RF16, RNF01, RNF02, RNF03 | 🟠 | [Vídeo Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link) · [Captura tela-inicial](../../assets/evidencias/tela-inicial.png) · [5.3 §2.5 F07](../05-er/evidencias-execucao.md) |
| Iteração 1 (antecipado) | 08/06 | **F04** (parcial) | Should | RF06, RNF06 | ✅ (parcial) | [5.3 §2.5 F04 RF06](../05-er/evidencias-execucao.md) |
| Iteração 2 | até 24/06 | **F04** | Should | RF04, RF05, RF07 | 🟡 | [5.3 §2.5 F04](../05-er/evidencias-execucao.md) — RF04/RF05/RF07 ⬜ |
| Iteração 2 | até 24/06 | **F08** | Should | RF17, RF18, RF19, RNF04, RNF09 | 🔴 | [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md) — bloqueada |
| Iteração 3 | até 30/06 | **F05** | Must (MVP) | RF22, RF23, RNF01, RNF02, RNF18–RNF26 | 🟡 | [5.3 §2.4 F05](../05-er/evidencias-execucao.md) · [Captura tela-inicial](../../assets/evidencias/tela-inicial.png) · [Vídeo Tela Inicial](https://drive.google.com/file/d/1J5pvcoWDN1ZcXoa7kzQK8vBnkqCwdqLL/view?usp=drive_link) |
| Iteração 4 | até 07/07 | **F02** | Could (pós-MVP) | RF02, RNF01–RNF03, RNF08 | 🟡 | [5.3 §2.5 F02](../05-er/evidencias-execucao.md) · [10.3 F02](../10-feature-list/acompanhamento.md) |
| Iteração 4 | até 07/07 | **F03** | Could (pós-MVP) | RF01, RF03, RNF02, RNF03, RNF08 | 🟡 | [5.3 §2.5 F03](../05-er/evidencias-execucao.md) · [10.3 F03](../10-feature-list/acompanhamento.md) |
| — | — | **F01** | Won't | RF08–RF11 | ❌ | Cancelada — VB=2 / ES=60h ([10.1](../10-feature-list/feature-list-geral.md)) |
| — | — | **F06** | Won't | RF12–RF15 | ❌ | Cancelada — VB=2 / ES=15h ([10.1](../10-feature-list/feature-list-geral.md)) |

---

## 6. Lista Detalhada por Requisito (RF e RNF)

> Esta seção traz **cada requisito individualmente como tópico/seção**, com seu **status atual**, **feature/iteração correspondente** e **link direto para a evidência**. Serve como auditoria item-a-item de toda a execução.
>
> 📚 Referências de origem: [Requisitos Funcionais (8.1)](../08-requisitos/funcionais.md) e [Requisitos Não Funcionais (8.2)](../08-requisitos/nao-funcionais.md).

---

### 6.1 Requisitos Funcionais (RF)

#### RF01 · Exibir Carteirinha Estudantil Digital 🟡
- **Feature:** F03 | **Prioridade:** Could (pós-MVP) | **Iteração:** I4
- **Status:** Em desenvolvimento
- **Evidência:** Branch `feat/carteirinha-digital` em desenvolvimento — [10.3 F03 card](../10-feature-list/acompanhamento.md)

#### RF02 · Gerar QR Code para Acesso à BCE 🟡
- **Feature:** F02 | **Prioridade:** Could (pós-MVP) | **Iteração:** I4
- **Status:** Em desenvolvimento
- **Evidência:** Branch `feat/qrcode-bce` em desenvolvimento — [10.3 F02 card](../10-feature-list/acompanhamento.md)

#### RF03 · Armazenar Carteirinha Estudantil 🟡
- **Feature:** F03 | **Prioridade:** Could (pós-MVP) | **Iteração:** I4
- **Status:** Em desenvolvimento
- **Evidência:** Persistência local em SQLite planejada — [10.3 F03 card](../10-feature-list/acompanhamento.md)

#### RF04 · Armazenar Dados de Documentos Enviados ⬜
- **Feature:** F04 | **Prioridade:** Should | **Iteração:** I2
- **Status:** Planejado
- **Evidência:** Sem evidência ainda — [5.3 §2.5 F04](../05-er/evidencias-execucao.md)

#### RF05 · Processar Dados de Documentos Enviados ⬜
- **Feature:** F04 | **Prioridade:** Should | **Iteração:** I2
- **Status:** Planejado
- **Evidência:** Sem evidência ainda — [5.3 §2.5 F04](../05-er/evidencias-execucao.md)

#### RF06 · Extrair Dados do Histórico Escolar ✅
- **Feature:** F04 | **Prioridade:** Should | **Iteração:** I1 (antecipado)
- **Status:** Concluído
- **Evidência:** Parser commitado no repositório — [5.3 §2.5 F04 RF06](../05-er/evidencias-execucao.md)

#### RF07 · Extrair Dados da Declaração do Passe Livre Estudantil ⬜
- **Feature:** F04 | **Prioridade:** Should | **Iteração:** I2
- **Status:** Planejado
- **Evidência:** Sem evidência ainda — [5.3 §2.5 F04](../05-er/evidencias-execucao.md)

#### RF08 · Enviar Perguntas ao Assistente Virtual ❌
- **Feature:** F01 | **Prioridade:** Won't | **Iteração:** —
- **Status:** Cancelado (Won't have)
- **Evidência:** Fora do escopo — VB=2 / ES=60h — [10.1 F01](../10-feature-list/feature-list-geral.md)

#### RF09 · Direcionar para Tutorial Específico ❌
- **Feature:** F01 | **Prioridade:** Won't | **Iteração:** —
- **Status:** Cancelado (Won't have)
- **Evidência:** Fora do escopo (atrelado à F01) — [10.1 F01](../10-feature-list/feature-list-geral.md)

#### RF10 · Manter Histórico de Conversas Visível ❌
- **Feature:** F01 | **Prioridade:** Won't | **Iteração:** —
- **Status:** Cancelado (Won't have)
- **Evidência:** Fora do escopo (atrelado à F01) — [10.1 F01](../10-feature-list/feature-list-geral.md)

#### RF11 · Consultar Resposta em Voz no Assistente Virtual (Text to Speech) ❌
- **Feature:** F01 | **Prioridade:** Won't | **Iteração:** —
- **Status:** Cancelado (Won't have)
- **Evidência:** Fora do escopo (atrelado à F01) — [10.1 F01](../10-feature-list/feature-list-geral.md)

#### RF12 · Listar Tutoriais Disponíveis ❌
- **Feature:** F06 | **Prioridade:** Won't | **Iteração:** —
- **Status:** Cancelado (Won't have)
- **Evidência:** Fora do escopo — VB=2 / ES=15h — [10.1 F06](../10-feature-list/feature-list-geral.md)

#### RF13 · Visualizar Tutoriais em Texto ❌
- **Feature:** F06 | **Prioridade:** Won't | **Iteração:** —
- **Status:** Cancelado (Won't have)
- **Evidência:** Fora do escopo (atrelado à F06) — [10.1 F06](../10-feature-list/feature-list-geral.md)

#### RF14 · Reproduzir Tutoriais em Vídeo ❌
- **Feature:** F06 | **Prioridade:** Won't | **Iteração:** —
- **Status:** Cancelado (Won't have)
- **Evidência:** Fora do escopo (atrelado à F06) — [10.1 F06](../10-feature-list/feature-list-geral.md)

#### RF15 · Expandir Explicação de Tópico em Dúvida ❌
- **Feature:** F06 | **Prioridade:** Won't | **Iteração:** —
- **Status:** Cancelado (Won't have)
- **Evidência:** Fora do escopo (atrelado à F06) — [10.1 F06](../10-feature-list/feature-list-geral.md)

#### RF16 · Consultar Grade Horária e Ensalamento 🟠
- **Feature:** F07 | **Prioridade:** Must (MVP) | **Iteração:** I1
- **Status:** Parcial (c/ atraso de 2 dias)
- **Evidência:** Tela Schedule + parser PDF — [Vídeo Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link) · [Captura tela-inicial](../../assets/evidencias/tela-inicial.png) · [5.3 §2.5 F07](../05-er/evidencias-execucao.md)

#### RF17 · Coletar Dados de Aulas Diariamente via SIGAA 🔴
- **Feature:** F08 | **Prioridade:** Should | **Iteração:** I2
- **Status:** Atrasado — bloqueado por falta de credenciais SIGAA
- **Evidência:** [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md)

#### RF18 · Coletar Dados do Calendário Acadêmico Semanalmente 🔴
- **Feature:** F08 | **Prioridade:** Should | **Iteração:** I2
- **Status:** Atrasado — bloqueado por falta de credenciais SIGAA
- **Evidência:** [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md)

#### RF19 · Atualizar Informações de Disciplinas Matriculadas 🔴
- **Feature:** F08 | **Prioridade:** Should | **Iteração:** I2
- **Status:** Atrasado — bloqueado por falta de credenciais SIGAA
- **Evidência:** [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md)

#### RF20 · Enviar Documentos Oficiais ✅
- **Feature:** F09 | **Prioridade:** Must (MVP) | **Iteração:** I1
- **Status:** Concluído
- **Evidência:** Upload implementado em `UnB-App/src/screens/Documents*` — [Vídeo Upload e Grade](https://drive.google.com/file/d/1O405tSUfuaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link) · [Captura tela-documentos](../../assets/evidencias/tela-documentos.png) · [5.3 §2.5 F09](../05-er/evidencias-execucao.md)

> **Nota:** o link do Drive acima pode estar corrompido — o link correto é o mesmo da F07: <https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link>.

#### RF21 · Armazenar Documentos Oficiais para Acesso Offline ✅
- **Feature:** F09 | **Prioridade:** Must (MVP) | **Iteração:** I1
- **Status:** Concluído
- **Evidência:** Persistência local com Expo SQLite — [Evidências U3 §1](../00-reunioes/evidencias.md) · [Vídeo Buscas e Filtros](https://drive.google.com/file/d/1EOVQwvk7PbyRCCIwI105-FQpBcUWR342/view?usp=drive_link) · [5.3 §2.5 F09 SQLite](../05-er/evidencias-execucao.md)

#### RF22 · Exibir Fluxo de Onboarding para o SIGAA 🟡
- **Feature:** F05 | **Prioridade:** Must (MVP) | **Iteração:** I3
- **Status:** Em desenvolvimento
- **Evidência:** Tela inicial/Home antecipada na I1 — [5.3 §2.4 F05](../05-er/evidencias-execucao.md) · [Captura tela-inicial](../../assets/evidencias/tela-inicial.png)

#### RF23 · Exibir Fluxo de Onboarding para o Aprender 3 ⬜
- **Feature:** F05 | **Prioridade:** Must (MVP) | **Iteração:** I3
- **Status:** Planejado
- **Evidência:** Sem evidência ainda — [10.3 F05 card](../10-feature-list/acompanhamento.md)

---

### 6.2 Requisitos Não Funcionais (RNF)

#### RNF01 · Aplicar Interface com Tipografia Adaptável 🟠
- **Categoria:** Usabilidade | **Iteração:** Transversal (I1, I2, I3, I4)
- **Status:** Parcial — implementado em iterações iniciais; ajuste contínuo
- **Evidência:** [5.3 §2.4 Design System](../05-er/evidencias-execucao.md) · [checklist-acessibilidade](../08-requisitos/checklist-acessibilidade.md)

#### RNF02 · Projetar Navegação de Tarefas Essenciais em Até 2 Cliques 🟡
- **Categoria:** Usabilidade | **Iteração:** I1, I3
- **Status:** Em validação
- **Evidência:** [Vídeo Tela Inicial](https://drive.google.com/file/d/1J5pvcoWDN1ZcXoa7kzQK8vBnkqCwdqLL/view?usp=drive_link) · [5.3 §2.4 F05/F07/F09](../05-er/evidencias-execucao.md)

#### RNF03 · Permitir Consulta de Informações Institucionais Offline ✅
- **Categoria:** Confiabilidade | **Iteração:** I1
- **Status:** Concluído (F09 + F07 + F03 com cache SQLite)
- **Evidência:** [5.3 §2.5 F09 SQLite](../05-er/evidencias-execucao.md) · ADR-02

#### RNF04 · Sincronizar Automaticamente Dados Divergentes 🔴
- **Categoria:** Confiabilidade | **Iteração:** I2
- **Status:** Atrasado — atrelado ao bloqueio da F08
- **Evidência:** [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md)

#### RNF05 · Garantir Compatibilidade com Android 7.0+ e iOS 15.1+ ✅
- **Categoria:** Suportabilidade | **Iteração:** I0/I1
- **Status:** Concluído (definido em ADR-01)
- **Evidência:** [5.3 §4 ADR-01](../05-er/evidencias-execucao.md) · `UnB-App/app.json`

#### RNF06 · Atualizar Calendário Acadêmico e Correções via OTA ✅
- **Categoria:** Suportabilidade | **Iteração:** I1 (antecipado)
- **Status:** Concluído — antecipado da I2 para a I1
- **Evidência:** [5.3 §4 ADR-06](../05-er/evidencias-execucao.md) · `UnB-App/eas.json`

#### RNF07 · Desenvolver Aplicativo com React Native, Expo e TypeScript ✅
- **Categoria:** + Restrições | **Iteração:** I0/I1
- **Status:** Concluído
- **Evidência:** [5.3 §4 ADR-01](../05-er/evidencias-execucao.md) · `UnB-App/package.json` · `UnB-App/tsconfig.json`

#### RNF08 · Armazenar Dados Locais com Expo SQLite ✅
- **Categoria:** + Restrições | **Iteração:** I1
- **Status:** Concluído
- **Evidência:** [5.3 §4 ADR-02](../05-er/evidencias-execucao.md) · [5.3 §2.5 F09 SQLite](../05-er/evidencias-execucao.md)

#### RNF09 · Emitir Notificações sobre Eventos e Alterações Acadêmicas ⬜
- **Categoria:** + Restrições | **Iteração:** I2
- **Status:** Planejado (depende de F08)
- **Evidência:** Sem evidência ainda — [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md)

#### RNF10 · Limitar Durações de Animações de Interface a 300ms ✅
- **Categoria:** Desempenho | **Iteração:** I1/I3
- **Status:** Concluído — animações nativas do React Navigation respeitam o limite
- **Evidência:** [5.3 §2.4 Design System](../05-er/evidencias-execucao.md) · [Vídeo Tela Inicial](https://drive.google.com/file/d/1J5pvcoWDN1ZcXoa7kzQK8vBnkqCwdqLL/view?usp=drive_link)

#### RNF11 · Omitir Animações de Entrada em Telas de Alta Frequência ✅
- **Categoria:** Desempenho | **Iteração:** I1/I3
- **Status:** Concluído
- **Evidência:** [5.3 §2.4 Design System](../05-er/evidencias-execucao.md)

#### RNF12 · Utilizar Aceleração por Hardware em Animações ✅
- **Categoria:** Desempenho | **Iteração:** I1/I3
- **Status:** Concluído — uso de `transform`/`opacity` em transições
- **Evidência:** [5.3 §2.4 Design System](../05-er/evidencias-execucao.md)

#### RNF13 · Limitar Tempo de Processamento de Arquivos Locais 🟡
- **Categoria:** Desempenho | **Iteração:** I1
- **Status:** Em validação — parser do PDF implementado, métricas em coleta
- **Evidência:** [5.3 §2.5 F09 parser](../05-er/evidencias-execucao.md) · [Vídeo Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link)

#### RNF14 · Garantir Resposta Imediata do Banco de Dados Local 🟡
- **Categoria:** Desempenho | **Iteração:** I1
- **Status:** Em validação — benchmarks planejados
- **Evidência:** [5.3 §2.5 F09 SQLite](../05-er/evidencias-execucao.md)

#### RNF15 · Otimizar Tempo de Inicialização (Cold Start) 🟡
- **Categoria:** Desempenho | **Iteração:** I1/I3
- **Status:** Em validação
- **Evidência:** [5.3 §2.5 Build Expo](../05-er/evidencias-execucao.md)

#### RNF16 · Limitar Uso de Armazenamento Local 🟡
- **Categoria:** Desempenho | **Iteração:** I1
- **Status:** Em monitoramento
- **Evidência:** [5.3 §2.5 F09 SQLite](../05-er/evidencias-execucao.md)

#### RNF17 · Executar Sincronização Web sem Bloqueio de UI ⬜
- **Categoria:** Desempenho | **Iteração:** I2
- **Status:** Planejado (depende de F08)
- **Evidência:** Sem evidência ainda — [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md)

#### RNF18 · Definir Tamanho Mínimo de Fonte Base em 18sp 🟠
- **Categoria:** Usabilidade (60+) | **Iteração:** I1/I3
- **Status:** Parcial — implementado nas telas atuais; validação completa em checklist pendente
- **Evidência:** [checklist-acessibilidade](../08-requisitos/checklist-acessibilidade.md) · [5.3 §2.4 Design System](../05-er/evidencias-execucao.md) · [Captura tela-inicial](../../assets/evidencias/tela-inicial.png)

#### RNF19 · Definir Razão de Contraste Mínimo de 4.5:1 🟠
- **Categoria:** Usabilidade (60+) | **Iteração:** I1/I3
- **Status:** Parcial — em revisão por inspeção visual
- **Evidência:** [checklist-acessibilidade](../08-requisitos/checklist-acessibilidade.md) · [Captura tela-inicial](../../assets/evidencias/tela-inicial.png)

#### RNF20 · Padronizar Botões e Ícones com Alvo de Toque Mínimo de 48x48dp 🟠
- **Categoria:** Usabilidade (60+) | **Iteração:** I1/I3
- **Status:** Parcial — implementado nos componentes principais
- **Evidência:** [checklist-acessibilidade](../08-requisitos/checklist-acessibilidade.md) · [5.3 §2.4 Design System](../05-er/evidencias-execucao.md)

#### RNF21 · Limitar Tarefas Essenciais a No Máximo 3 Passos Visíveis 🟡
- **Categoria:** Usabilidade (60+) | **Iteração:** I1/I3/I4
- **Status:** Em validação — fluxos Home → Recurso implementados
- **Evidência:** [Vídeo Tela Inicial](https://drive.google.com/file/d/1J5pvcoWDN1ZcXoa7kzQK8vBnkqCwdqLL/view?usp=drive_link) · [5.3 §2.4 F05/F07/F09](../05-er/evidencias-execucao.md)

#### RNF22 · Fornecer Indicação Clara do Próximo Passo e do Local Atual 🟡
- **Categoria:** Usabilidade (60+) | **Iteração:** I1/I3/I4
- **Status:** Em validação — cabeçalhos e CTAs padronizados
- **Evidência:** [5.3 §2.4 Design System](../05-er/evidencias-execucao.md) · [Captura tela-inicial](../../assets/evidencias/tela-inicial.png)

#### RNF23 · Exibir Feedback Imediato e Mensagens de Erro em Linguagem Natural 🟡
- **Categoria:** Usabilidade (60+) | **Iteração:** I1/I3
- **Status:** Em validação
- **Evidência:** [5.3 §2.4 Design System](../05-er/evidencias-execucao.md) · [Vídeo Buscas e Filtros](https://drive.google.com/file/d/1EOVQwvk7PbyRCCIwI105-FQpBcUWR342/view?usp=drive_link)

#### RNF24 · Permitir Ajuste Persistente de Tamanho de Fonte pelo Usuário ⬜
- **Categoria:** Usabilidade (60+) | **Iteração:** I3
- **Status:** Planejado — seletor nas Configurações de Acessibilidade
- **Evidência:** [checklist-acessibilidade](../08-requisitos/checklist-acessibilidade.md) · [5.3 §2.4 F05](../05-er/evidencias-execucao.md)

#### RNF25 · Aplicar Padrão Foco Visível em Navegação por Teclado/Leitor de Tela 🟠
- **Categoria:** Usabilidade (60+) | **Iteração:** I1/I3
- **Status:** Parcial — propriedades de acessibilidade aplicadas nos componentes principais
- **Evidência:** [checklist-acessibilidade](../08-requisitos/checklist-acessibilidade.md) · [5.3 §2.4 Design System](../05-er/evidencias-execucao.md)

#### RNF26 · Evitar Dependência Exclusiva de Cor para Transmitir Informação 🟠
- **Categoria:** Usabilidade (60+) | **Iteração:** I1/I3
- **Status:** Parcial — uso de ícone + texto + cor nos status
- **Evidência:** [checklist-acessibilidade](../08-requisitos/checklist-acessibilidade.md) · [Captura tela-documentos](../../assets/evidencias/tela-documentos.png)

---

## 7. Registro de Desvios — Planejado × Realizado

> Esta seção consolida todos os **desvios entre o cronograma planejado e a execução real**, com justificativa, impacto e plano de mitigação. É o principal insumo para replanejamento e para a auditoria de processo.

| # | Iteração/Item | Planejado | Realizado | Desvio | Status | Justificativa | Mitigação | Evidência |
|:-:|---------------|-----------|-----------|--------|:------:|---------------|-----------|-----------|
| D1 | Iteração 1 — F07 + F09 | até 08/06/2026 | até 10/06/2026 | **+2 dias** | 🔴 Atrasado | Inclusão de suíte de testes do parser de PDF | Aceito — não comprometeu MVP | [Vídeo Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link) · [Vídeo Buscas e Filtros](https://drive.google.com/file/d/1EOVQwvk7PbyRCCIwI105-FQpBcUWR342/view?usp=drive_link) |
| D2 | Iteração 1 — antecipação RNF06 | Iteração 2 | Iteração 1 | **antecipado** | ✅ Concluído | Empolgação da equipe ao implementar calendário na Fase de "Calendarização" | — | [5.3 §4 ADR-06](../05-er/evidencias-execucao.md) |
| D3 | Iteração 1 — entrega parcial de F07 | F07 completa | Apenas grade + parser; sem sincronização/notificação | **parcial** | 🟠 Parcial | Foco no MVP de upload e parser | Sincronização com calendário movida para F08 (Iteração 2) | [10.3 F07 card](../10-feature-list/acompanhamento.md) |
| D4 | Iteração 1 — antecipação da Tela Inicial | Iteração 3 (F05) | Iteração 1 | **antecipado** | ✅ Concluído | Necessidade de "casca" para demonstrar MVP ao cliente | Onboarding completo segue na Iteração 3 | [Captura tela-inicial](../../assets/evidencias/tela-inicial.png) |
| D5 | Iteração 2 — F08 Web Scraping SIGAA | até 24/06/2026 | não iniciado | **bloqueado** | 🔴 Atrasado | Sem credenciais de homologação do SIGAA | Solicitar credenciais à cliente ou mockar dados com `MSW`/fixture | [5.3 §5 Pendência F08](../05-er/evidencias-execucao.md) |
| D6 | Iteração 2 — F04 Histórico/Passe Livre | até 24/06/2026 | RF06 concluído; RF04/RF05/RF07 ⬜ | **parcial** | 🟠 Parcial | Foco em RF06 (parser do histórico) por trazer maior valor imediato | Demais subatividades migradas para janela de replanejamento | [10.3 F04 card](../10-feature-list/acompanhamento.md) |
| D7 | Iteração 3 — Onboarding completo SIGAA + Aprender 3 | até 30/06/2026 | em execução | **em risco** | 🟡 Em andamento | Tela inicial antecipada (D4); fluxos detalhados ainda em construção | Concentrar esforços nos 2 fluxos críticos até o fim da iteração | [10.3 F05 card](../10-feature-list/acompanhamento.md) |

---

## 8. Resumo Executivo do Status

| Categoria | Qtd. | Itens |
|:---------:|:----:|-------|
| ⬜ Planejado | 3 | RF17, RF18, RF19 (F08) |
| 🟡 Em andamento | 5 | F02, F03, F05, F08, F04 |
| ✅ Concluído | 1 | Fase 0 integralmente; RF06 (F04) — antecipado |
| 🟠 Parcial | 4 | F07, F09, F04 (apenas RF06), F05 (apenas Splash+Home) |
| 🔴 Atrasado | 2 | Iteração 1 (+2 dias), Iteração 2 — F08 (bloqueada) |
| ❌ Cancelado | 2 | F01 (assistente IA — Won't), F06 (tutoriais — Won't) |

> 🔗 **Para os detalhes qualitativos** (decisões arquiteturais, lições aprendidas, inspeções e pendências), consulte a [tela de evidências de execução](../05-er/evidencias-execucao.md).

---

## 9. Links Úteis

- 📂 [Tela de Evidências de Execução do FDD (5.3)](../05-er/evidencias-execucao.md)
- 🖼️ [Tela de Evidências da Implementação (0.3)](../00-reunioes/evidencias.md)
- 📊 [Feature List Geral](../10-feature-list/feature-list-geral.md)
- 🧭 [Acompanhamento por Feature](../10-feature-list/acompanhamento.md)
- 🎯 [Priorização e MVP](../10-feature-list/priorizacao.md)
- ✅ [DoR e DoD](../09-dor-dod/index.md)
- ♿ [Checklist de Acessibilidade](../08-requisitos/checklist-acessibilidade.md)
- 🔗 [Matriz de Rastreabilidade](../08-requisitos/rastreabilidade.md)
- 🎥 [Gravações das Reuniões](../00-reunioes/gravacoes.md)
- 📑 [Atas e transcrições (.docx)](../00-reunioes/docx/)
- 🗂️ [Repositório GitHub](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App)