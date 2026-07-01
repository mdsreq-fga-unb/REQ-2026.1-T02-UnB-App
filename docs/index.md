# Visão Geral do Produto e Projeto

!!! info "Sobre este documento"
    Bem-vindo ao **UnB App**. Para facilitar o acompanhamento gerencial e evitar redundâncias, concentramos nesta página inicial as **três visões principais** do projeto. Clique nos links de Features, Requisitos e Iterações para acessar os detalhamentos.

---

## 1. Escopo Mínimo Viável (MVP)

Abaixo estão listadas as funcionalidades que compõem o MVP.
*Clique na Feature ou no Requisito para ver seu card de detalhamento e protótipo.*

| Feature | Status Atual | Requisitos Funcionais da Feature |
| :--- | :--- | :--- |
| **[F09: Centralizar Documentos Oficiais](10-feature-list/feature-list-geral.md#f09)** | 🟠 Parcial | [RF20](08-requisitos/funcionais.md#rf20), [RF21](08-requisitos/funcionais.md#rf21) |
| **[F05: Fluxos de Onboarding](10-feature-list/feature-list-geral.md#f05)** | 🟡 Em andamento | [RF22](08-requisitos/funcionais.md#rf22), [RF23](08-requisitos/funcionais.md#rf23) |
| **[F07: Grade Horária e Ensalamento](10-feature-list/feature-list-geral.md#f07)** | 🟠 Parcial | [RF16](08-requisitos/funcionais.md#rf16) |

---

## 2. Cronograma de Execução

Acompanhamento das iterações do desenvolvimento FDD.
*Clique na Iteração para visualizar os Critérios de Aceite, DoR, DoD e as evidências (protótipos).*

| Iteração | Datas (Início - Fim) | Resultado Esperado | Features Envolvidas | Técnicas Adotadas (DoR/DoD) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[Iteração 1](06-cronograma/index.md#i1)** | 23/05/2026 - 10/06/2026 | Upload local, parser PDF offline e grade horária funcional | [F09](10-feature-list/feature-list-geral.md#f09), [F07](10-feature-list/feature-list-geral.md#f07) | Design Review Figma, Suíte de Testes, Expo Build | 🟠 Parcial |
| **[Iteração 2](06-cronograma/index.md#i2)** | 11/06/2026 - 24/06/2026 | Extração do Passe Livre e Web Scraping do SIGAA | [F04](10-feature-list/feature-list-geral.md#f04), [F08](10-feature-list/feature-list-geral.md#f08) | Testes Regex, Background Fetch | 🟡 Andamento |
| **[Iteração 3](06-cronograma/index.md#i3)** | 25/06/2026 - 30/06/2026 | Modais de onboarding e telas iniciais validadas | [F05](10-feature-list/feature-list-geral.md#f05) | Validação de Acessibilidade (60+), Animações limitadas | 🟡 Andamento |
| **[Iteração 4](06-cronograma/index.md#i4)** | 01/07/2026 - 07/07/2026 | Geração de QR Code e carteirinha virtual armazenada | [F02](10-feature-list/feature-list-geral.md#f02), [F03](10-feature-list/feature-list-geral.md#f03) | SQLite Persistente, Renderização Gráfica | 🟡 Andamento |

---

## 3. Matriz de Rastreabilidade Visual

Esta matriz amarra o **Problema Identificado** à **Feature** que o resolve.
*Legenda:* ✅ Implementado | 🟡 Parcial/Andamento | 🔴 Pendente/Atrasado

| Problema Identificado | Objetivo | Característica | Requisito | Feature |
| :--- | :--- | :--- | :--- | :--- |
| Desorganização de papéis (ex: passe estudantil) | Unificar documentos num local seguro | Acesso offline a PDFs | [RF21](08-requisitos/funcionais.md#rf21) ✅ | [F09](10-feature-list/feature-list-geral.md#f09) 🟠 |
| Dificuldade em saber o local das aulas no campus | Exibir locais e horários de forma ágil | Interface de mapa/lista rápida | [RF16](08-requisitos/funcionais.md#rf16) 🟡 | [F07](10-feature-list/feature-list-geral.md#f07) 🟠 |
| Calouros perdidos nas plataformas (SIGAA/Aprender) | Fornecer guia introdutório | Componentes de onboarding educativo | [RF22](08-requisitos/funcionais.md#rf22) 🟡 | [F05](10-feature-list/feature-list-geral.md#f05) 🟡 |
| Longas filas na Biblioteca Central (BCE) | Agilizar entrada pelas catracas | Leitura otimizada por QR Code | [RF02](08-requisitos/funcionais.md#rf02) 🟡 | [F02](10-feature-list/feature-list-geral.md#f02) 🟡 |
| Esforço braçal de copiar dados do SIGAA | Automatizar coleta de dados | Integração Web Scraping invisível | [RF17](08-requisitos/funcionais.md#rf17) 🔴 | [F08](10-feature-list/feature-list-geral.md#f08) 🔴 |

---

## 4. Estrutura Completa de Documentação

<div class="vpp-hero" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); margin-top: 1rem; margin-bottom: 3rem;">
  <a href="08-requisitos/funcionais/" class="vpp-hero-card" style="text-decoration: none;">
    <span class="vpp-section-num">Tópico 08</span>
    <h3>Requisitos (Cards)</h3>
    <p>O que deve ser feito e as tecnologias para implementar.</p>
  </a>
  <a href="10-feature-list/feature-list-geral/" class="vpp-hero-card" style="text-decoration: none;">
    <span class="vpp-section-num">Tópico 10</span>
    <h3>Features (Cards)</h3>
    <p>Objetivos da feature, fluxos de uso no app e imagens.</p>
  </a>
  <a href="06-cronograma/" class="vpp-hero-card" style="text-decoration: none;">
    <span class="vpp-section-num">Tópico 06</span>
    <h3>Iterações (Detalhes)</h3>
    <p>Critérios de aceite, DoR e DoD executados no desenvolvimento.</p>
  </a>
  <a href="05-er/evidencias-execucao/" class="vpp-hero-card" style="text-decoration: none;">
    <span class="vpp-section-num">Tópico 05</span>
    <h3>Evidências Visuais</h3>
    <p>Registro formal, prints e PRs organizados por iteração.</p>
  </a>
</div>

---

## Nossa Equipe

<div class="team-grid">
	<article class="team-card">
		<img class="team-card__photo" src="https://github.com/RivaFilho.png?size=240" alt="Foto de Rivaldavio no GitHub" loading="lazy" />
		<h3 class="team-card__name">Rivaldavio Joaquim</h3>
		<a class="team-card__handle" href="https://github.com/RivaFilho" target="_blank" rel="noopener noreferrer">@RivaFilho</a>
		<p class="team-card__role">Gerente de Projeto</p>
	</article>

	<article class="team-card">
		<img class="team-card__photo" src="https://github.com/cunha-luiss.png?size=240" alt="Foto de Luís Felipe no GitHub" loading="lazy" />
		<h3 class="team-card__name">Luís Felipe Cunha</h3>
		<a class="team-card__handle" href="https://github.com/cunha-luiss" target="_blank" rel="noopener noreferrer">@cunha-luiss</a>
		<p class="team-card__role">Dev Frontend / Analista de Requisitos</p>
	</article>

	<article class="team-card">
		<img class="team-card__photo" src="https://github.com/Davi-UnB.png?size=240" alt="Foto de Davi no GitHub" loading="lazy" />
		<h3 class="team-card__name">Davi Severiano</h3>
		<a class="team-card__handle" href="https://github.com/Davi-UnB" target="_blank" rel="noopener noreferrer">@Davi-UnB</a>
		<p class="team-card__role">Desenvolvedor Backend</p>
	</article>

	<article class="team-card">
		<img class="team-card__photo" src="https://github.com/PedroGTG.png?size=240" alt="Foto de Pedro no GitHub" loading="lazy" />
		<h3 class="team-card__name">Pedro Henrique Xavier</h3>
		<a class="team-card__handle" href="https://github.com/PedroGTG" target="_blank" rel="noopener noreferrer">@PedroGTG</a>
		<p class="team-card__role">Analista de QA</p>
	</article>

	<article class="team-card">
		<img class="team-card__photo" src="https://github.com/Mateus0xC.png?size=240" alt="Foto de Mateus no GitHub" loading="lazy" />
		<h3 class="team-card__name">Mateus Barreto</h3>
		<a class="team-card__handle" href="https://github.com/Mateus0xC" target="_blank" rel="noopener noreferrer">@Mateus0xC</a>
		<p class="team-card__role">Suporte Backend / QA</p>
	</article>

	<article class="team-card">
		<img class="team-card__photo" src="https://github.com/IsaacLusca.png?size=240" alt="Foto de Isaac no GitHub" loading="lazy" />
		<h3 class="team-card__name">Isaac</h3>
		<a class="team-card__handle" href="https://github.com/IsaacLusca" target="_blank" rel="noopener noreferrer">@IsaacLusca</a>
		<p class="team-card__role">QA, Acessibilidade e Backend</p>
	</article>
</div>

---

## Identificação e Histórico de Revisão

### Identificação

| Campo         | Informação                          |
|---------------|-------------------------------------|
| **Produto**   | UnB App                             |
| **Versão**    | [2.0]                               |
| **Equipe**    | [Rivotril - G7]                     |
| **Disciplina**| Requisitos de Software — [2026.01]  |

### Histórico de Revisão

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 03/04/2026 | 1.0 | Primeira versão do documento com quase toda a parte de 1 até 2.3 completa, além da inserção de alguns outros como o 2.4 | Luís Felipe Parreira Cunha, Rivadalvio, Davi e Pedro |
| 04/04/2026 | 1.0.1 | Refinamento de detalhes e verificação do projeto | Mateus, Luís Felipe e Davi |
| 06/04/2026 | 1.1 | Adequação aos pedidos do professor com adição de novos esclarecimentos e pontos. Além de alteração de nome do projeto | Luís Felipe, Rivadalvio e Mateus |
| 06/04/2026 | 1.1.1 | Refinamento do documento | Pedro, Mateus e Rivadalvio |
| 08/04/2026 | 1.2 | Atualizações da visão do projeto para seguir as recomendações do professor | Luís Felipe |
| 09/04/2026 | 1.2.1 | Atualização de pensamentos e ideias que haviam ficado ambíguas no entendimento dos objetivos | Luís Felipe, Davi, Pedro e Rivadalvio |
| 09/04/2026 | 1.2.2 | Inclusão do Objetivo Específico 5 (OE5), refinamento do Objetivo Geral e correção de erros pontuais no documento. | Davi Severiano |
| 09/04/2026 | 1.3 | Correção ortográfica e acordo entre ideias que estavam muito ambíguas. Incluindo uma revisão geral dos tópicos 1 até o 2.3 | Davi, Luís, Mateus, Pedro e Rivadalvio |
| 12/04/2026 | 1.3.1 | Adicionados os tópicos referentes a cada um dos autores que são tópicos 2.5, 2.6, 4.1 e 6.3 | Pedro, Luís |
| 13/04/2026 | 1.3.2 | Adicionados os tópicos referentes a cada um dos autores que são tópicos 6.1, 6.2 e revisão 2.3 | Davi |
| 13/04/2026 | 1.3.3 | Adicionados os tópicos referentes a cada um dos autores que são tópicos 3.2, 3.3 e 5 | Riva |
| 13/04/2026 | 1.3.4 | Adicionados os tópicos referentes a cada um dos autores que são tópicos 2.7, 3.1 e 4.2 | Mateus |
| 13/04/2026 | 1.3.5 | Revisão das novas adições feitas por cada integrante | Luis |
| 01/05/2026 | 1.4 | Reformulação completa das issues apresentadas pelo professor | Davi, Luís, Mateus, Pedro e Rivadalvio |
| 09/05/2026 | 1.4.1 | Finalização da verificação de todas as alterações feitas de acordo com o pedido das issues | Davi, Luís, Mateus, Pedro e Rivadalvio |
| 09/05/2026 | 1.5 | Começo estrutural da formação dos requisitos definidos e objetivos do projeto (Unidade 2 de forma formal no documento) | Davi, Luís, Mateus, Pedro e Rivadalvio |
| 13/05/2026 | 1.5.1 | Criação da matriz de rastreabilidade dos requisitos e da matriz de valor de negócio e esforço para definição do MVP | Davi, Luís, Mateus, Pedro e Rivadalvio |
| 14/05/2026 | 1.5.2 | Correção do que foi apresentado em sala como característica de produto unificada e diminuição de 1:1 de características para requisitos | Davi, Luís, Mateus, Pedro e Rivadalvio |
| 15/05/2026 | 1.5.3 | Reformulação dos objetivos específicos e das características, além da criação de novos requisitos, destrinchando outros maiores | Davi, Mateus, Pedro e Rivadalvio |
| 16/05/2026 | 1.6 | Organização e produção da priorização de features e quais features entrariam no MVP | Davi, Luís, Mateus, Pedro e Rivadalvio |
| 18/05/2026 | 1.6.1 | Revisão e finalização da Unidade 2, englobando toda a Visão de Produto e Projeto do UnB App | Davi, Luís, Mateus, Pedro e Rivadalvio |
| 18/05/2026 | 1.6.2 | Atualizações na feature list, transcrições de reuniões e correções gerais | Luís, Pedro |
| 14/06/2026 | 1.6.3 | Correção na documentação da iteração | Rivadalvio |
| 15/06/2026 | 1.7 | Adição de membro na equipe (Isaac), definição de papéis do FDD e justificativas técnicas | Luís |
| 15/06/2026 | 2.0 | Repaginação visual do GitPages, reestruturação da home, seção de evidências e adição de vídeos embed | Luís |
| 29/06/2026 | 2.1 | Correção de consistência do RF22 e RF23, anteriormente representaodos como RF07 | Davi |
