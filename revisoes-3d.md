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
