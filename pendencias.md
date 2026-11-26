# Pendências do Caçador de Monstros

O que foi aprovado com recomendação e ainda pode melhorar.
- **Visual 3D:** o revisor 3D (`.claude/agents/revisor-3d.md`) atualiza esta parte quando o veredito é APROVADO COM RECOMENDAÇÕES.
- **Gravidade "importante":** um jogador perceberia.
- **Gravidade "menor":** detalhe que quase não aparece no jogo.

Quando alguém corrige um item, o revisor confere na foto e o move para "Resolvidas".
O que já passou pelo revisor 3D está no [`revisoes-3d.md`](revisoes-3d.md).

## Visual 3D

### Abertas

#### R-001 · O arco fica solto no ar, sem mão, e virado de lado
- **Gravidade:** importante
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1)
- **Cena e quadro:** armas-1, quadro 5; tiro-arco, quadros 1 a 5.
- **O que está errado e o que deveria ser:** o arco aparece à esquerda do meio da tela, sem braço e sem mão segurando (parece flutuar). Ele está virado de lado: a curva aponta para a esquerda e a flecha encaixada aponta para a esquerda, e não para a mira. Na hora do tiro, a flecha sai do meio da tela (dos olhos do jogador), e não do arco. Deveria: uma mão segurando o cabo de couro do arco; a flecha encaixada apontando para a mira (para a frente); a curva continua visível se o arco for inclinado de lado, sem girar a flecha para fora; e a flecha que voa deveria parecer sair do arco.
- **Onde mexer:** `src/main.js`, `montarArmaNaMao`, parte do `'arco'`: `braco.visible = a.modelo !== 'arco'` esconde o braço e a mão; `rot = [0.04, 0.55, 0.2]` gira a flecha uns 30° para a esquerda (o 0.55 deveria ficar perto de 0, e a curva pode aparecer inclinando com o terceiro número); `mao.position.set(-0.42, 0.24, -0.3)` põe o arco longe da mão. Ponto de saída da flecha: `atacar`, variável `origem`.

#### R-002 · Cobra e dragões (o dragãozinho e o dragão amigo) estão sem olhos
- **Gravidade:** importante
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1)
- **Cena e quadro:** monstros-1 (cobra), monstros-3 (dragãozinho), ajudantes (dragão amigo), inicio (dragãozinho da vitrine).
- **O que está errado e o que deveria ser:** os olhos foram colocados dentro da cabeça e ficam escondidos. A cobra parece uma lagarta de bolinhas verdes sem rosto; o dragão parece um passarinho vermelho (ou verde), só com uns pontinhos brancos aparecendo. Deveria: os dois olhos com o brilhinho na frente da cabeça, metade para fora, como nos outros monstros.
- **Onde mexer:** `src/main.js`, `fazerMonstro`. Cobra: `olhos(g, r * 1.45, r * 1.6, r, olhoBrilho)`, levar os olhos para a frente (z perto de `r * 1.85`, altura perto de `r * 1.5`). Dragão: `olhosD.position.set(0, r * 0.55, r * 1.25)`, levar para a frente (z perto de `r * 1.45`). Dica de gosto: um rabinho no dragão ajudaria a não parecer passarinho.

#### R-003 · No celular em pé, a espada passa por cima do monstro
- **Gravidade:** importante
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1)
- **Cena e quadro:** celular (foto única).
- **O que está errado e o que deveria ser:** no celular em pé, a mão vem mais para o meio e a lâmina, inclinada para a esquerda, sobe até perto da mira e cobre o rosto e o corpo do vampiro (que está logo à direita da mira). Não cobre a mira em si, mas esconde o monstro que a criança está olhando. No computador está bom. Deveria: no celular em pé, a espada inteira continuar dentro da tela, mas mais baixa e mais encostada na direita, sem passar por cima dos monstros perto da mira.
- **Onde mexer:** `src/main.js`, `ajustar` (`maoBase`, hoje só o lado muda no celular em pé; dá para baixar a altura ou diminuir a arma quando a tela é mais alta que larga) e `montarArmaNaMao` (`rot`, a inclinação da lâmina).

#### R-004 · O escorpião não parece escorpião, e as pernas da aranha ficam retas no ar
- **Gravidade:** importante
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1)
- **Cena e quadro:** monstros-2 (escorpião gigante); monstros-1, primeira-pessoa e celular (aranha).
- **O que está errado e o que deveria ser:** o escorpião parece uma salsicha laranja deitada: as pernas ficam escondidas dentro do corpo, as pinças são duas tábuas achatadas e a cauda é feita de bolinhas separadas, com buracos entre elas (parecem soltas no ar). Na aranha, as 8 pernas saem retas para os lados, na altura do corpo, sem encostar no chão (de frente parecem 3 ou 4 palitos). Deveria: pernas que descem até o chão (dobradas, como um "V" de cabeça para baixo); pinças com cara de pinça (duas pontas abertas na frente); cauda com as bolinhas encostadas umas nas outras, subindo e curvando até o ferrão.
- **Onde mexer:** `src/main.js`, `fazerMonstro`, parte da `'aranha'` (o escorpião usa a mesma forma, com `cauda: true`): a rotação das pernas (`b.rotation.z = lado * 0.5` com a peça girada `-lado * 0.6` deixa a perna quase deitada), as bolinhas da cauda (5 bolinhas de tamanho `r * 0.22`; mais bolinhas ou maiores) e as pinças (`peca(G.caixa, mat, r * 0.3, r * 0.15, r * 0.6, ...)`).

#### R-005 · Brilhos perdem a cor em cima da grama: o gelo fica verde e o anel do chefão fica branco-rosado
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1)
- **Cena e quadro:** magia (quadros 1 e 2: a bola de gelo parece verde-clara), armas-2 (quadro 2: o cristal da varinha), defesas e torres (o brilho do cristal da torre de gelo), chefe (o anel no chão parece branco com rosa, e não roxo).
- **O que está errado e o que deveria ser:** esses brilhos são "somados" à cor de trás. Em cima da grama verde, o azul-claro vira verde-água e o roxo vira quase branco. Deveria: o gelo continuar azul e o anel do chefão continuar roxo, em qualquer fundo.
- **Onde mexer:** `src/main.js`: `spriteMat` e `fazerTiro` (bola de magia), `brilhoSprite` (varinha), `fazerDefesa`, parte da `'torre-gelo'` (brilho do cristal), e `matAura` e `matParedeRoxa` (anel do chefão). Ideias: um azul e um roxo mais fortes (menos claros), menos transparência, ou um miolo com cor normal (sem somar) por baixo do brilho.

#### R-006 · A besta da torre de flechas fica escondida atrás do parapeito
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1)
- **Cena e quadro:** defesas (torre de flechas), torres (quadros 1 a 5), primeira-pessoa.
- **O que está errado e o que deveria ser:** a besta fica na mesma altura da grade de madeira da plataforma, então quase não aparece. Não dá para ver que ela vira para o monstro. Deveria: a besta um pouco acima da grade, para ver ela mirando.
- **Onde mexer:** `src/main.js`, `fazerDefesa`, parte da `'torre-flechas'`: `cabeca.position.y = 2.1` (a grade vai até uns 2,14; algo perto de 2,3 já deixaria a besta à mostra, ajustando `alturaTiro` junto).

#### R-007 · O rastro do golpe aparece inteiro antes da espada passar
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1)
- **Cena e quadro:** golpe, quadro 2.
- **O que está errado e o que deveria ser:** com a espada ainda no meio da descida, a meia-lua branca já aparece toda, até embaixo à esquerda, e a parte mais clara fica justamente onde a espada ainda não chegou. Parece que o rastro vai na frente da espada. Deveria: o rastro ir aparecendo atrás da ponta da lâmina, por onde ela já passou.
- **Onde mexer:** `src/main.js`, `animarArma` (hoje só muda `rastro.material.opacity`); dá para mostrar a meia-lua aos poucos (por exemplo com `rastro.geometry.setDrawRange`), acompanhando a descida.

#### R-008 · Fotos: o que não deu para conferir (ajustar as cenas)
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1)
- **Cena e quadro:** todas as cenas (sol); tiro-arco, quadros 1 a 3 (flecha em voo); torres, quadros 1 a 5 (bala de canhão e explosão laranja).
- **O que está errado e o que deveria ser:** não conferido: (1) o **sol** não aparece em nenhuma foto, porque fica sempre atrás da câmera; (2) a **flecha voando** é vista bem de trás, então não dá para ver se a ponta vai para a frente (pelo código, vai); (3) a **bala de canhão** e a **explosão laranja** caem entre um quadro e outro (só aparecem a fumacinha na boca do canhão e as faíscas no lobo). Deveria: uma foto olhando para o lado do sol (por exemplo na cena `inicio` ou `vista-geral`), uma vista de lado para a flecha, e na cena `torres` quadros mais próximos no tempo (ou começando um pouco antes do tiro do canhão).
- **Onde mexer:** `tests/fotos-3d.cjs` (lista `SCENES`: `espera` e `passo`) e `src/main.js`, `iniciarFotos` (posição da câmera, `camLivre`, nas cenas `tiro-arco`, `torres` e `inicio`/`vista-geral`).

### Resolvidas
Nenhuma.
