# Pendências do Caçador de Monstros

O que foi aprovado com recomendação e ainda pode melhorar.
- **Visual 3D:** o revisor 3D (`.claude/agents/revisor-3d.md`) atualiza esta parte quando o veredito é APROVADO COM RECOMENDAÇÕES.
- **Gravidade "importante":** um jogador perceberia.
- **Gravidade "menor":** detalhe que quase não aparece no jogo.

Quando alguém corrige um item, o revisor confere na foto e o move para "Resolvidas".
O que já passou pelo revisor 3D está no [`revisoes-3d.md`](revisoes-3d.md).

## Visual 3D

### Abertas

#### R-001 · Arco: a flecha encaixada fica escondida atrás do braço
- **Gravidade:** menor (era "importante" na rodada 1; a parte principal foi resolvida)
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1). Conferido de novo em dc789e4, 26/11/2026 (rodada 2).
- **Cena e quadro:** armas-1, quadro 5; tiro-arco, quadros 1 a 5.
- **Já resolvido na rodada 2:** a mão esquerda segura o arco pelo cabo (o braço entra pelo canto de baixo à esquerda); o arco fica em pé, com a curva para a frente e a corda do lado do jogador, sem girar para o lado; a flecha que voa sai do lado do arco (tiro-arco, quadro 1) e voa com a ponta para a frente (flecha-de-lado).
- **O que ainda está errado e o que deveria ser:** a flecha encaixada passa bem no meio da mão e fica atrás do braço. Só aparece um pontinho vermelho (as penas) perto da corda; a haste e a ponta de ferro, apontando para a mira, não aparecem. Para a criança, parece um arco sem flecha até a hora do tiro. Deveria: a flecha apoiada em cima da mão, com a ponta de ferro aparecendo um pouco à frente do arco, na direção da mira.
- **Onde mexer:** `src/main.js`, `montarArmaNaMao`, parte do `'arco'`: o grupo `flechaNoArco` está na altura do cabo (y = 0). Subir um pouco (algo como `flechaNoArco.position.y = 0.035`, apoiada em cima da mão) e deixar a ponta um pouco mais comprida para a frente (`x1 = -R - 0.17`, por exemplo `-R - 0.25`), para a ponta sair da mão e do arco.

#### R-004 · Escorpião: ponta da cauda com buracos, ferrão quase invisível e pinças que não aparecem na foto
- **Gravidade:** menor (era "importante" na rodada 1; a parte principal foi resolvida)
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1). Conferido de novo em dc789e4, 26/11/2026 (rodada 2).
- **Cena e quadro:** monstros-2 (escorpião gigante).
- **Já resolvido na rodada 2:** a aranha tem as 8 pernas dobradas que descem até o chão (monstros-1, primeira-pessoa, celular, vista-geral). O escorpião agora parece escorpião: corpo achatado, pernas dobradas até o chão, cauda de bolinhas que sobe e curva para a frente por cima do corpo.
- **O que ainda está errado e o que deveria ser:** (1) no alto da cauda, as 4 últimas bolinhas ficam separadas, com um vãozinho entre elas (parecem soltas); (2) o ferrão é pequeno e escuro e quase não aparece (só um pontinho escuro depois da última bolinha); (3) as pinças com duas pontas **não foram conferidas**: o escorpião aparece de lado na foto, e as duas pontas ficam uma atrás da outra (parece uma ponta só). Deveria: bolinhas encostadas até o fim da cauda, um ferrão que dê para ver, e a foto mostrando o escorpião mais de frente.
- **Onde mexer:** `src/main.js`, `fazerMonstro`, parte da `'aranha'` (com `esc`): o tamanho das bolinhas da cauda diminui demais no fim (`rr = r * (0.26 - t2 * 0.1)`; algo como `0.26 - t2 * 0.06`, ou mais bolinhas, com `cs <= 13`); o ferrão (`peca(G.cone, M.escuro, r * 0.09, r * 0.34, ...)`) pode ficar maior e mais claro (por exemplo da cor do corpo, com a ponta escura). Para a foto: `iniciarFotos`, `galeria`, virar o escorpião mais para a câmera.

#### R-008 · Fotos: o que ainda não deu para conferir (ajustar as cenas)
- **Gravidade:** menor
- **Desde:** 4afa7d1, 26/11/2026 (revisão geral, rodada 1). Conferido de novo em dc789e4, 26/11/2026 (rodada 2).
- **Cena e quadro:** ceu (foto única); torres, quadros 1 a 5; flecha-de-lado, quadros 1 a 5.
- **Já resolvido na rodada 2:** a cena nova `ceu` mostra o degradê do céu sem faixas nem riscos, o brilho em volta do sol, as nuvens e as montanhas; a cena nova `flecha-de-lado` mostra a flecha voando deitada, com a ponta de ferro na frente e as penas vermelhas atrás; na cena `torres`, a bala de canhão aparece saindo do cano, com o clarão e a fumaça (quadro 1).
- **O que ainda está errado e o que deveria ser:** não conferido: (1) na cena `ceu`, a **bola do sol** fica bem atrás de uma nuvem; só aparece o brilho em volta da nuvem; (2) na cena `torres`, a **explosão laranja** do canhão continua sem aparecer: a bala some atrás da torre de flechas nos quadros 2 a 4 e só chega ao lobo depois do quadro 5; (3) na cena `flecha-de-lado`, o **javali fica cortado** na beirada direita (só aparecem o olho e o focinho), então não dá para ver as faíscas quando a flecha chega (a chegada aparece na cena `tiro-arco`, onde o javali pisca de branco). Deveria: uma foto do céu com a bola do sol num pedaço sem nuvem; nas torres, um quadro com a explosão; na flecha de lado, o javali inteiro na foto.
- **Onde mexer:** `src/main.js`, `iniciarFotos`: na cena `'ceu'`, virar a câmera uns graus para o lado ou girar as nuvens (`grupoNuvens.rotation.y`) antes da foto, para tirar a nuvem da frente do sol; na cena `'torres'`, pôr a câmera (`camLivre`) do outro lado, para o caminho da bala não ficar atrás da torre de flechas, e em `tests/fotos-3d.cjs` aumentar a `espera` (algo perto de 0,6 s) para pegar a explosão; na cena `'flecha-de-lado'`, mirar a câmera um pouco mais para o lado do javali (o último número do `camLivre`, hoje -4,8, perto de -6) ou afastá-la um pouco.

### Resolvidas

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
