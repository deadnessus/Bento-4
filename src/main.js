// Caçador de Monstros: derrote monstros, ganhe moedas e compre armas e armaduras melhores.
// Os monstros aparecem no nível do jogador; monstro de nível maior dá mais moedas.
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var canvas = $('campo'), ctx = canvas.getContext('2d');

  // Aviso anônimo para a medição do queres.games (nunca dá erro; fora do site, não faz nada).
  function evento(nome, dados) { try { if (window.QG && window.QG.evento) window.QG.evento(nome, dados); } catch (e) { /* nunca atrapalha */ } }

  // ---------- Itens da loja ----------
  // dano por golpe, espera entre golpes (segundos), alcance (pixels), distancia = atira de longe
  var ARMAS = [
    { id: 'graveto', nome: 'Graveto', icone: '🪵', preco: 0, dano: 6, espera: 0.55, alcance: 48, cor: '#8b5a2b' },
    { id: 'espada-madeira', nome: 'Espada de madeira', icone: '🗡️', preco: 30, dano: 9, espera: 0.55, alcance: 52, cor: '#c08a4a' },
    { id: 'espada-ferro', nome: 'Espada de ferro', icone: '⚔️', preco: 150, dano: 18, espera: 0.5, alcance: 56, cor: '#cfd8dc' },
    { id: 'machado', nome: 'Machado', icone: '🪓', preco: 450, dano: 36, espera: 0.75, alcance: 58, cor: '#90a4ae' },
    { id: 'arco', nome: 'Arco e flecha', icone: '🏹', preco: 1000, dano: 40, espera: 0.6, alcance: 260, distancia: true, cor: '#a1662f' },
    { id: 'lanca', nome: 'Lança de prata', icone: '🔱', preco: 2200, dano: 90, espera: 0.6, alcance: 90, cor: '#e0f2fe' },
    { id: 'varinha-gelo', nome: 'Varinha de gelo', icone: '❄️', preco: 5000, dano: 120, espera: 0.55, alcance: 290, distancia: true, gelo: true, cor: '#7dd3fc' },
    { id: 'espada-fogo', nome: 'Espada de fogo', icone: '🔥', preco: 11000, dano: 300, espera: 0.5, alcance: 66, cor: '#ff7a1a' },
    { id: 'martelo-trovao', nome: 'Martelo do trovão', icone: '⚡', preco: 25000, dano: 600, espera: 0.65, alcance: 72, cor: '#facc15' },
    { id: 'lamina-estelar', nome: 'Lâmina estelar', icone: '🌟', preco: 60000, dano: 1100, espera: 0.45, alcance: 320, distancia: true, cor: '#e879f9' }
  ];
  // defesa = parte do dano que a armadura segura; vida = vida extra
  var ARMADURAS = [
    { id: 'roupa', nome: 'Roupa comum', icone: '👕', preco: 0, defesa: 0, vida: 0, cor: '#3b82f6' },
    { id: 'couro', nome: 'Armadura de couro', icone: '🦺', preco: 60, defesa: 0.10, vida: 20, cor: '#92400e' },
    { id: 'malha', nome: 'Cota de malha', icone: '⛓️', preco: 300, defesa: 0.20, vida: 50, cor: '#9ca3af' },
    { id: 'ferro', nome: 'Armadura de ferro', icone: '🛡️', preco: 1100, defesa: 0.30, vida: 130, cor: '#64748b' },
    { id: 'ouro', nome: 'Armadura de ouro', icone: '👑', preco: 4000, defesa: 0.40, vida: 320, cor: '#eab308' },
    { id: 'cristal', nome: 'Armadura de cristal', icone: '💎', preco: 13000, defesa: 0.50, vida: 750, cor: '#22d3ee' },
    { id: 'dragao', nome: 'Armadura de dragão', icone: '🐉', preco: 40000, defesa: 0.60, vida: 1600, cor: '#dc2626' }
  ];
  var TIPOS = [
    { nome: 'Geleca', cor: '#5fd35f', vel: 65, r: 18, hp: 1, dano: 1, forma: 'geleca' },
    { nome: 'Morcego', cor: '#8b5cf6', vel: 115, r: 14, hp: 0.7, dano: 0.8, forma: 'morcego' },
    { nome: 'Esqueleto', cor: '#e5e7eb', vel: 80, r: 18, hp: 1.1, dano: 1.1, forma: 'normal' },
    { nome: 'Orc', cor: '#65a30d', vel: 75, r: 22, hp: 1.5, dano: 1.3, forma: 'normal' },
    { nome: 'Fantasma', cor: '#bae6fd', vel: 95, r: 18, hp: 0.9, dano: 1.1, forma: 'fantasma' },
    { nome: 'Golem', cor: '#78716c', vel: 48, r: 28, hp: 2.4, dano: 1.6, forma: 'normal' },
    { nome: 'Dragãozinho', cor: '#ef4444', vel: 90, r: 24, hp: 1.8, dano: 1.5, forma: 'morcego' },
    { nome: 'Demônio', cor: '#9f1239', vel: 100, r: 24, hp: 2, dano: 1.8, forma: 'normal' }
  ];
  var MUNDO = 2400; // tamanho do campo (quadrado)

  // ---------- Contas do jogo ----------
  function vidaMonstro(n) { return 15 * Math.pow(1.22, n - 1); }
  function danoMonstro(n) { return 3 * Math.pow(1.19, n - 1); }
  function moedasMonstro(n) { return Math.round((3 + n) * Math.pow(1.15, n - 1)); }
  function xpMonstro(n) { return 2 + 2 * n; }
  function xpParaSubir(n) { return Math.round(10 * n * Math.pow(1.08, n - 1)); }
  function vidaBase(n) { return Math.round(100 * Math.pow(1.13, n - 1)); }

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

  // ---------- Estado ----------
  var estado = 'inicio';
  var jog, monstros, tiros, textos, particulas, cam = { x: 0, y: 0 }, ultimo = 0, relogio = 0, proxMonstro = 0;
  var teclas = {}, toque = null;
  var W = innerWidth, H = innerHeight, dpr = 1;

  function ajustar() {
    W = innerWidth; H = innerHeight; dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    if (estado !== 'jogando') desenhar();
  }
  addEventListener('resize', ajustar);

  function mostrar(qual) {
    ['tela-inicio', 'tela-pausa', 'tela-morte', 'tela-loja', 'tela-confirmar'].forEach(function (t) { $(t).hidden = t !== qual; });
    $('hud').hidden = qual === 'tela-inicio' || qual === 'tela-confirmar' || qual === 'tela-loja';
  }

  function novoJogador() { jog = { x: MUNDO / 2, y: MUNDO / 2, vida: vidaMax(), dir: 0, espera: 0, golpe: 0, golpeDir: 0, semDano: 0, piscar: 0 }; }
  function limparCampo() { monstros = []; tiros = []; textos = []; particulas = []; }

  // ---------- Monstros ----------
  function criarMonstro() {
    var n = Math.max(1, save.nivel + Math.floor(Math.random() * 3) - 1); // nível do jogador -1, igual ou +1
    var disp = Math.min(TIPOS.length, 1 + Math.floor((save.nivel - 1) / 3));
    var tipo = TIPOS[Math.max(0, disp - 1 - Math.floor(Math.random() * Math.min(3, disp)))];
    var dourado = Math.random() < 0.05;
    var ang = Math.random() * Math.PI * 2, dist = Math.max(W, H) * 0.6 + 60;
    var x = Math.min(MUNDO - 30, Math.max(30, jog.x + Math.cos(ang) * dist));
    var y = Math.min(MUNDO - 30, Math.max(30, jog.y + Math.sin(ang) * dist));
    var vida = vidaMonstro(n) * tipo.hp * (dourado ? 2 : 1);
    monstros.push({ x: x, y: y, n: n, tipo: tipo, vida: vida, max: vida, dano: danoMonstro(n) * tipo.dano, r: tipo.r * (dourado ? 1.15 : 1),
      vel: tipo.vel * (0.9 + Math.random() * 0.2), espera: 0, lento: 0, bate: 0, dourado: dourado, fase: Math.random() * 6 });
  }
  function maxMonstros() { return Math.min(14, 5 + Math.floor(save.nivel / 3)); }

  function texto(x, y, t, cor, tam) { textos.push({ x: x, y: y, t: t, cor: cor, tam: tam || 18, vida: 1 }); }
  function estourar(x, y, cor, qtd) {
    for (var i = 0; i < qtd; i++) {
      var a = Math.random() * 6.28, v = 60 + Math.random() * 160;
      particulas.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, cor: cor, vida: 0.5 + Math.random() * 0.3 });
    }
  }
  function curto(v) { v = Math.round(v); return v >= 100000 ? Math.round(v / 1000) + 'mil' : String(v); }

  function ferir(m, dano) {
    m.vida -= dano; m.bate = 0.12;
    texto(m.x, m.y - m.r, curto(dano), '#fff', 16);
    if (arma().gelo) m.lento = 1.5;
    if (m.vida <= 0) matar(m);
  }
  function matar(m) {
    var i = monstros.indexOf(m); if (i < 0) return;
    monstros.splice(i, 1);
    var ganho = moedasMonstro(m.n) * (m.dourado ? 5 : 1);
    ganho = Math.max(1, Math.round(ganho * (0.85 + Math.random() * 0.3)));
    save.moedas += ganho;
    texto(m.x, m.y - 10, '+' + curto(ganho), '#ffd23f', m.dourado ? 26 : 20);
    estourar(m.x, m.y, m.dourado ? '#ffd23f' : m.tipo.cor, 14);
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
    }
  }

  // ---------- Avisos na tela ----------
  var avisoTimer = 0;
  function avisar(t) { var a = $('aviso'); a.textContent = t; a.hidden = false; clearTimeout(avisoTimer); avisoTimer = setTimeout(function () { a.hidden = true; }, 1800); }

  // ---------- Partida ----------
  function comecar() {
    somLigar();
    novoJogador(); limparCampo(); relogio = 0; proxMonstro = 0;
    for (var i = 0; i < 3; i++) criarMonstro();
    estado = 'jogando'; ultimo = 0; mostrar(null); atualizarHud();
    evento('partida_iniciada');
    requestAnimationFrame(quadro);
  }
  function pausar() { if (estado !== 'jogando') return; estado = 'pausa'; mostrar('tela-pausa'); }
  function continuar() { if (estado !== 'pausa' && estado !== 'loja') return; estado = 'jogando'; ultimo = 0; teclas = {}; toque = null; mostrar(null); requestAnimationFrame(quadro); }
  function morrer() {
    estado = 'morto';
    var perdeu = Math.floor(save.moedas * 0.25);
    save.moedas -= perdeu; guardar();
    $('morte-texto').textContent = perdeu > 0 ? 'Você deixou cair ' + perdeu + ' moedas. Suas armas e armaduras continuam com você.' : 'Suas armas e armaduras continuam com você.';
    bip(200, 0.5, 'sawtooth', 0.08);
    atualizarHud(); mostrar('tela-morte');
    evento('partida_terminada', { nivel: save.nivel });
  }
  function reviver() { somLigar(); novoJogador(); limparCampo(); for (var i = 0; i < 3; i++) criarMonstro(); estado = 'jogando'; ultimo = 0; mostrar(null); atualizarHud(); requestAnimationFrame(quadro); }

  function tomarPocao() {
    if (estado !== 'jogando' || save.pocoes <= 0) return;
    if (jog.vida >= vidaMax()) { avisar('Sua vida já está cheia'); return; }
    save.pocoes--; jog.vida = Math.min(vidaMax(), jog.vida + vidaMax() * 0.6);
    texto(jog.x, jog.y - 30, '+vida', '#ff6b6b', 20); bip(660, 0.2, 'sine', 0.08);
    guardar(); atualizarHud();
  }

  // ---------- Atualizar ----------
  function quadro(t) {
    if (estado !== 'jogando') return;
    var dt = ultimo ? Math.min(0.05, (t - ultimo) / 1000) : 0;
    ultimo = t; relogio += dt;
    passo(dt);
    if (estado !== 'jogando') return;
    desenhar();
    requestAnimationFrame(quadro);
  }

  function passo(dt) {
    // Andar
    var mx = 0, my = 0;
    if (teclas.ArrowLeft || teclas.KeyA) mx -= 1;
    if (teclas.ArrowRight || teclas.KeyD) mx += 1;
    if (teclas.ArrowUp || teclas.KeyW) my -= 1;
    if (teclas.ArrowDown || teclas.KeyS) my += 1;
    if (toque && toque.ativo) {
      var dx = toque.x - toque.ox, dy = toque.y - toque.oy, d = Math.hypot(dx, dy);
      if (d > 8) { var f = Math.min(1, d / 60); mx = dx / d * f; my = dy / d * f; }
    }
    var ml = Math.hypot(mx, my);
    if (ml > 1) { mx /= ml; my /= ml; }
    var vel = 190;
    jog.x = Math.min(MUNDO - 20, Math.max(20, jog.x + mx * vel * dt));
    jog.y = Math.min(MUNDO - 20, Math.max(20, jog.y + my * vel * dt));
    if (ml > 0.1) jog.dir = Math.atan2(my, mx);
    jog.andando = ml > 0.1;

    // Recupera vida devagar quando fica um tempo sem levar golpe
    jog.semDano += dt;
    if (jog.semDano > 3) jog.vida = Math.min(vidaMax(), jog.vida + vidaMax() * 0.04 * dt);
    if (jog.piscar > 0) jog.piscar -= dt;

    // Novos monstros
    proxMonstro -= dt;
    if (proxMonstro <= 0 && monstros.length < maxMonstros()) { criarMonstro(); proxMonstro = 1.1; }

    // Ataque automático no monstro mais perto
    jog.espera -= dt; if (jog.golpe > 0) jog.golpe -= dt;
    var a = arma();
    if (jog.espera <= 0) {
      var alvo = null, melhor = Infinity;
      for (var i = 0; i < monstros.length; i++) {
        var m = monstros[i], dd = Math.hypot(m.x - jog.x, m.y - jog.y) - m.r;
        if (dd < a.alcance && dd < melhor) { melhor = dd; alvo = m; }
      }
      if (alvo) {
        jog.espera = a.espera;
        var ang = Math.atan2(alvo.y - jog.y, alvo.x - jog.x);
        jog.dir = ang;
        if (a.distancia) {
          tiros.push({ x: jog.x, y: jog.y, vx: Math.cos(ang) * 620, vy: Math.sin(ang) * 620, vida: 0.8, cor: a.cor, dano: danoArma() });
          bip(a.gelo ? 1000 : 700, 0.07, 'triangle', 0.04);
        } else {
          jog.golpe = 0.18; jog.golpeDir = ang;
          // golpe de perto acerta todos que estão na frente
          var atingidos = monstros.filter(function (m) {
            var dx2 = m.x - jog.x, dy2 = m.y - jog.y;
            if (Math.hypot(dx2, dy2) - m.r > a.alcance) return false;
            var dif = Math.abs(((Math.atan2(dy2, dx2) - ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
            return dif < 0.9;
          });
          atingidos.forEach(function (m) { ferir(m, danoArma()); });
          bip(320, 0.06, 'square', 0.04);
        }
      }
    }

    // Tiros
    for (var k = tiros.length - 1; k >= 0; k--) {
      var tr = tiros[k];
      tr.x += tr.vx * dt; tr.y += tr.vy * dt; tr.vida -= dt;
      var acertou = false;
      for (var j = 0; j < monstros.length; j++) {
        var mm = monstros[j];
        if (Math.hypot(mm.x - tr.x, mm.y - tr.y) < mm.r + 6) { ferir(mm, tr.dano); acertou = true; break; }
      }
      if (acertou || tr.vida <= 0) tiros.splice(k, 1);
    }

    // Monstros andam até você e mordem
    for (var q = 0; q < monstros.length; q++) {
      var mo = monstros[q];
      var ex = jog.x - mo.x, ey = jog.y - mo.y, dist = Math.hypot(ex, ey) || 1;
      var v = mo.vel * (mo.lento > 0 ? 0.45 : 1);
      if (mo.lento > 0) mo.lento -= dt;
      if (mo.bate > 0) mo.bate -= dt;
      if (dist > mo.r + 16) { mo.x += ex / dist * v * dt; mo.y += ey / dist * v * dt; }
      // não deixa monstros ficarem um em cima do outro
      for (var o = q + 1; o < monstros.length; o++) {
        var ou = monstros[o], sx = ou.x - mo.x, sy = ou.y - mo.y, sd = Math.hypot(sx, sy) || 1, min = mo.r + ou.r;
        if (sd < min) { var emp = (min - sd) / 2; mo.x -= sx / sd * emp; mo.y -= sy / sd * emp; ou.x += sx / sd * emp; ou.y += sy / sd * emp; }
      }
      mo.espera -= dt;
      if (dist < mo.r + 22 && mo.espera <= 0) {
        mo.espera = 1.2;
        var dano = mo.dano * (1 - armadura().defesa);
        jog.vida -= dano; jog.semDano = 0; jog.piscar = 0.25;
        texto(jog.x, jog.y - 26, '-' + curto(Math.max(1, dano)), '#ff6b6b', 18);
        bip(140, 0.1, 'sawtooth', 0.05);
        if (jog.vida <= 0) { jog.vida = 0; atualizarHud(); morrer(); return; }
      }
      // monstro que ficou muito longe some (e outro aparece perto)
      if (dist > Math.max(W, H) * 1.6 + 400) { monstros.splice(q, 1); q--; }
    }

    // Efeitos
    for (var p = particulas.length - 1; p >= 0; p--) {
      var pa = particulas[p]; pa.x += pa.vx * dt; pa.y += pa.vy * dt; pa.vx *= 0.92; pa.vy *= 0.92; pa.vida -= dt;
      if (pa.vida <= 0) particulas.splice(p, 1);
    }
    for (var s = textos.length - 1; s >= 0; s--) { textos[s].y -= 40 * dt; textos[s].vida -= dt; if (textos[s].vida <= 0) textos.splice(s, 1); }

    cam.x = jog.x - W / 2; cam.y = jog.y - H / 2;
    atualizarVida();
  }

  // ---------- Desenho ----------
  function desenhar() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineJoin = 'round';
    ctx.fillStyle = '#3f7d3a'; ctx.fillRect(0, 0, W, H);
    if (!jog) return;
    ctx.save(); ctx.translate(-Math.round(cam.x), -Math.round(cam.y));
    // chão quadriculado com tufos de grama
    var T = 80, x0 = Math.floor(cam.x / T) * T, y0 = Math.floor(cam.y / T) * T;
    for (var gx = x0; gx < cam.x + W + T; gx += T) {
      for (var gy = y0; gy < cam.y + H + T; gy += T) {
        if (gx < 0 || gy < 0 || gx >= MUNDO || gy >= MUNDO) continue;
        if (((gx / T) + (gy / T)) % 2 === 0) { ctx.fillStyle = '#448a3e'; ctx.fillRect(gx, gy, T, T); }
        var h = (gx * 73856093 ^ gy * 19349663) >>> 0;
        if (h % 5 === 0) { ctx.fillStyle = '#2f6a2b'; ctx.fillRect(gx + h % 60, gy + (h >> 3) % 60, 4, 10); ctx.fillRect(gx + h % 60 + 6, gy + (h >> 3) % 60 + 3, 4, 7); }
        if (h % 23 === 0) { ctx.fillStyle = '#ffe14d'; ctx.beginPath(); ctx.arc(gx + (h >> 5) % 70, gy + (h >> 7) % 70, 4, 0, 7); ctx.fill(); }
      }
    }
    // borda do campo
    ctx.strokeStyle = '#1e3b1b'; ctx.lineWidth = 16; ctx.strokeRect(-8, -8, MUNDO + 16, MUNDO + 16);

    particulas.forEach(function (p) { ctx.globalAlpha = Math.max(0, p.vida * 1.6); ctx.fillStyle = p.cor; ctx.fillRect(p.x - 3, p.y - 3, 6, 6); });
    ctx.globalAlpha = 1;
    monstros.forEach(desenharMonstro);
    desenharJogador();
    tiros.forEach(function (tr) {
      ctx.fillStyle = tr.cor; ctx.beginPath(); ctx.arc(tr.x, tr.y, 6, 0, 7); ctx.fill();
      ctx.strokeStyle = tr.cor; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(tr.x, tr.y); ctx.lineTo(tr.x - tr.vx * 0.03, tr.y - tr.vy * 0.03); ctx.stroke();
    });
    ctx.textAlign = 'center'; ctx.lineJoin = 'round';
    textos.forEach(function (t) {
      ctx.globalAlpha = Math.min(1, t.vida * 2); ctx.font = '800 ' + t.tam + 'px system-ui, sans-serif';
      ctx.strokeStyle = '#000'; ctx.lineWidth = 4; ctx.strokeText(t.t, t.x, t.y); ctx.fillStyle = t.cor; ctx.fillText(t.t, t.x, t.y);
    });
    ctx.globalAlpha = 1;
    ctx.restore();

    // controle de toque
    if (toque && toque.ativo) {
      ctx.globalAlpha = 0.35; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(toque.ox, toque.oy, 60, 0, 7); ctx.fill();
      ctx.globalAlpha = 0.7;
      var dx = toque.x - toque.ox, dy = toque.y - toque.oy, d = Math.hypot(dx, dy), f = d > 60 ? 60 / d : 1;
      ctx.beginPath(); ctx.arc(toque.ox + dx * f, toque.oy + dy * f, 26, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function olhos(x, y, r, cor) {
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.15, r * 0.25, 0, 7); ctx.arc(x + r * 0.35, y - r * 0.15, r * 0.25, 0, 7); ctx.fill();
    ctx.fillStyle = cor || '#111';
    ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.1, r * 0.12, 0, 7); ctx.arc(x + r * 0.4, y - r * 0.1, r * 0.12, 0, 7); ctx.fill();
  }

  function desenharMonstro(m) {
    var x = m.x, y = m.y, r = m.r, cor = m.bate > 0 ? '#fff' : (m.dourado ? '#ffd23f' : m.tipo.cor);
    var balanco = Math.sin(relogio * 6 + m.fase);
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, y + r * 0.9, r * 0.9, r * 0.3, 0, 0, 7); ctx.fill();
    ctx.fillStyle = cor;
    if (m.tipo.forma === 'geleca') {
      ctx.beginPath(); ctx.ellipse(x, y + 2, r * (1 + balanco * 0.08), r * (0.85 - balanco * 0.08), 0, Math.PI, 0); ctx.lineTo(x + r, y + r * 0.6); ctx.lineTo(x - r, y + r * 0.6); ctx.fill();
    } else if (m.tipo.forma === 'morcego') {
      var asa = balanco * r * 0.5;
      ctx.beginPath(); ctx.moveTo(x - r * 0.5, y); ctx.lineTo(x - r * 1.7, y - r * 0.4 + asa); ctx.lineTo(x - r * 0.9, y + r * 0.5); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + r * 0.5, y); ctx.lineTo(x + r * 1.7, y - r * 0.4 + asa); ctx.lineTo(x + r * 0.9, y + r * 0.5); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    } else if (m.tipo.forma === 'fantasma') {
      ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.arc(x, y, r, Math.PI, 0); ctx.lineTo(x + r, y + r);
      for (var i = 0; i < 4; i++) ctx.lineTo(x + r - (i + 0.5) * r / 2, y + r * (i % 2 ? 1 : 0.6) + balanco * 2);
      ctx.lineTo(x - r, y + r); ctx.fill(); ctx.globalAlpha = 1;
    } else {
      ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 3; ctx.stroke();
    }
    olhos(x, y, r, m.tipo.nome === 'Demônio' || m.tipo.nome === 'Dragãozinho' ? '#ffd23f' : '#111');
    if (m.lento > 0) { ctx.fillStyle = 'rgba(125,211,252,.4)'; ctx.beginPath(); ctx.arc(x, y, r + 4, 0, 7); ctx.fill(); }
    // vida e nível
    var bw = Math.max(36, r * 2), by = y - r - 14;
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x - bw / 2, by, bw, 6);
    ctx.fillStyle = m.n > save.nivel ? '#f97316' : (m.n < save.nivel ? '#84cc16' : '#ef4444');
    ctx.fillRect(x - bw / 2, by, bw * Math.max(0, m.vida / m.max), 6);
    ctx.font = '800 12px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.strokeText('Nv ' + m.n, x, by - 3);
    ctx.fillStyle = m.dourado ? '#ffd23f' : '#fff'; ctx.fillText('Nv ' + m.n, x, by - 3);
  }

  function desenharJogador() {
    var x = jog.x, y = jog.y + (jog.andando ? Math.sin(relogio * 14) * 2 : 0), r = 20, a = arma(), arm = armadura();
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(jog.x, jog.y + r * 0.9, r * 0.9, r * 0.3, 0, 0, 7); ctx.fill();
    // arma
    var ang = jog.golpe > 0 ? jog.golpeDir - 1 + (1 - jog.golpe / 0.18) * 2 : jog.dir;
    var comp = a.distancia ? 26 : Math.min(48, 18 + a.alcance * 0.35);
    ctx.strokeStyle = a.cor; ctx.lineWidth = a.distancia ? 5 : 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x + Math.cos(ang) * 12, y + Math.sin(ang) * 12); ctx.lineTo(x + Math.cos(ang) * (12 + comp), y + Math.sin(ang) * (12 + comp)); ctx.stroke();
    if (jog.golpe > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(x, y, a.alcance, jog.golpeDir - 0.9, jog.golpeDir + 0.9); ctx.stroke();
    }
    // corpo (cor da armadura)
    ctx.fillStyle = jog.piscar > 0 ? '#ff8a8a' : arm.cor;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    // rosto
    ctx.fillStyle = '#f5c99b'; ctx.beginPath(); ctx.arc(x, y - 2, r * 0.62, 0, 7); ctx.fill();
    var ox = Math.cos(jog.dir) * 3, oy = Math.sin(jog.dir) * 3;
    ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(x - 5 + ox, y - 4 + oy, 2.5, 0, 7); ctx.arc(x + 5 + ox, y - 4 + oy, 2.5, 0, 7); ctx.fill();
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
  function precoPocao() { return Math.max(20, Math.round(vidaMax() * 0.35)); }
  function abrirLoja() {
    if (estado !== 'jogando' && estado !== 'morto') return;
    vindoDe = estado; estado = 'loja'; mostrar('tela-loja'); montarLoja();
  }
  function fecharLoja() {
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
      var ehArma = chave.indexOf('arma-') === 0 && chave.indexOf('armadura-') !== 0;
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
    if (e.code === 'Escape' || e.code === 'KeyP') { if (estado === 'jogando') pausar(); else if (estado === 'pausa') continuar(); }
    if (e.code === 'KeyL' && estado === 'jogando') abrirLoja();
    if (e.code === 'KeyQ' || e.code === 'KeyE') tomarPocao();
    if (e.code.indexOf('Arrow') === 0 || e.code === 'Space') e.preventDefault();
  });
  addEventListener('keyup', function (e) { teclas[e.code] = false; });
  addEventListener('blur', function () { teclas = {}; toque = null; });

  canvas.addEventListener('pointerdown', function (e) {
    if (estado !== 'jogando') return;
    somLigar();
    toque = { id: e.pointerId, ativo: true, ox: e.clientX, oy: e.clientY, x: e.clientX, y: e.clientY };
    try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* ok */ }
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!toque || toque.id !== e.pointerId) return;
    toque.x = e.clientX; toque.y = e.clientY;
    // a bolinha acompanha o dedo se ele for longe demais
    var dx = toque.x - toque.ox, dy = toque.y - toque.oy, d = Math.hypot(dx, dy);
    if (d > 90) { toque.ox = toque.x - dx / d * 90; toque.oy = toque.y - dy / d * 90; }
  });
  function soltar(e) { if (toque && toque.id === e.pointerId) toque = null; }
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);

  document.addEventListener('visibilitychange', function () { if (document.hidden) { pausar(); if (audio) audio.suspend(); } });

  $('btn-jogar').onclick = comecar;
  $('btn-recomecar').onclick = function () { estado = 'confirmar'; mostrar('tela-confirmar'); };
  $('btn-confirmar-sim').onclick = function () { var som = save.som; save = novoSave(); save.som = som; guardar(); irInicio(); };
  $('btn-confirmar-nao').onclick = irInicio;
  $('btn-pausar').onclick = function () { if (estado === 'jogando') pausar(); };
  $('btn-continuar').onclick = continuar;
  $('btn-sair').onclick = irInicio;
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
    estado = 'inicio';
    var tem = save.nivel > 1 || save.moedas > 0;
    $('btn-jogar').textContent = tem ? 'Continuar (nível ' + save.nivel + ')' : 'Jogar';
    $('btn-recomecar').hidden = !tem;
    mostrar('tela-inicio');
  }

  ajustar(); atualizarHud(); irInicio();
})();
