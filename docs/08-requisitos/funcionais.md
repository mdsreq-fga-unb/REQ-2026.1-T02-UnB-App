# 8.1 Requisitos Funcionais

> Os requisitos funcionais descrevem as funcionalidades específicas que o sistema deve implementar para atender às necessidades do negócio.
>
> 📌 **Visão Geral e Rastreabilidade:** A tabela consolidada e a visão macro dos requisitos estão disponíveis na **[Página Inicial (Home)](../index.md)**. Esta página destina-se ao detalhamento profundo de cada requisito.

---

## Legenda de Status

| Ícone | Status |
|:-----:|--------|
| ✅ | **Feito** (Concluído) |
| 🟡 | **Em execução** (Andamento) |
| ⬜ | **Planejado** (Não iniciado) |
| ❌ | **Fora do escopo** (Cancelado) |

---

<div class="cards-container" style="display: flex; flex-direction: column; gap: 2rem;" markdown="1">

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf01"></a> 🟡 RF01: Exibir Carteirinha Estudantil Digital

**Prioridade:** Could (C) | <strong>Feature:</strong> [F03](../10-feature-list/feature-list-geral.md#f03) | <strong>Iteração:</strong> [I3](../06-cronograma/index.md#i3) | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve exibir as credenciais de acesso e identidade do estudante em formato de carteirinha digital, com suporte à leitura por catracas, Restaurante Universitário (RU) e biblioteca.

#### Como ser implementado
Desenvolver uma tela em React Native (<code>src/screens/StudentID</code>) que resgate as informações persistidas do estudante e gere a interface de uma carteira estudantil. A integração com catracas exigirá geração de código de barras/QR Code na tela ou acesso à API NFC do dispositivo.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf02"></a> 🟡 RF02: Gerar QR Code para Acesso à BCE

**Prioridade:** Could (C) | <strong>Feature:</strong> [F02](../10-feature-list/feature-list-geral.md#f02) | <strong>Iteração:</strong> [I3](../06-cronograma/index.md#i3) | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve gerar um QR Code a partir do CPF do estudante para autenticação e acesso à Biblioteca Central (BCE).

#### Como ser implementado
Utilizar a biblioteca <code>react-native-qrcode-svg</code> para renderizar o QR Code contendo o CPF criptografado ou formatado conforme o padrão aceito pelas catracas da BCE. O CPF deve ser resgatado do cache local (SQLite) garantindo o RNF03 (Offline).

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf03"></a> 🟡 RF03: Armazenar Carteirinha Estudantil

**Prioridade:** Could (C) | <strong>Feature:</strong> [F03](../10-feature-list/feature-list-geral.md#f03) | <strong>Iteração:</strong> [I3](../06-cronograma/index.md#i3) | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve armazenar localmente a carteirinha estudantil, permitindo seu acesso mesmo sem conexão com a internet.

#### Como ser implementado
Salvar os metadados da carteirinha (Nome, Matrícula, Foto, Validade) utilizando Expo SQLite, sincronizados em background quando houver conexão. Ao abrir a aba da carteirinha, o app primeiro tenta ler do SQLite.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf04"></a> ✅ RF04: Armazenar Dados de Documentos Enviados

**Prioridade:** Should (S) | <strong>Feature:</strong> [F04](../10-feature-list/feature-list-geral.md#f04) | <strong>Iteração:</strong> [I2](../06-cronograma/index.md#i2) | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve armazenar os dados extraídos dos documentos enviados pelo estudante para uso posterior nas funcionalidades do aplicativo.

#### Como ser implementado
Os dados processados pelo parser (JSON extraído do PDF) devem ser modelados em tabelas específicas no SQLite (ex: Tabela `DisciplinasCursadas`, Tabela `HorariosAula`) e salvos com transações locais.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf05"></a> ✅ RF05: Processar Dados de Documentos Enviados

**Prioridade:** Should (S) | <strong>Feature:</strong> [F04](../10-feature-list/feature-list-geral.md#f04) | <strong>Iteração:</strong> [I2](../06-cronograma/index.md#i2) | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve processar os documentos enviados pelo estudante, extraindo os dados para alimentar a plataforma e eliminar a necessidade de preenchimento manual de formulários.

#### Como ser implementado
Utilizar a API nativa ou bibliotecas como <code>pdf2json</code>/<code>react-native-pdf</code> ou chamadas de extração textual para ler o conteúdo bruto dos PDFs e aplicar Expressões Regulares (Regex) para identificar entidades-chave (matrícula, nome, créditos, turmas).

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf06"></a> ✅ RF06: Extrair Dados do Histórico Escolar

**Prioridade:** Should (S) | <strong>Feature:</strong> [F04](../10-feature-list/feature-list-geral.md#f04) | <strong>Iteração:</strong> [I1](../06-cronograma/index.md#i1) | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve obter automaticamente os dados presentes no Histórico Escolar do usuário.

#### Como ser implementado
Implementar e testar um script de Parser customizado (<code>pdfExtractor.ts</code>) que identifique especificamente as tabelas de componentes curriculares do Histórico Oficial da UnB, isolando código, disciplina, carga horária e menção.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf07"></a> ✅ RF07: Extrair Dados da Declaração do Passe Livre Estudantil

**Prioridade:** Should (S) | <strong>Feature:</strong> [F04](../10-feature-list/feature-list-geral.md#f04) | <strong>Iteração:</strong> [I2](../06-cronograma/index.md#i2) | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve obter automaticamente os dados presentes na Declaração do Passe Livre Estudantil do usuário.

#### Como ser implementado
Aproveitar o mecanismo do RF05/RF06, criando um adaptador de regex específico para o layout do documento do Passe Livre, buscando extrair dados como Período Letivo e Frequência.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf08"></a> ❌ RF08: Enviar Perguntas ao Assistente Virtual

**Prioridade:** Won't (W) | <strong>Feature:</strong> [F01](../10-feature-list/feature-list-geral.md#f01) | <strong>Iteração:</strong> — | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve permitir que o estudante envie perguntas ao assistente virtual utilizando linguagem natural.

#### Como ser implementado
<strong>Removido do Escopo.</strong> Originalmente, utilizaria chamadas a uma API LLM (ex: OpenAI) com base de conhecimento institucional via RAG.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf09"></a> ❌ RF09: Direcionar para Tutorial Específico

**Prioridade:** Won't (W) | <strong>Feature:</strong> [F01](../10-feature-list/feature-list-geral.md#f01) | <strong>Iteração:</strong> — | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve direcionar o estudante para o tutorial específico caso necessário, como citação.

#### Como ser implementado
<strong>Removido do Escopo.</strong> A intenção da feature LLM no frontend associada a deeplinks diretos no aplicativo.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf10"></a> ❌ RF10: Manter Histórico de Conversas Visível

**Prioridade:** Won't (W) | <strong>Feature:</strong> [F01](../10-feature-list/feature-list-geral.md#f01) | <strong>Iteração:</strong> — | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve manter e exibir o histórico de conversas do estudante com o assistente virtual.

#### Como ser implementado
<strong>Removido do Escopo.</strong> Persistência local no SQLite de histórico de chats.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf11"></a> ❌ RF11: Consultar Resposta em Voz no Assistente Virtual

**Prioridade:** Won't (W) | <strong>Feature:</strong> [F01](../10-feature-list/feature-list-geral.md#f01) | <strong>Iteração:</strong> — | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve permitir que o estudante consulte a resposta de texto em voz no assistente virtual (Text to Speech).

#### Como ser implementado
<strong>Removido do Escopo.</strong> Utilizaria <code>expo-speech</code>.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf12"></a> ❌ RF12: Listar Tutoriais Disponíveis

**Prioridade:** Won't (W) | <strong>Feature:</strong> [F06](../10-feature-list/feature-list-geral.md#f06) | <strong>Iteração:</strong> — | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve exibir a listagem de tutoriais disponíveis para o estudante.

#### Como ser implementado
<strong>Removido do Escopo.</strong> Renderização de <code>FlatList</code> consumindo lista estática local.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf13"></a> ❌ RF13: Visualizar Tutoriais em Texto

**Prioridade:** Won't (W) | <strong>Feature:</strong> [F06](../10-feature-list/feature-list-geral.md#f06) | <strong>Iteração:</strong> — | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve permitir a visualização de tutoriais em formato textual.

#### Como ser implementado
<strong>Removido do Escopo.</strong> Uso de parser Markdown no React Native.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf14"></a> ❌ RF14: Reproduzir Tutoriais em Vídeo

**Prioridade:** Won't (W) | <strong>Feature:</strong> [F06](../10-feature-list/feature-list-geral.md#f06) | <strong>Iteração:</strong> — | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve permitir a reprodução de tutoriais em formato de vídeo.

#### Como ser implementado
<strong>Removido do Escopo.</strong> Uso de <code>expo-av</code>.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf15"></a> ❌ RF15: Expandir Explicação de Tópico em Dúvida

**Prioridade:** Won't (W) | <strong>Feature:</strong> [F06](../10-feature-list/feature-list-geral.md#f06) | <strong>Iteração:</strong> — | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve permitir que o estudante expanda a explicação de um tópico em dúvida.

#### Como ser implementado
<strong>Removido do Escopo.</strong> Componente Accordion.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf16"></a> ✅ RF16: Consultar Grade Horária e Ensalamento

**Prioridade:** Must (M) | <strong>Feature:</strong> [F07](../10-feature-list/feature-list-geral.md#f07) | <strong>Iteração:</strong> [I1](../06-cronograma/index.md#i1) | <strong>MVP:</strong> ✅

#### O que deve ser feito
O sistema deve permitir a consulta à grade horária do estudante, incluindo os locais das aulas e das provas (ensalamento).

#### Como ser implementado
Telas em formato de calendário (week view) que recuperam os dados da tabela SQLite de turmas. As informações de ensalamento podem ser complementadas caso o sistema consiga extrair o formato de sala (BSB, ICC, etc).

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf17"></a> ✅ RF17: Coletar Dados de Aulas Diariamente via SIGAA

**Prioridade:** Should (S) | <strong>Feature:</strong> [F08](../10-feature-list/feature-list-geral.md#f08) | <strong>Iteração:</strong> [I2](../06-cronograma/index.md#i2) | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve coletar diariamente, a partir da plataforma SIGAA, os dados referentes às aulas do estudante.

#### Como ser implementado
Criar rotinas em background (`expo-task-manager` / `expo-background-fetch`) que disparem requisições de web scraping ou integração com um backend customizado que realize o login fantasma no SIGAA e recupere as aulas do dia.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf18"></a> ✅ RF18: Coletar Dados do Calendário Acadêmico Semanalmente

**Prioridade:** Should (S) | <strong>Feature:</strong> [F08](../10-feature-list/feature-list-geral.md#f08) | <strong>Iteração:</strong> [I2](../06-cronograma/index.md#i2) | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve coletar semanalmente os dados das aulas a partir do calendário acadêmico oficial da universidade.

#### Como ser implementado
Consumir endpoint exposto por backend próprio contendo as datas chave (início, fim, feriados) ou injetar como dado estático em atualizações Over-The-Air (EAS Update).

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf19"></a> ✅ RF19: Atualizar Informações de Disciplinas Matriculadas

**Prioridade:** Should (S) | <strong>Feature:</strong> [F08](../10-feature-list/feature-list-geral.md#f08) | <strong>Iteração:</strong> [I2](../06-cronograma/index.md#i2) | <strong>MVP:</strong> Não

#### O que deve ser feito
O sistema deve atualizar diariamente as informações das disciplinas em que o estudante está matriculado, com base nos dados extraídos do SIGAA.

#### Como ser implementado
Depende diretamente da resolução do RF17 (Web scraping ou API SIGAA). Após a coleta, sobrescrever ou dar merge nos dados do SQLite (atualizando faltas, notas parciais ou locais de aula que mudaram).

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf20"></a> ✅ RF20: Enviar Documentos Oficiais

**Prioridade:** Must (M) | <strong>Feature:</strong> [F09](../10-feature-list/feature-list-geral.md#f09) | <strong>Iteração:</strong> [I1](../06-cronograma/index.md#i1) | <strong>MVP:</strong> ✅

#### O que deve ser feito
O sistema deve permitir que o estudante envie e anexe documentos oficiais à sua conta no aplicativo para uso nas funcionalidades disponíveis.

#### Como ser implementado
Uso de <code>expo-document-picker</code> para selecionar PDFs locais. Em seguida, os arquivos devem ser processados (se forem históricos) ou apenas renomeados e classificados pelo usuário.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf21"></a> ✅ RF21: Armazenar Documentos Oficiais para Acesso Offline

**Prioridade:** Must (M) | <strong>Feature:</strong> [F09](../10-feature-list/feature-list-geral.md#f09) | <strong>Iteração:</strong> [I1](../06-cronograma/index.md#i1) | <strong>MVP:</strong> ✅

#### O que deve ser feito
O sistema deve centralizar os documentos oficiais da universidade, disponibilizando-os para acesso rápido e sem necessidade de conexão com a internet.

#### Como ser implementado
Salvar os PDFs físicos no diretório local seguro com <code>expo-file-system</code> e persistir os metadados (caminho, nome, data) no SQLite para indexação, busca e listagem em tela sem conexão de internet.

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf22"></a> ✅ RF22: Exibir Fluxo de Onboarding para o SIGAA

**Prioridade:** Must (M) | <strong>Feature:</strong> [F05](../10-feature-list/feature-list-geral.md#f05) | <strong>Iteração:</strong> [I3](../06-cronograma/index.md#i3) | <strong>MVP:</strong> ✅

#### O que deve ser feito
O sistema deve oferecer um fluxo guiado e tutorial de acolhimento para orientar o estudante no uso da plataforma oficial SIGAA.

#### Como ser implementado
Utilizar um fluxo de telas (Intro Slider ou modais de tutorial interativo) ensinando as tarefas cruciais da universidade, podendo envolver dicas persistidas via <code>AsyncStorage</code> para exibir apenas no primeiro acesso (Onboarding).

</article>

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" markdown="1">

### <a id="rf23"></a> ✅ RF23: Exibir Fluxo de Onboarding para o Aprender 3

**Prioridade:** Must (M) | <strong>Feature:</strong> [F05](../10-feature-list/feature-list-geral.md#f05) | <strong>Iteração:</strong> [I3](../06-cronograma/index.md#i3) | <strong>MVP:</strong> ✅

#### O que deve ser feito
O sistema deve oferecer um fluxo guiado e tutorial de acolhimento para orientar o estudante no uso da plataforma oficial Aprender 3.

#### Como ser implementado
Módulo análogo ao RF22, focando em onde achar matérias, fóruns e envios de atividade. O conteúdo deve ser resumido e os cartões visuais facilmente deslizáveis (Carousel).

</article>

</div>
