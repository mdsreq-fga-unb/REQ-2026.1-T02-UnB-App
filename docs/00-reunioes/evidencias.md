# 0.3 Evidências da Implementação

> Página reservada para documentar e demonstrar a implementação prática das features desenvolvidas ao longo do projeto, validando o uso do framework Feature-Driven Development (FDD).
>
> 📌 Para uma visão **consolidada por processo FDD** (status, features, decisões técnicas e pendências), consulte também **[5.3 Evidências de Execução do Processo de ESW](../05-er/evidencias-execucao.md)**.

---

## Sobre as Evidências

Abaixo, listamos as fotos, vídeos e capturas de tela comprovando o funcionamento das funcionalidades implementadas na **Unidade 3**, servindo como registro da materialização dos requisitos propostos e da rastreabilidade das etapas de qualidade do FDD.

### 1. Validação Visual e de UI (Design Inspecionado)
No FDD, o design deve ser construído e inspecionado rigorosamente. Abaixo estão as interfaces desenvolvidas nativamente, respeitando os requisitos de acessibilidade e navegação.

**Tela Inicial:**
Interface principal do aplicativo, refletindo a navegação simplificada em poucos cliques focada no público-alvo.

![Evidência - Tela Inicial](../assets/evidencias/tela-inicial.png){ width="250" }

**Tela de Documentos:**
Interface dedicada ao gerenciamento e visualização offline dos documentos oficiais do estudante.

![Evidência - Tela de Documentos](../assets/evidencias/tela-documentos.png){ width="250" }

---

### 2. Validação Funcional e de Valor (Demonstração de Features)
Os vídeos abaixo atestam o funcionamento real das features desenvolvidas.

* **Navegação na Tela Inicial**
  *Demonstração da navegação, renderização dos componentes nativos e comportamento visual na home.*
  > 🔗 **[Assistir Vídeo - Tela Inicial](https://drive.google.com/file/d/1J5pvcoWDN1ZcXoa7kzQK8vBnkqCwdqLL/view?usp=drive_link)**

* **Upload de Documentos e Geração da Grade Horária**
  *Comprovação do fluxo de negócio principal: envio do documento (PDF), o processamento interno (parser) e a geração com sucesso da grade do aluno na tela.*
  > 🔗 **[Assistir Vídeo - Upload e Grade](https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view?usp=drive_link)**

* **Buscas e Filtros de Documentos**
  *Demonstração da utilização da barra de pesquisas e aplicação de filtros, comprovando a fácil localização de arquivos no repositório local.*
  > 🔗 **[Assistir Vídeo - Buscas e Filtros](https://drive.google.com/file/d/1EOVQwvk7PbyRCCIwI105-FQpBcUWR342/view?usp=drive_link)**

---

### 3. Inspeção Formal de Código (Code Review FDD)
Para atestar que as evidências visuais acima passaram pelos marcos técnicos exigidos de "Código Inspecionado" e "Promoção para Build" sem quebras arquiteturais:

* **[Acesso ao Código-Fonte](https://github.com/mdsreq-fga-unb/REQ-2026.1-T02-UnB-App/tree/feat/entregaUnidade3)**