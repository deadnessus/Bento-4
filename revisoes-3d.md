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
| Céu (degradê, sol, nuvens), montanhas com neve e morros com floresta fora da cerca | inicio, vista-geral, primeira-pessoa, monstros-1, defesas | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral, pedido do dono) | Aprovado com recomendação: céu, nuvens, montanhas e morros ok; o sol não aparece em nenhuma foto, não conferido (R-008) |
| Chão com trilhas, grama e flores com vento, árvores, pedras, arbustos, cogumelos, troncos e cerca | vista-geral, primeira-pessoa, celular, graficos-baixo, monstros-1, monstros-2, monstros-3, defesas | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado: troncos no chão, grama e flores sem flutuar, cerca fechando o campo |
| Luz e sombras (gráfico alto, médio e baixo) | vista-geral, primeira-pessoa, celular, graficos-baixo | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado: sombras todas para o mesmo lado, sombra redonda no médio e no baixo, sem listras, sem tela escura ou estourada. Peso ok (celular: 119 desenhos por quadro) |
| Monstros 1 a 17 (material cartoon, olhos com brilho) | monstros-1, monstros-2, monstros-3, primeira-pessoa, vista-geral | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado com recomendações: cobra e dragãozinho sem olhos visíveis (R-002); escorpião difícil de reconhecer e pernas da aranha retas no ar (R-004); os outros ok |
| Chefão (coroa de ouro, brilho e anel roxo) e monstro dourado | chefe, vista-geral | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado com recomendação: tamanho e coroa ok; o anel roxo parece branco-rosado em cima da grama (R-005) |
| Ajudantes (geleca, lobo, golem e dragão amigos, com anel verde) | ajudantes, vista-geral, primeira-pessoa | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado com recomendação: anel verde ok; dragão amigo sem olhos visíveis (R-002) |
| As 5 defesas (muros de madeira e de pedra, torre de flechas, torre de gelo, canhão) | defesas, torres, vista-geral | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado com recomendações: todas em pé no chão e o canhão vira para o monstro; a besta fica escondida atrás da grade (R-006); o brilho do cristal fica esverdeado (R-005) |
| Armas na mão em primeira pessoa (10 armas, com braço e mão) | armas-1, armas-2, primeira-pessoa, celular, graficos-baixo | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado com recomendações: 9 armas ok (machado com o fio para a esquerda); arco sem mão e virado de lado (R-001); espada cobre o monstro no celular em pé (R-003) |
| Golpe (sobe, desce com rastro, só acerta na descida) | golpe | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado com recomendação: sobe antes de descer e o lobo só pisca na descida; o rastro aparece inteiro antes da espada passar (R-007) |
| Tiros e efeitos: flechas, bolas de magia, balas de canhão, faíscas e fumaça | tiro-arco, magia, torres | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado com recomendações: magia e gelo das torres chegam ao alvo com faíscas, e o zumbi fica azulado; a flecha sai do meio da tela (R-001); a bola de gelo parece verde (R-005); flecha em voo, bala de canhão e explosão não conferidas (R-008) |
| Moedas que voam até a câmera, pedacinhos e poeira | moedas | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado |
| Tela de início (vitrine com lobo, vampiro, urso e dragãozinho) | inicio | Rodada 1 · 4afa7d1 · 26/11/2026 (revisão geral) | Aprovado com recomendação: cenário bonito; o dragãozinho fica sem olhos (R-002) |
