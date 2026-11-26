# queres.games: medição de uso, boas práticas e melhorias

Este repositório é de um jogo dos irmãos Jojô e Bento, publicado em https://queres.games/jogar/<nome-do-jogo>/ por outro repositório (`deadnessus/queres-games`). Repositório novo: começa com o jogo-modelo (index.html, style.css, src/main.js), que deve ser trocado pelo jogo de verdade.

## Skills deste repositório (em `.claude/skills/`)
Use-as: elas têm o passo a passo e um verificador automático.
- **`preparar-jogo-para-queres-games`**: antes de pedir para publicar, ao começar um jogo ou ao conferir. Rode o verificador e siga o checklist.
- **`telemetria-queres-games`**: botões com nomes claros e `QG.evento`.
- **`privacidade-infantil`**: o que nunca coletar (LGPD, crianças), conta de apelido, online sem chat.
- **`melhorias-por-issues`**: como transformar os números do painel em issues.

## Regras que nunca mudam
- É um site para **crianças**: sem dado pessoal, sem chat, sem texto livre enviado a servidor, sem rastreadores.
- **Tudo dentro do jogo**: nada de CDN, Google Fonts ou outro site. Caminhos relativos.
- **A telemetria é automática pelo site.** Não crie analytics próprio nem importe script de medição.
- Login e ranking só pela conta do site (`/conta.js`); nada de telas de login próprias.
- Português do Brasil, linguagem simples (o dono não é programador).

## Medição (resumo)
O site mede, de forma anônima, sessões, tempo de uso, erros de JavaScript, celular ou computador, tamanho de tela, retorno em outro dia, **quantas vezes cada botão é usado** (pelo `id` ou `data-...`, nunca pelo texto) e a versão (commit) do jogo. Por isso dê **`id` ou `data-...` claros e estáveis** aos botões, sem dado pessoal.

Avisar um acontecimento do jogo (opcional): `window.QG?.evento?.('fase_concluida', { fase: 3 });`. O nome precisa estar em `qg-eventos.json` na **raiz** deste repositório (`{ "eventos": ["fase_concluida"] }`; até 12 nomes, minúsculas/números/`_`). Dados: até 2 pares, número inteiro ou palavra curta, **nunca** nome de pessoa, texto digitado, pontuação exata ou código de sala. Só aplique eventos a pedido do dono.

## Sugestões de melhoria ficam nas issues deste repositório
Quando alguém (uma pessoa ou uma rotina automática) achar um problema ou uma ideia a partir dos números do site, a sugestão vira uma **issue** aqui, em português simples, com: o que foi observado, em qual versão (commit), e uma ideia do que mudar. Não faça a mudança sem que alguém aprove a issue.

## Imagens 3D: revisão antes de subir para o jogo
O agente **`revisor-3d`** (`.claude/agents/revisor-3d.md`) confere **toda imagem 3D nova ou que mudou** antes de ela subir para o jogo (prévia, site ou merge), do mesmo jeito que o revisor do Origines (decisão do dono, 26/11/2026).
- **Quando chamar:** monstro, ajudante, defesa, arma na mão, tiro, efeito, cenário, céu, luz, sombra, câmera, material ou qualidade dos gráficos novos ou mudados. **Não chamar** para interface 2D (botões, menus, loja), som ou regras do jogo.
- **Fotos:** `node tests/fotos-3d.cjs` (todas as cenas) ou `node tests/fotos-3d.cjs cena1,cena2` (só algumas). Elas vão para `fotos-3d/` (fora do git), com a lista `fotos-3d/LEIA.md`. O jogo monta as cenas sozinho com `?fotos=1` no endereço (função `iniciarFotos`, no `src/main.js`); item novo precisa de uma cena nova lá e no `tests/fotos-3d.cjs`.
- **No máximo 2 rodadas por mudança.** Avise o revisor de qual rodada se trata (1 ou 2). Não existe 3ª.
- **Termina sempre aprovado:** **APROVADO** (nada a corrigir) ou **APROVADO COM RECOMENDAÇÕES** (o que vale melhorar vai para o [`pendencias.md`](pendencias.md), que o revisor atualiza; faça o commit desse arquivo junto). Depois da 1ª rodada, dá para corrigir as recomendações e chamar a 2ª.
- **Registro:** o que já foi revisado fica no [`revisoes-3d.md`](revisoes-3d.md). Item registrado não é revisado de novo, a menos que o dono peça.
- Salvar o trabalho na branch antes do veredito pode, desde que a mensagem do commit diga "em revisão 3D".
