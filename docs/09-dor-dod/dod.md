# 9.2 Definition of Done (DoD)

> Acordo que atesta a qualidade interna e externa da funcionalidade construída. Um item que não atende a todos os parâmetros mensuráveis deste DoD não deve ser promovido para construção final (build) nem apresentado na validação de entrega para o cliente.

---

<div class="vpp-chip-row">
  <div class="vpp-chip"><span class="icon">✅</span> 100% dos Critérios BDD passando</div>
  <div class="vpp-chip"><span class="icon">✅</span> Stack Correta (Expo/SQLite)</div>
  <div class="vpp-chip"><span class="icon">✅</span> Inspeção Formal de Código (FDD)</div>
  <div class="vpp-chip"><span class="icon">✅</span> Acessibilidade e Offline validados</div>
  <div class="vpp-chip"><span class="icon">✅</span> Promoção para Build (EAS) sem erros</div>
</div>

---

## Checklist do DoD

| # | Critério | Descrição (Critério de Verificabilidade) |
|---|---|---|
| 1 | **Validação de Valor** | A funcionalidade construída atende ao propósito original definido no modelo FDD e resolve diretamente o seu respectivo Requisito Funcional (RF). |
| 2 | **Atendimento aos Critérios de Aceite** | A funcionalidade atende a 100% dos critérios de aceite estabelecidos no DoR, com todos os cenários BDD validados no ambiente de testes. |
| 3 | **Padrões de Codificação e Stack** | O código foi desenvolvido estritamente em **TypeScript, React Native e Expo**, utilizando o **Expo SQLite** para os dados locais.(**RNF07 e RNF08**). |
| 4 | **Fidelidade de Interface e Acessibilidade** | A UI respeita o protótipo aprovado e implementa nativamente a tipografia adaptável padrão ABNT(**RNF01**). Se for uma tarefa essencial, a navegação exige o máximo de 2 cliques(**RNF02**). |
| 5 | **Garantia de Funcionamento Offline** |100% dos cenários de consulta de dados críticos (grade, ensalamento e carteirinha) devem funcionar sem conexão com a internet utilizando cache local. A sincronização dos dados deve ocorrer automaticamente após o restabelecimento da conexão (**RNF03 e RNF04**). |
| 6 | **Inspeção de Código e Testes** | O código passou pela "Inspeção de Código" (revisão por pares do FDD), atingiu a cobertura mínima de 80% em testes unitários e garante compatibilidade com Android 7.0+ e iOS 15.1+ (**RNF05**). |
| 7 | **Promoção para Construção (Build via OTA)** | O código-fonte foi integrado com sucesso à branch principal e o build via EAS (Expo Application Services) foi gerado sem erros, pronto para receber atualizações Over-the-Air (**RNF06**). |