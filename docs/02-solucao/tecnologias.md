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
