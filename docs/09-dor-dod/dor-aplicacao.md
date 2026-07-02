# 9.2 Aplicação do DoR por Feature

> Demonstração de que cada feature trabalhada ou planejada na Unidade 3 cumpriu os critérios do [Definition of Ready](dor.md) **antes** de entrar em construção. Nenhuma feature foi marcada como "em construção" sem ter seu DoR preenchido.

---

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">✅</span> Aprovado — Evidência completa</div>
  <div class="vpp-chip"><span class="icon">⚠️</span> Parcial — Evidência incompleta</div>
  <div class="vpp-chip"><span class="icon">❌</span> Pendente — Sem evidência</div>
</div>

---

## F09 — Centralizar Documentos Oficiais

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">📦</span> Iteração 1 · Concluída</div>
  <div class="vpp-chip"><span class="icon">⏱️</span> Esforço: 12 h</div>
  <div class="vpp-chip"><span class="icon">🟢</span> Q1 — Ganho Rápido</div>
  <div class="vpp-chip"><span class="icon">🔴</span> Must Have</div>
</div>

!!! example "Declaração FDD"
    **Centralizar** documentos oficiais, **reunindo** todos os documentos acadêmicos e estudantis em um único local acessível, **facilitando** a localização, gestão e apresentação de documentos pelo estudante, economizando tempo e esforço.

**Requisitos cobertos:** RF20, RF21 · **RNFs relacionados:** RNF01, RNF02, RNF03, RNF08

| # | Critério do DoR | Status | Evidência |
|---|-----------------|--------|-----------|
| 1 | **Dados e regras documentados** | ✅ Aprovado | [RF20 — Enviar Documentos Oficiais](../08-requisitos/funcionais.md): entradas (PDF do estudante), saídas (documento acessível offline), regras (armazenamento local via SQLite). [RF21 — Armazenar Documentos Oficiais](../08-requisitos/funcionais.md): acesso sem internet. |
| 2 | **Esforço estimado cabe na iteração** | ✅ Aprovado | 12 h estimadas para uma iteração de ~2 semanas. Ver [Tabela de Priorização](../10-feature-list/priorizacao.md) (VB=22, ES=12, Pontuação=1.83). |
| 3 | **Declaração de Feature (formato FDD)** | ✅ Aprovado | Descrita em formato `[ação] [resultado] [objeto]` na [Feature List Geral](../10-feature-list/feature-list-geral.md). |
| 4 | **Critérios de aceite e BDD** | ✅ Aprovado | CA 20.1 (limite de upload) e CA 21.1 (cenário BDD — acesso em cache offline) documentados nos [Critérios de Aceite](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/blob/feat/criteriosAceite-isaac/docs/08-requisitos/criterios-aceite.md#f09-centralizar-documentos-oficiais). |
| 5 | **Interface mapeada** | ✅ Aprovado | Protótipo inspecionado e implementado. Ver [evidência — Tela de Documentos](../assets/evidencias/tela-documentos.png). |

!!! success "Veredito: ✅ DoR aprovado"
    Feature estava pronta para entrar em construção.

!!! note "Decisões e atas relacionadas"
    - [R02 — 18/05/2026](../00-reunioes/entregas.md#r02--18052026): Definição do MVP com F09 como prioridade máxima (maior pontuação ROI).
    - [R03 — 15/06/2026](../00-reunioes/entregas.md#r03--15062026): Demonstração da feature implementada.
    - [Cronograma — Iteração 1](../06-cronograma/index.md): RF20 e RF21 marcados como concluídos.

---

## F07 — Consultar Grade Horária e Ensalamento

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">📦</span> Iteração 1 · Concluída</div>
  <div class="vpp-chip"><span class="icon">⏱️</span> Esforço: 16 h</div>
  <div class="vpp-chip"><span class="icon">🟢</span> Q1/Q2</div>
  <div class="vpp-chip"><span class="icon">🔴</span> Must Have</div>
</div>

!!! example "Declaração FDD"
    **Consultar** grade horária e ensalamento, **informando** as disciplinas, horários e locais de aula mesmo sem internet, **reduzindo** a sobrecarga cognitiva do usuário na localização de espaços físicos no campus e sem depender de conexões de internet instáveis.

**Requisitos cobertos:** RF16 · **RNFs relacionados:** RNF01, RNF02, RNF03, RNF09

| # | Critério do DoR | Status | Evidência |
|---|-----------------|--------|-----------|
| 1 | **Dados e regras documentados** | ✅ Aprovado | [RF16 — Consultar Grade Horária e Ensalamento](../08-requisitos/funcionais.md): entradas (dados do SIGAA/PDF), saídas (cards com disciplina, horário, local, docente), regras (funcionamento 100% offline via SQLite — RNF03). |
| 2 | **Esforço estimado cabe na iteração** | ✅ Aprovado | 16 h estimadas para uma iteração de ~2 semanas. Ver [Tabela de Priorização](../10-feature-list/priorizacao.md) (VB=9, ES=16, Pontuação=0.56). |
| 3 | **Declaração de Feature (formato FDD)** | ✅ Aprovado | Descrita em formato `[ação] [resultado] [objeto]` na [Feature List Geral](../10-feature-list/feature-list-geral.md). |
| 4 | **Critérios de aceite e BDD** | ✅ Aprovado | CA 16.1 (cenário BDD — estado vazio com botão de upload) e CA 16.2 (cenário BDD — renderização de cards) documentados nos [Critérios de Aceite](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/blob/feat/criteriosAceite-isaac/docs/08-requisitos/criterios-aceite.md#f07-consultar-grade-hor%C3%A1ria-e-ensalamento). |
| 5 | **Interface mapeada** | ✅ Aprovado | Protótipo inspecionado e implementado. Ver [evidência — Tela Inicial com Grade](../assets/evidencias/tela-inicial.png). |

!!! success "Veredito: ✅ DoR aprovado"
    Feature estava pronta para entrar em construção.

!!! note "Decisões e atas relacionadas"
    - [R02 — 18/05/2026](../00-reunioes/entregas.md#r02--18052026): F07 definida como MVP. Repriorizada e antecipada para Iteração 1 (antes de F05).
    - [Lições Aprendidas — Unidade 3](../11-licoes/unidade3.md): Registra a antecipação da F07 sobre a F05 como ajuste de prioridade.
    - [Cronograma — Iteração 1](../06-cronograma/index.md): RF16 marcado como concluído.

---

## F05 — Exibir Fluxos de Onboarding

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">📋</span> Iteração 3 · Planejada</div>
  <div class="vpp-chip"><span class="icon">⏱️</span> Esforço: 10 h</div>
  <div class="vpp-chip"><span class="icon">🟢</span> Q1 — Ganho Rápido</div>
  <div class="vpp-chip"><span class="icon">🔴</span> Must Have</div>
</div>

!!! example "Declaração FDD"
    **Exibir** fluxos de onboarding, **apresentando** as principais funcionalidades e a proposta de valor do aplicativo aos novos usuários, **garantindo** que o usuário compreenda rapidamente como utilizar a plataforma e sinta-se engajado desde o primeiro uso.

**Requisitos cobertos:** RF22, RF23 · **RNFs relacionados:** RNF01, RNF02

| # | Critério do DoR | Status | Evidência |
|---|-----------------|--------|-----------|
| 1 | **Dados e regras documentados** | ✅ Aprovado | [RF22 — Onboarding SIGAA](../08-requisitos/funcionais.md) e [RF23 — Onboarding Aprender 3](../08-requisitos/funcionais.md): fluxo guiado e tutorial de acolhimento para orientar o estudante. |
| 2 | **Esforço estimado cabe na iteração** | ✅ Aprovado | 10 h estimadas para uma iteração de ~1 semana (Iteração 3: 24/06 → 30/06). Ver [Tabela de Priorização](../10-feature-list/priorizacao.md) (VB=16, ES=10, Pontuação=1.60). |
| 3 | **Declaração de Feature (formato FDD)** | ✅ Aprovado | Descrita em formato `[ação] [resultado] [objeto]` na [Feature List Geral](../10-feature-list/feature-list-geral.md). |
| 4 | **Critérios de aceite e BDD** | ✅ Aprovado | CA 22.1 (controles de navegação — botão "Pular Tutorial") e CA 22.2 (cenário BDD — apresentação única) documentados nos [Critérios de Aceite](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/blob/feat/criteriosAceite-isaac/docs/08-requisitos/criterios-aceite.md#f05-exibir-fluxos-de-onboarding). |
| 5 | **Interface mapeada** | ✅ Aprovado | A interface para acesso aos tutoriais está mapeada na Home (atalhos para SIGAA e Aprender 3). Ver [evidência — Tela Inicial](../assets/evidencias/tela-inicial.png). |

!!! success "Veredito: ✅ DoR aprovado"
    Feature estava pronta para entrar em construção.

---

## F08 — Coletar e Atualizar Dados Acadêmicos

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">📋</span> Iteração 2 · Planejada</div>
  <div class="vpp-chip"><span class="icon">⏱️</span> Esforço: 50 h</div>
  <div class="vpp-chip"><span class="icon">🔵</span> Q2 — Grande Projeto</div>
  <div class="vpp-chip"><span class="icon">🟡</span> Should Have</div>
</div>

!!! example "Declaração FDD"
    **Coletar** e atualizar dados acadêmicos, **mantendo** as informações do usuário sincronizadas e atualizadas no sistema, **garantindo** a precisão dos dados para acesso a serviços e funcionalidades específicas e evitando retrabalho.

**Requisitos cobertos:** RF17, RF18, RF19 · **RNFs relacionados:** RNF04, RNF06, RNF08

| # | Critério do DoR | Status | Evidência |
|---|-----------------|--------|-----------|
| 1 | **Dados e regras documentados** | ✅ Aprovado | [RF17 — Coleta diária via SIGAA](../08-requisitos/funcionais.md), [RF18 — Coleta semanal do calendário](../08-requisitos/funcionais.md), [RF19 — Atualizar disciplinas matriculadas](../08-requisitos/funcionais.md). Regras de sincronização (RNF04) e atualização OTA (RNF06) documentadas em [RNFs](../08-requisitos/nao-funcionais.md). |
| 2 | **Esforço estimado cabe na iteração** | ✅ Aprovado | 50 h estimadas para a Iteração 2. Ver [Tabela de Priorização](../10-feature-list/priorizacao.md). |
| 3 | **Declaração de Feature (formato FDD)** | ✅ Aprovado | Descrita em formato `[ação] [resultado] [objeto]` na [Feature List Geral](../10-feature-list/feature-list-geral.md). |
| 4 | **Critérios de aceite e BDD** | ✅ Aprovado | CA 17.1 (sincronização apenas via Wi-Fi), CA 18.1 (gatilho semanal) e CA 19.1 (cenário BDD — tolerância a falhas) documentados nos [Critérios de Aceite](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/blob/feat/criteriosAceite-isaac/docs/08-requisitos/criterios-aceite.md#f08-coletar-e-atualizar-dados-acad%C3%AAmicos-sincroniza%C3%A7%C3%A3o). |
| 5 | **Interface mapeada** | ✅ Aprovado | N/A — Feature de backend/sincronização sem interface dedicada. Critério não aplicável. |

!!! success "Veredito: ✅ DoR aprovado"
    Feature estava pronta para entrar em construção.

---

## F04 — Extrair, Processar e Armazenar Histórico Escolar / Passe Livre

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">🔧</span> Iteração 2 · Parcialmente implementada</div>
  <div class="vpp-chip"><span class="icon">⏱️</span> Esforço: 35 h</div>
  <div class="vpp-chip"><span class="icon">🔵</span> Q2 — Grande Projeto</div>
  <div class="vpp-chip"><span class="icon">🟡</span> Should Have</div>
</div>

!!! example "Declaração FDD"
    **Extrair**, processar e armazenar Histórico Escolar e/ou Passe Livre Estudantil para **obter** dados úteis à plataforma de forma automatizada, **reduzindo** o esforço manual do usuário ao evitar o preenchimento de formulários.

**Requisitos cobertos:** RF04, RF05, RF06, RF07 · **RNFs relacionados:** RNF03, RNF08

| # | Critério do DoR | Status | Evidência |
|---|-----------------|--------|-----------|
| 1 | **Dados e regras documentados** | ✅ Aprovado | [RF04 — Armazenar dados extraídos](../08-requisitos/funcionais.md), [RF05 — Processar documentos](../08-requisitos/funcionais.md), [RF06 — Extrair dados do Histórico Escolar](../08-requisitos/funcionais.md), [RF07 — Extrair dados do Passe Livre](../08-requisitos/funcionais.md). Regras de armazenamento offline (RNF03, RNF08) em [RNFs](../08-requisitos/nao-funcionais.md). |
| 2 | **Esforço estimado cabe na iteração** | ✅ Aprovado | 35 h estimadas. O RF06 foi antecipado para a Iteração 1 como mitigação. Ver [Cronograma](../06-cronograma/index.md). |
| 3 | **Declaração de Feature (formato FDD)** | ✅ Aprovado | Descrita em formato `[ação] [resultado] [objeto]` na [Feature List Geral](../10-feature-list/feature-list-geral.md). |
| 4 | **Critérios de aceite e BDD** | ✅ Aprovado | CA 4.1 (armazenamento estruturado em SQLite), CA 5.1 (filtro .pdf), CA 6.1 (cenário BDD — extração sem duplicidades) e CA 7.1 (validação do Passe Livre) documentados nos [Critérios de Aceite](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/blob/feat/criteriosAceite-isaac/docs/08-requisitos/criterios-aceite.md#f04-extrair-processar-e-armazenar-documentos). |
| 5 | **Interface mapeada** | ✅ Aprovado | A interface é compartilhada com a tela de Documentos (F09). O fluxo de upload está implementado na [Tela de Documentos](../assets/evidencias/tela-documentos.png). |

!!! success "Veredito: ✅ DoR aprovado"
    Feature estava pronta para entrar em construção. Parte do escopo (RF06) foi antecipada para a Iteração 1.

!!! note "Evidências de implementação antecipada"
    - Commit `539c5af`: `feat: adiciona parser de historico escolar da UnB`
    - Commit `573dd22`: `fix: preservacao do CPF do aluno na extracao do passe livre`
    - Commit `fcf75af`: `test: adiciona testes para o processamento do historico escolar`
    - [Cronograma — Iteração 1](../06-cronograma/index.md): RF06 marcado como concluído antecipadamente.

---

## Resumo Consolidado

| Feature | Informação | Esforço | FDD | Aceite + BDD | Interface | Veredito |
|---------|:----------:|:-------:|:---:|:------------:|:---------:|-----------|
| **F09** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Aprovado |
| **F07** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Aprovado |
| **F05** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Aprovado |
| **F08** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Aprovado |
| **F04** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Aprovado |
