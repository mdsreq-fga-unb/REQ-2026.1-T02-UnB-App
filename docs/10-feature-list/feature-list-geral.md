# 10.1 Feature List Geral

> A **Feature List** é o **backlog vivo do projeto** e funciona como instrumento central de acompanhamento.
>
> 📌 **Visão Geral e Rastreabilidade:** O cronograma e a tabela unificada (MVP) estão na **[Página Inicial (Home)](../index.md)**. Esta página destina-se ao detalhamento de cada feature em forma de cards com foco no fluxo e nas evidências.

---

<div class="cards-container" style="display: flex; flex-direction: column; gap: 2rem;" markdown="1">

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="f09"></a> 🟠 F09: Centralizar documentos oficiais

**Prioridade:** Must (MVP) | **Iteração:** [I1](../06-cronograma/index.md#i1) | **Requisitos Relacionados:** [RF20](../08-requisitos/funcionais.md#rf20), [RF21](../08-requisitos/funcionais.md#rf21)

#### O que deve ser feito (Ação, Resultado, Objetivo)
**Ação:** Centralizar documentos oficiais.<br>**Resultado:** Reunir todos os documentos acadêmicos e estudantis em um único local acessível.<br>**Objetivo:** Facilitar a localização, gestão e apresentação de documentos pelo estudante, economizando tempo e esforço.

#### Etapas dentro do App (Fluxo)
1. Na barra de navegação inferior (Tabs), o usuário clica em **"Documentos"**.
2. O usuário visualiza a lista de documentos offline armazenados.
3. O usuário pode clicar no **botão flutuante de '+'** para enviar um novo documento (PDF) usando o seletor nativo do celular.

#### Evidência Visual
<img src="../../assets/evidencias/tela-documentos.png" alt="Tela de Documentos" style="max-width: 250px; display: block; border-radius: 8px;" />

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="f05"></a> 🟡 F05: Exibir fluxos de onboarding

**Prioridade:** Must (MVP) | **Iteração:** [I3](../06-cronograma/index.md#i3) | **Requisitos Relacionados:** [RF22](../08-requisitos/funcionais.md#rf22), [RF23](../08-requisitos/funcionais.md#rf23)

#### O que deve ser feito (Ação, Resultado, Objetivo)
**Ação:** Exibir fluxos de onboarding.<br>**Resultado:** Apresentar as principais funcionalidades e plataformas oficiais da universidade (SIGAA/Aprender 3).<br>**Objetivo:** Garantir que o usuário compreenda rapidamente como utilizar a plataforma e engajar novos estudantes.

#### Etapas dentro do App (Fluxo)
1. Ao abrir o app pela primeira vez, o usuário passa pelas telas de boas-vindas.
2. Ao entrar na **Home** (Tela Inicial), o usuário visualiza atalhos rápidos para SIGAA e Aprender 3.
3. Ao clicar nos atalhos, um tutorial em formato de carrossel é apresentado na tela.

#### Evidência Visual
<img src="../../assets/evidencias/tela-inicial.png" alt="Tela Inicial do UnB-App" style="max-width: 250px; display: block; border-radius: 8px;" />

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="f07"></a> 🟠 F07: Consultar grade horária e ensalamento

**Prioridade:** Must (MVP) | **Iteração:** [I1](../06-cronograma/index.md#i1) | **Requisitos Relacionados:** [RF16](../08-requisitos/funcionais.md#rf16)

#### O que deve ser feito (Ação, Resultado, Objetivo)
**Ação:** Consultar grade horária e ensalamento.<br>**Resultado:** Informar as disciplinas, horários e locais de aula mesmo sem internet.<br>**Objetivo:** Reduzir a sobrecarga cognitiva do usuário na localização de espaços físicos e sem depender de conexão.

#### Etapas dentro do App (Fluxo)
1. Na tela **Home**, a aba central do cabeçalho exibe a grade do dia atual.
2. Na barra de navegação inferior, o usuário pode clicar em **"Grade"** (Schedule) para ver o calendário semanal completo.
3. Clicar sobre uma aula abre um modal com os detalhes de ensalamento.

#### Evidência Visual
<img src="../../assets/evidencias/tela-inicial.png" alt="Visualização da Grade na Home" style="max-width: 250px; display: block; border-radius: 8px;" />

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="f04"></a> 🟠 F04: Extrair e processar Histórico/Passe Livre

**Prioridade:** Should (S) | **Iteração:** [I2](../06-cronograma/index.md#i2) | **Requisitos Relacionados:** [RF04](../08-requisitos/funcionais.md#rf04), [RF05](../08-requisitos/funcionais.md#rf05), [RF06](../08-requisitos/funcionais.md#rf06), [RF07](../08-requisitos/funcionais.md#rf07)

#### O que deve ser feito (Ação, Resultado, Objetivo)
**Ação:** Extrair e processar Histórico Escolar e/ou Passe Livre.<br>**Resultado:** Obter dados úteis à plataforma de forma automatizada via processamento de arquivos PDF.<br>**Objetivo:** Reduzir o esforço manual do usuário ao evitar o preenchimento de formulários de matérias.

#### Etapas dentro do App (Fluxo)
1. O usuário envia o Histórico Escolar na tela de **Documentos**.
2. Um loading aparece enquanto o parser processa o PDF (backend local).
3. Uma notificação de sucesso informa que a **Grade Horária** foi automaticamente alimentada.

#### Evidência Visual
*(Funcionalidade operando em background; impacto visual refletido na grade horária)*

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="f08"></a> 🔴 F08: Coletar e atualizar dados acadêmicos (Matrícula)

**Prioridade:** Should (S) | **Iteração:** [I2](../06-cronograma/index.md#i2) | **Requisitos Relacionados:** [RF17](../08-requisitos/funcionais.md#rf17), [RF18](../08-requisitos/funcionais.md#rf18), [RF19](../08-requisitos/funcionais.md#rf19)

#### O que deve ser feito (Ação, Resultado, Objetivo)
**Ação:** Coletar e atualizar dados acadêmicos (Matrícula e SIGAA).<br>**Resultado:** Manter as informações sincronizadas através de integração web scraping.<br>**Objetivo:** Garantir a precisão e automatizar a coleta de notas, faltas e mudanças de horários.

#### Etapas dentro do App (Fluxo)
1. O usuário insere suas credenciais do SIGAA em **Perfil > Sincronização**.
2. O app roda uma rotina diária em background.
3. O usuário recebe push notifications de mudanças de nota ou local de sala.

#### Evidência Visual
*(Feature bloqueada por falta de credenciais do SIGAA; aguardando liberação)*

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="f02"></a> 🟡 F02: Exibir QRCode da BCE

**Prioridade:** Could (C) | **Iteração:** [I4](../06-cronograma/index.md#i4) | **Requisitos Relacionados:** [RF02](../08-requisitos/funcionais.md#rf02)

#### O que deve ser feito (Ação, Resultado, Objetivo)
**Ação:** Exibir QRCode da BCE.<br>**Resultado:** Gerar e apresentar o QR Code criado a partir do CPF do estudante.<br>**Objetivo:** Permitir a autenticação e o acesso rápido às catracas da Biblioteca Central.

#### Etapas dentro do App (Fluxo)
1. Na tela **Home** ou em um atalho rápido na Navbar inferior.
2. O usuário clica em **BCE**.
3. A tela brilha e um QR Code expandido aparece pronto para leitura no scanner.

#### Evidência Visual
*(Mockups em validação)*

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="f03"></a> 🟡 F03: Exibir e armazenar a carteirinha digital

**Prioridade:** Could (C) | **Iteração:** [I4](../06-cronograma/index.md#i4) | **Requisitos Relacionados:** [RF01](../08-requisitos/funcionais.md#rf01), [RF03](../08-requisitos/funcionais.md#rf03)

#### O que deve ser feito (Ação, Resultado, Objetivo)
**Ação:** Exibir e armazenar carteirinha digital.<br>**Resultado:** Apresentar as credenciais e identificação do aluno com foto.<br>**Objetivo:** Garantir a identificação do estudante (RU e seguranças) mesmo sem internet.

#### Etapas dentro do App (Fluxo)
1. Na barra de navegação, clicar em **"Identidade"**.
2. A carteirinha estudantil flipável aparece na tela com foto, nome e código de barras.

#### Evidência Visual
*(Mockups em validação)*

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="f06"></a> ❌ F06: Listar e reproduzir tutoriais (Cancelado)

**Prioridade:** Won't (W) | **Iteração:** — | **Requisitos Relacionados:** [RF12](../08-requisitos/funcionais.md#rf12)–[RF15](../08-requisitos/funcionais.md#rf15)

#### O que deve ser feito (Ação, Resultado, Objetivo)
**Ação:** Listar e reproduzir tutoriais de uso da UnB.<br>**Objetivo:** Reduzir ansiedade de novos alunos.<br>*(Status: Cancelado por ultrapassar o limite de esforço da disciplina (15h, Baixo Valor Relativo).)*

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="f01"></a> ❌ F01: Conversar com assistente IA (Cancelado)

**Prioridade:** Won't (W) | **Iteração:** — | **Requisitos Relacionados:** [RF08](../08-requisitos/funcionais.md#rf08)–[RF11](../08-requisitos/funcionais.md#rf11)

#### O que deve ser feito (Ação, Resultado, Objetivo)
**Ação:** Assistente de voz RAG para dúvidas acadêmicas.<br>**Objetivo:** Ajudar em dúvidas específicas de editais e manuais.<br>*(Status: Cancelado por complexidade arquitetural (60h+ esforço estimado).)*

</article>

</div>