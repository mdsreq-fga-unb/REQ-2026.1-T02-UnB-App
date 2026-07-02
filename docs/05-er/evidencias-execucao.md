# 5. Evidências de Execução

> 📌 **Visão Geral e Rastreabilidade:** O acompanhamento geral das iterações está na **[Página Inicial (Home)](../index.md)**. Esta página destina-se ao registro detalhado e isolado de todas as evidências (atas, decisões, PRs, protótipos e imagens) agrupadas explicitamente por iteração para facilitar buscas e auditorias.

---

## Fase 0: Planejamento e Idealização do Escopo ✅

**Período:** 13/04/2026 a 22/05/2026

Nesta fase inicial de Engenharia de Requisitos (ER), o foco foi na descoberta e modelagem do problema, resultando na criação da backlog inicial (Feature List).

- **Elicitação e Contexto:** 
  - Rich Picture desenhado com base em observações de uso do SIGAA.
  - Entrevistas com stakeholder Maria Fátima documentada na [Ata RE01](../00-reunioes/docx/Terminar%20a%20primeira%20entrega%20.docx).
  - Identificação de Público-Alvo e Segmentação de mercado estruturada em pesquisa pública.
- **Decisões Técnicas Iniciais (ADR-01 a ADR-03):**
  - Adoção de React Native + Expo + TS.
  - Uso de SQLite para modo offline.
  - Adoção de **FDD** como processo ágil.
- **Priorização:**
  - Aplicação de MoSCoW e construção da matriz de Valor de Negócio vs Esforço. 
  - <a href="../assets/matriz-priorizacao.png" target="_blank">🖼️ Ver Matriz Priorização</a>

---

## Iteração 1: Documentos e Grade Horária (MVP) 🟠

**Período:** até 10/06/2026

Foco principal em entregar a infraestrutura offline (SQLite) e as features F09 (Documentos) e F07 (Grade), fundamentais para compor o escopo do MVP.

- **Evidências Visuais e Protótipos:**
  - Protótipos de Baixa/Média fidelidade validados no Figma.
  - Telas iniciais (Home e Documentos) codificadas e renderizadas no Expo.
  - <a href="../assets/evidencias/tela-documentos.png" target="_blank">🖼️ Ver Tela Documentos</a>
  - <a href="../assets/evidencias/tela-inicial.png" target="_blank">🖼️ Ver Tela Home (Grade)</a>
- **Evidências de Desenvolvimento (Builds & PRs):**
  - Implementação completa de Upload local e cache SQLite (RNF08).
  - Parser customizado para leitura do Histórico Escolar (antecipado de F04).
  - 🔗 <a href="https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view" target="_blank">Vídeo de Demonstração - Grade</a>
  - 🔗 <a href="https://drive.google.com/file/d/1EOVQwvk7PbyRCCIwI105-FQpBcUWR342/view" target="_blank">Vídeo de Demonstração - Busca e Filtros</a>
- **Inspeção de Qualidade:** Testes unitários do Parser e validação inicial de acessibilidade WCAG (contraste/fonte) cobrindo parte do RNF18.

---

## Iteração 2: Automação e SIGAA 🟡

**Período Planejado:** até 24/06/2026

Iteração em andamento, cujo objetivo é integrar processos manuais (como ler o Passe Livre) e iniciar a raspagem de dados (Web Scraping) do SIGAA.

- **Evidências Visuais e Protótipos:** 
  - *Fluxo sem tela específica — impacto na grade existente.*
- **Evidências de Desenvolvimento (Builds & PRs):**
  - O script extrator do Passe Livre encontra-se em testes de Regex contra diferentes formatos e assinaturas digitais.
- **Pendências (Bloqueios Registrados):**
  - **Bloqueio Crítico (F08):** Falta de credenciais do SIGAA homologadas para criação do script de web scraping em background (RNF17). Estuda-se a mitigação por Mocking temporário.

---

## Iteração 3: Onboarding e Acolhimento 🟡

**Período Planejado:** até 30/06/2026

Criação dos caminhos felizes iniciais para aclimatar novos calouros, apresentando os módulos do UnB App, SIGAA e Aprender 3.

- **Evidências Visuais e Protótipos:**
  - Fluxo de Splash e Carrossel em construção. 
  - Animações usando API `Animated` ou Reanimated limitadas a 300ms (RNF10).
- **Evidências de Desenvolvimento (Builds & PRs):**
  - Branch estrutural `feat/onboarding` criada.
  - 🔗 <a href="https://drive.google.com/file/d/1J5pvcoWDN1ZcXoa7kzQK8vBnkqCwdqLL/view" target="_blank">Vídeo Precursor - Navegação de Tarefas Iniciais</a>

---

## Iteração 4: Carteirinha e Acesso Físico (Pós-MVP) 🟡

**Período Planejado:** até 07/07/2026

Ciclo que entregará a geração da Carteirinha Física Digital e o QR Code padrão para as catracas da Biblioteca Central e RU.

- **Evidências Visuais e Protótipos:**
  - Protótipos Figma em refinamento final de Design Review.
- **Evidências de Desenvolvimento (Builds & PRs):**
  - Dependência no Expo SQLite resolvida na Iteração 1 permite focar puramente em UI. Testes com `react-native-qrcode-svg` validados e em branch separada.
