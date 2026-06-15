# 9.1 Definition of Ready (DoR)

> Acordo estabelecido pela equipe que indica quando uma funcionalidade (Feature) está completamente especificada, verificável e preparada para entrar no processo de "Projetar e Construir por Funcionalidade" do FDD.

---

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">✅</span> Critérios explícitos e sem adjetivos</div>
  <div class="vpp-chip"><span class="icon">✅</span> Esforço máximo de 2 semanas (FDD)</div>
  <div class="vpp-chip"><span class="icon">✅</span> Formato estrito de Feature FDD</div>
  <div class="vpp-chip"><span class="icon">✅</span> Modelagem/UI inspecionadas</div>
</div>

---

## Checklist do DoR

| # | Critério | Descrição (Critério de Verificabilidade) |
|---|---|---|
| 1 | **Informação Base e Critérios de Aceite** | A funcionalidade possui, no mínimo, dois critérios de aceitação validados pelo cliente. O texto da declaração foi verificado e não contém adjetivos vagos. |
| 2 | **Granularidade FDD (Tempo)** | O esforço da funcionalidade foi estimado pela equipe e pode ser concluído em duas semanas ou menos de desenvolvimento. |
| 3 | **Formato Estrito de Feature** | O requisito está declarado rigorosamente na sintaxe orientada ao cliente exigida pelo FDD: `<ação> <resultado> <objeto>`. |
| 4 | **Testabilidade (BDD)** | Os critérios de aceitação foram traduzidos para o formato testável BDD (Dado / Quando / Então), permitindo a futura validação do comportamento. |
| 5 | **Design Inspecionado** | Se houver interface visual associada, os wireframes/protótipos correspondentes passaram pela etapa de "Design Inspecionado" do FDD e foram aprovados em revisão técnica. |

!!! example "Formato de Feature FDD"
    **[ação]** **[resultado]** **[objeto]**.