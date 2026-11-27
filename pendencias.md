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
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1). Conferido de novo em dc789e4, 26/11/2026 (rodada 2), e em 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1).
- **Cena e quadro:** monstros-2 (escorpião gigante).
- **Já resolvido:** na rodada 2, a aranha ganhou as 8 pernas dobradas até o chão e o escorpião passou a parecer escorpião (corpo achatado, pernas até o chão, cauda que sobe e curva para a frente). Em 5cdf61b: as bolinhas da cauda ficam encostadas até a ponta (sem vãos), o ferrão ficou maior e amarelo-claro e dá para ver no alto da cauda, e as placas das costas aparecem.
- **O que ainda está errado e o que deveria ser:** as pinças com duas pontas **continuam não conferidas**: o escorpião aparece de lado na foto e as duas pontas de cada pinça ficam uma atrás da outra (parece uma ponta só). Deveria: a foto mostrar o escorpião mais de frente, para dar para ver as duas pontas abertas.
- **Onde mexer:** `src/main.js`, `iniciarFotos`, `galeria`: o escorpião entra na lista dos "compridos" (forma `'aranha'`) e fica virado de lado (`olhar: 1.0`). Dar um `olhar` menor só para ele (por exemplo `t.cauda ? 0.45 : ...`). O desenho das pinças (`fazerMonstro`/`construirMonstro`, parte da `'aranha'` com `esc`) parece certo no código.

#### R-008 · Fotos: o que ainda não deu para conferir (ajustar as cenas)
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1). Conferido de novo em dc789e4, 26/11/2026 (rodada 2), e em 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1).
- **Cena e quadro:** torres, quadros 1 a 5; flecha-de-lado, quadros 1 a 5.
- **Já resolvido:** na rodada 2, a cena `ceu` mostrou o degradê do céu, as nuvens e as montanhas; a cena `flecha-de-lado` mostrou a flecha voando deitada, com a ponta de ferro na frente e as penas vermelhas atrás; na cena `torres`, a bala de canhão aparece saindo do cano, com o clarão e a fumaça. Em 5cdf61b: com o sol mais baixo, a **bola do sol** aparece inteira na foto `ceu`, num pedaço de céu sem nuvem, com o brilho em volta.
- **O que ainda está errado e o que deveria ser:** não conferido: (1) na cena `torres`, a **explosão laranja** do canhão continua sem aparecer nos 5 quadros (só a fumaça na boca do cano); (2) na cena `flecha-de-lado`, o **javali continua cortado** na beirada direita (só aparecem o olho e o focinho), então não dá para ver as faíscas quando a flecha chega (a chegada aparece na cena `tiro-arco`, onde o javali pisca de branco). Deveria: nas torres, um quadro com a explosão; na flecha de lado, o javali inteiro na foto.
- **Onde mexer:** `src/main.js`, `iniciarFotos`: na cena `'torres'`, pôr a câmera (`camLivre`) do outro lado, para o caminho da bala não ficar atrás da torre de flechas, e em `tests/fotos-3d.cjs` aumentar a `espera` (algo perto de 0,6 s) para pegar a explosão; na cena `'flecha-de-lado'`, mirar a câmera um pouco mais para o lado do javali (o último número do `camLivre`, hoje -4,8, perto de -6) ou afastá-la um pouco.

#### R-009 · Asas do morcego e dos dragões somem quando vistos de frente
- **Gravidade:** importante
- **Desde:** 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1).
- **Cena e quadro:** monstros-1 (morcego vampiro); primeira-pessoa, celular e graficos-baixo (o morcego voando na sua frente); inicio e monstros-3 (dragãozinho).
- **O que está errado e o que deveria ser:** a asa nova é uma folha fina deitada (sem espessura). Vista de frente, que é como o jogador vê os monstros vindo, ela some: o morcego vira uma bola com orelhas e dois palitinhos escuros dos lados (em monstros-1 nem os palitos aparecem, parece um morcego sem asa nenhuma), e o dragãozinho fica com dois palitos vermelhos para cima, que parecem antenas de inseto (inicio e monstros-3). Só de lado dá para ver um pouco da asa (o dragão amigo, na cena ajudantes, está bom). Antes, com a asa de caixa, sobrava ao menos uma faixa visível. Deveria: a asa aparecer de frente, com o recorte em "ondas" à mostra, batendo em "V".
- **Onde mexer:** `src/main.js`, `construirMonstro`, parte do `'morcego'`/`'dragao'`, e a forma `geoAsa`: o `g.rotateX(Math.PI / 2)` deixa a asa deitada. Deixar a membrana mais em pé, de frente para quem olha (por exemplo, girar menos, ou girar a `asa` no eixo x uns 50 a 60 graus, com a borda ondulada para baixo e para trás), e acompanhar o osso da asa (`membro(piv, matEsc, ...)`) na borda de cima. A batida em "V" (`p.asas`, `rotation.z`, perto de "asas em V, batendo") pode continuar igual.

#### R-010 · Texturas que não combinam: escorpião com pelo e ciclope com manchas fortes
- **Gravidade:** menor
- **Desde:** 5cdf61b, 26/11/2026 (mudança de texturas, formas e luz, rodada 1).
- **Cena e quadro:** monstros-2 (escorpião gigante); monstros-3 (ciclope).
- **O que está errado e o que deveria ser:** (1) o escorpião ficou peludo, igual à aranha e ao urso; escorpião tem casca dura e lisa. Deveria: casca lisa (ou com placas), sem pelo. (2) No ciclope, as "manchas leves" da pele aparecem como manchas marrons fortes, de borda dura, e ele parece pintado de onça. No zumbi elas combinam (parece pele de zumbi) e no demônio quase não aparecem. Deveria: manchas bem de leve, ou nenhuma, no ciclope.
- **Onde mexer:** `src/main.js`, `texturaDoTipo`: a forma `'aranha'` recebe `'pelo'` também quando é o escorpião (`tipo.cauda`); dar outra textura a ele (por exemplo `'escamas'` com relevo fraco, ou nenhuma). Para o ciclope (`tipo.umOlho`), diminuir a força do relevo das `'manchas'` (`forcaRel`) ou não usar textura. Causa provável das bordas duras: o relevo, junto com a luz em degraus do material desenho (toon), vira manchas escuras.

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
