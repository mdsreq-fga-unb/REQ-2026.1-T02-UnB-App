# 2.4 Tecnologias a Serem Utilizadas

O UnB App será um aplicativo mobile que funcionará em ambas as plataformas (Android e iOS). Ele será desenvolvido usando TypeScript com as bibliotecas React Native e Expo, priorizando automatização e simplicidade no processo de implementação para as duas plataformas.

Na camada de dados, serão utilizadas ferramentas do ecossistema Expo, como Expo SQLite, para salvamento local de dados no dispositivo do usuário, viabilizando funcionalidades essenciais em modo offline, como consulta de grade horária e carteirinha digital.

## Stack principal

| Camada | Tecnologia | Finalidade |
|--------|------------|------------|
| Linguagem | TypeScript | Tipagem estática e maior confiabilidade no desenvolvimento |
| Frontend mobile | React Native | Construção de interface nativa multiplataforma |
| Plataforma de desenvolvimento | Expo | Aceleração do desenvolvimento, build e distribuição |
| Dados locais | Expo SQLite | Persistência local para recursos offline (grade e carteirinha) |

## Justificativa das Escolhas

A escolha do **React Native** aliado ao **Expo** foi baseada em diversos fatores que otimizam o tempo de desenvolvimento e a qualidade do produto final:

- **Código base único (Cross-platform):** O React Native permite a escrita de um único código-fonte em TypeScript que é executado de forma nativa tanto no Android quanto no iOS. Isso reduz o esforço e tempo de desenvolvimento da equipe, garantindo que o aplicativo evolua com as mesmas funcionalidades em ambas as plataformas simultaneamente.
- **Benefícios do ecossistema React Native:** A ferramenta oferece uma performance e responsividade próximas a de aplicações puramente nativas, suporte ao *Fast Refresh* (que aplica as alterações de código instantaneamente na tela durante o desenvolvimento), e conta com uma comunidade vasta e consolidada, facilitando a resolução de problemas e a adoção de bibliotecas robustas.
- **Facilidade de testes físicos com Expo:** O Expo reduz significativamente a complexidade de configuração inicial do ambiente de desenvolvimento. Através de comandos simples de terminal da CLI do Expo (como `npx expo start`), a ferramenta gera um *QR Code*. Com o aplicativo **Expo Go** instalado, a equipe pode escanear esse código e testar a aplicação diretamente em dispositivos físicos reais de forma rápida e prática, agilizando o ciclo de avaliação e testes da interface sem a necessidade de configurar emuladores pesados ou cabos.
- **Persistência de dados com Expo SQLite:** Para viabilizar os recursos offline da aplicação (como acesso à grade horária e carteirinha digital), o Expo SQLite foi escolhido por ser uma das poucas opções amplamente consolidadas e integradas no ecossistema do Expo e React Native que oferecem salvamento estruturado de dados e arquivos localmente direto no dispositivo do usuário com alta confiabilidade.
