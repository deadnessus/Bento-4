// Caçador de Monstros 3D (primeira pessoa): derrote monstros, ganhe moedas e compre armas e armaduras melhores.
// Os monstros aparecem no nível do jogador; monstro de nível maior dá mais moedas. Quanto maior o nível, mais monstros.
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  // Aviso anônimo para a medição do queres.games (nunca dá erro; fora do site, não faz nada).
  function evento(nome, dados) { try { if (window.QG && window.QG.evento) window.QG.evento(nome, dados); } catch (e) { /* nunca atrapalha */ } }

  var T = window.THREE;
  if (!T) { $('tela-inicio').hidden = true; $('tela-erro').hidden = false; return; }

  // ---------- Itens da loja ----------
  // dano por golpe, espera entre golpes (segundos), alcance (metros), distancia = atira de longe
  var ARMAS = [
    { id: 'graveto', nome: 'Graveto', icone: '🪵', preco: 0, dano: 5, espera: 0.55, alcance: 1.8, cor: 0x8b5a2b, modelo: 'pau' },
    { id: 'espada-madeira', nome: 'Espada de madeira', icone: '🗡️', preco: 40, dano: 8, espera: 0.55, alcance: 2.0, cor: 0xc08a4a, modelo: 'espada' },
    { id: 'espada-ferro', nome: 'Espada de ferro', icone: '⚔️', preco: 180, dano: 17, espera: 0.5, alcance: 2.1, cor: 0xcfd8dc, modelo: 'espada' },
    { id: 'machado', nome: 'Machado', icone: '🪓', preco: 500, dano: 34, espera: 0.75, alcance: 2.2, cor: 0x90a4ae, modelo: 'machado' },
    { id: 'arco', nome: 'Arco e flecha', icone: '🏹', preco: 1100, dano: 38, espera: 0.6, alcance: 22, distancia: true, cor: 0xa1662f, modelo: 'arco', tiro: 0xfff1c1 },
    { id: 'lanca', nome: 'Lança de prata', icone: '🔱', preco: 2400, dano: 85, espera: 0.6, alcance: 3.2, cor: 0xe0f2fe, modelo: 'lanca' },
    { id: 'varinha-gelo', nome: 'Varinha de gelo', icone: '❄️', preco: 5500, dano: 115, espera: 0.55, alcance: 24, distancia: true, gelo: true, cor: 0x7dd3fc, modelo: 'varinha', tiro: 0x7dd3fc },
    { id: 'espada-fogo', nome: 'Espada de fogo', icone: '🔥', preco: 12000, dano: 290, espera: 0.5, alcance: 2.4, cor: 0xff7a1a, modelo: 'espada', brilha: true },
    { id: 'martelo-trovao', nome: 'Martelo do trovão', icone: '⚡', preco: 27000, dano: 580, espera: 0.65, alcance: 2.6, cor: 0xfacc15, modelo: 'martelo', brilha: true },
    { id: 'lamina-estelar', nome: 'Lâmina estelar', icone: '🌟', preco: 65000, dano: 1050, espera: 0.45, alcance: 26, distancia: true, cor: 0xe879f9, modelo: 'espada', brilha: true, tiro: 0xf5d0fe }
  ];
  // defesa = parte do dano que a armadura segura; vida = vida extra
  var ARMADURAS = [
    { id: 'roupa', nome: 'Roupa comum', icone: '👕', preco: 0, defesa: 0, vida: 0 },
    { id: 'couro', nome: 'Armadura de couro', icone: '🦺', preco: 70, defesa: 0.10, vida: 15 },
    { id: 'malha', nome: 'Cota de malha', icone: '⛓️', preco: 350, defesa: 0.20, vida: 40 },
    { id: 'ferro', nome: 'Armadura de ferro', icone: '🛡️', preco: 1200, defesa: 0.30, vida: 110 },
    { id: 'ouro', nome: 'Armadura de ouro', icone: '👑', preco: 4300, defesa: 0.40, vida: 280 },
    { id: 'cristal', nome: 'Armadura de cristal', icone: '💎', preco: 14000, defesa: 0.50, vida: 650 },
    { id: 'dragao', nome: 'Armadura de dragão', icone: '🐉', preco: 42000, defesa: 0.60, vida: 1400 }
  ];
  // vel em metros por segundo, r = tamanho
  var TIPOS = [
    { nome: 'Geleca', cor: 0x5fd35f, vel: 1.7, r: 0.7, hp: 1, dano: 1, forma: 'geleca' },
    { nome: 'Morcego', cor: 0x8b5cf6, vel: 3.0, r: 0.45, hp: 0.7, dano: 0.8, forma: 'morcego' },
    { nome: 'Esqueleto', cor: 0xe5e7eb, vel: 2.1, r: 0.5, hp: 1.1, dano: 1.1, forma: 'humano' },
    { nome: 'Orc', cor: 0x65a30d, vel: 2.0, r: 0.65, hp: 1.5, dano: 1.3, forma: 'humano', dentes: true },
    { nome: 'Fantasma', cor: 0xe0f2fe, vel: 2.4, r: 0.6, hp: 0.9, dano: 1.1, forma: 'fantasma' },
    { nome: 'Golem', cor: 0x78716c, vel: 1.3, r: 1.0, hp: 2.4, dano: 1.6, forma: 'golem' },
    { nome: 'Dragãozinho', cor: 0xef4444, vel: 2.4, r: 0.75, hp: 1.8, dano: 1.5, forma: 'dragao' },
    { nome: 'Demônio', cor: 0x9f1239, vel: 2.6, r: 0.7, hp: 2, dano: 1.8, forma: 'humano', chifres: true }
  ];
  var LIM = 44; // o campo vai de -44 a 44 metros

  // ---------- Contas do jogo ----------
  function vidaMonstro(n) { return 20 * Math.pow(1.22, n - 1); }
  function danoMonstro(n) { return 3.5 * Math.pow(1.19, n - 1); }
  function moedasMonstro(n) { return Math.round((3 + n) * Math.pow(1.15, n - 1)); }
  function xpMonstro(n) { return 2 + 2 * n; }
  function xpParaSubir(n) { return Math.round(10 * n * Math.pow(1.08, n - 1)); }
  function vidaBase(n) { return Math.round(70 * Math.pow(1.13, n - 1)); }
  function maxMonstros() { return Math.min(30, 2 + Math.floor(save.nivel * 1.3)); }

  // ---------- Progresso salvo (só neste aparelho; nada de dado pessoal) ----------
  var CHAVE = 'cacador-monstros-v1';
  function novoSave() { return { moedas: 0, nivel: 1, xp: 0, armas: ['graveto'], armaduras: ['roupa'], arma: 'graveto', armadura: 'roupa', pocoes: 1, som: true }; }
  var save = novoSave();
  try { var lido = JSON.parse(localStorage.getItem(CHAVE) || 'null'); if (lido && lido.nivel) save = Object.assign(novoSave(), lido); } catch (e) { /* sem salvar */ }
  function guardar() { try { localStorage.setItem(CHAVE, JSON.stringify(save)); } catch (e) { /* sem salvar */ } }
  function acha(lista, id) { for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i]; return lista[0]; }
  function arma() { return acha(ARMAS, save.arma); }
  function armadura() { return acha(ARMADURAS, save.armadura); }
  function vidaMax() { return vidaBase(save.nivel) + armadura().vida; }
  function danoArma() { return arma().dano * (1 + 0.04 * (save.nivel - 1)); }

  // ---------- Som (só depois de um toque) ----------
  var audio = null;
  function somLigar() { if (!audio) { try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audio = null; } } if (audio && audio.state === 'suspended') audio.resume(); }
  function bip(freq, dur, tipo, vol) {
    if (!audio || !save.som) return;
    try {
      var o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime;
      o.type = tipo || 'square'; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(Math.max(40, freq * 0.6), t + dur);
      g.gain.setValueAtTime(vol || 0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + dur);
    } catch (e) { /* sem som */ }
  }

  // ---------- Cena 3D ----------
  var canvas = $('mundo'), hud = $('hud2d'), h2 = hud.getContext('2d');
  var renderer;
  try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: (window.devicePixelRatio || 1) < 2 }); }
  catch (e) { $('tela-inicio').hidden = true; $('tela-erro').hidden = false; return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  var CEU = 0x9fd6ff;
  var scene = new T.Scene();
  scene.background = new T.Color(CEU);
  scene.fog = new T.Fog(CEU, 14, 52);
  var camera = new T.PerspectiveCamera(70, 1, 0.05, 140);
  camera.rotation.order = 'YXZ';
  scene.add(camera);
  scene.add(new T.HemisphereLight(0xffffff, 0x3a6b35, 0.85));
  var sol = new T.DirectionalLight(0xffffff, 0.75); sol.position.set(30, 50, 20); scene.add(sol);

  // peças básicas que todos os modelos reaproveitam
  var G = {
    esfera: new T.SphereGeometry(1, 16, 12), caixa: new T.BoxGeometry(1, 1, 1),
    cone: new T.ConeGeometry(1, 1, 10), cilindro: new T.CylinderGeometry(1, 1, 1, 10)
  };
  var M = {
    branco: new T.MeshLambertMaterial({ color: 0xffffff }), preto: new T.MeshBasicMaterial({ color: 0x111111 }),
    amarelo: new T.MeshBasicMaterial({ color: 0xffd23f }), osso: new T.MeshLambertMaterial({ color: 0xfff7e0 }),
    madeira: new T.MeshLambertMaterial({ color: 0x5b3a1e }), escuro: new T.MeshLambertMaterial({ color: 0x333333 })
  };
  function peca(geo, mat, sx, sy, sz, x, y, z, pai) {
    var m = new T.Mesh(geo, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); if (pai) pai.add(m); return m;
  }

  // números aleatórios sempre iguais para o cenário
  var semente = 7;
  function rnd() { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; }

  // chão de grama
  (function chao() {
    var c = document.createElement('canvas'); c.width = c.height = 128; var g = c.getContext('2d');
    g.fillStyle = '#4a8c3f'; g.fillRect(0, 0, 128, 128);
    for (var i = 0; i < 900; i++) { g.fillStyle = ['#3f7d35', '#56a048', '#447f3a', '#5fae50'][i % 4]; g.fillRect(rnd() * 128, rnd() * 128, 2, 3 + rnd() * 3); }
    var tex = new T.CanvasTexture(c); tex.wrapS = tex.wrapT = T.RepeatWrapping; tex.repeat.set(60, 60);
    var chao = new T.Mesh(new T.PlaneGeometry(240, 240), new T.MeshLambertMaterial({ map: tex }));
    chao.rotation.x = -Math.PI / 2; scene.add(chao);
  })();

  // árvores, pedras e cerca
  var obstaculos = [];
  (function cenario() {
    var arvores = [], pedras = [];
    for (var i = 0; i < 260 && arvores.length < 75; i++) {
      var x = (rnd() * 2 - 1) * (LIM - 3), z = (rnd() * 2 - 1) * (LIM - 3);
      if (Math.hypot(x, z) < 8) continue;
      arvores.push({ x: x, z: z, s: 0.8 + rnd() * 0.6 });
      obstaculos.push({ x: x, z: z, r: 0.6 });
    }
    for (var k = 0; k < 140; k++) { // floresta do lado de fora da cerca
      var a = rnd() * Math.PI * 2, d = LIM + 4 + rnd() * 40;
      arvores.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, s: 1 + rnd() * 0.8 });
    }
    for (var p = 0; p < 30; p++) {
      var px = (rnd() * 2 - 1) * (LIM - 2), pz = (rnd() * 2 - 1) * (LIM - 2);
      if (Math.hypot(px, pz) < 6) continue;
      var ps = 0.4 + rnd() * 0.8; pedras.push({ x: px, z: pz, s: ps, r: rnd() * 6 });
      obstaculos.push({ x: px, z: pz, r: ps * 0.9 });
    }
    var dummy = new T.Object3D();
    var tronco = new T.InstancedMesh(G.cilindro, M.madeira, arvores.length);
    var folhas = new T.InstancedMesh(G.cone, new T.MeshLambertMaterial({ color: 0x2f7d32 }), arvores.length);
    arvores.forEach(function (a, i) {
      dummy.rotation.set(0, 0, 0);
      dummy.position.set(a.x, a.s, a.z); dummy.scale.set(0.3 * a.s, 2 * a.s, 0.3 * a.s); dummy.updateMatrix(); tronco.setMatrixAt(i, dummy.matrix);
      dummy.position.set(a.x, a.s * 3.6, a.z); dummy.scale.set(1.6 * a.s, 3.6 * a.s, 1.6 * a.s); dummy.updateMatrix(); folhas.setMatrixAt(i, dummy.matrix);
    });
    scene.add(tronco); scene.add(folhas);
    var rochas = new T.InstancedMesh(new T.DodecahedronGeometry(1), new T.MeshLambertMaterial({ color: 0x8a8f96 }), pedras.length);
    pedras.forEach(function (r, i) { dummy.position.set(r.x, r.s * 0.4, r.z); dummy.rotation.set(r.r, r.r * 2, 0); dummy.scale.set(r.s, r.s * 0.75, r.s); dummy.updateMatrix(); rochas.setMatrixAt(i, dummy.matrix); });
    scene.add(rochas);
    // cerca
    var lado = LIM + 1, postes = [], passo = 3;
    for (var v = -lado; v <= lado; v += passo) { postes.push([v, -lado], [v, lado], [-lado, v], [lado, v]); }
    var mPoste = new T.InstancedMesh(G.caixa, M.madeira, postes.length);
    postes.forEach(function (p, i) { dummy.rotation.set(0, 0, 0); dummy.position.set(p[0], 0.6, p[1]); dummy.scale.set(0.2, 1.2, 0.2); dummy.updateMatrix(); mPoste.setMatrixAt(i, dummy.matrix); });
    scene.add(mPoste);
    var mTabua = new T.MeshLambertMaterial({ color: 0x8b5a2b });
    [0.45, 0.95].forEach(function (y) {
      peca(G.caixa, mTabua, lado * 2, 0.12, 0.08, 0, y, -lado, scene); peca(G.caixa, mTabua, lado * 2, 0.12, 0.08, 0, y, lado, scene);
      peca(G.caixa, mTabua, 0.08, 0.12, lado * 2, -lado, y, 0, scene); peca(G.caixa, mTabua, 0.08, 0.12, lado * 2, lado, y, 0, scene);
    });
  })();

  // ---------- Modelos dos monstros ----------
  function olhos(g, y, z, r, pupila) {
    [-1, 1].forEach(function (lado) {
      peca(G.esfera, M.branco, r * 0.24, r * 0.24, r * 0.24, lado * r * 0.33, y, z, g);
      peca(G.esfera, pupila || M.preto, r * 0.12, r * 0.12, r * 0.12, lado * r * 0.33, y, z + r * 0.18, g);
    });
  }
  function fazerMonstro(tipo, dourado) {
    var r = tipo.r * (dourado ? 1.15 : 1);
    var mat = new T.MeshLambertMaterial({ color: dourado ? 0xffd23f : tipo.cor, emissive: dourado ? 0x553300 : 0x000000 });
    if (tipo.forma === 'fantasma') { mat.transparent = true; mat.opacity = 0.8; }
    var g = new T.Group(), p = {}, alt = r * 2;
    var olhoBrilho = (tipo.nome === 'Demônio' || tipo.nome === 'Dragãozinho') ? M.amarelo : M.preto;
    if (tipo.forma === 'geleca') {
      p.corpo = peca(G.esfera, mat, r, r * 0.75, r, 0, r * 0.7, 0, g);
      olhos(g, r * 0.9, r * 0.82, r); alt = r * 1.5;
    } else if (tipo.forma === 'morcego' || tipo.forma === 'dragao') {
      var voo = new T.Group(); voo.position.y = tipo.forma === 'dragao' ? 2.1 : 1.6; g.add(voo); p.voo = voo; p.vooY = voo.position.y;
      if (tipo.forma === 'dragao') {
        peca(G.esfera, mat, r * 0.8, r * 0.7, r * 1.2, 0, 0, 0, voo);
        peca(G.esfera, mat, r * 0.55, r * 0.5, r * 0.6, 0, r * 0.45, r * 1.0, voo);
        peca(G.cone, M.osso, r * 0.12, r * 0.4, r * 0.12, -r * 0.25, r * 0.95, r * 0.9, voo);
        peca(G.cone, M.osso, r * 0.12, r * 0.4, r * 0.12, r * 0.25, r * 0.95, r * 0.9, voo);
        var olhosD = new T.Group(); olhosD.position.set(0, r * 0.55, r * 1.25); voo.add(olhosD); olhos(olhosD, 0, 0, r * 0.8, olhoBrilho);
      } else {
        peca(G.esfera, mat, r, r, r, 0, 0, 0, voo);
        peca(G.cone, mat, r * 0.25, r * 0.5, r * 0.25, -r * 0.5, r * 0.95, 0, voo);
        peca(G.cone, mat, r * 0.25, r * 0.5, r * 0.25, r * 0.5, r * 0.95, 0, voo);
        olhos(voo, r * 0.15, r * 0.82, r, olhoBrilho);
      }
      p.asas = [-1, 1].map(function (lado) {
        var piv = new T.Group(); piv.position.set(lado * r * 0.6, 0, 0); voo.add(piv);
        peca(G.caixa, mat, r * 1.6, 0.05, r * 0.9, lado * r * 0.8, 0, 0, piv);
        piv.userData.lado = lado; return piv;
      });
      alt = voo.position.y + r;
    } else if (tipo.forma === 'fantasma') {
      var flut = new T.Group(); flut.position.y = 1.0; g.add(flut); p.voo = flut; p.vooY = 1.0;
      peca(G.esfera, mat, r, r, r, 0, r * 0.5, 0, flut);
      var saia = peca(G.cone, mat, r, r * 1.4, r, 0, -r * 0.2, 0, flut); saia.rotation.x = Math.PI;
      olhos(flut, r * 0.6, r * 0.85, r); alt = 1 + r * 1.5;
    } else if (tipo.forma === 'golem') {
      p.corpo = peca(G.caixa, mat, r * 1.6, r * 1.4, r * 1.0, 0, r * 1.5, 0, g);
      peca(G.caixa, mat, r * 0.8, r * 0.7, r * 0.8, 0, r * 2.55, 0, g);
      olhos(g, r * 2.6, r * 0.41, r * 0.9, M.amarelo);
      p.bracos = [-1, 1].map(function (lado) { var b = new T.Group(); b.position.set(lado * r * 1.05, r * 2.0, 0); g.add(b); peca(G.caixa, mat, r * 0.5, r * 1.4, r * 0.5, 0, -r * 0.6, 0, b); return b; });
      p.pernas = [-1, 1].map(function (lado) { var b = new T.Group(); b.position.set(lado * r * 0.45, r * 0.8, 0); g.add(b); peca(G.caixa, mat, r * 0.55, r * 0.8, r * 0.55, 0, -r * 0.4, 0, b); return b; });
      alt = r * 3;
    } else { // humano: esqueleto, orc, demônio
      peca(G.caixa, mat, r * 1.3, r * 1.5, r * 0.8, 0, r * 2.0, 0, g);
      peca(G.esfera, mat, r * 0.62, r * 0.62, r * 0.62, 0, r * 3.2, 0, g);
      olhos(g, r * 3.3, r * 0.5, r * 0.9, olhoBrilho);
      if (tipo.dentes) { peca(G.cone, M.osso, r * 0.08, r * 0.25, r * 0.08, -r * 0.2, r * 3.0, r * 0.55, g); peca(G.cone, M.osso, r * 0.08, r * 0.25, r * 0.08, r * 0.2, r * 3.0, r * 0.55, g); }
      if (tipo.chifres) { peca(G.cone, M.escuro, r * 0.14, r * 0.5, r * 0.14, -r * 0.35, r * 3.85, 0, g); peca(G.cone, M.escuro, r * 0.14, r * 0.5, r * 0.14, r * 0.35, r * 3.85, 0, g); }
      p.bracos = [-1, 1].map(function (lado) { var b = new T.Group(); b.position.set(lado * r * 0.85, r * 2.6, 0); g.add(b); peca(G.caixa, mat, r * 0.32, r * 1.3, r * 0.32, 0, -r * 0.6, 0, b); return b; });
      p.pernas = [-1, 1].map(function (lado) { var b = new T.Group(); b.position.set(lado * r * 0.35, r * 1.25, 0); g.add(b); peca(G.caixa, mat, r * 0.38, r * 1.25, r * 0.38, 0, -r * 0.62, 0, b); return b; });
      alt = r * 3.9;
    }
    // sombra
    var sombra = new T.Mesh(G.esfera, matSombra); sombra.scale.set(r * 0.9, 0.01, r * 0.9); sombra.position.y = 0.02; g.add(sombra);
    return { grupo: g, partes: p, mat: mat, alt: alt, r: r };
  }
  var matSombra = new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false });
  function animarMonstro(m, t) {
    var p = m.modelo.partes, f = Math.sin(t * 7 + m.fase);
    if (m.tipo.forma === 'geleca') { p.corpo.scale.y = m.r * (0.75 + f * 0.1); p.corpo.scale.x = p.corpo.scale.z = m.r * (1 - f * 0.06); }
    if (p.asas) p.asas.forEach(function (a) { a.rotation.z = a.userData.lado * Math.sin(t * 14 + m.fase) * 0.6; });
    if (p.voo) p.voo.position.y = p.vooY + Math.sin(t * 3 + m.fase) * 0.2;
    if (p.pernas) { p.pernas[0].rotation.x = f * 0.6; p.pernas[1].rotation.x = -f * 0.6; }
    if (p.bracos) { p.bracos[0].rotation.x = -f * 0.5 - (m.ataque > 0 ? 1.5 : 0); p.bracos[1].rotation.x = f * 0.5 - (m.ataque > 0 ? 1.5 : 0); }
  }

  // ---------- Arma na mão ----------
  var mao = new T.Group(); mao.scale.setScalar(0.7); camera.add(mao);
  var maoBase = new T.Vector3(0.3, -0.36, -0.55);
  function montarArmaNaMao() {
    while (mao.children.length) mao.remove(mao.children[0]);
    var a = arma(), cor = a.brilha ? new T.MeshBasicMaterial({ color: a.cor }) : new T.MeshLambertMaterial({ color: a.cor });
    var g = new T.Group(); mao.add(g);
    if (a.modelo === 'pau') { peca(G.cilindro, cor, 0.025, 0.55, 0.025, 0, 0.22, 0, g); }
    else if (a.modelo === 'espada') {
      peca(G.cilindro, M.madeira, 0.025, 0.18, 0.025, 0, 0, 0, g);
      peca(G.caixa, M.escuro, 0.2, 0.03, 0.05, 0, 0.1, 0, g);
      peca(G.caixa, cor, 0.055, 0.6, 0.015, 0, 0.41, 0, g);
    } else if (a.modelo === 'machado') {
      peca(G.cilindro, M.madeira, 0.028, 0.7, 0.028, 0, 0.25, 0, g);
      peca(G.caixa, cor, 0.26, 0.2, 0.03, 0.1, 0.52, 0, g);
    } else if (a.modelo === 'arco') {
      var arco = new T.Mesh(new T.TorusGeometry(0.32, 0.018, 6, 18, Math.PI), cor); arco.rotation.z = -Math.PI / 2; arco.position.y = 0.2; g.add(arco);
      peca(G.cilindro, M.branco, 0.003, 0.64, 0.003, 0, 0.2, 0, g);
    } else if (a.modelo === 'lanca') {
      peca(G.cilindro, M.madeira, 0.022, 1.2, 0.022, 0, 0.35, 0, g);
      peca(G.cone, cor, 0.05, 0.2, 0.05, 0, 1.05, 0, g);
    } else if (a.modelo === 'varinha') {
      peca(G.cilindro, M.madeira, 0.015, 0.45, 0.015, 0, 0.15, 0, g);
      peca(G.esfera, new T.MeshBasicMaterial({ color: a.cor }), 0.05, 0.05, 0.05, 0, 0.4, 0, g);
    } else if (a.modelo === 'martelo') {
      peca(G.cilindro, M.madeira, 0.03, 0.7, 0.03, 0, 0.25, 0, g);
      peca(G.caixa, cor, 0.32, 0.2, 0.2, 0, 0.6, 0, g);
    }
    mao.userData.distancia = !!a.distancia;
  }

  // ---------- Estado ----------
  var estado = 'inicio';
  var jog = null, monstros = [], tiros = [], textos = [], particulas = [];
  var ultimo = 0, relogio = 0, proxMonstro = 0, vermelho = 0;
  var teclas = {}, toques = {}, atacando = false, travado = false, olharMouse = null;
  var W = innerWidth, H = innerHeight, dpr2 = 1;
  var toqueAparelho = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  $('dica-controles').innerHTML = toqueAparelho
    ? 'Lado esquerdo da tela: arraste para andar.<br>Lado direito: arraste para olhar. Botão vermelho: atacar.'
    : 'W A S D para andar, mouse para olhar (clique na tela).<br>Clique ou Espaço: atacar · E: poção · L: loja · Esc: pausa';

  function ajustar() {
    W = innerWidth; H = innerHeight; dpr2 = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.fov = W < H ? 80 : 70; camera.updateProjectionMatrix();
    // a arma fica sempre dentro da tela, mesmo no celular em pé
    var meiaLargura = 0.55 * Math.tan(camera.fov * Math.PI / 360) * camera.aspect;
    maoBase.x = Math.min(0.3, meiaLargura * 0.55);
    hud.width = Math.round(W * dpr2); hud.height = Math.round(H * dpr2);
  }
  addEventListener('resize', ajustar);

  function mostrar(qual) {
    ['tela-inicio', 'tela-pausa', 'tela-morte', 'tela-loja', 'tela-confirmar'].forEach(function (t) { $(t).hidden = t !== qual; });
    var emJogo = !qual;
    $('hud').hidden = !(emJogo || qual === 'tela-pausa' || qual === 'tela-morte');
    $('btn-atacar').hidden = !emJogo;
  }

  function novoJogador() { jog = { x: 0, z: 0, yaw: 0, pitch: 0, vida: vidaMax(), espera: 0, golpe: 0, semDano: 0, passo: 0, andando: false }; }
  function tirarMonstro(m) { scene.remove(m.modelo.grupo); m.modelo.mat.dispose(); }
  function limparCampo() {
    monstros.forEach(tirarMonstro);
    tiros.forEach(function (t) { scene.remove(t.mesh); t.mesh.material.dispose(); });
    particulas.forEach(function (p) { scene.remove(p.mesh); });
    monstros = []; tiros = []; textos = []; particulas = [];
    vermelho = 0; $('dano').style.opacity = 0;
  }

  // ---------- Monstros ----------
  function soltarDeObstaculos(o, r) {
    for (var i = 0; i < obstaculos.length; i++) {
      var b = obstaculos[i], dx = o.x - b.x, dz = o.z - b.z, d = Math.hypot(dx, dz) || 1, min = b.r + r;
      if (d < min) { o.x = b.x + dx / d * min; o.z = b.z + dz / d * min; }
    }
    o.x = Math.max(-LIM, Math.min(LIM, o.x)); o.z = Math.max(-LIM, Math.min(LIM, o.z));
  }
  function criarMonstro() {
    var n = Math.max(1, save.nivel + Math.floor(Math.random() * 3) - 1); // nível do jogador -1, igual ou +1
    var disp = Math.min(TIPOS.length, 1 + Math.floor((save.nivel - 1) / 3));
    var tipo = TIPOS[Math.max(0, disp - 1 - Math.floor(Math.random() * Math.min(3, disp)))];
    var dourado = Math.random() < 0.05;
    var ang = Math.random() * Math.PI * 2, dist = 10 + Math.random() * 8;
    var pos = { x: jog.x + Math.cos(ang) * dist, z: jog.z + Math.sin(ang) * dist };
    soltarDeObstaculos(pos, tipo.r);
    var modelo = fazerMonstro(tipo, dourado);
    var vida = vidaMonstro(n) * tipo.hp * (dourado ? 2 : 1);
    var m = { x: pos.x, z: pos.z, n: n, tipo: tipo, vida: vida, max: vida, dano: danoMonstro(n) * tipo.dano, r: modelo.r,
      vel: tipo.vel * (0.9 + Math.random() * 0.2), espera: 0.5, lento: 0, bate: 0, ataque: 0, dourado: dourado, fase: Math.random() * 6, nasce: 0, modelo: modelo };
    modelo.grupo.position.set(m.x, 0, m.z); modelo.grupo.scale.setScalar(0.01);
    scene.add(modelo.grupo);
    monstros.push(m);
  }
  function horda() {
    var qtd = 5 + Math.floor(save.nivel / 2);
    for (var i = 0; i < qtd; i++) criarMonstro();
    avisar('Uma horda de ' + qtd + ' monstros está chegando!');
    bip(180, 0.6, 'sawtooth', 0.07);
  }

  function texto(x, y, z, t, cor, tam) { textos.push({ x: x, y: y, z: z, t: t, cor: cor, tam: tam || 20, vida: 1 }); }
  var geoParticula = new T.BoxGeometry(0.12, 0.12, 0.12);
  function estourar(x, y, z, cor, qtd) {
    var mat = new T.MeshBasicMaterial({ color: cor });
    for (var i = 0; i < qtd; i++) {
      var mesh = new T.Mesh(geoParticula, mat); mesh.position.set(x, y, z); scene.add(mesh);
      var a = Math.random() * 6.28;
      particulas.push({ mesh: mesh, vx: Math.cos(a) * (1 + Math.random() * 3), vy: 2 + Math.random() * 3, vz: Math.sin(a) * (1 + Math.random() * 3), vida: 0.6 + Math.random() * 0.3 });
    }
  }
  function curto(v) { v = Math.round(v); return v >= 100000 ? Math.round(v / 1000) + 'mil' : String(v); }

  function ferir(m, dano) {
    m.vida -= dano; m.bate = 0.12;
    texto(m.x, m.modelo.alt + 0.2, m.z, curto(dano), '#ffffff', 22);
    if (arma().gelo) m.lento = 1.5;
    if (!arma().distancia) { // empurrão para trás
      var dx = m.x - jog.x, dz = m.z - jog.z, d = Math.hypot(dx, dz) || 1;
      m.x += dx / d * 0.5; m.z += dz / d * 0.5;
    }
    if (m.vida <= 0) matar(m);
  }
  function matar(m) {
    var i = monstros.indexOf(m); if (i < 0) return;
    monstros.splice(i, 1); tirarMonstro(m);
    var ganho = moedasMonstro(m.n) * (m.dourado ? 5 : 1);
    ganho = Math.max(1, Math.round(ganho * (0.85 + Math.random() * 0.3)));
    save.moedas += ganho;
    texto(m.x, m.modelo.alt * 0.6, m.z, '+' + curto(ganho), '#ffd23f', m.dourado ? 30 : 24);
    estourar(m.x, m.modelo.alt * 0.5, m.z, m.dourado ? 0xffd23f : m.tipo.cor, 12);
    bip(m.dourado ? 1200 : 880, 0.12, 'triangle', 0.07);
    ganharXp(xpMonstro(m.n));
    guardar(); atualizarHud();
  }
  function ganharXp(q) {
    save.xp += q;
    while (save.xp >= xpParaSubir(save.nivel)) {
      save.xp -= xpParaSubir(save.nivel); save.nivel++;
      jog.vida = vidaMax();
      avisar('Subiu para o nível ' + save.nivel + '!');
      bip(523, 0.15, 'triangle', 0.08); setTimeout(function () { bip(784, 0.25, 'triangle', 0.08); }, 120);
      if (save.nivel % 5 === 0) setTimeout(function () { if (estado === 'jogando') horda(); }, 2200);
    }
  }

  // ---------- Avisos na tela ----------
  var avisoTimer = 0;
  function avisar(t) { var a = $('aviso'); a.textContent = t; a.hidden = false; clearTimeout(avisoTimer); avisoTimer = setTimeout(function () { a.hidden = true; }, 2200); }

  // ---------- Partida ----------
  function travar() {
    if (toqueAparelho || !canvas.requestPointerLock) return;
    try { var r = canvas.requestPointerLock(); if (r && r.catch) r.catch(function () { /* sem trava */ }); } catch (e) { /* sem trava */ }
  }
  function destravar() { try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) { /* ok */ } }

  function entrar() { estado = 'jogando'; ultimo = 0; teclas = {}; toques = {}; atacando = false; mostrar(null); atualizarHud(); travar(); }
  function comecar() {
    somLigar();
    novoJogador(); limparCampo(); montarArmaNaMao(); proxMonstro = 0;
    for (var i = 0; i < 3; i++) criarMonstro();
    entrar();
    evento('partida_iniciada');
  }
  function pausar() { if (estado !== 'jogando') return; estado = 'pausa'; atacando = false; mostrar('tela-pausa'); destravar(); }
  function continuar() { if (estado !== 'pausa' && estado !== 'loja') return; entrar(); }
  function morrer() {
    estado = 'morto'; atacando = false; destravar(); vermelho = 0; $('dano').style.opacity = 0;
    var perdeu = Math.floor(save.moedas * 0.25);
    save.moedas -= perdeu; guardar();
    $('morte-texto').textContent = perdeu > 0 ? 'Você deixou cair ' + perdeu + ' moedas. Suas armas e armaduras continuam com você.' : 'Suas armas e armaduras continuam com você.';
    bip(200, 0.5, 'sawtooth', 0.08);
    atualizarHud(); mostrar('tela-morte');
    evento('partida_terminada', { nivel: save.nivel });
  }
  function reviver() { somLigar(); novoJogador(); limparCampo(); montarArmaNaMao(); for (var i = 0; i < 3; i++) criarMonstro(); entrar(); }

  function tomarPocao() {
    if (estado !== 'jogando' || save.pocoes <= 0) return;
    if (jog.vida >= vidaMax()) { avisar('Sua vida já está cheia'); return; }
    save.pocoes--; jog.vida = Math.min(vidaMax(), jog.vida + vidaMax() * 0.6);
    avisar('+ vida!'); bip(660, 0.2, 'sine', 0.08);
    guardar(); atualizarHud();
  }

  // ---------- Atacar ----------
  var frente = new T.Vector3();
  function atacar() {
    var a = arma();
    jog.espera = a.espera; jog.golpe = 1;
    var fx = -Math.sin(jog.yaw), fz = -Math.cos(jog.yaw);
    if (a.distancia) {
      // ajuda a mirar: escolhe o monstro mais perto do centro da tela
      var alvo = null, melhor = 0.3;
      monstros.forEach(function (m) {
        var dx = m.x - jog.x, dz = m.z - jog.z, d = Math.hypot(dx, dz);
        if (d > a.alcance || m.nasce < 1) return;
        var ang = Math.acos(Math.max(-1, Math.min(1, (dx * fx + dz * fz) / (d || 1))));
        if (ang < melhor) { melhor = ang; alvo = m; }
      });
      var origem = new T.Vector3(jog.x, 1.45, jog.z), dir;
      if (alvo) dir = new T.Vector3(alvo.x, alvo.modelo.alt * 0.55, alvo.z).sub(origem).normalize();
      else { camera.getWorldDirection(frente); dir = frente.clone(); }
      var mesh = new T.Mesh(G.esfera, new T.MeshBasicMaterial({ color: a.tiro })); mesh.scale.setScalar(0.12); mesh.position.copy(origem);
      scene.add(mesh);
      tiros.push({ mesh: mesh, vel: dir.multiplyScalar(32), vida: 1.2, dano: danoArma() });
      bip(a.gelo ? 1000 : 700, 0.07, 'triangle', 0.04);
    } else {
      var acertou = false;
      monstros.slice().forEach(function (m) {
        var dx = m.x - jog.x, dz = m.z - jog.z, d = Math.hypot(dx, dz);
        if (d - m.r > a.alcance) return;
        var ang = Math.acos(Math.max(-1, Math.min(1, (dx * fx + dz * fz) / (d || 1))));
        if (ang < 0.75 || d < m.r + 0.3) { ferir(m, danoArma()); acertou = true; }
      });
      bip(acertou ? 320 : 220, 0.06, 'square', 0.04);
    }
  }

  // ---------- Cada quadro ----------
  function quadro(t) {
    requestAnimationFrame(quadro);
    var dt = ultimo ? Math.min(0.05, (t - ultimo) / 1000) : 0;
    ultimo = t; relogio += dt;
    if (estado === 'jogando') passo(dt);
    else if (estado === 'inicio' || estado === 'confirmar') { // a câmera gira devagar na tela de início
      camera.position.set(Math.sin(relogio * 0.05) * 6, 2.2, Math.cos(relogio * 0.05) * 6);
      camera.rotation.set(-0.08, relogio * 0.05, 0);
      mao.visible = false;
    }
    renderer.render(scene, camera);
    desenharHud();
  }

  function passo(dt) {
    mao.visible = true;
    // Olhar com o teclado (setas)
    if (teclas.ArrowLeft) jog.yaw += 2.2 * dt;
    if (teclas.ArrowRight) jog.yaw -= 2.2 * dt;
    // Andar
    var fw = 0, st = 0;
    if (teclas.KeyW || teclas.ArrowUp) fw += 1;
    if (teclas.KeyS || teclas.ArrowDown) fw -= 1;
    if (teclas.KeyA) st -= 1;
    if (teclas.KeyD) st += 1;
    for (var id in toques) {
      var tq = toques[id];
      if (tq.tipo !== 'mover') continue;
      var dx = tq.x - tq.ox, dy = tq.y - tq.oy, d = Math.hypot(dx, dy);
      if (d > 8) { var f = Math.min(1, d / 60); st = dx / d * f; fw = -dy / d * f; }
    }
    var ml = Math.hypot(fw, st); if (ml > 1) { fw /= ml; st /= ml; }
    var vel = 5, sy = Math.sin(jog.yaw), cy = Math.cos(jog.yaw);
    jog.x += (-sy * fw + cy * st) * vel * dt;
    jog.z += (-cy * fw - sy * st) * vel * dt;
    soltarDeObstaculos(jog, 0.4);
    jog.andando = ml > 0.1;
    if (jog.andando) jog.passo += dt * 9;

    // Recupera vida devagar quando fica um tempo sem levar golpe
    jog.semDano += dt;
    if (jog.semDano > 4) jog.vida = Math.min(vidaMax(), jog.vida + vidaMax() * 0.03 * dt);
    if (vermelho > 0) { vermelho = Math.max(0, vermelho - dt * 2.5); $('dano').style.opacity = vermelho; }

    // Câmera
    camera.position.set(jog.x, 1.6 + (jog.andando ? Math.sin(jog.passo) * 0.05 : 0), jog.z);
    camera.rotation.set(jog.pitch, jog.yaw, 0);

    // Arma na mão
    jog.espera -= dt;
    if (atacando && jog.espera <= 0) atacar();
    if (jog.golpe > 0) jog.golpe = Math.max(0, jog.golpe - dt / 0.22);
    var s = Math.sin(jog.golpe * Math.PI);
    mao.position.set(maoBase.x - s * 0.15, maoBase.y + (jog.andando ? Math.abs(Math.sin(jog.passo)) * 0.02 : 0) + s * 0.05, maoBase.z - s * 0.15);
    if (mao.userData.distancia) mao.rotation.set(-0.2 + s * 0.2, 0.15, -0.1);
    else mao.rotation.set(-0.85 - s * 1.1, 0.3 * s, -0.35 + s * 0.7);

    // Novos monstros (quanto maior o nível, mais monstros)
    proxMonstro -= dt;
    if (proxMonstro <= 0 && monstros.length < maxMonstros()) { criarMonstro(); proxMonstro = Math.max(0.4, 1.4 - save.nivel * 0.03); }

    // Tiros
    for (var k = tiros.length - 1; k >= 0; k--) {
      var tr = tiros[k];
      tr.mesh.position.addScaledVector(tr.vel, dt); tr.vida -= dt;
      var acertou = false, tp = tr.mesh.position;
      for (var j = 0; j < monstros.length; j++) {
        var mm = monstros[j], cy2 = mm.modelo.alt * 0.55;
        if (Math.hypot(mm.x - tp.x, mm.z - tp.z) < mm.r + 0.35 && Math.abs(tp.y - cy2) < mm.modelo.alt * 0.6 + 0.3) { ferir(mm, tr.dano); acertou = true; break; }
      }
      if (acertou || tr.vida <= 0 || tp.y < 0) { scene.remove(tr.mesh); tr.mesh.material.dispose(); tiros.splice(k, 1); }
    }

    // Monstros andam até você e atacam
    for (var q = 0; q < monstros.length; q++) {
      var mo = monstros[q];
      if (mo.nasce < 1) { mo.nasce = Math.min(1, mo.nasce + dt * 2); mo.modelo.grupo.scale.setScalar(Math.max(0.01, mo.nasce)); }
      var ex = jog.x - mo.x, ez = jog.z - mo.z, dist = Math.hypot(ex, ez) || 1;
      var v = mo.vel * (mo.lento > 0 ? 0.45 : 1);
      if (mo.lento > 0) mo.lento -= dt;
      if (mo.ataque > 0) mo.ataque -= dt;
      if (dist > mo.r + 0.7) { mo.x += ex / dist * v * dt; mo.z += ez / dist * v * dt; }
      for (var o = q + 1; o < monstros.length; o++) {
        var ou = monstros[o], sx = ou.x - mo.x, sz = ou.z - mo.z, sd = Math.hypot(sx, sz) || 1, min = mo.r + ou.r;
        if (sd < min) { var emp = (min - sd) / 2; mo.x -= sx / sd * emp; mo.z -= sz / sd * emp; ou.x += sx / sd * emp; ou.z += sz / sd * emp; }
      }
      if (mo.tipo.forma !== 'fantasma' && mo.tipo.forma !== 'morcego' && mo.tipo.forma !== 'dragao') soltarDeObstaculos(mo, mo.r * 0.8);
      mo.modelo.grupo.position.set(mo.x, 0, mo.z);
      mo.modelo.grupo.rotation.y = Math.atan2(ex, ez);
      // pisca de branco quando apanha
      if (mo.bate > 0) { mo.bate -= dt; mo.modelo.mat.emissive.setHex(0xffffff); }
      else mo.modelo.mat.emissive.setHex(mo.dourado ? 0x553300 : (mo.lento > 0 ? 0x1e4d6b : 0x000000));
      animarMonstro(mo, relogio);
      mo.espera -= dt;
      if (dist < mo.r + 1.0 && mo.espera <= 0 && mo.nasce >= 1) {
        mo.espera = 1.2; mo.ataque = 0.25;
        var dano = mo.dano * (1 - armadura().defesa);
        jog.vida -= dano; jog.semDano = 0; vermelho = Math.min(0.9, vermelho + 0.55); $('dano').style.opacity = vermelho;
        bip(140, 0.1, 'sawtooth', 0.05);
        if (jog.vida <= 0) { jog.vida = 0; atualizarHud(); morrer(); return; }
      }
      // monstro que ficou muito longe some (e outro aparece mais perto)
      if (dist > 48) { tirarMonstro(mo); monstros.splice(q, 1); q--; }
    }

    // Efeitos
    for (var p = particulas.length - 1; p >= 0; p--) {
      var pa = particulas[p];
      pa.vy -= 9 * dt; pa.mesh.position.x += pa.vx * dt; pa.mesh.position.y = Math.max(0.06, pa.mesh.position.y + pa.vy * dt); pa.mesh.position.z += pa.vz * dt;
      pa.vida -= dt; if (pa.vida <= 0) { scene.remove(pa.mesh); particulas.splice(p, 1); }
    }
    for (var s2 = textos.length - 1; s2 >= 0; s2--) { textos[s2].y += 1.2 * dt; textos[s2].vida -= dt; if (textos[s2].vida <= 0) textos.splice(s2, 1); }
    atualizarVida();
  }

  // ---------- Desenho por cima (vida dos monstros, números, radar, mira) ----------
  var v3 = new T.Vector3();
  function naTela(x, y, z) {
    v3.set(x, y, z).project(camera);
    if (v3.z > 1 || v3.z < -1) return null;
    return { x: (v3.x + 1) / 2 * W, y: (1 - v3.y) / 2 * H };
  }
  function desenharHud() {
    h2.setTransform(dpr2, 0, 0, dpr2, 0, 0);
    h2.clearRect(0, 0, W, H);
    if (!jog || (estado !== 'jogando' && estado !== 'pausa' && estado !== 'morto')) return;
    h2.lineJoin = 'round'; h2.textAlign = 'center';
    var fx = -Math.sin(jog.yaw), fz = -Math.cos(jog.yaw);
    // barras de vida dos monstros (perto e na frente)
    var lista = monstros.map(function (m) { return { m: m, d: Math.hypot(m.x - jog.x, m.z - jog.z) }; })
      .filter(function (o) { return o.d < 28 && ((o.m.x - jog.x) * fx + (o.m.z - jog.z) * fz) > 0; })
      .sort(function (a, b) { return b.d - a.d; });
    lista.forEach(function (o) {
      var m = o.m, pt = naTela(m.x, m.modelo.alt + 0.35, m.z); if (!pt) return;
      var esc = Math.max(0.55, Math.min(1.3, 8 / o.d)), bw = 54 * esc, bh = 7 * esc;
      h2.fillStyle = 'rgba(0,0,0,.6)'; h2.fillRect(pt.x - bw / 2, pt.y, bw, bh);
      h2.fillStyle = m.n > save.nivel ? '#f97316' : (m.n < save.nivel ? '#84cc16' : '#ef4444');
      h2.fillRect(pt.x - bw / 2, pt.y, bw * Math.max(0, m.vida / m.max), bh);
      h2.font = '800 ' + Math.round(13 * esc) + 'px system-ui, sans-serif';
      h2.strokeStyle = '#000'; h2.lineWidth = 3; h2.strokeText('Nv ' + m.n, pt.x, pt.y - 3);
      h2.fillStyle = m.dourado ? '#ffd23f' : '#fff'; h2.fillText('Nv ' + m.n, pt.x, pt.y - 3);
    });
    // números que sobem
    textos.forEach(function (t) {
      if (((t.x - jog.x) * fx + (t.z - jog.z) * fz) <= 0) return;
      var pt = naTela(t.x, t.y, t.z); if (!pt) return;
      h2.globalAlpha = Math.min(1, t.vida * 2); h2.font = '800 ' + t.tam + 'px system-ui, sans-serif';
      h2.strokeStyle = '#000'; h2.lineWidth = 4; h2.strokeText(t.t, pt.x, pt.y); h2.fillStyle = t.cor; h2.fillText(t.t, pt.x, pt.y);
    });
    h2.globalAlpha = 1;
    // mira
    var cx = W / 2, cy = H / 2;
    h2.strokeStyle = 'rgba(255,255,255,.9)'; h2.lineWidth = 2;
    h2.beginPath(); h2.moveTo(cx - 10, cy); h2.lineTo(cx - 4, cy); h2.moveTo(cx + 4, cy); h2.lineTo(cx + 10, cy);
    h2.moveTo(cx, cy - 10); h2.lineTo(cx, cy - 4); h2.moveTo(cx, cy + 4); h2.lineTo(cx, cy + 10); h2.stroke();
    // radar: mostra os monstros em volta (você no meio, olhando para cima)
    var R = 50, rx = 12 + R, ry = toqueAparelho ? 112 + R : H - 12 - R;
    h2.fillStyle = 'rgba(0,0,0,.45)'; h2.beginPath(); h2.arc(rx, ry, R, 0, 7); h2.fill();
    h2.strokeStyle = 'rgba(255,255,255,.7)'; h2.lineWidth = 2; h2.stroke();
    var sy = Math.sin(jog.yaw), cyw = Math.cos(jog.yaw), ALC = 30;
    monstros.forEach(function (m) {
      var dx = m.x - jog.x, dz = m.z - jog.z;
      var lx = dx * cyw - dz * sy, lz = dx * sy + dz * cyw; // em relação para onde você olha
      var d = Math.hypot(lx, lz); if (d > ALC) { lx *= ALC / d; lz *= ALC / d; }
      h2.fillStyle = m.dourado ? '#ffd23f' : (m.n > save.nivel ? '#f97316' : '#ff4d4d');
      h2.beginPath(); h2.arc(rx + lx / ALC * (R - 5), ry + lz / ALC * (R - 5), d > ALC ? 2.5 : 3.5, 0, 7); h2.fill();
    });
    h2.fillStyle = '#fff'; h2.beginPath(); h2.moveTo(rx, ry - 7); h2.lineTo(rx - 5, ry + 5); h2.lineTo(rx + 5, ry + 5); h2.closePath(); h2.fill();
    // controles de toque
    for (var id in toques) {
      var tq = toques[id]; if (tq.tipo !== 'mover') continue;
      h2.globalAlpha = 0.3; h2.fillStyle = '#fff'; h2.beginPath(); h2.arc(tq.ox, tq.oy, 60, 0, 7); h2.fill();
      var dx = tq.x - tq.ox, dy = tq.y - tq.oy, d = Math.hypot(dx, dy), f = d > 60 ? 60 / d : 1;
      h2.globalAlpha = 0.65; h2.beginPath(); h2.arc(tq.ox + dx * f, tq.oy + dy * f, 26, 0, 7); h2.fill();
      h2.globalAlpha = 1;
    }
    if (estado === 'jogando' && !toqueAparelho && !travado) {
      h2.font = '700 16px system-ui, sans-serif';
      var msg = 'Clique na tela para olhar com o mouse', w = h2.measureText(msg).width + 24;
      h2.fillStyle = 'rgba(0,0,0,.55)'; h2.fillRect(cx - w / 2, H - 44, w, 30); h2.fillStyle = '#fff'; h2.fillText(msg, cx, H - 23);
    }
  }

  // ---------- Barra de cima ----------
  function atualizarVida() {
    var mx = vidaMax();
    $('vida-cheia').style.width = Math.max(0, Math.min(100, jog.vida / mx * 100)) + '%';
    $('vida-texto').textContent = curto(Math.ceil(jog.vida)) + ' / ' + curto(mx);
  }
  function atualizarHud() {
    if (jog) atualizarVida();
    $('xp-cheia').style.width = Math.min(100, save.xp / xpParaSubir(save.nivel) * 100) + '%';
    $('nivel-texto').textContent = 'Nível ' + save.nivel;
    $('moedas-texto').textContent = curto(save.moedas);
    $('loja-moedas').textContent = curto(save.moedas);
    $('pocoes-texto').textContent = save.pocoes;
    $('btn-som').textContent = 'Som: ' + (save.som ? 'ligado' : 'desligado');
  }

  // ---------- Loja ----------
  var abaLoja = 'armas', vindoDe = 'jogando';
  function precoPocao() { return Math.max(20, Math.round(vidaMax() * 0.4)); }
  function abrirLoja() {
    if (estado !== 'jogando' && estado !== 'morto') return;
    vindoDe = estado; estado = 'loja'; atacando = false; destravar(); mostrar('tela-loja'); montarLoja();
  }
  function fecharLoja() {
    montarArmaNaMao();
    if (vindoDe === 'morto') { estado = 'morto'; mostrar('tela-morte'); return; }
    continuar();
  }
  function trocarAba(qual) {
    abaLoja = qual;
    ['armas', 'armaduras', 'pocoes'].forEach(function (a) { $('aba-' + a).classList.toggle('ativa', a === qual); });
    montarLoja();
  }
  function montarLoja() {
    var lista = $('loja-lista'); lista.textContent = '';
    atualizarHud();
    if (abaLoja === 'pocoes') {
      lista.appendChild(itemHtml('🧪', 'Poção de vida', 'Recupera boa parte da vida. Você tem ' + save.pocoes + '.', 'Comprar ' + curto(precoPocao()), 'pocao', true, save.moedas >= precoPocao(), false));
      return;
    }
    var itens = abaLoja === 'armas' ? ARMAS : ARMADURAS;
    var donos = abaLoja === 'armas' ? save.armas : save.armaduras;
    var atual = abaLoja === 'armas' ? save.arma : save.armadura;
    itens.forEach(function (it) {
      var tem = donos.indexOf(it.id) >= 0, desc;
      if (abaLoja === 'armas') desc = 'Dano ' + it.dano + ' · ' + (it.distancia ? 'atira de longe' : 'golpe de perto') + (it.gelo ? ' · deixa lento' : '') + ' · ' + (1 / it.espera).toFixed(1) + ' golpes/s';
      else desc = 'Segura ' + Math.round(it.defesa * 100) + '% do dano · +' + it.vida + ' de vida';
      var rotulo = it.id === atual ? 'Usando' : (tem ? 'Usar' : curto(it.preco) + ' moedas');
      var pode = it.id !== atual && (tem || save.moedas >= it.preco);
      lista.appendChild(itemHtml(it.icone, it.nome, desc, rotulo, (abaLoja === 'armas' ? 'arma-' : 'armadura-') + it.id, !tem, pode, it.id === atual));
    });
  }
  function itemHtml(icone, nome, desc, rotulo, chave, comprar, pode, equipado) {
    var d = document.createElement('div'); d.className = 'item' + (equipado ? ' equipado' : '');
    var i = document.createElement('div'); i.className = 'item-icone'; i.textContent = icone;
    var info = document.createElement('div'); info.className = 'item-info';
    var n = document.createElement('div'); n.className = 'item-nome'; n.textContent = nome;
    var s = document.createElement('div'); s.className = 'item-desc'; s.textContent = desc;
    info.appendChild(n); info.appendChild(s);
    var b = document.createElement('button'); b.type = 'button'; b.textContent = rotulo; b.disabled = !pode;
    if (comprar) b.className = 'comprar';
    b.setAttribute('data-loja', chave);
    b.onclick = function () { usarItem(chave); };
    d.appendChild(i); d.appendChild(info); d.appendChild(b);
    return d;
  }
  function usarItem(chave) {
    if (chave === 'pocao') {
      if (save.moedas < precoPocao()) return;
      save.moedas -= precoPocao(); save.pocoes++; bip(660, 0.12, 'triangle', 0.07);
    } else {
      var ehArma = chave.indexOf('armadura-') !== 0;
      var id = chave.replace(/^arma(dura)?-/, '');
      var lista = ehArma ? ARMAS : ARMADURAS, donos = ehArma ? save.armas : save.armaduras, it = acha(lista, id);
      if (donos.indexOf(id) < 0) {
        if (save.moedas < it.preco) return;
        save.moedas -= it.preco; donos.push(id);
        bip(880, 0.1, 'triangle', 0.07); setTimeout(function () { bip(1320, 0.18, 'triangle', 0.07); }, 90);
      }
      var antes = vidaMax();
      if (ehArma) save.arma = id; else save.armadura = id;
      if (jog) jog.vida = Math.max(1, Math.min(vidaMax(), jog.vida + (vidaMax() - antes)));
    }
    guardar(); montarLoja();
  }

  // ---------- Controles ----------
  addEventListener('keydown', function (e) {
    teclas[e.code] = true;
    if (e.code === 'KeyP') { if (estado === 'jogando') pausar(); else if (estado === 'pausa') continuar(); }
    if (e.code === 'KeyL' && estado === 'jogando') abrirLoja();
    if (e.code === 'KeyE' || e.code === 'KeyQ') tomarPocao();
    if (e.code === 'Space') { if (estado === 'jogando') atacando = true; e.preventDefault(); }
    if (e.code.indexOf('Arrow') === 0) e.preventDefault();
  });
  addEventListener('keyup', function (e) { teclas[e.code] = false; if (e.code === 'Space') atacando = false; });
  addEventListener('blur', function () { teclas = {}; toques = {}; atacando = false; });

  document.addEventListener('pointerlockchange', function () {
    var agora = document.pointerLockElement === canvas;
    if (!agora && travado && estado === 'jogando') pausar(); // apertou Esc
    travado = agora;
  });
  function olhar(dx, dy, k) { jog.yaw -= dx * k; jog.pitch = Math.max(-1.2, Math.min(1.2, jog.pitch - dy * k)); }
  document.addEventListener('mousemove', function (e) {
    if (estado !== 'jogando') return;
    if (travado) olhar(e.movementX || 0, e.movementY || 0, 0.0025);
    else if (olharMouse) { olhar(e.clientX - olharMouse.x, e.clientY - olharMouse.y, 0.005); olharMouse = { x: e.clientX, y: e.clientY }; }
  });

  canvas.addEventListener('pointerdown', function (e) {
    if (estado !== 'jogando') return;
    somLigar();
    if (e.pointerType === 'mouse') {
      if (!travado) { travar(); olharMouse = { x: e.clientX, y: e.clientY }; }
      atacando = true;
      return;
    }
    toques[e.pointerId] = { tipo: e.clientX < W * 0.45 ? 'mover' : 'olhar', ox: e.clientX, oy: e.clientY, x: e.clientX, y: e.clientY };
    try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* ok */ }
  });
  canvas.addEventListener('pointermove', function (e) {
    var tq = toques[e.pointerId]; if (!tq || estado !== 'jogando') return;
    if (tq.tipo === 'olhar') olhar(e.clientX - tq.x, e.clientY - tq.y, 0.006);
    tq.x = e.clientX; tq.y = e.clientY;
    if (tq.tipo === 'mover') {
      var dx = tq.x - tq.ox, dy = tq.y - tq.oy, d = Math.hypot(dx, dy);
      if (d > 90) { tq.ox = tq.x - dx / d * 90; tq.oy = tq.y - dy / d * 90; }
    }
  });
  function soltar(e) { delete toques[e.pointerId]; if (e.pointerType === 'mouse') { atacando = false; olharMouse = null; } }
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);

  var btnAtacar = $('btn-atacar');
  btnAtacar.addEventListener('pointerdown', function (e) { e.preventDefault(); somLigar(); if (estado === 'jogando') atacando = true; try { btnAtacar.setPointerCapture(e.pointerId); } catch (er) { /* ok */ } });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (n) { btnAtacar.addEventListener(n, function () { atacando = false; }); });
  btnAtacar.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  document.addEventListener('visibilitychange', function () { if (document.hidden) { pausar(); if (audio) audio.suspend(); } });

  $('btn-jogar').onclick = comecar;
  $('btn-recomecar').onclick = function () { estado = 'confirmar'; mostrar('tela-confirmar'); };
  $('btn-confirmar-sim').onclick = function () { var som = save.som; save = novoSave(); save.som = som; guardar(); irInicio(); };
  $('btn-confirmar-nao').onclick = irInicio;
  $('btn-pausar').onclick = function () { if (estado === 'jogando') pausar(); };
  $('btn-continuar').onclick = continuar;
  $('btn-sair').onclick = function () { limparCampo(); jog = null; irInicio(); };
  $('btn-som').onclick = function () { save.som = !save.som; guardar(); atualizarHud(); somLigar(); bip(660, 0.1, 'triangle', 0.07); };
  $('btn-reviver').onclick = reviver;
  $('btn-loja-morte').onclick = abrirLoja;
  $('btn-loja').onclick = abrirLoja;
  $('btn-fechar-loja').onclick = fecharLoja;
  $('btn-pocao').onclick = tomarPocao;
  $('aba-armas').onclick = function () { trocarAba('armas'); };
  $('aba-armaduras').onclick = function () { trocarAba('armaduras'); };
  $('aba-pocoes').onclick = function () { trocarAba('pocoes'); };

  function irInicio() {
    estado = 'inicio'; destravar();
    var tem = save.nivel > 1 || save.moedas > 0;
    $('btn-jogar').textContent = tem ? 'Continuar (nível ' + save.nivel + ')' : 'Jogar';
    $('btn-recomecar').hidden = !tem;
    mostrar('tela-inicio');
  }

  ajustar(); atualizarHud(); irInicio();
  requestAnimationFrame(quadro);
})();
