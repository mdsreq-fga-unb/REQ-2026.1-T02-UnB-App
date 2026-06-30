import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Network from 'expo-network';

const GHOST_ROBOT_SCRIPT = `
  (function() {
    try {
      // verifica se caiu na tela de Login (Sessão Expirada)
      if (document.body.innerHTML.includes('Entrar no Sistema') || document.querySelector('input[name="user.login"]')) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'AUTH_REQUIRED' }));
        return;
      }

      // Procura o painel principal de turmas
      const painelTurmas = document.getElementById('turmas-portal');
      
      if (painelTurmas) {
        const aulasExtraidas = [];
        const linhas = painelTurmas.querySelectorAll('tbody tr');

        linhas.forEach(linha => {
          const nomeEl = linha.querySelector('td.descricao a');
          const tdInfo = linha.querySelectorAll('td.info');

          if (nomeEl && tdInfo.length >= 2) {
            let nome = nomeEl.innerText.trim();
            let local = tdInfo[0].innerText.trim();
            let horarioTexto = tdInfo[1].innerText.trim();
            let horarioLimpo = horarioTexto.split('(')[0].trim();

            aulasExtraidas.push({ 
              nome: nome, 
              local: local, 
              horario: horarioLimpo 
            });
          }
        });

        if(aulasExtraidas.length > 0) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            type: 'SYNC_SUCCESS', 
            payload: aulasExtraidas 
          }));
        } else {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', error: 'Tabela encontrada, mas vazia.' }));
        }

      } else {
        // Força a navegação para a home caso esteja noutro ecrã do SIGAA
        const btnPortal = document.querySelector('a[href*="/sigaa/portais/discente/discente.jsf"]');
        if (btnPortal) {
           btnPortal.click();
        } else {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', error: 'Painel turmas-portal não encontrado.' }));
        }
      }
    } catch (e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', error: e.message }));
    }
  })();
  true;
`;

export function SigaaSync() {
  const [shouldSync, setShouldSync] = useState(false);
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    async function checkNetworkAndTrigger() {
      const networkState = await Network.getNetworkStateAsync();
      if (networkState.isConnected && networkState.isInternetReachable) {
        setShouldSync(true);
      }
    }
    checkNetworkAndTrigger();
  }, []);

  const handleWebViewMessage = async (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === 'AUTH_REQUIRED') {
      console.log('Sessão do SIGAA expirou. Por favor, faça o login.');
    } 
    
    if (data.type === 'SYNC_SUCCESS') {
      // Imprime o JSON no terminal 
      console.log('Dados pegos!');
      console.log(JSON.stringify(data.payload, null, 2));
      
      // depois implementar a parte de armazenar/atualizar o banco
    }

    if (data.type === 'ERROR') {
      console.log('Erro no Script de Extração:', data.error);
    }
  };

  if (!shouldSync) return null;

  return (
    // View 
    <View style={{ width: 0, height: 0, opacity: 0 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://sig.unb.br/sigaa/portais/discente/discente.jsf' }}
        injectedJavaScript={GHOST_ROBOT_SCRIPT}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        sharedCookiesEnabled={true} 
        thirdPartyCookiesEnabled={true}
      />
    </View>
  );
}