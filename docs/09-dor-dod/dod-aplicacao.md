# 9.4 Aplicação do DoD por Feature

> Demonstração de que cada feature concluída na Iteração 1 da Unidade 3 atendeu a todos os critérios estabelecidos no [Definition of Done (DoD)](dod.md) antes de ser apresentada na validação de entrega.

---

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">✅</span> Aprovado — Evidência completa</div>
  <div class="vpp-chip"><span class="icon">⚠️</span> Parcial — Evidência incompleta ou justificada tecnicamente</div>
  <div class="vpp-chip"><span class="icon">❌</span> Pendente — Sem evidência</div>
</div>

---

## F07 — Consultar Grade Horária e Ensalamento

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">📦</span> Iteração 1 · Entregue e Validada</div>
  <div class="vpp-chip"><span class="icon">💻</span> Código no PR #128</div>
</div>

!!! example "Incremento de Produto Gerado"
    A funcionalidade agora permite que os estudantes visualizem os horários e locais de aula extraídos do SIGAA, em formato de "cards", funcionando **100% offline**, o que reduz a dependência de conectividade no campus.

| # | Critério do DoD | Status | Evidência |
|---|-----------------|--------|-----------|
| 1 | **Incremento do produto** | ✅ Aprovado | Valor agregado visível na interface de "Grade". Ver vídeo de [Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view) (complementar). |
| 2 | **Critérios de aceite (DoR)** | ✅ Aprovado | Checklist cumprido em [Aplicação do DoR (F07)](dor-aplicacao.md#f07-consultar-grade-horaria-e-ensalamento). |
| 3 | **Documentação** | ✅ Aprovado | Documentação técnica gerada. Funcionalidade descrita no guia de [Requisitos Funcionais (RF16)](../08-requisitos/funcionais.md). |
| 4 | **Padrões de codificação** | ✅ Aprovado | Código validado pelo ESLint e Prettier integrados no projeto React Native/Expo. |
| 5 | **Performance (≤ 300ms)** | ✅ Aprovado | Renderização imediata utilizando queries otimizadas do SQLite. Ver commits: `fix: conserta lentidão do modal` e `fix: conserta animações para números menos de transição`. |
| 6 | **Desenvolvimento completo** | ✅ Aprovado | Especificações técnicas de front-end (UI/UX) e acesso ao banco (SQL) totalmente implementadas. |
| 7 | **Testes aprovados** | ✅ Aprovado | Testes unitários para consultas ao banco: ver [gradeQueries.test.ts](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/blob/dev/UnB-App/src/app/(tabs)/__tests__/gradeQueries.test.ts) (5 CTs) e [disciplinas.test.tsx](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/blob/dev/UnB-App/src/app/(tabs)/__tests__/disciplinas.test.tsx) (2 CTs). |
| 8 | **Revisão da equipe (PR)** | ✅ Aprovado | Merge realizado via [Pull Request #128](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/pull/128) (feat/entregaUnidade3), validado por outros desenvolvedores. |
| 9 | **Feedback incorporado** | ✅ Aprovado | Ajustes solicitados em review aplicados nos commits: `fix: melhora renderização em android mais antigo` e `fix: aplica truque de otimização no botão de tamanho de texto`. |

!!! success "Veredito: ✅ DoD Aprovado"
    A funcionalidade F07 encontra-se **Done** e foi aprovada em demonstração.

---

## F09 — Centralizar Documentos Oficiais

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">📦</span> Iteração 1 · Entregue e Validada</div>
  <div class="vpp-chip"><span class="icon">💻</span> Código no PR #128</div>
</div>

!!! example "Incremento de Produto Gerado"
    Permite aos estudantes anexar PDFs oficiais (histórico, passe livre, carteirinha) localmente no dispositivo para acesso instantâneo sem necessidade de recarregar páginas web externas.

| # | Critério do DoD | Status | Evidência |
|---|-----------------|--------|-----------|
| 1 | **Incremento do produto** | ✅ Aprovado | Aba dedicada a documentos operante. Ver vídeo de [Buscas e Filtros / Documentos](https://drive.google.com/file/d/1EOVQwvk7PbyRCCIwI105-FQpBcUWR342/view) (complementar). |
| 2 | **Critérios de aceite (DoR)** | ✅ Aprovado | Checklist cumprido em [Aplicação do DoR (F09)](dor-aplicacao.md#f09-centralizar-documentos-oficiais). |
| 3 | **Documentação** | ✅ Aprovado | Integração nativa justificada; documentada em [Requisitos Funcionais (RF20, RF21)](../08-requisitos/funcionais.md). |
| 4 | **Padrões de codificação** | ✅ Aprovado | Verificação de código por ESLint garantida na entrega. |
| 5 | **Performance (≤ 300ms)** | ✅ Aprovado | Processamento assíncrono via `expo-file-system`. A renderização e resposta do cache (SQLite) ocorrem abaixo de 50ms (RNF14 cumprido tecnicamente). |
| 6 | **Desenvolvimento completo** | ✅ Aprovado | Armazenamento de binários nativo e visualização baseada em modais desenvolvidas integralmente. |
| 7 | **Testes aprovados** | ⚠️ Parcial | Testes pontuais não aplicados especificamente para a tela de Documentos. Teste integrado existe apenas indiretamente via motor universal de renderização de PDF (validação transversal), mas não de forma isolada e testada unitariamente. |
| 8 | **Revisão da equipe (PR)** | ✅ Aprovado | Entregue em conjunto no [Pull Request #128](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/pull/128) com os devidos *code reviews*. |
| 9 | **Feedback incorporado** | ✅ Aprovado | Ajustes baseados no feedback de revisão foram incluídos, como visto no commit de refatoração: `refactor: centraliza logica de documentos em motor universal`. |

!!! warning "Veredito: ⚠️ DoD Parcialmente Aprovado"
    A funcionalidade entrega valor e está operacional, contudo a ausência de **testes unitários isolados** (Item 7) requer refatoração em sprints futuras para alcançar 100% dos critérios do DoD técnico.

---

## Resumo da Aplicação do DoD na Iteração 1

| Feature | Conclusão Técnica | Testes/Qualidade | PR/Revisão | Feedback Adotado | Veredito Final |
|---------|:-----------------:|:----------------:|:----------:|:----------------:|----------------|
| **F07** | ✅ | ✅ | ✅ | ✅ | ✅ Done |
| **F09** | ✅ | ⚠️ | ✅ | ✅ | ⚠️ Parcial |
