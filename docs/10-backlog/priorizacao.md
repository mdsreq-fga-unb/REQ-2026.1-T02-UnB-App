# 10.2 Priorização do Backlog e MVP

## Matriz de Valor de Negócio x Esforço

![Matriz de Valor de Negócio e Esforço](../assets/matriz-priorizacao.png)

## Critérios de priorização

> Pontuação baseada em **Valor de Negócio (VB)**, **Complexidade Técnica (CX)** e **Esforço de Implementação (ES)** — escala de 1 a 5.

---

### Fórmulas

$$PT = \frac{CX + ES}{2} \quad \text{(Pontuação Técnica)}$$

$$IP = \frac{VB}{PT} \quad \text{(Índice de Prioridade)}$$

---

### Faixas de decisão

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">🟢</span> <strong>IP ≥ 1,50</strong>&nbsp;→ Alta prioridade</div>
  <div class="vpp-chip"><span class="icon">🟡</span> <strong>IP 1,00 – 1,49</strong>&nbsp;→ Média prioridade</div>
  <div class="vpp-chip"><span class="icon">🔴</span> <strong>IP &lt; 1,00</strong>&nbsp;→ Baixa prioridade</div>
</div>

---

### Tabela de priorização

| Feature | Descrição | VB | CX | ES | PT | IP | Quadrante | Prioridade |
|----|-----------|:--:|:--:|:--:|:--:|:--:|-----------|:---:|
| F01 | [Descrição] | — | — | — | — | — | [Q1/Q2/Q3/Q4] | 1 |
| F02 | [Descrição] | — | — | — | — | — | [Q1/Q2/Q3/Q4] | 1 |
| F03 | [Descrição] | — | — | — | — | — | [Q1/Q2/Q3/Q4] | 2 |
| F04 | [Descrição] | — | — | — | — | — | [Q1/Q2/Q3/Q4] | 2 |
| F05 | [Descrição] | — | — | — | — | — | [Q1/Q2/Q3/Q4] | 3 |
| F06 | [Descrição] | — | — | — | — | — | [Q1/Q2/Q3/Q4] | 3 |
| F07 | [Descrição] | — | — | — | — | — | [Q1/Q2/Q3/Q4] | 4 |

---

## MVP — Produto Mínimo Viável

> Conjunto mínimo de funcionalidades para lançamento e validação das principais hipóteses de valor de negócio.

!!! success "Compõem o MVP (Prioridade 1 e 2)"
    - **F01** — [Descrição]
    - **F02** — [Descrição]
    - **F03** — [Descrição]
    - **F04** — [Descrição]

!!! warning "Fora do MVP (Prioridade 3 e 4)"
    - **F05** — [Descrição]
    - **F06** — [Descrição]
    - **F07** — [Descrição]
