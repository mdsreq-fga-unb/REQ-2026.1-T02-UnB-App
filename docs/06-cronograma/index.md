# 6. Cronograma Detalhado (Iterações)

> 📌 **Visão Geral e Rastreabilidade:** A tabela unificada do cronograma com datas, status e responsáveis está na **[Página Inicial (Home)](../index.md)**. Esta página destina-se ao detalhamento profundo de cada iteração, contendo seus Critérios de Aceite, DoR, DoD e Protótipos.

---

<div class="iterations-container" style="display: flex; flex-direction: column; gap: 2rem;">

<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <h2 style="margin-top: 0;"><a id="i1"></a> 🟠 Iteração 1: Documentos e Grade (F09, F07)</h2>
  
  <h3>Critérios de Aceite</h3>
  <ul>
    <li>O usuário deve conseguir anexar um PDF pelo celular.</li>
    <li>O aplicativo deve processar esse PDF offline.</li>
    <li>A grade horária deve ser renderizada corretamente em formato de calendário.</li>
  </ul>

  <h3>DoR (Definition of Ready)</h3>
  <ul>
    <li>Protótipos de alta fidelidade aprovados.</li>
    <li>ADR-02 (Uso de SQLite) definida e documentada.</li>
  </ul>

  <h3>DoD (Definition of Done)</h3>
  <ul>
    <li>Código no repositório (branch `feat/entregaUnidade3`).</li>
    <li>Testes de parseamento passando.</li>
    <li>App funcional no Expo Go.</li>
  </ul>

  <h3>Protótipos / Evidências</h3>
  <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
    <img src="../../assets/evidencias/tela-documentos.png" alt="Tela de Documentos" style="max-height: 250px; border-radius: 8px;" />
    <img src="../../assets/evidencias/tela-inicial.png" alt="Tela de Grade" style="max-height: 250px; border-radius: 8px;" />
  </div>
  <p>🔗 <a href="https://drive.google.com/file/d/1O405tSUfyaiEHS8nvXzuDSnSpt-c87WK/view" target="_blank">Vídeo do Protótipo Funcional</a></p>
</article>


<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <h2 style="margin-top: 0;"><a id="i2"></a> 🟡 Iteração 2: Automação e SIGAA (F04, F08)</h2>
  
  <h3>Critérios de Aceite</h3>
  <ul>
    <li>Dados do SIGAA devem ser extraídos ou mockados com sucesso.</li>
    <li>O parser do Passe Livre Estudantil deve funcionar com 90% de precisão.</li>
  </ul>

  <h3>DoR (Definition of Ready)</h3>
  <ul>
    <li>Credenciais de homologação do SIGAA disponibilizadas (Bloqueio atual).</li>
    <li>Regex do Passe Livre homologado.</li>
  </ul>

  <h3>DoD (Definition of Done)</h3>
  <ul>
    <li>Notificações em background testadas no celular físico.</li>
    <li>Atualizações do calendário ocorrendo sem quebrar a UI.</li>
  </ul>

  <h3>Protótipos / Evidências</h3>
  <p><em>Iteração bloqueada (F08) ou em andamento (F04). Sem protótipos finais aprovados para exibição ainda.</em></p>
</article>


<article class="card" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
  <h2 style="margin-top: 0;"><a id="i3"></a> 🟡 Iteração 3: Onboarding e Carteirinha (F05, F02, F03)</h2>

  <h3>Critérios de Aceite</h3>
  <ul>
    <li>Novos usuários devem ver o slider educativo antes da Home.</li>
    <li>Telas de tutorial não devem ser mostradas novamente no segundo acesso.</li>
    <li>QR Code gerado offline deve ser aceito nas catracas da BCE.</li>
    <li>Foto e dados do aluno devem aparecer nítidos na tela.</li>
  </ul>

  <h3>DoR (Definition of Ready)</h3>
  <ul>
    <li>Copy (textos) dos tutoriais escritos e validados com a equipe de usabilidade (60+).</li>
    <li>Assets visuais e ícones exportados em SVG.</li>
    <li>Padrão de criptografia do QR Code da UnB documentado.</li>
    <li>Foto do usuário disponível localmente no cache do SQLite.</li>
  </ul>

  <h3>DoD (Definition of Done)</h3>
  <ul>
    <li>Animações nativas rodando a 60fps constantes.</li>
    <li>Critérios WCAG 2.1 AA atendidos (contraste e foco).</li>
    <li>Acesso físico simulado ou testado na BCE.</li>
    <li>Layout responsivo garantido para telas menores.</li>
  </ul>

  <h3>Protótipos / Evidências</h3>
  <img src="../../assets/evidencias/tela-inicial.png" alt="Tela Inicial" style="max-height: 250px; border-radius: 8px;" />
  <p>🔗 <a href="https://drive.google.com/file/d/1J5pvcoWDN1ZcXoa7kzQK8vBnkqCwdqLL/view" target="_blank">Vídeo de Navegação Inicial</a></p>
  <p><em>Carteirinha/QRCode: branches em andamento. Protótipos em fase final de validação visual.</em></p>
</article>