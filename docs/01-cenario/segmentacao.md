# 1.7 Segmentação de Clientes

A plataforma atende clientes de várias faixas etárias. No entanto, há um grupo com características específicas que demandam maior atenção: os estudantes da faixa etária 60+ da Universidade de Brasília, grupo que está crescendo após a adição do vestibular 60+. Esse público emergente possui necessidades distintas no uso de sistemas digitais, com ênfase em usabilidade, acessibilidade e familiaridade com tecnologia.

## Perfis identificados

=== "Usuários letrados em tecnologia"
    São indivíduos que já possuem certa experiência com tecnologia, seja por atuação profissional na área ou por uso frequente no dia a dia.

    - **Comportamento:** conseguem navegar pelo SIGAA com menos dificuldades, mas relatam incômodo com excesso de informações, rótulos de menu que não correspondem à ação esperada, fluxos confusos e necessidade de uso de zoom para leitura.
    - **Necessidades principais:** fluxos com número de etapas entre a tela inicial e a informação desejada (no máximo, 3 passos/telas visíveis, conforme RNF21), agrupamento de informações correlacionadas e tamanho de fonte mínimo de 18sp.

=== "Usuários intermediários (adaptáveis)"
    São indivíduos que possuem alguma familiaridade com tecnologia, mas não dominam totalmente sistemas mais complexos como o SIGAA.

    - **Comportamento:** realizam tarefas básicas, porém enfrentam dificuldades quando a ação esperada não está claramente indicada na tela ou quando o fluxo exige interpretar termos técnicos da interface.
    - **Necessidades principais:** indicações visíveis de qual passo executar a seguir, redução de situações onde o usuário tenta uma ação errada antes de encontrar a correta, e menor dependência de suporte externo.

=== "Usuários com pouca familiaridade tecnológica"
    São indivíduos com alto grau de dificuldade em sistemas computacionais devido ao pouco contato com tecnologia ao longo da vida.

    - **Comportamento:** dificuldade para realizar tarefas como login, localização de funcionalidades e interpretação de informações na tela.
    - **Necessidades principais:** fluxos com o menor número possível de passos e telas, apoio guiado passo a passo e capacidade de concluir tarefas sem auxílio constante de terceiros.

=== "Usuários com barreiras de acessibilidade"
    Além da baixa familiaridade tecnológica, esse grupo enfrenta limitações relacionadas ao envelhecimento, como dificuldades visuais, redução da coordenação motora e maior esforço cognitivo para processar informações.

    - **Comportamento:** sofrem impacto direto com letras pequenas (obrigando uso de zoom), razão de contraste entre texto e fundo abaixo de 4,5:1, excesso de informação por tela e fluxos em que o próximo elemento a ser acionado não está identificado visualmente de forma distinta dos demais.
    - **Necessidades principais:** tamanho de fonte mínimo de 18sp; razão de contraste ≥ 4,5:1 (WCAG 2.1 nível AA); uma única ação primária de destaque por tela (conforme RNF21); e alvos de toque com dimensão mínima de 48×48dp (Android Accessibility Guidelines).
