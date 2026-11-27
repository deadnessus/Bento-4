// Fotos 3D para revisão (usadas pelo agente revisor-3d antes de liberar mudanças visuais).
// Abre o jogo num navegador sem janela com ?fotos=1, monta cenas fixas (sempre iguais), tira as fotos
// e salva uma folha por cena em fotos-3d/, mais a lista fotos-3d/LEIA.md (versão, erros, o que deve aparecer
// e quantos "desenhos por quadro" cada cena usa, que é o que pesa no celular).
// Uso: node tests/fotos-3d.cjs                 (todas as cenas)
//      node tests/fotos-3d.cjs golpe,chefe     (só algumas)
// Precisa do Playwright com o Chromium (já vem instalado nas sessões do Claude na nuvem).
const { chromium, devices } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'fotos-3d');
const ONLY = (process.argv[2] || '').split(',').map(s => s.trim()).filter(Boolean);

// tipo: 'larga' (1 foto grande), 'fileira' (1 foto bem larga), 'acao' (5 quadros seguidos), 'armas' (uma arma por quadro), 'celular' (tela de celular em pé)
// antes: o que fazer antes dos quadros; passo: segundos de jogo entre um quadro e outro; espera: segundos antes do 1º quadro
const SCENES = [
  { k: 'inicio', tipo: 'larga', espera: 1, d: 'Tela de início: título em cima, os botões embaixo e, no meio, os monstros da vitrine (lobo, vampiro, urso e dragãozinho voando) parados na clareira, virados para a câmera, que gira devagar. Céu azul com o sol, nuvens, montanhas com neve ao longe, árvores e grama.' },
  { k: 'ceu', tipo: 'larga', espera: 0.5, d: 'Olhando para o lado do sol: céu azul mais claro perto do horizonte, o sol (bola clara com brilho em volta), nuvens fofas e, embaixo, montanhas com neve e árvores. Nada de faixa, risco ou cor estourada no céu.' },
  { k: 'vista-geral', tipo: 'larga', espera: 1.2, d: 'O campo visto do alto: cerca de madeira em volta, árvores (pinheiros e árvores de copa redonda, algumas laranjas), pedras, arbustos, trilhas de terra, morros com floresta do lado de fora, montanhas com neve e nuvens. No meio, monstros andando em direção ao centro (um urso dourado), dois ajudantes (lobo e golem azul, com anel verde no chão), um muro de pedra, uma torre de gelo e um canhão. Sombras de verdade no chão, todas para o mesmo lado.' },
  { k: 'primeira-pessoa', tipo: 'larga', espera: 0.6, d: 'Jogando no computador (gráfico alto): a mão segura a espada de ferro pelo cabo, no canto de baixo à direita, com a lâmina para cima; manga cinza de metal (armadura de ferro). Na frente: morcego vampiro voando, lobo, aranha, vampiro e urso parados virados para você, com vida e nível em cima; à esquerda, o lobo ajudante com anel verde e coração; à direita, uma torre de flechas. Barra de vida, nível, moedas, botões e radar por cima.' },
  { k: 'celular', tipo: 'celular', espera: 0.6, d: 'A mesma cena num celular em pé (gráfico médio): a espada menor, mais baixa e mais em pé, inteira dentro da tela, sem passar por cima dos monstros perto da mira, botão vermelho de atacar, radar e barras sem cobrir os monstros. Os monstros têm a sombra redonda embaixo (no médio, só árvores, pedras e defesas fazem sombra de verdade).' },
  { k: 'graficos-baixo', tipo: 'larga', espera: 0.6, d: 'A mesma cena no gráfico baixo: sem sombras de verdade (só a sombra redonda embaixo dos bichos), menos grama, e o jogo continua bonito e fácil de entender.' },
  { k: 'monstros-1', tipo: 'fileira', espera: 0.5, d: 'Monstros 1 a 6, da esquerda para a direita, virados um pouco para a câmera: rato gigante (rabo rosa fino), aranha (8 pernas, olhos vermelhos), cobra (corpo comprido em S, língua vermelha), morcego vampiro (voando, asas abertas, presas), lobo (olhos amarelos, orelhas pontudas) e javali (presas para a frente, orelhas redondas). Nome embaixo de cada um.' },
  { k: 'monstros-2', tipo: 'fileira', espera: 0.5, d: 'Monstros 7 a 12: zumbi (verde-acinzentado), urso (grande, marrom, orelhas redondas), vampiro (rosto pálido, capa vermelha, presas, olhos vermelhos), lobisomem (focinho e orelhas de lobo, olhos amarelos), fantasma (branco, meio transparente, flutuando) e escorpião gigante (laranja, pinças na frente, cauda com ferrão).' },
  { k: 'monstros-3', tipo: 'fileira', espera: 0.5, d: 'Monstros 13 a 17: yeti (branco, grande), ciclope (um olho só), dragãozinho (vermelho, voando, chifres), golem de lava (laranja brilhante) e demônio (vermelho-escuro, chifres pretos, olhos amarelos).' },
  { k: 'chefe', tipo: 'fileira', espera: 0.5, d: 'Da esquerda para a direita: o chefão (lobisomem bem maior, coroa dourada com pedras vermelhas na cabeça, brilho roxo e um anel roxo girando no chão), um lobisomem normal para comparar o tamanho e um lobo dourado (brilhando, com faíscas douradas).' },
  { k: 'ajudantes', tipo: 'fileira', espera: 0.5, d: 'Os 4 ajudantes, cada um com um anel verde no chão: geleca amiga (azul), lobo (cinza), golem amigo (azul) e dragão amigo (verde, voando).' },
  { k: 'defesas', tipo: 'fileira', espera: 0.5, d: 'As 5 defesas: muro de madeira (troncos apontados com travessas), muro de pedra (blocos desencontrados com ameias em cima), torre de flechas (torre de madeira com telhado vermelho e uma besta acima da grade, bem à mostra), torre de gelo (pilar de pedra com um cristal azul flutuando e brilhando) e canhão (de madeira com rodas e cano de ferro).' },
  { k: 'armas-1', tipo: 'armas', armas: ['graveto', 'espada-madeira', 'espada-ferro', 'machado', 'arco'], d: 'Primeira pessoa com as armas 1 a 5 (uma por quadro): graveto, espada de madeira, espada de ferro, machado (a lâmina virada para o lado do golpe, para a esquerda) e arco (seguro pela mão esquerda, que entra pelo canto de baixo à esquerda: em pé, curva para a frente, corda do seu lado, com uma flecha encaixada apontando para a frente, para a mira). O cabo fica na mão.' },
  { k: 'armas-2', tipo: 'armas', armas: ['lanca', 'varinha-gelo', 'espada-fogo', 'martelo-trovao', 'lamina-estelar'], d: 'Armas 6 a 10: lança (apontando para a frente), varinha de gelo (cristal azul brilhando na ponta, apontando para a frente), espada de fogo (lâmina laranja brilhando), martelo do trovão (cabeça dourada com faixas escuras e raios brilhando) e lâmina estelar (lâmina rosa brilhando, apontando para a frente, porque atira de longe).' },
  { k: 'andar-patas', tipo: 'acao', largura: 900, espera: 0.6, passo: 0.1, d: 'Andando no lugar, como numa esteira, para ver o passo. Rato gigante, lobo, javali e urso andando para a direita (no lugar), vistos de lado. Rato, javali e urso trotam: as patas em diagonal andam juntas. O lobo, que é rápido, galopa: as duas patas de trás juntas e depois as duas da frente, com o corpo balançando para a frente e para trás. As patas dobram no joelho quando vão para a frente e ficam esticadas no chão quando vão para trás (sem patinar); o rabo balança; o urso anda gingando de um lado para o outro.' },
  { k: 'andar-pernas', tipo: 'acao', largura: 900, espera: 0.6, passo: 0.1, d: 'Andando no lugar, como numa esteira, para ver o passo. Zumbi, vampiro, lobisomem, ciclope e demônio andando para a direita (no lugar), vistos de lado: braço e perna opostos vão juntos, o joelho dobra quando a perna vai para a frente, o cotovelo fica um pouco dobrado e o corpo sobe e desce um pouco. O zumbi anda devagar, cambaleando, arrastando a perna direita e com os braços esticados para a frente; o lobisomem anda curvado e balança muito os braços; o ciclope anda pesado (sobe e desce mais); o vampiro balança pouco os braços.' },
  { k: 'andar-outros', tipo: 'acao', largura: 900, espera: 0.6, passo: 0.1, d: 'Andando no lugar, como numa esteira, para ver o passo. Aranha e escorpião andando para a direita: quatro pernas sobem e vão para a frente enquanto as outras quatro ficam no chão, alternando; a cauda do escorpião balança. A cobra serpenteia: o corpo faz um "S" que vai passando da cabeça para o rabo. O golem de lava anda pesado, com passos duros, balançando de um lado para o outro. O yeti anda dobrando os joelhos e balançando os braços compridos.' },
  { k: 'voar', tipo: 'acao', largura: 900, espera: 0.6, passo: 0.1, d: 'Andando no lugar, como numa esteira, para ver o passo. Morcego vampiro batendo as asas rápido, subindo e descendo a cada batida e fazendo zigue-zague; dragãozinho batendo as asas devagar e com força (de vez em quando plana com as asas abertas); fantasma flutuando devagar, balançando de leve.' },
  { k: 'ataques', tipo: 'acao', antes: 'atacarTodos', espera: 0.3, passo: 0.05, d: 'Lobo, zumbi, golem de lava, cobra e aranha atacando ao mesmo tempo (para a frente, um pouco para a direita): o lobo dá o bote abaixando a cabeça; o zumbi avança com os braços; o golem de lava ergue os dois braços e desce; a cobra dá o bote para a frente; a aranha empina a frente. Depois todos voltam à posição parada (respirando).' },
  { k: 'golpe', tipo: 'acao', antes: 'atacar', espera: 0, passo: 0.07, d: 'Golpe da espada de ferro num lobo bem na frente: a espada sobe para a direita (quadros 1 e 2), desce na diagonal para a esquerda com um rastro branco (quadros 3 e 4) e volta (quadro 5). Faíscas no lobo quando a lâmina passa, e ele pisca de branco e é empurrado para trás.' },
  { k: 'flecha-de-lado', tipo: 'acao', antes: 'atacar', espera: 0, passo: 0.05, d: 'O mesmo tiro de arco visto de lado (o jogador fica à esquerda, fora da foto): a flecha (haste de madeira, ponta de ferro na frente, penas vermelhas atrás, com um rastro claro) voa da esquerda para a direita, deitada na direção do voo, até o javali, que solta faíscas e pisca quando ela chega.' },
  { k: 'tiro-arco', tipo: 'acao', antes: 'atacar', espera: 0, passo: 0.07, d: 'Tiro de arco num javali a uns 9 m: a flecha (haste de madeira, ponta de ferro, penas vermelhas) sai do arco (à esquerda, na mão esquerda) apontando para o javali, voa reto e, quando chega, solta faíscas; o arco fica sem flecha e depois aparece uma nova.' },
  { k: 'magia', tipo: 'acao', antes: 'atacar', espera: 0, passo: 0.07, d: 'Tiro da varinha de gelo num zumbi a uns 8 m: uma bola azul brilhante com rastro de brilho voa até ele; no impacto, faíscas azuis e fumacinha clara, e o zumbi fica azulado (lento).' },
  { k: 'moedas', tipo: 'acao', antes: 'derrotar', espera: 0, passo: 0.12, d: 'Um lobo é derrotado na frente: pedacinhos cinza e uma nuvem de poeira branca; moedas douradas pulam para cima e depois voam até a câmera.' },
  { k: 'torres', tipo: 'acao', espera: 0.6, passo: 0.09, d: 'Visto de fora: torre de flechas, torre de gelo e canhão atirando nos monstros que vêm de longe (lobo, javali, zumbi, rato e urso), com um muro de madeira na frente. As torres viram para o monstro. Flechas, bolas de gelo e balas de canhão (com fumaça) voando; faíscas onde acertam; explosão laranja do canhão.' },
];

function versao() {
  try {
    const v = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
    const sujo = execSync('git status --porcelain', { cwd: ROOT }).toString().trim() ? ' + mudanças ainda não salvas' : '';
    return v + sujo;
  } catch { return '?'; }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (f.endsWith('.png') || f === 'LEIA.md') fs.unlinkSync(path.join(OUT, f));
  const url = pathToFileURL(path.join(ROOT, 'index.html')).href + '?fotos=1';
  const errors = [], info = {};
  let browser;
  try {
    browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
    const ctxPc = await browser.newContext({ viewport: { width: 1100, height: 620 }, deviceScaleFactor: 1 });
    const ctxCel = await browser.newContext({ ...devices['Pixel 5'], deviceScaleFactor: 1 });
    const sheet = await ctxPc.newPage();
    const pages = {};
    const pagina = async (cel) => {
      const k = cel ? 'cel' : 'pc';
      if (pages[k]) return pages[k];
      const pg = await (cel ? ctxCel : ctxPc).newPage();
      pg.on('pageerror', e => errors.push(e.message));
      pg.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await pg.goto(url);
      await pg.waitForFunction('window.__cacador && window.__cacador.cenas', null, { timeout: 60000 });
      pages[k] = pg; return pg;
    };
    let idx = 0;
    for (const sc of SCENES) {
      if (ONLY.length && !ONLY.includes(sc.k)) continue;
      idx++;
      const page = await pagina(sc.tipo === 'celular');
      const size = sc.tipo === 'fileira' ? { width: 1400, height: 560 } : sc.tipo === 'acao' || sc.tipo === 'armas' ? { width: sc.largura || 560, height: 420 } : sc.tipo === 'celular' ? null : { width: 1100, height: 620 };
      if (size) await page.setViewportSize(size);
      await page.evaluate(`window.__cacador.cena(${JSON.stringify(sc.k)})`);
      if (sc.espera) await page.evaluate(`window.__cacador.passo(${sc.espera})`);
      const n = sc.tipo === 'acao' || sc.tipo === 'armas' ? 5 : 1, frames = [];
      if (sc.antes) await page.evaluate(`window.__cacador.${sc.antes}()`);
      for (let f = 0; f < n; f++) {
        if (sc.tipo === 'armas') await page.evaluate(`window.__cacador.arma(${JSON.stringify(sc.armas[f])})`);
        else if (sc.tipo === 'acao') await page.evaluate(`window.__cacador.passo(${sc.passo})`);
        else await page.evaluate('window.__cacador.passo(0.02)');
        frames.push((await page.screenshot()).toString('base64'));
      }
      info[sc.k] = await page.evaluate('window.__cacador.info()');
      const vw = (await page.viewportSize()).width;
      const html = `<body style="margin:0;background:#141a17;color:#e8ede9;font:15px system-ui,sans-serif">
        <div style="padding:10px 14px"><b style="font-size:17px">${idx}. ${sc.k}</b><div style="color:#a9b8b0;margin-top:3px;max-width:${Math.max(760, n * 560)}px">${sc.d}</div>${n > 1 ? `<div style="color:#a9b8b0;font-size:13px;margin-top:3px">${sc.tipo === 'armas' ? 'Uma arma por quadro, na ordem da descrição' : `5 quadros seguidos, ${sc.passo} s de jogo entre eles (da esquerda para a direita)`}</div>` : ''}</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:0 14px 14px;max-width:${sc.largura ? 3 * (sc.largura + 4) : 99999}px">${frames.map((b, i) => `<div style="position:relative"><img src="data:image/png;base64,${b}" style="display:block;${sc.tipo === 'celular' ? 'width:393px' : ''}">${n > 1 ? `<span style="position:absolute;left:6px;top:4px;background:#0009;padding:1px 6px;border-radius:4px;font-size:12px">${i + 1}</span>` : ''}</div>`).join('')}</div></body>`;
      await sheet.setContent(html);
      await sheet.setViewportSize({ width: Math.max(800, (n > 1 ? (sc.largura ? 3 * (sc.largura + 4) : 564 * n) : (sc.tipo === 'celular' ? 393 : vw)) + 28), height: 200 });
      await sheet.screenshot({ path: path.join(OUT, `${String(idx).padStart(2, '0')}-${sc.k}.png`), fullPage: true });
      console.log(`foto ${idx}: ${sc.k} (${info[sc.k].chamadas} desenhos por quadro)`);
    }
  } catch (err) {
    errors.push(String(err && err.stack || err));
  } finally {
    if (browser) await browser.close();
  }
  const lista = SCENES.filter(s => !ONLY.length || ONLY.includes(s.k)).map((s, i) => {
    const inf = info[s.k];
    return `| ${i + 1} | ${s.k} | \`${String(i + 1).padStart(2, '0')}-${s.k}.png\` | ${inf ? `${inf.chamadas} (${inf.graficos})` : '?'} | ${s.d} |`;
  }).join('\n');
  fs.writeFileSync(path.join(OUT, 'LEIA.md'), `# Fotos 3D para revisão\n\nVersão: ${versao()} · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC\n\nErros na página: ${errors.length ? '\n\n```\n' + errors.join('\n') + '\n```' : 'nenhum'}\n\n` +
    `"Desenhos por quadro" é quantas vezes o jogo pede para a placa de vídeo desenhar algo em cada quadro (contando as sombras). Quanto menos, mais leve no celular. Referência: até uns 400 no gráfico médio (celular) numa cena de jogo normal.\n\n` +
    `| # | Cena | Arquivo | Desenhos por quadro (gráfico) | O que deve aparecer |\n|---|---|---|---|---|\n${lista}\n`);
  console.log(errors.length ? `Terminou com ${errors.length} erro(s): veja fotos-3d/LEIA.md` : 'Pronto: fotos em fotos-3d/ (lista em fotos-3d/LEIA.md)');
  process.exit(errors.length ? 1 : 0);
})();
