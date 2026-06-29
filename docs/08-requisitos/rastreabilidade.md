# 8.3 Matriz de Rastreabilidade

> Relacionamento entre Objetivos Específicos (OE), Características de Produto (C), Requisitos Funcionais (RF) e Não Funcionais (RNF).

---

| Contribuição principal | Contribuição secundária | Característica de Produto | Requisitos Funcionais relacionados | Requisitos Não Funcionais relacionados |
|:---:|:---:|:---:|---|---|
| OE1 | OE2 | C06 | RF04, RF05, RF06 | - |
| OE1 | OE3 | C07 | RF20, RF21 | RNF03, RNF08 |
| OE2 | OE3 | C08 | RF08, RF09, RF10, RF11 | - |
| OE2 | OE1 | C09 | - | RNF01, RNF02, RNF05, RNF18, RNF19, RNF20, RNF21, RNF22, RNF23, RNF24, RNF25, RNF26 |
| OE3 | OE1 | C01 | - | RNF03, RNF08 |
| OE3 | OE1 | C04 | RF07, RF12, RF13, RF14, RF15 | - |
| OE3 | - | C05 | RF01, RF02, RF03 | - |
| OE4 | OE1 | C03 | RF18 | RNF06, RNF09 |
| OE4 | OE3 | C02 | RF16, RF17, RF19 | RNF04 |

!!! note "Observação"
    Requisitos não funcionais de caráter transversal (como restrições de implementação): RNF07, RNF18, RNF19, RNF20, RNF21, RNF22, RNF23, RNF24, RNF25, RNF26.

---

## Rastreabilidade — RNFs de Acessibilidade/Usabilidade × Features do MVP

> Visão complementar focada no público **60+**. Cada RNF novo (RNF18–RNF26) é mapeado às features do MVP (**F05**, **F07**, **F09**) e às features F02/F03 (incluídas como prioridade pós-MVP) para validar que **toda feature crítica do produto** está coberta pelos critérios de acessibilidade.

| RNF | Descrição resumida | F02 — QRCode BCE | F03 — Carteirinha Digital | F05 — Onboarding | F07 — Grade Horária/Ensalamento | F09 — Centralizar Documentos |
|:---:|---|:-:|:-:|:-:|:-:|:-:|
| **RNF18** | Fonte mínima 18sp + seletor persistente | ✅ | ✅ | ✅ | ✅ | ✅ |
| **RNF19** | Contraste ≥ 4.5:1 (AA) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **RNF20** | Alvos de toque ≥ 48x48dp + ícone com rótulo | ✅ (botão "abrir") | ✅ (botão "abrir") | ✅ (CTAs grandes) | ✅ (chips de dia) | ✅ (cards de doc) |
| **RNF21** | Tarefas essenciais em ≤ 3 passos + 1 CTA por tela | ✅ (Home → QRCode) | ✅ (Home → Carteirinha) | ✅ (Fluxo guiado ≤ 3 etapas) | ✅ (Home → Grade → Dia) | ✅ (Home → Doc → Visualizar) |
| **RNF22** | Cabeçalho claro + próximo passo destacado | ✅ | ✅ | ✅ (1/3, 2/3) | ✅ | ✅ |
| **RNF23** | Feedback ≤ 100ms + erros em linguagem natural | ✅ | ✅ | ✅ | ✅ | ✅ |
| **RNF24** | Ajuste persistente de fonte | ✅ | ✅ | ✅ | ✅ | ✅ |
| **RNF25** | Foco visível + TalkBack/VoiceOver | ✅ | ✅ | ✅ | ✅ | ✅ |
| **RNF26** | Informação nunca só por cor | ✅ (status com ícone) | ✅ (status com ícone) | ✅ | ✅ | ✅ (status do doc) |

> **Cobertura:** 100% das features críticas (MVP + prioridades pós-MVP) estão cobertas por todos os 9 novos RNFs de acessibilidade/usabilidade. O **[checklist de acessibilidade/usabilidade](checklist-acessibilidade.md)** deve ser aplicado na DoD de cada feature.

---

Abaixo segue uma árvore de rastreabilidade para melhor visualização das relações apresemtadas na tabela acima:

<div class="image-preview">
  <figure class="image-preview__figure">
    <img src="../../assets/arvore-de-rastreabilidade.png" alt="Árvore de Rastreabilidade dos Requisitos" loading="lazy">
  </figure>
  <a class="image-preview__action" href="../../assets/arvore-de-rastreabilidade.png" target="_blank" rel="noopener">
    Abrir imagem em tamanho completo
  </a>
</div>
