# Registro da revisão 3D

Aqui fica **o que já passou pelo revisor 3D** (`.claude/agents/revisor-3d.md`). Regras do dono:
- O revisor só trabalha quando o jogo ganha **imagem 3D nova** ou quando **muda o visual** de algo.
- **Item registrado aqui não é revisado de novo**, a menos que o dono peça. Quando o visual de um item registrado muda, só **a parte que mudou** é revisada, e a linha do item é atualizada.
- **No máximo 2 rodadas por mudança**, e a revisão **sempre termina aprovada**: APROVADO ou APROVADO COM RECOMENDAÇÕES.
- As recomendações ficam no [`pendencias.md`](pendencias.md), seção "Visual 3D".

Quem atualiza este arquivo é o próprio revisor, ao terminar uma revisão. As colunas:
- **Item:** o que foi revisado.
- **Cenas:** os nomes das cenas do `node tests/fotos-3d.cjs` onde ele aparece. Numa revisão de mudança, só essas cenas são fotografadas.
- **Revisado em:** a rodada, a versão (o commit) e a data.
- **Resultado:** o veredito daquele item.

| Item | Cenas | Revisado em | Resultado |
|---|---|---|---|
| Céu (degradê, sol, nuvens), montanhas com neve e morros com floresta fora da cerca | inicio, ceu, vista-geral, primeira-pessoa, monstros-1, defesas | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral, pedido do dono); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado com recomendação: degradê sem faixas, brilho do sol, nuvens mais claras, montanhas e morros ok; na foto `ceu` a bola do sol fica atrás de uma nuvem, não conferida (R-008) |
| Chão com trilhas, grama e flores com vento, árvores, pedras, arbustos, cogumelos, troncos e cerca | vista-geral, primeira-pessoa, celular, graficos-baixo, monstros-1, monstros-2, monstros-3, defesas | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado: troncos no chão, grama e flores sem flutuar, cerca fechando o campo; nada piorou na rodada 2 |
| Luz e sombras (gráfico alto, médio e baixo) | vista-geral, primeira-pessoa, celular, graficos-baixo | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado: sombras todas para o mesmo lado, sombra redonda no médio e no baixo, sem listras, sem tela escura ou estourada. Peso ok (celular: 123 desenhos por quadro) |
| Monstros 1 a 17 (material cartoon, olhos com brilho) | monstros-1, monstros-2, monstros-3, primeira-pessoa, vista-geral | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado com recomendação: cobra e dragãozinho com olhos (R-002 resolvida); aranha com pernas dobradas até o chão; escorpião agora parece escorpião, faltam detalhes da cauda, do ferrão e das pinças (R-004, menor); lobo com olhos amarelos |
| Chefão (coroa de ouro, brilho e anel roxo) e monstro dourado | chefe, vista-geral | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado: tamanho e coroa ok, anel roxo de verdade em cima da grama (R-005 resolvida); lobo e urso dourados mais dourados |
| Ajudantes (geleca, lobo, golem e dragão amigos, com anel verde) | ajudantes, vista-geral, primeira-pessoa | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado: anel verde ok; dragão amigo com olhos e rabo (R-002 resolvida) |
| As 5 defesas (muros de madeira e de pedra, torre de flechas, torre de gelo, canhão) | defesas, torres, vista-geral, primeira-pessoa | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado: todas em pé no chão; a besta fica acima da grade e vira para o monstro (R-006 resolvida); o cristal da torre de gelo fica azul (R-005 resolvida) |
| Armas na mão em primeira pessoa (10 armas, com braço e mão) | armas-1, armas-2, primeira-pessoa, celular, graficos-baixo, tiro-arco | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado com recomendação: 9 armas ok; arco seguro pela mão esquerda, em pé, curva para a frente (R-001 quase toda resolvida; falta a flecha encaixada aparecer, menor); espada menor e mais baixa no celular em pé (R-003 resolvida); cristal da varinha azul |
| Golpe (sobe, desce com rastro, só acerta na descida) | golpe | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado: sobe antes de descer, o lobo só pisca na descida e o rastro vai aparecendo atrás da espada (R-007 resolvida) |
| Tiros e efeitos: flechas, bolas de magia, balas de canhão, faíscas e fumaça | tiro-arco, flecha-de-lado, magia, torres | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado com recomendação: a flecha sai do lado do arco e voa com a ponta para a frente; bola de gelo azul (R-005 resolvida); bala de canhão vista saindo do cano; explosão laranja do canhão e faíscas da flecha vista de lado ainda não conferidas (R-008) |
| Moedas que voam até a câmera, pedacinhos e poeira | moedas | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado; nada piorou na rodada 2 |
| Tela de início (vitrine com lobo, vampiro, urso e dragãozinho) | inicio | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral); Rodada 2 (última) · dc789e4 · 26/11/2026 | Aprovado: câmera mais baixa ok, cenário bonito, dragãozinho com olhos (R-002 resolvida), lobo com olhos amarelos |
