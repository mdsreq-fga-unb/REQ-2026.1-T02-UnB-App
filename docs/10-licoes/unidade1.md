# 10.1 Lições Aprendidas — Unidade 1

!!! info "Retrospectiva da unidade"
    A Unidade 1 foi marcada por uma correção de direção importante: saímos de uma visão centrada em ajustes visuais e evoluímos para uma proposta orientada por funcionalidades, módulos e valor de negócio.

<div class="vpp-chip-row">
    <div class="vpp-chip"><span class="icon">⚠️</span> <strong>1ª entrega parcial</strong>&nbsp;reprovada</div>
    <div class="vpp-chip"><span class="icon">⚠️</span> <strong>2ª entrega parcial</strong>&nbsp;reprovada</div>
    <div class="vpp-chip"><span class="icon">✅</span> <strong>3ª entrega parcial</strong>&nbsp;aprovada</div>
    <div class="vpp-chip"><span class="icon">🧭</span> <strong>Foco realinhado</strong>&nbsp;para Engenharia de Requisitos</div>
    <div class="vpp-chip"><span class="icon">🛠️</span> <strong>Documento de visão</strong>&nbsp;reestruturado (v1.3)</div>
    <div class="vpp-chip"><span class="icon">🎯</span> <strong>Objetivo geral</strong>&nbsp;conectado ao problema raiz</div>
</div>

---

## Dificuldades Enfrentadas Pela Equipe

<div class="oe-grid">
    <div class="oe-card">
        <span class="oe-id">D1 · Escopo do Projeto</span>
        <p><strong>Desalinhamento de escopo:</strong> a primeira entrega parcial foi reprovada por estar focada quase exclusivamente em melhorias de interface e usabilidade para o público 60+.</p>
        <p>O direcionamento da disciplina exigia a proposição de novas funcionalidades e módulos de software, e não apenas ajustes visuais.</p>
    </div>
    <div class="oe-card">
        <span class="oe-id">D2 · Nível de Abstração</span>
        <p><strong>Baixo nível de abstração nas características:</strong> inicialmente, foram listados itens granulares e de design, como ajuste de fonte e feedback visual.</p>
        <p>Foi necessário elevar o nível para características capazes de derivar múltiplos RFs e RNFs de forma estruturada.</p>
    </div>
    <div class="oe-card">
        <span class="oe-id">D3 · Foco no Problema Raiz</span>
        <p><strong>Falta de conexão direta entre objetivo e problema:</strong> a visão inicial mascarava a dor principal ao priorizar apenas acessibilidade.</p>
        <p>O problema raiz, porém, era a perda de autonomia e a dificuldade de acesso nas rotinas acadêmicas diárias.</p>
    </div>
</div>

---

## Lições Aprendidas e Ações de Melhoria

=== "1) Pivotagem de UI/UX para Engenharia de Requisitos"

    **Lição aprendida:** Compreendemos a diferença entre redesenhar interface e projetar um novo sistema.

    **Ação tomada:** Deixamos de focar em "consertar CSS/layout do SIGAA" e passamos a idealizar o **UnB App** com funcionalidades arquiteturais reais, como visualização de carteirinha e grade horária offline, além de um motor de notificações pró-ativas.

    **Resultado:** O projeto passou a refletir melhor o escopo esperado da disciplina e a gerar base concreta para derivação de requisitos.

=== "2) Reestruturação da documentação de visão"

    **Lição aprendida:** Características de produto precisam representar épicos/módulos orientados a valor, não soluções de interface de baixo nível.

    **Ação tomada:** Revisamos a tabela de **Características do Produto** na versão 1.3, substituindo itens granulares por macrocaracterísticas, como "Acompanhamento Facilitado da Rotina Acadêmica" e "Central de Acolhimento e Tutoriais".

    **Resultado:** A documentação ficou mais consistente para derivação correta de RFs e RNFs nas próximas unidades.

=== "3) Alinhamento foco-problema"

    **Lição aprendida:** Objetivo geral e dores mapeadas precisam estar diretamente conectados.

    **Ação tomada:** Reescrevemos o objetivo geral para priorizar a devolução da **independência e autonomia acadêmica**, tratando o produto como mediador sociotécnico e não apenas como tradução mobile do SIGAA.

    **Resultado:** Houve maior coerência entre problema, solução e valor entregue ao usuário.

---

## Consolidação das Melhorias

| Dificuldade identificada | Ação de melhoria aplicada | Evidência de superação |
|---|---|---|
| Escopo centrado em UI/UX | Pivotagem para funcionalidades e módulos de negócio | Solução reposicionada como UnB App com recursos offline e notificações pró-ativas |
| Características muito granulares | Reestruturação das características em nível de épico/módulo | Melhor base para derivação de RFs e RNFs |
| Objetivo pouco conectado à dor principal | Reescrita do objetivo geral com foco em autonomia | Alinhamento com o problema raiz de perda de independência acadêmica |

---

## Referências Internas Atualizadas

- [2.1 Objetivo Geral](../02-solucao/objetivo-geral.md)
- [2.3 Características de Produto](../02-solucao/caracteristicas.md)

## Ações para o Próximo Ciclo

- [x] Consolidar o foco em autonomia acadêmica como norte de decisão.
- [x] Manter características no nível correto de abstração para ER.
- [x] Vincular cada nova funcionalidade ao problema raiz validado.
- [ ] Expandir o detalhamento dos RFs e RNFs com base na nova estrutura de características.
- [ ] Refinar critérios de validação das funcionalidades pró-ativas nas próximas unidades.
