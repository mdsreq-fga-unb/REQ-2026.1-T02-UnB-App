# 5.3 Evidências de Execução do Processo de ESW

> Página dedicada a consolidar **o que foi efetivamente feito pela equipe** ao longo do semestre, evidenciando a execução prática do processo **FDD (Feature-Driven Development)** combinado às atividades de **Engenharia de Software / Requisitos (ESW/ER)**.
>
> Aqui cada atividade do FDD é rastreada com **status** (planejada, em andamento, concluída ou pendente), **features trabalhadas** e **evidências concretas** (atas, decisões técnicas, tarefas, issues, commits, protótipos, vídeos, inspeções).

---

## Legenda de Status

| Ícone | Status | Significado |
|:-----:|--------|-------------|
| ⬜ | **Planejada** | Atividade prevista no planejamento, ainda não iniciada. |
| 🟡 | **Em andamento** | Atividade em execução no ciclo atual. |
| ✅ | **Concluída** | Atividade finalizada e validada. |
| 🔴 | **Pendente** | Atividade prevista, mas bloqueada ou atrasada — exige plano de mitigação. |
| ❌ | **Cancelada** | Atividade descartada por decisão formal (com justificativa). |

---

## 1. Visão Geral — Status do Processo FDD

> Snapshot do progresso por processo do FDD. Atualizado ao final de cada iteração.

| # | Processo FDD | Status | Features Envolvidas | Evidência Resumida |
|:-:|--------------|:------:|---------------------|---------------------|
| 1 | **Desenvolver um Modelo Abrangente** | ✅ | Contexto (todas) | Rich Picture, entrevistas, formulário público |
| 2 | **Construir uma Lista de Funcionalidades** | ✅ | F01 a F09 | Feature List Geral + MoSCoW |
| 3 | **Planejar por Funcionalidade** | ✅ | F05, F07, F09 (MVP) | Matriz VB×ES, cronograma, DoR |
| 4 | **Projetar por Funcionalidade** | 🟡 | F05, F07, F09, F02, F03 | Mockups Figma, protótipos RN |
| 5 | **Construir por Funcionalidade** | 🟡 | F07, F09, F02 | Inspeções, PRs, build Expo |

---

## 2. Detalhamento por Processo FDD

### 2.1 Desenvolver um Modelo Abrangente ✅

| Atividade | Status | Evidência | Link |
|-----------|:------:|-----------|------|
| Elicitação — Entrevistas com cliente (Maria Fátima) | ✅ | Ata R01 + transcrição | [Terminar a primeira entrega.docx](../00-reunioes/docx/Terminar%20a%20primeira%20entrega%20.docx) |
| Elicitação — Questionário público | ✅ | Resultados consolidados na [segmentação](../01-cenario/segmentacao.md) | — |
| Elicitação — Observação de uso do SIGAA | ✅ | [Rich Picture](../01-cenario/rich-picture.md) | — |
| Análise de Tarefas (Task Analysis) | ✅ | Mapeamento de barreiras em [segmentação](../01-cenario/segmentacao.md) | — |
| Consenso — Workshops com equipe | ✅ | Atas R01, R02 | [00-reunioes/entregas.md](../00-reunioes/entregas.md) |
| Identificação de Stakeholders | ✅ | [stakeholders.md](../01-cenario/stakeholders.md) | — |

---

### 2.2 Construir uma Lista de Funcionalidades ✅

| Atividade | Status | Evidência | Link |
|-----------|:------:|-----------|------|
| Levantamento das 9 features (F01–F09) | ✅ | [feature-list-geral.md](../10-feature-list/feature-list-geral.md) | — |
| Aplicação de MoSCoW | ✅ | Tabela em [priorizacao.md](../10-feature-list/priorizacao.md) | — |
| Matriz Valor de Negócio × Esforço | ✅ | [matriz-priorizacao.png](../../assets/matriz-priorizacao.png) | — |
| Refinamento da lista com feedback da cliente | 🟡 | Acompanhamento contínuo via WhatsApp/Teams | — |

---

### 2.3 Planejar por Funcionalidade ✅

| Atividade | Status | Evidência | Link |
|-----------|:------:|-----------|------|
| Definição do MVP (F05, F07, F09) | ✅ | [priorizacao.md](../10-feature-list/priorizacao.md) § MVP | — |
| Definição de DoR (Definition of Ready) | ✅ | [dor.md](../09-dor-dod/dor.md) | — |
| Definição de DoD (Definition of Done) | ✅ | [dod.md](../09-dor-dod/dod.md) | — |
| Cronograma por iteração (15 dias) | ✅ | [cronograma](../06-cronograma/index.md) | — |
| Alocação de features por iteração | ✅ | Tabela de iteração (ata R02) | [Terminar Unidade 2 (2).docx](../00-reunioes/docx/Terminar%20Unidade%202%20(2).docx) |

---

### 2.4 Projetar por Funcionalidade 🟡

| Atividade | Status | Feature | Evidência | Link |
|-----------|:------:|:-------:|-----------|------|
| Mockup de baixa fidelidade — Onboarding | ✅ | F05 | Capturas no protótipo Figma | — |
| Mockup de baixa fidelidade — Grade Horária | ✅ | F07 | Capturas no protótipo Figma | — |
| Mockup de baixa fidelidade — Documentos | ✅ | F09 | Capturas no protótipo Figma | — |
| Design System — Tipografia adaptável | ✅ | Transversal | [RNF01, RNF18-RNF24](../08-requisitos/nao-funcionais.md) | — |
| Design System — Padrão de botões/ícones | ✅ | Transversal | [RNF20](../08-requisitos/nao-funcionais.md) | — |
| Protótipo navegável React Native | 🟡 | F07, F09 | Build Expo Go em execução | [Branch feat/entregaUnidade3](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/tree/feat/entregaUnidade3) |
| Inspeção de Design (Design Review) | 🟡 | F05, F07 | Atas R03 — checklist de acessibilidade | [checklist-acessibilidade.md](../08-requisitos/checklist-acessibilidade.md) |

---

### 2.5 Construir por Funcionalidade 🟡

| Atividade | Status | Feature | Evidência | Link |
|-----------|:------:|:-------:|-----------|------|
| Setup do projeto (Expo + RN + TS) | ✅ | Transversal | `UnB-App/package.json`, commits iniciais | [Repositório](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App) |
| Implementação — Tela Inicial (Home) | ✅ | F05 | `UnB-App/src/screens/Home*` | — |
| Implementação — Grade Horária e Ensalamento | 🟡 | F07 | `UnB-App/src/screens/Schedule*` | — |
| Implementação — Upload e Parser de PDF | 🟡 | F09 | `UnB-App/src/screens/Documents*` + parser | — |
| Implementação — Carteirinha Digital | 🟡 | F03 (pós-MVP) | `UnB-App/src/screens/StudentID*` | — |
| Implementação — QRCode BCE | 🟡 | F02 (pós-MVP) | `UnB-App/src/screens/QRCode*` | — |
| Web Scraping SIGAA | 🔴 | F08 (Should) | Pendente de acesso/credenciais | — |
| Code Review (inspeção de código) | 🟡 | F07, F09 | PRs com reviewers designados | [Pull Requests](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/pulls) |
| Build & Deploy Expo (EAS) | 🟡 | Transversal | `UnB-App/eas.json` | — |
| Testes unitários (Jest) | 🟡 | F07, F09 | `UnB-App/jest.config.js` + suítes em `__tests__/` | — |
| Demonstração com stakeholder | ✅ | F07, F09 | Vídeo R03 | [R03 — 15/06/2026](https://www.youtube.com/watch?v=sUqzIqj841U) |

---

## 3. Features Trabalhadas × Evidências

> Cruzamento explícito entre **features** (do MVP e pós-MVP) e **artefatos comprobatórios**.

| Feature | Nome | MoSCoW | Status | Evidências |
|:-:|-----------|:------:|:------:|------------|
| **F05** | Exibir fluxos de onboarding | Must (MVP) | 🟡 | • Mockup aprovado em R02<br>• Tela Home implementada em `src/screens/Home*`<br>• Captura: [tela-inicial.png](../../assets/evidencias/tela-inicial.png) |
| **F07** | Consultar grade horária e ensalamento | Must (MVP) | 🟡 | • Parser PDF integrado<br>• Tela Schedule implementada<br>• Vídeo: [Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link) |
| **F09** | Centralizar documentos oficiais | Must (MVP) | 🟡 | • Upload + SQLite local<br>• Filtros e busca implementados<br>• Vídeo: [Buscas e Filtros](https://drive.google.com/file/d/1EOVQwvk7PbyRCCIwI105-FQpBcUWR342/view?usp=drive_link)<br>• Captura: [tela-documentos.png](../../assets/evidencias/tela-documentos.png) |
| **F02** | Exibir QRCode da BCE | Could (pós-MVP) | 🟡 | • Branch em desenvolvimento<br>• Rastreabilidade RF02 ✓ |
| **F03** | Exibir e armazenar a carteirinha digital | Could (pós-MVP) | 🟡 | • Branch em desenvolvimento<br>• Rastreabilidade RF01/RF03 ✓ |
| F04 | Extrair e processar Histórico/Passe Livre | Should | ⬜ | Não iniciada — dependia de decisão de scraping |
| F08 | Coletar e atualizar dados acadêmicos (Matrícula) | Should | 🔴 | Bloqueada — sem credenciais SIGAA válidas para testes |
| F06 | Listar e reproduzir tutoriais | Won't | ❌ | Fora do escopo desta release (esforço 15h × VB 2) |
| F01 | Conversar com assistente (IA/Voz) | Won't | ❌ | Fora do escopo (esforço 60h × VB 2) |

---

## 4. Decisões Técnicas Registradas (ADR simplificado)

> Decisões arquiteturais/ técnicas tomadas durante o semestre, com referência à fonte.

| # | Decisão | Data | Origem | Status |
|:-:|---------|------|--------|:------:|
| ADR-01 | Adoção de **React Native + Expo + TypeScript** | R01 (13/04) | [entregas.md R01](../00-reunioes/entregas.md#r01--13042026-23h59) | ✅ |
| ADR-02 | Adoção do **SQLite local (Expo SQLite)** como cache offline | R01 (13/04) | Idem | ✅ |
| ADR-03 | Adoção do **FDD** como processo de ESW (vs. cascata) | R01 (13/04) | Idem | ✅ |
| ADR-04 | MVP centrado em **F05 + F07 + F09** (Matriz VB×ES) | R02 (18/05) | [entregas.md R02](../00-reunioes/entregas.md#r02--18052026) | ✅ |
| ADR-05 | Inclusão de **F02 e F03 como prioridade pós-MVP** | R03 (15/06) | [entregas.md R03](../00-reunioes/entregas.md#r03--15062026) | ✅ |
| ADR-06 | Foco em **acessibilidade WCAG 2.1 AA** para o público 60+ | Iteração 4 | [RNF18–RNF26](../08-requisitos/nao-funcionais.md) | ✅ |
| ADR-07 | Padronização de **branches por feature** (`feat/<unidade>`) | Iteração 3 | [R03 lições aprendidas](../00-reunioes/entregas.md#r03--15062026) | 🟡 |

---

## 5. Pendências e Plano de Mitigação

| Pendência | Impacto | Mitigação |
|-----------|---------|-----------|
| 🔴 F08 — Web scraping sem credenciais de teste | Média (Should have) | Solicitar credenciais de homologação à cliente ou mockar dados |
| 🟡 Inspeções de Design de F02 e F03 | Baixa | Agendar Design Review na próxima iteração |
| 🟡 Testes unitários de F09 | Média | Cobrir casos de parser PDF e busca antes da release final |
| 🟡 Validação com usuários 60+ | Alta | Planejar 2 sessões de teste de usabilidade na U4 |

---

## 6. Links Úteis

- 📂 [Repositório GitHub do projeto](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App)
- 📋 [Projects / Issues do repositório](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/issues)
- 🎥 [Gravações das reuniões](../00-reunioes/gravacoes.md)
- 📑 [Atas e transcrições (.docx)](../00-reunioes/docx/)
- 🖼️ [Pasta de evidências visuais](../../assets/evidencias/)
- 📊 [Feature List Geral](../10-feature-list/feature-list-geral.md)
- 📋 [Acompanhamento por Feature (status, responsáveis, período)](../10-feature-list/acompanhamento.md)
- ✅ [DoR e DoD](../09-dor-dod/index.md)