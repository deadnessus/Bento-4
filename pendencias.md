# Pendências do Caçador de Monstros

O que foi aprovado com recomendação e ainda pode melhorar.
- **Visual 3D:** o revisor 3D (`.claude/agents/revisor-3d.md`) atualiza esta parte quando o veredito é APROVADO COM RECOMENDAÇÕES.
- **Gravidade "importante":** um jogador perceberia.
- **Gravidade "menor":** detalhe que quase não aparece no jogo.

Quando alguém corrige um item, o revisor confere na foto e o move para "Resolvidas".
O que já passou pelo revisor 3D está no [`revisoes-3d.md`](revisoes-3d.md).

## Visual 3D

### Abertas

#### R-004 · Escorpião: cada pinça ainda parece ter uma ponta só
- **Gravidade:** menor (era "importante" na rodada 1 da revisão geral; a maior parte foi resolvida)
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1). Conferido de novo em dc789e4, 26/11/2026 (rodada 2), em 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1), em 73fc144, 27/11/2026 (mesma mudança, rodada 2, a última), e em ed0190a, 27/11/2026 (conferência das pendências, junto com a rodada 2 dos movimentos).
- **Cena e quadro:** monstros-2 (escorpião gigante); ataques-2, quadros 1 a 4 (escorpião, mais de perto).
- **Já resolvido:** na rodada 2, a aranha ganhou as 8 pernas dobradas até o chão e o escorpião passou a parecer escorpião (corpo achatado, pernas até o chão, cauda que sobe e curva para a frente). Em 5cdf61b: as bolinhas da cauda ficam encostadas até a ponta (sem vãos), o ferrão ficou maior e amarelo-claro e dá para ver no alto da cauda, e as placas das costas aparecem. Em ed0190a: na galeria, o escorpião ficou **virado para a câmera** (em 3/4), com os dois olhos, as **duas pinças à mostra na frente** e a cauda com o ferrão. A parte da foto está resolvida.
- **O que ainda está errado e o que deveria ser:** agora que dá para ver bem, cada pinça aparece como uma bolinha com **uma ponta escura só**, também de perto (ataques-2). As duas pontas ficam tão juntas e finas que se misturam, e a pinça lembra mais um ferrão do que uma pinça aberta. Deveria: as duas pontas de cada pinça separadas, formando um "V" aberto, como uma tesourinha.
- **Onde mexer:** `src/main.js`, `construirMonstro`, parte da `'aranha'` com `esc`, as pinças ("pinças: braço, a mão e as duas pontas abertas"). Hoje as pontas ficam a `k * r * 0.09` do meio, abrem `k * 0.38` e têm grossura `r * 0.085`. Algo como `k * r * 0.15`, abertura `k * 0.6` e grossura `r * 0.11` deve separar as duas pontas.

#### R-014 · Fotos de movimento: a cobra ainda passa por baixo do vizinho no desfile
- **Gravidade:** menor (só nas fotos; não muda o jogo)
- **Desde:** 73fc144, 27/11/2026 (mudança de movimentos dos bichos, rodada 1). Conferido de novo em ed0190a, 27/11/2026 (rodada 2, a última).
- **Cena e quadro:** andar-outros, quadros 1 a 5 (cobra e escorpião); andar-cima, quadros 1 a 5 (geleca e cobra); ataques-2 (nomes embaixo).
- **Já resolvido:** em ed0190a, a cena nova `andar-cima` mostra a **geleca pulando** (sobe nos quadros 1, 3 e 5 e cai amassada e mais larga nos quadros 2 e 4), a **onda da cobra** vista de cima (veja a R-015), as **pernas do golem de lava** dando os passos, o trote do urso e o zumbi balançando. A cena nova `ataques-2` mostra o **escorpião jogando a cauda para a frente** (quadros 2 a 4), o **morcego descendo**, o **dragãozinho avançando** e o **fantasma crescendo** (susto); depois todos voltam.
- **O que ainda está errado e o que deveria ser:** (1) a cobra continua **mais comprida do que o espaço que ganha**: em `andar-outros`, o rabo dela passa por baixo da cabeça, das pinças e das pernas da frente do escorpião (as bolinhas verdes aparecem embaixo dele); em `andar-cima`, o rabo passa por baixo da geleca e sai do outro lado (quadro 5). Deveria: um vão de grama entre o rabo da cobra e o bicho de trás. (2) Em `ataques-2`, os nomes "Escorpião gigante" e "Morcego vampiro" ficam um em cima do outro. (3) Detalhe: a cena `andar-cima` é vista **de lado e de cima**, e não "de frente" como diz a descrição; para a onda da cobra e a geleca, isso bastou, mas a ginga do urso e o balanço do zumbi aparecem só de leve.
- **Onde mexer:** `src/main.js`, `iniciarFotos`, `desfile`: hoje `trasDe` dá `t.r * 4.8` para a cobra, mas o corpo dela vai uns 10 "tamanhos" para trás (11 bolinhas a cada `r * 1.05`, em `construirMonstro`, parte da `'cobra'`). Trocar por uns `t.r * 10.5`, e dar à frente do escorpião um pouco mais por causa das pinças (`frenteDe`: `t.cauda ? t.r * 2.3 : t.r * 1.7`). A câmera se afasta sozinha, porque usa o `total`. Em `'ataques-2'`, afastar mais os bichos (`-4.2 + i * 2.8` para algo como `-5 + i * 3.3`) ou subir o nome do morcego. Para a descrição, trocar "de frente e de cima" por "de lado e de cima" no `tests/fotos-3d.cjs`.

#### R-015 · Cobra: o "S" ao serpentear é muito leve
- **Gravidade:** menor
- **Desde:** ed0190a, 27/11/2026 (mudança de movimentos dos bichos, rodada 2, a última; achado na cena nova `andar-cima`).
- **Cena e quadro:** andar-cima, quadros 1 a 5 (cobra).
- **O que está errado e o que deveria ser:** vista de cima, a cobra faz só uma **ondinha bem leve**, que muda de um quadro para o outro (então o movimento existe), mas o corpo parece quase reto: o corpo sai da linha reta só cerca de 1/20 do comprimento da cobra para cada lado. Deveria: um "S" que dê para ver de longe, com o corpo indo bem para um lado e para o outro.
- **Onde mexer:** `src/main.js`, `animarMonstro`, parte da `'cobra'`: `sg.position.x = Math.sin(c - i * 0.75) * r * 0.5 * ...`. Algo como `r * 0.9` a `r * 1.0` (o dobro) e uma onda um pouco mais comprida (`i * 0.6`), conferindo na foto `andar-cima` que as bolinhas continuam encostadas umas nas outras.

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

#### R-008 · Fotos: a explosão laranja do canhão quase não aparecia
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1)
- **Resolvida em:** ed0190a, 27/11/2026 (conferência das pendências, junto com a rodada 2 dos movimentos). Conferido em torres: nos quadros 1 a 3 aparece um **clarão amarelo-alaranjado** em volta do zumbi atingido, que cresce e some, e no quadro 4 fica só a fumaça cinza. Antes já tinham sido conferidos o céu (`ceu`), a flecha de lado (`flecha-de-lado`, com o javali piscando) e a bala de canhão saindo do cano.

#### R-010 · Ciclope tinha anéis escuros na pele
- **Gravidade:** menor
- **Desde:** 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1)
- **Resolvida em:** ed0190a, 27/11/2026 (conferência das pendências). Conferido em monstros-3 e andar-pernas: o ciclope tem a **pele lisa**, laranja, sem manchas nem anéis. O escorpião já tinha ficado com a casca lisa em 73fc144.

#### R-011 · Dragãozinho visto de lado: a asa virava uma "vela" fina e alta
- **Gravidade:** menor
- **Desde:** 73fc144, 27/11/2026 (mudança de texturas, formas e luz, rodada 2, a última)
- **Resolvida em:** ed0190a, 27/11/2026 (conferência das pendências). Conferido em voar: nos quadros 1 e 2 a asa aparece de lado como uma vela larga, inclinada para a frente, com a borda em ondas, e cabe inteira na foto; nos quadros 4 e 5, com a asa embaixo, ela aparece por cima do corpo. Só no quadro 3, no meio da batida, ela fica de quina por um instante, o que é normal. De frente continua boa (inicio, monstros-3) e o dragão amigo, em 3/4, continua com a asa inteira (ajudantes).

#### R-012 · Zumbi e lobisomem: o pé nunca pisava na frente do corpo
- **Gravidade:** importante
- **Desde:** 73fc144, 27/11/2026 (mudança de movimentos dos bichos, rodada 1)
- **Resolvida em:** ed0190a, 27/11/2026 (rodada 2, a última). Conferido em andar-pernas, comparando com fotos da versão antiga: o lobisomem continua curvado, mas agora as pernas ficam em pé, com um pé à frente do quadril e o outro atrás (antes os dois ficavam para trás e o de trás subia até o joelho); o zumbi ficou mais em pé, com os passos curtos embaixo do corpo e um pé passando à frente. Vampiro, demônio e ciclope continuam certos.

#### R-013 · Zumbi levantava os braços para o alto no ataque
- **Gravidade:** menor
- **Desde:** 73fc144, 27/11/2026 (mudança de movimentos dos bichos, rodada 1)
- **Resolvida em:** ed0190a, 27/11/2026 (rodada 2, a última). Conferido em ataques, quadros 2 a 4, comparando com a versão antiga: os braços continuam esticados para a frente, subindo só um pouco, e o corpo avança para agarrar (antes eles subiam até ficar acima da cabeça).
