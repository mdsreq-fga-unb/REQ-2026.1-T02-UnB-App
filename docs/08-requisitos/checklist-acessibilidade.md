# 8.4 Checklist de Acessibilidade e Usabilidade (Público 60+)

> Lista de verificação operacional a ser aplicada em cada **Definition of Done (DoD)** de feature do MVP, garantindo conformidade com os RNFs 18 a 26 e com as normas **WCAG 2.1 nível AA**, **Android Accessibility Guidelines** e **Apple HIG Accessibility**.
>
> Inspirado nas práticas de revisão de acessibilidade da [W3C — Easy Checks](https://www.w3.org/WAI/test-evaluate/easy-checks/) e nos critérios de sucesso das WCAG 2.1.

---

## Como usar

Para cada item, marcar:

- ✅ **Conforme** — atendeu plenamente.
- ⚠️ **Parcial** — atendeu com ressalvas (anotar justificativa).
- ❌ **Não conforme** — não atendeu (bloqueia a DoD até correção).

> **Regra de aprovação:** 100% dos itens **críticos** devem estar ✅. Itens **recomendados** podem ter até 10% de ⚠️ justificados.

---

## 1. Tipografia e Contraste

| # | Item | RNF | Criticidade |
|---|------|-----|:-:|
| 1.1 | O tamanho da fonte do corpo do texto é **≥ 18sp** em todas as telas. | RNF18 | 🔴 Crítico |
| 1.2 | Títulos principais têm **≥ 24sp**. | RNF18 | 🔴 Crítico |
| 1.3 | Existe seletor de tamanho de fonte (Pequeno/Médio/Grande/Extra) nas Configurações de Acessibilidade. | RNF24 | 🔴 Crítico |
| 1.4 | A escolha de tamanho de fonte é persistida entre sessões. | RNF24 | 🔴 Crítico |
| 1.5 | A razão de contraste texto/fundo é **≥ 4.5:1** (texto comum) e **≥ 3:1** (texto grande). | RNF19 | 🔴 Crítico |
| 1.6 | O contraste de elementos não textuais (ícones, bordas de foco) é **≥ 3:1**. | RNF19 | 🟡 Recomendado |
| 1.7 | Testes automatizados com `axe-react-native` ou `accessibility-checker` não reportam violações. | RNF19 | 🟡 Recomendado |

---

## 2. Botões, Ícones e Alvos de Toque

| # | Item | RNF | Criticidade |
|---|------|-----|:-:|
| 2.1 | Todos os elementos interativos têm alvo de toque **≥ 48x48dp** (Android) ou **≥ 44x44pt** (iOS). | RNF20 | 🔴 Crítico |
| 2.2 | Há espaçamento mínimo de **8dp** entre alvos de toque adjacentes. | RNF20 | 🔴 Crítico |
| 2.3 | Todo ícone funcional é acompanhado de **rótulo textual visível** (não apenas tooltip). | RNF20 | 🔴 Crítico |
| 2.4 | O estilo de botão (primário, secundário, terciário) é consistente em toda a aplicação (design tokens). | RNF20 | 🟡 Recomendado |
| 2.5 | O botão primário (CTA) de cada tela é visualmente distinto dos demais (cor, tamanho ou elevação). | RNF20, RNF21 | 🔴 Crítico |

---

## 3. Fluxo de Tarefas e Navegação

| # | Item | RNF | Criticidade |
|---|------|-----|:-:|
| 3.1 | Cada tarefa essencial é concluída em **≤ 3 passos/telas visíveis** a partir do início. | RNF02, RNF21 | 🔴 Crítico |
| 3.2 | Cada tela exibe **uma única ação primária de destaque**. | RNF21, RNF22 | 🔴 Crítico |
| 3.3 | O cabeçalho de toda tela informa o nome da tela atual e a ação em curso. | RNF22 | 🔴 Crítico |
| 3.4 | Fluxos com mais de 1 passo exibem **indicador de etapa** (1/3, 2/3…). | RNF22 | 🟡 Recomendado |
| 3.5 | O botão "Voltar" é sempre visível e acessível (exceto na tela inicial). | RNF22 | 🔴 Crítico |
| 3.6 | O próximo elemento a ser interagido está **destacado visualmente** (cor, peso, ícone). | RNF22 | 🟡 Recomendado |

---

## 4. Feedback e Mensagens

| # | Item | RNF | Criticidade |
|---|------|-----|:-:|
| 4.1 | Toda ação do usuário gera feedback visual (e tátil quando relevante) em **≤ 100ms**. | RNF23 | 🔴 Crítico |
| 4.2 | Mensagens de erro usam **linguagem natural**, sem códigos técnicos. | RNF23 | 🔴 Crítico |
| 4.3 | Mensagens de erro dizem *o que aconteceu* e *o que fazer em seguida*. | RNF23 | 🔴 Crítico |
| 4.4 | Estados de carregamento são explícitos (skeleton/spinner com texto "Carregando…"). | RNF23 | 🟡 Recomendado |
| 4.5 | Nenhuma informação essencial é transmitida **apenas por cor** (combinar cor + ícone + texto). | RNF26 | 🔴 Crítico |

---

## 5. Acessibilidade Assistiva

| # | Item | RNF | Criticidade |
|---|------|-----|:-:|
| 5.1 | Todos os elementos interativos possuem `accessibilityLabel` descritivo. | RNF25 | 🔴 Crítico |
| 5.2 | Elementos complexos (cards, listas) possuem `accessibilityRole` e `accessibilityHint`. | RNF25 | 🟡 Recomendado |
| 5.3 | A ordem de foco/leitura segue a sequência lógica (cima→baixo, esquerda→direita). | RNF25 | 🔴 Crítico |
| 5.4 | O estado de **foco visível** está presente e tem contraste **≥ 3:1**. | RNF25 | 🔴 Crítico |
| 5.5 | TalkBack (Android) e VoiceOver (iOS) anunciam corretamente todos os elementos da tela. | RNF25 | 🔴 Crítico |
| 5.6 | Gestos complexos (multi-touch, arrastar) têm **alternativa acessível por botão visível**. | RNF20, RNF25 | 🟡 Recomendado |
| 5.7 | O app respeita `prefers-reduced-motion` do sistema (RNF10/11). | RNF11 | 🟡 Recomendado |

---

## 6. Validação com Usuários 60+

| # | Item | RNF | Criticidade |
|---|------|-----|:-:|
| 6.1 | Teste de usabilidade com pelo menos **3 usuários 60+** foi realizado. | RNF02, RNF21 | 🟡 Recomendado |
| 6.2 | As tarefas essenciais foram concluídas por **≥ 80% dos usuários sem ajuda**. | RNF02, RNF21 | 🟡 Recomendado |
| 6.3 | O tempo médio de conclusão de tarefa essencial é **≤ 30s**. | RNF02 | 🟡 Recomendado |
| 6.4 | Nenhum usuário reportou "não conseguir ler" ou "não entender o próximo passo". | RNF18, RNF22 | 🟡 Recomendado |

---

## Referências normativas

- **WCAG 2.1** — *Web Content Accessibility Guidelines*, nível AA. [W3C/WAI](https://www.w3.org/WAI/WCAG21/quickref/).
- **Android Accessibility Guidelines** — alvo de toque mínimo, contraste, TalkBack. [Material Design](https://m3.material.io/foundations/accessible-design/accessibility-basics).
- **Apple HIG — Accessibility** — Dynamic Type, VoiceOver, Touch Targets. [Apple Developer](https://developer.apple.com/design/human-interface-guidelines/accessibility).
- **ABNT NBR 9050** — Acessibilidade em interfaces digitais (referência nacional).
