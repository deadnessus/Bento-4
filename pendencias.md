# Pendências do Caçador de Monstros

O que foi aprovado com recomendação e ainda pode melhorar.
- **Visual 3D:** o revisor 3D (`.claude/agents/revisor-3d.md`) atualiza esta parte quando o veredito é APROVADO COM RECOMENDAÇÕES.
- **Gravidade "importante":** um jogador perceberia.
- **Gravidade "menor":** detalhe que quase não aparece no jogo.

Quando alguém corrige um item, o revisor confere na foto e o move para "Resolvidas".
O que já passou pelo revisor 3D está no [`revisoes-3d.md`](revisoes-3d.md).

## Visual 3D

### Abertas

#### R-004 · Escorpião: as pinças ainda não aparecem na foto
- **Gravidade:** menor (era "importante" na rodada 1 da revisão geral; a maior parte foi resolvida)
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1). Conferido de novo em dc789e4, 26/11/2026 (rodada 2), em 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1), e em 73fc144, 27/11/2026 (mesma mudança, rodada 2, a última).
- **Cena e quadro:** monstros-2 (escorpião gigante).
- **Já resolvido:** na rodada 2, a aranha ganhou as 8 pernas dobradas até o chão e o escorpião passou a parecer escorpião (corpo achatado, pernas até o chão, cauda que sobe e curva para a frente). Em 5cdf61b: as bolinhas da cauda ficam encostadas até a ponta (sem vãos), o ferrão ficou maior e amarelo-claro e dá para ver no alto da cauda, e as placas das costas aparecem.
- **O que ainda está errado e o que deveria ser:** as pinças com duas pontas **continuam não conferidas**. Em 73fc144 o escorpião ganhou um `olhar` próprio (0,5), mas ele continua aparecendo quase de lado: ele é o último da fila, bem à direita, e a câmera fica no meio, então a perspectiva soma mais uns 40 graus. As duas pontas de cada pinça ficam uma atrás da outra (parece uma ponta só). Deveria: o escorpião virado de verdade para a câmera (de frente ou em 3/4), para dar para ver as duas pontas abertas.
- **Onde mexer:** `src/main.js`, `iniciarFotos`, `galeria`: hoje `olhar: t.cauda ? 0.5 : ...`. Para quem está na ponta direita, virar para a câmera é um número **negativo**: a câmera fica mais ou menos na direção -0,7 a partir do escorpião. Algo como `t.cauda ? -0.35 : ...` (ou calcular o ângulo até a câmera, `Math.atan2(0 - x, camZ - z)`, e somar uns 0,35). O desenho das pinças (`construirMonstro`, parte da `'aranha'` com `esc`) parece certo no código.

#### R-008 · Fotos: a explosão laranja do canhão quase não aparece
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1). Conferido de novo em dc789e4, 26/11/2026 (rodada 2), em 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1), e em 73fc144, 27/11/2026 (mesma mudança, rodada 2, a última).
- **Cena e quadro:** torres, quadros 1 a 5.
- **Já resolvido:** na rodada 2, a cena `ceu` mostrou o degradê do céu, as nuvens e as montanhas; a cena `flecha-de-lado` mostrou a flecha voando deitada, com a ponta de ferro na frente e as penas vermelhas atrás; na cena `torres`, a bala de canhão aparece saindo do cano, com o clarão e a fumaça. Em 5cdf61b: a **bola do sol** aparece inteira na foto `ceu`. Em 73fc144: na cena `flecha-de-lado` o **javali aparece inteiro**, e no quadro 5, quando a flecha chega, ele pisca de branco e solta faísca no focinho; na cena `torres`, com a câmera do outro lado, o lugar do impacto agora aparece (a nuvem de fumaça cinza em volta do zumbi, quadros 2 a 5).
- **O que ainda está errado e o que deveria ser:** a parte **laranja** da explosão do canhão quase não se vê: só uns pontinhos amarelos, pequenos, no quadro 2. De longe, a explosão parece só fumaça. Deveria: um clarão laranja que dê para ver, pelo menos num quadro.
- **Onde mexer:** se for só a foto: `tests/fotos-3d.cjs`, cena `torres`, `espera` um pouco menor (0,5) e `passo` menor (0,05), para pegar o começo da explosão. Se for o jogo (o mais provável, porque as faíscas somem rápido e são pequenas de longe): `src/main.js`, parte "canhão: explode e acerta todos em volta" (`faiscas(px, tp.y, pz, 0xffa53c, 26, 6)`): faíscas maiores, ou acrescentar um brilho laranja grande que cresce e some em uns 0,2 s (com `fxBrilho.emitir`).

#### R-010 · Ciclope ainda com anéis escuros na pele
- **Gravidade:** menor
- **Desde:** 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1). Conferido de novo em 73fc144, 27/11/2026 (rodada 2, a última).
- **Cena e quadro:** monstros-3 (ciclope); andar-pernas (ciclope, quadros 1 a 5).
- **Já resolvido:** em 73fc144, o escorpião ficou com a **casca lisa**, com as placas das costas à mostra, sem pelo (só as bolinhas da cauda, bem de perto, ainda parecem um pouco fofas; não precisa mudar).
- **O que ainda está errado e o que deveria ser:** no ciclope as manchas ficaram mais claras, mas de perto ainda aparecem **anéis escuros** no corpo e na cabeça, que lembram as rosetas de uma onça. Deveria: pele quase lisa, com manchas bem de leve ou nenhuma.
- **Onde mexer:** `src/main.js`, `texturaDoTipo` e a linha do `forcaRel` em `construirMonstro`. Causa provável: o anel vem do relevo (o "mapa de relevo" das manchas redondas), que, com a luz em degraus do material desenho, vira uma borda escura em volta de cada mancha. Para o ciclope (`tipo.umOlho`), tirar o relevo (passar `0` como força em `texturizar`) ou não usar textura (`return null`).

#### R-011 · Dragãozinho visto de lado: a asa vira uma "vela" fina e alta
- **Gravidade:** menor
- **Desde:** 73fc144, 27/11/2026 (mudança de texturas, formas e luz, rodada 2, a última; achado na cena nova `voar`).
- **Cena e quadro:** voar, quadros 1 a 5 (dragãozinho).
- **O que está errado e o que deveria ser:** com a correção da R-009, a asa ficou em pé, virada para a frente, e de frente ficou ótima. Mas vista bem de lado, a mesma asa aparece quase de quina: nos quadros 1 e 2 é uma tira vermelha fina e alta, que sai pelo alto da foto (parece um mastro com bandeira); nos quadros 3 a 5 é um palito com uma bolinha vermelha na ponta (a ponta do osso), como uma antena. De lado, aparece menos da metade da asa de antes. Em 3/4 (o dragão amigo, na cena ajudantes) está bom. Deveria: a asa dar para ver também de lado, que é como se vê o dragão amigo voando ao seu lado ou um dragão fazendo a curva.
- **Onde mexer:** `src/main.js`, `construirMonstro`, parte do `'morcego'`/`'dragao'`: `incl.rotation.x = 0.45` (quanto a asa inclina para a frente). Uma inclinação maior, perto de 0,75 a 0,8 (uns 45 graus), deixa a asa à mostra de frente **e** de lado. Na foto `voar`, afastar um pouco a câmera ou subir a mira (`desfile`, `camLivre`), para a ponta da asa do dragão caber no quadro.

#### R-012 · Zumbi e lobisomem: o pé nunca pisa na frente do corpo
- **Gravidade:** importante
- **Desde:** 73fc144, 27/11/2026 (mudança de movimentos dos bichos, rodada 1).
- **Cena e quadro:** andar-pernas, quadros 1 a 5 (zumbi e lobisomem).
- **O que está errado e o que deveria ser:** vistos de lado, o pé que vai para a frente para no máximo embaixo do quadril, e o outro vai bem para trás (no lobisomem, o pé de trás chega a subir quase na altura do joelho). Os pés nunca pisam à frente do corpo: parece que eles caem para a frente arrastando as pernas para trás, em vez de dar o passo. No vampiro, no demônio, no ciclope e no yeti o passo está certo (um pé na frente, outro atrás). Deveria: o zumbi e o lobisomem continuarem inclinados para a frente, mas com o pé da frente pisando um pouco à frente do corpo.
- **Onde mexer:** `src/main.js`, `animarMonstro`, parte de duas pernas: `pe.rotation.x = -Math.sin(ph) * ampP * arrasta * w + lean;`. As pernas ficam dentro do `balanco`, que já inclina o corpo inteiro com `bal.rotation.x = lean`. Somar `+ lean` na perna joga a perna **ainda mais** para trás (fica o dobro: no lobisomem, uns 32 graus para trás em média; no zumbi, uns 17). Trocar por `- lean` (aí a perna fica em pé com o corpo inclinado, que é o que o comentário do código pretende). Nos outros o `lean` é bem pequeno, por isso não aparece.

#### R-013 · Zumbi: no ataque, levanta os braços para o alto
- **Gravidade:** menor
- **Desde:** 73fc144, 27/11/2026 (mudança de movimentos dos bichos, rodada 1).
- **Cena e quadro:** ataques, quadros 2 a 4 (zumbi).
- **O que está errado e o que deveria ser:** no ataque, o zumbi gira os dois braços até ficarem em pé, acima da cabeça (parece "mãos ao alto"), em vez de avançar com os braços esticados para a frente, para agarrar. Deveria: os braços continuarem para a frente (no máximo subindo um pouco e descendo) e o corpo avançar.
- **Onde mexer:** `src/main.js`, `animarMonstro`, parte de duas pernas: `b.rotation.x = Math.sin(ph) * ampB * w - at * 1.7 + ...`. Os braços do zumbi já são feitos esticados para a frente, e o ataque soma mais 1,7 (uns 97 graus) para cima, igual aos outros. Para o zumbi (`zumbi`), usar um giro pequeno (algo perto de `- at * 0.4`) e deixar o avanço do corpo (`bal.position.z`) fazer o bote.

#### R-014 · Fotos de movimento: o que não deu para conferir (ajustar as cenas)
- **Gravidade:** menor
- **Desde:** 73fc144, 27/11/2026 (mudança de movimentos dos bichos, rodada 1).
- **Cena e quadro:** andar-outros, quadros 1 a 5; andar-patas e andar-pernas (urso e zumbi); não há cena para a geleca e para alguns ataques.
- **O que está errado e o que deveria ser:** não conferido: (1) a **cobra serpenteando**: o "S" é de um lado para o outro, no chão, e vista de lado a cobra parece reta nos 5 quadros; além disso, a cabeça e as pinças do escorpião ficam por cima do rabo da cobra (um bicho encostado no outro); (2) os **passos duros do golem de lava**: as pernas dele ficam escondidas na grama (o balanço do corpo aparece); (3) a **ginga do urso** e o **cambalear do zumbi** são de um lado para o outro e, de lado, quase não aparecem; (4) não há foto da **geleca andando aos pulos**, nem do **escorpião atacando com a cauda**, nem do ataque do morcego, do dragão e do fantasma. Deveria: um desfile visto de frente, um pouco do alto (em 3/4), para ver o "S" da cobra e a ginga; mais espaço entre a cobra e o escorpião; a geleca no desfile; o escorpião na cena `ataques`.
- **Onde mexer:** `src/main.js`, `iniciarFotos`: em `desfile`, dar mais espaço para os bichos compridos (cobra e escorpião) e criar uma versão com a câmera mais alta ou de frente; em `'ataques'`, incluir o escorpião (e, se couber, o morcego); e a cena nova também em `tests/fotos-3d.cjs`.

### Resolvidas

#### R-001 · Arco: a flecha encaixada ficava escondida atrás do braço
- **Gravidade:** importante na rodada 1 da revisão geral; menor na rodada 2
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1)
- **Resolvida em:** 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1). Conferido em armas-1, quadro 5, e tiro-arco, quadro 5: a flecha encaixada fica em cima da mão, com as penas vermelhas perto da corda e a ponta de ferro aparecendo à frente do arco, apontando para a mira. No tiro (tiro-arco, quadros 1 a 4) o arco fica sem flecha, e no quadro 5 aparece uma nova.

#### R-002 · Cobra e dragões (o dragãozinho e o dragão amigo) estavam sem olhos
- **Gravidade:** importante
- **Desde:** 4afa7d1, 26/11/2026 (rodada 1)
- **Resolvida em:** dc789e4, 26/11/2026 (rodada 2). Conferido em monstros-1 (a cobra tem os dois olhos para fora da cabeça, com o brilhinho, e a língua vermelha), monstros-3 e inicio (o dragãozinho tem os olhos na frente da cabeça) e ajudantes (o dragão amigo tem os olhos e um rabo pontudo, e não parece mais passarinho).

#### R-003 · No celular em pé, a espada passava por cima do monstro
- **Gravidade:** importante
- **Desde:** 4afa7d1, 26/11/2026 (rodada 1)
- **Resolvida em:** dc789e4, 26/11/2026 (rodada 2). Conferido na cena celular: a espada ficou menor, mais baixa e mais em pé, inteira dentro da tela e longe da mira; não cobre mais o rosto nem o corpo do vampiro (só a pontinha encosta na beirada do braço dele). No computador (primeira-pessoa) continua igual.

#### R-005 · Brilhos perdiam a cor em cima da grama (o gelo ficava verde e o anel do chefão branco-rosado)
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (rodada 1)
- **Resolvida em:** dc789e4, 26/11/2026 (rodada 2). Conferido em magia (a bola de gelo e o rastro ficam azuis), armas-2, quadro 2 (o cristal da varinha fica azul), defesas e torres (o cristal da torre de gelo fica azul, e as bolas de gelo voam azuis) e chefe (o anel no chão fica roxo de verdade).

#### R-006 · A besta da torre de flechas ficava escondida atrás do parapeito
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (rodada 1)
- **Resolvida em:** dc789e4, 26/11/2026 (rodada 2). Conferido em defesas, primeira-pessoa e torres: a besta fica acima da grade, embaixo do telhado, e dá para ver ela virada para o lado dos monstros.

#### R-007 · O rastro do golpe aparecia inteiro antes da espada passar
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (rodada 1)
- **Resolvida em:** dc789e4, 26/11/2026 (rodada 2). Conferido na cena golpe: no quadro 2 o rastro vai só do alto à direita até perto da ponta da espada; no quadro 3, com a espada já embaixo, a meia-lua fica completa. O rastro vem atrás da lâmina.

#### R-009 · Asas do morcego e dos dragões sumiam quando vistos de frente
- **Gravidade:** importante
- **Desde:** 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1)
- **Resolvida em:** 73fc144, 27/11/2026 (mesma mudança, rodada 2, a última). Conferido em monstros-1, primeira-pessoa, celular e graficos-baixo (o morcego, de frente, mostra as duas asas escuras abertas em "V", com o recorte em ondas e o osso na borda de cima), em inicio e monstros-3 (o dragãozinho tem duas asas vermelhas grandes em "V", com a borda ondulada, e não parece mais ter antenas), em ajudantes (o dragão amigo, em 3/4, mostra a asa inteira) e em voar (as asas batem para cima e para baixo). Visto bem de lado, o dragão ganhou outra recomendação (R-011).
