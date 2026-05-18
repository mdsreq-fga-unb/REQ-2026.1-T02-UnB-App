# 10.2 Priorização do Backlog e MVP

## Matriz de Valor de Negócio x Esforço

![Matriz de Valor de Negócio e Esforço](../assets/matriz-priorizacao.png)

## Critérios de priorização

> A priorização é baseada no **Valor de Negócio (VB)** e no **Esforço (ES)**.

---

### Valor de Negócio (VB)

O Valor de Negócio é definido com base na quantidade de vezes que a funcionalidade foi solicitada:
- **Formulário do público:** O peso equivale ao número de pedidos (Ex.: pediu 1 vez = peso 1, pediu 3 vezes = peso 3).
- **Cliente:** Os pedidos feitos diretamente pela cliente possuem **peso 3**, visto que atender às suas necessidades é a principal prioridade da equipe.

### Esforço (ES)

O Esforço indica o tempo estimado em **horas** para a implementação do requisito.
- Valores menores indicam tarefas mais rápidas, enquanto valores maiores indicam maior complexidade.
- Exemplo: Implementar um sistema de notificações pode levar **2h**, mas fazer o *web scraping* de um site pode demandar **30h**.

---

### Fórmulas

$$
\text{Pontuação} = \frac{VB}{ES}
$$

> O relacionamento para priorização se dá pela divisão do Valor de Negócio (VB) pelas horas de Esforço (ES), estabelecendo uma relação de Retorno sobre Investimento (ROI). Onde pontuações maiores indicam itens de maior prioridade.

---

## Metodologias de Priorização

A classificação do *Backlog* utiliza a união entre **MoSCoW** (para medir a indispensabilidade) e a **Matriz de Valor x Esforço** (para determinar a viabilidade e sequência de ataque). 

### 1. MoSCoW
* **Must Have:** Mínimo Viável; indispensável para o software funcionar (MVP) e entregar seu valor principal.
* **Should Have:** Importante e de alto valor, mas existem soluções de contorno se não for implementado agora.
* **Could Have:** Desejável sob condições favoráveis, mas pode ser deixado de fora se o tempo for curto.
* **Won't Have:** Fora do escopo para este momento ou release atual.

### 2. Quadrantes da Matriz
Os requisitos pontuados são alocados visualmente na Matriz de Priorização identificando as seguintes decisões baseadas no relacionamento VB x ES:

<div class="vpp-chip-row">
  <div class="vpp-chip">🟢 <strong>Q1 | Ganhos Rápidos</strong>: Alto Valor, Baixo Esforço → Foco central.</div>
  <div class="vpp-chip">🔵 <strong>Q2 | Grandes Projetos</strong>: Alto Valor, Alto Esforço → Planeje com cautela.</div>
  <div class="vpp-chip">🟡 <strong>Q3 | Tarefas Menores</strong>: Baixo Valor, Baixo Esforço → Prioridade média-baixa.</div>
  <div class="vpp-chip">🔴 <strong>Q4 | Demandas Ingratas</strong>: Baixo Valor, Alto Esforço → Evite / Descarte.</div>
</div>

---

## Tabela Consolidada de Priorização

Aplicando a equação da Pontuação ($VB / ES$) baseada nos dados empíricos atualizados (votos do formulário + peso da cliente) e nas novas estimativas de esforço:

| Feature | Nome da Feature | MoSCoW | VB (Peso) | ES (Horas) | Pontuação | Quadrante |
|----|-----------|:------:|:--:|:--:|:--:|:---:|
| F09 | Centralizar documentos oficiais | Must | 22 | 12 | 1.83 | Q1 |
| F05 | Exibir fluxos de onboarding | Must | 16 | 10 | 1.60 | Q1 |
| F07 | Consultar grade horária e ensalamento | Must | 9 | 16 | 0.56 | Q1 / Q2 |
| F04 | Extrair e processar Histórico Escolar | Should | 16 | 35 | 0.45 | Q2 |
| F02 | Exibir QRCode da BCE | Could | 3 | 8 | 0.37 | Q3 |
| F08 | Coletar e atualizar dados acadêmicos (Matrícula) | Should | 16 | 50 | 0.32 | Q2 |
| F03 | Exibir e armazenar a carteirinha digital | Could | 3 | 10 | 0.30 | Q3 |
| F06 | Listar e reproduzir tutoriais | Won't | 2 | 15 | 0.13 | Q4 |
| F01 | Conversar com assistente (IA/Voz) | Won't | 2 | 60 | 0.03 | Q4 |

---

## MVP — Produto Mínimo Viável

> Conjunto mínimo de funcionalidades estritamente necessárias (*Must Have*, primariamente em Q1/Q2) para lançamento e validação contínua de hipóteses com o público.

A integração dos dados empíricos da pesquisa muda o foco do aplicativo, mostrando que **a maior dor do usuário é acessar materiais e não se perder na interface**.

!!! success "Compõem o MVP"
    - **F09** — Centralizar documentos oficiais
    - **F05** — Exibir fluxos de onboarding
    - **F07** — Consultar grade horária e ensalamento
    - **F04** — Extrair e processar Histórico Escolar e/ou Passe Livre
    - **F08** — Coletar e atualizar dados acadêmicos (Matrícula)

!!! warning "Fora do MVP"
    - **F02** — Exibir QRCode da BCE
    - **F03** — Exibir e armazenar a carteirinha digital
    - **F06** — Listar e reproduzir tutoriais
    - **F01** — Conversar com assistente
