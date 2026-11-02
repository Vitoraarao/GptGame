/* Scenery reconstructed from the supplied gameplay recording. No external assets. */
(() => {
  'use strict';
  const W = 1200, H = 600;
  const C = {
    sky: '#b5d0b7', haze: '#ccdfb5', cloud: '#edf0cd', sun: '#e5d88c',
    mountain: '#a2bf9b', mountain2: '#88aa83', distant: '#73966f',
    grass: '#557a46', grassTop: '#779858', dirt: '#947951', dirtLight: '#b49662',
    leafDark: '#365c3d', leafMid: '#48774a', leaf: '#5e8450', leafLight: '#7b9b53',
    trunk: '#72734b', trunkDark: '#575f3d', cream: '#f3eed7', ink: '#244b3e',
    gold: '#d7b658', roof: '#9b6144', roofLight: '#b57c4c', wall: '#ddc99d',
    wallShade: '#c3ad7e', window: '#36594b', dark: '#34483b'
  };
  const hash = n => { const a = Math.sin(n * 127.1 + 311.7) * 43758.5453; return a - Math.floor(a); };
  function rect(ctx, color, x, y, w, h) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }
  function poly(ctx, color, points) {
    ctx.fillStyle = color;
    ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(Math.round(x), Math.round(y)) : ctx.moveTo(Math.round(x), Math.round(y)));
    ctx.closePath(); ctx.fill();
  }
  function cloud(ctx, x, y, scale = 1) {
    ctx.save(); ctx.translate(Math.round(x), Math.round(y)); ctx.scale(scale, scale);
    rect(ctx, C.cloud, 0, 12, 90, 12);
    rect(ctx, C.cloud, 15, 3, 50, 12);
    rect(ctx, C.cloud, 28, -6, 25, 12);
    rect(ctx, '#dce6bf', 0, 24, 83, 3); ctx.restore();
  }
  function backdrop(ctx, camera, time, ground, lab) {
    rect(ctx, C.sky, 0, 0, W, H);
    rect(ctx, C.haze, 0, 102, W, 114);
    rect(ctx, '#bfd7b4', 0, 216, W, 250);
    rect(ctx, C.sun, 970, 47, 48, 56); rect(ctx, C.sun, 962, 58, 64, 35);
    rect(ctx, C.sun, 977, 40, 34, 68);
    for (let i = -1; i < 7; i++) {
      const x = i * 285 - (camera * .07 % 285);
      cloud(ctx, x + 12, [48, 79, 115, 40][((i + 4) % 4)], i % 2 ? .8 : 1);
    }
    for (let i = -1; i < 6; i++) {
      let x = i * 460 - (camera * .15 % 460);
      const top = i % 2 ? 164 : 207;
      poly(ctx, C.mountain, [[x - 100, 420], [x + 75, 238], [x + 150, top], [x + 225, top + 31], [x + 337, 376], [x + 470, 420]]);
    }
    for (let i = -1; i < 9; i++) {
      const x = i * 230 - (camera * .3 % 230);
      poly(ctx, C.mountain2, [[x - 50, 450], [x + 40, 361], [x + 105, 302 + hash(i) * 47], [x + 160, 324 + hash(i) * 47], [x + 250, 450]]);
    }
    rect(ctx, '#cadbb7', 0, 465, W, 8);
    rect(ctx, '#779364', 0, 473, W, ground - 473);
    for (let i = -2; i < 15; i++) {
      const worldIndex = Math.floor(camera * .5 / 115) + i;
      const x = worldIndex * 115 - camera * .5;
      const y = 325 + hash(worldIndex) * 65;
      rect(ctx, C.distant, x + 18, y + 39, 12, ground - y - 44);
      rect(ctx, '#82a17b', x - 11, y + 8, 75, 65);
      rect(ctx, '#6a8e70', x, y - 14, 65, 57);
    }
    if (lab) {
      // The recording shows the forest; this distant campus keeps the same palette.
      rect(ctx, '#a8bfa3', 620 - camera * .05 % 160, 352, 420, 123);
      rect(ctx, '#90ab91', 702 - camera * .05 % 160, 305, 95, 170);
    }
  }
  function tree(ctx, x, ground, variant = 0) {
    const scale = .83 + hash(variant) * .27;
    ctx.save(); ctx.translate(Math.round(x), ground); ctx.scale(scale, scale);
    rect(ctx, C.trunk, -6, -144, 15, 136);
    rect(ctx, C.trunkDark, -6, -116, 5, 108);
    poly(ctx, C.trunk, [[0, -79], [-33, -128], [-21, -137], [8, -98], [33, -142], [43, -135], [8, -76]]);
    rect(ctx, C.leafDark, -55, -190, 90, 67);
    rect(ctx, C.leafMid, -30, -215, 78, 87);
    rect(ctx, C.leafMid, -64, -160, 122, 46);
    rect(ctx, C.leaf, -2, -140, 64, 39);
    rect(ctx, C.leafDark, 26, -190, 50, 32);
    rect(ctx, C.leafLight, -23, -208, 46, 9);
    rect(ctx, '#83a256', 31, -183, 27, 6);
    rect(ctx, '#70944f', -59, -167, 21, 6);
    rect(ctx, '#4e7549', -12, -8, 30, 6);
    ctx.restore();
  }
  function windowPane(ctx, x, y, w = 36, h = 45) {
    rect(ctx, '#baa579', x - 4, y - 4, w + 8, h + 8);
    rect(ctx, C.window, x, y, w, h);
    rect(ctx, '#719184', x + 3, y + 3, w / 2 - 6, h / 2 - 6);
    rect(ctx, '#d8c797', x + w / 2 - 2, y, 4, h);
    rect(ctx, '#d8c797', x, y + h / 2 - 2, w, 4);
    rect(ctx, '#ad9266', x - 5, y + h, w + 10, 5);
  }
  function house(ctx, x, ground, variant) {
    const w = 220, top = ground - 139, peak = top - 85;
    rect(ctx, C.wallShade, x + 5, top, w, 139);
    rect(ctx, C.wall, x + 5, top, w - 13, 125);
    rect(ctx, '#e4d3aa', x + 11, top + 8, 10, 103);
    poly(ctx, C.roof, [[x - 15, top - 6], [x + w / 2, peak], [x + w + 15, top - 6]]);
    ctx.strokeStyle = C.roofLight; ctx.lineWidth = 3;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo(x + w / 2, peak + 8); ctx.lineTo(x - 8 + i * 24, top - 14); ctx.stroke();
    }
    rect(ctx, '#795c3f', x - 15, top - 7, w + 30, 9);
    rect(ctx, '#af7550', x - 15, top - 13, w + 30, 7);
    windowPane(ctx, x + 27, top + 28);
    windowPane(ctx, x + 152, top + 28);
    rect(ctx, '#b09b72', x + 91, top + 60, 44, 79);
    rect(ctx, '#615741', x + 97, top + 65, 33, 74);
    rect(ctx, '#d9bc77', x + 122, top + 100, 4, 4);
    rect(ctx, '#b09c73', x + 13, top + 10, 3, 14);
    rect(ctx, '#b09c73', x + 17, top + 11, 5, 3);
    rect(ctx, '#b09c73', x + 189, top + 94, 3, 13);
    rect(ctx, '#b09c73', x + 185, top + 106, 6, 3);
    if (variant % 2) {
      rect(ctx, '#493f2e', x + 178, ground - 18, 29, 18);
      for (let k = 0; k < 4; k++) {
        rect(ctx, '#b99863', x + 180, ground - 15 + k * 4, 25, 2);
        rect(ctx, '#493f2e', x + 185 + k * 5, ground - 20, 2, 20);
      }
    }
  }
  function fence(ctx, x, ground, width = 130) {
    for (let i = 0; i < width; i += 32) {
      rect(ctx, '#a79361', x + i, ground - 37, 8, 35);
      poly(ctx, '#b9a16a', [[x + i, ground - 37], [x + i + 4, ground - 48], [x + i + 8, ground - 37]]);
    }
    rect(ctx, '#ac9764', x - 6, ground - 30, width + 2, 5);
    rect(ctx, '#9c885b', x - 6, ground - 13, width + 2, 5);
  }
  function labBuilding(ctx, x, ground) {
    rect(ctx, '#b3c5af', x, ground - 225, 490, 225);
    rect(ctx, '#dce0c1', x + 12, ground - 214, 465, 202);
    rect(ctx, '#457361', x - 12, ground - 232, 514, 16);
    rect(ctx, '#7b9373', x + 170, ground - 260, 150, 36);
    rect(ctx, '#e5e7cf', x + 180, ground - 252, 130, 24);
    ctx.fillStyle = C.ink; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('MANGUINHOS', x + 245, ground - 235);
    for (let i = 0; i < 4; i++) windowPane(ctx, x + 35 + i * 115, ground - 190, 64, 53);
    windowPane(ctx, x + 35, ground - 97, 64, 53); windowPane(ctx, x + 380, ground - 97, 64, 53);
    rect(ctx, '#6d8c77', x + 182, ground - 110, 125, 110);
    rect(ctx, '#345947', x + 194, ground - 100, 100, 100);
    rect(ctx, '#ccd5b2', x + 241, ground - 96, 4, 96);
    rect(ctx, '#d6b55e', x + 230, ground - 51, 5, 7); rect(ctx, '#d6b55e', x + 253, ground - 51, 5, 7);
    rect(ctx, '#496d56', x + 130, ground - 134, 230, 23);
    ctx.fillStyle = C.cream; ctx.font = 'bold 11px system-ui'; ctx.fillText('LABORATÓRIO · CIÊNCIA & CUIDADO', x + 245, ground - 118);
    ctx.textAlign = 'left';
  }
  function terrain(ctx, state) {
    const { camera = 0, groundY: ground = 512 } = state;
    rect(ctx, C.dirt, 0, ground, W, H - ground);
    rect(ctx, '#456941', 0, ground, W, 6);
    rect(ctx, '#839953', 0, ground + 6, W, 5);
    const begin = Math.floor(camera / 42) - 1;
    for (let i = begin; i < begin + 32; i++) {
      const x = i * 42 - camera;
      rect(ctx, C.dirtLight, x + 10, ground + 25, 8, 4);
      rect(ctx, '#796341', x + 26, ground + 50, 11, 5);
      rect(ctx, '#b19a62', x, ground + 72, 8, 5);
      rect(ctx, '#698449', x + 16, ground + 9, 4, 6);
    }
    for (const gap of state.gaps || []) {
      const x = gap.x - camera;
      rect(ctx, '#668765', x, ground, gap.w, H - ground);
      rect(ctx, '#5f805e', x, ground + 28, gap.w, H - ground - 28);
    }
    for (let i = Math.floor(camera / 63); i < Math.floor(camera / 63) + 22; i++) {
      const x = i * 63 - camera + 13;
      if ((state.gaps || []).some(g => i * 63 + 13 > g.x - 6 && i * 63 + 13 < g.x + g.w + 6)) continue;
      rect(ctx, '#5d7a43', x, ground - 8, 4, 8); rect(ctx, '#628348', x - 4, ground - 5, 13, 3);
      if (i % 3 === 1) { rect(ctx, '#839652', x + 19, ground - 14, 3, 14); rect(ctx, '#e7d38a', x + 17, ground - 16, 6, 6); }
    }
  }
  function platform(ctx, p, camera) {
    const x = p.x - camera, y = p.y, w = p.w;
    rect(ctx, '#638347', x, y, w, 7); rect(ctx, '#8c9e54', x + 4, y, w - 8, 4);
    rect(ctx, '#8f774c', x, y + 7, w, 9); rect(ctx, '#5b6740', x, y + 14, w, 4);
    for (let i = 5; i < w; i += 22) rect(ctx, '#ccb27b', x + i, y + 9, 7, 3);
    for (let i = 9; i < w; i += 41) rect(ctx, '#729346', x + i, y - 5, 4, 5);
  }
  function note(ctx, x, y, time, index) {
    y += Math.sin(time / 270 + index) * 3;
    ctx.globalAlpha = .14; rect(ctx, '#fff6b2', x - 15, y - 15, 30, 30); ctx.globalAlpha = 1;
    rect(ctx, '#e6c46f', x - 5, y - 10, 10, 20); rect(ctx, '#efd990', x - 10, y - 5, 20, 10);
    rect(ctx, '#fff5bf', x - 4, y - 4, 8, 8);
  }
  function marker(ctx, station, camera, ground, time, total) {
    const x = station.x - camera, solved = station.solved, color = solved ? '#8cbb91' : '#dfbf61';
    rect(ctx, '#8d9460', x - 4, ground - 50, 7, 44);
    rect(ctx, '#dfd6a6', x - 12, ground - 57, 25, 17);
    rect(ctx, '#9f925e', x - 8, ground - 53, 15, 2); rect(ctx, '#9f925e', x - 8, ground - 48, 10, 2);
    const y = ground - 92 + Math.sin(time / 380 + station.index) * 2;
    ctx.globalAlpha = .13; rect(ctx, color, x - 27, y - 27, 54, 54); ctx.globalAlpha = 1;
    poly(ctx, color, [[x, y - 23], [x + 23, y], [x, y + 23], [x - 23, y]]);
    poly(ctx, solved ? '#b4dac0' : '#f7e5a3', [[x, y - 16], [x + 16, y], [x, y + 16], [x - 16, y]]);
    ctx.fillStyle = solved ? '#3e7852' : '#a17e39'; ctx.textAlign = 'center'; ctx.font = 'bold 12px system-ui';
    ctx.fillText(solved ? '✓' : String(station.index + 1).padStart(2, '0'), x, y + 4);
    const label = solved ? 'REGISTRO CONCLUÍDO' : 'INVESTIGAR';
    const width = solved ? 158 : 120;
    rect(ctx, '#254c3b', x - width / 2 - 2, ground - 141, width + 4, 23);
    rect(ctx, '#3c6549', x - width / 2, ground - 139, width, 19);
    ctx.fillStyle = '#e7e6bf'; ctx.font = 'bold 9px monospace'; ctx.fillText(label, x, ground - 126);
    ctx.textAlign = 'left';
    if (!solved) {
      const gx = (station.gateX ?? station.x + 170) - camera;
      rect(ctx, '#8d9560', gx - 25, ground - 137, 8, 136); rect(ctx, '#8d9560', gx + 24, ground - 137, 8, 136);
      rect(ctx, '#d6cc92', gx - 22, ground - 130, 3, 125); rect(ctx, '#d6cc92', gx + 25, ground - 130, 3, 125);
      rect(ctx, '#a3a768', gx - 35, ground - 139, 80, 7);
      ctx.strokeStyle = '#dfd498'; ctx.lineWidth = 3; ctx.setLineDash([11, 7]);
      ctx.beginPath(); ctx.moveTo(gx - 14, ground - 126); ctx.lineTo(gx + 21, ground - 9); ctx.moveTo(gx + 21, ground - 126); ctx.lineTo(gx - 14, ground - 9); ctx.stroke(); ctx.setLineDash([]);
      rect(ctx, '#2f5742', gx - 44, ground - 167, 100, 24);
      ctx.fillStyle = '#e5e3b9'; ctx.textAlign = 'center'; ctx.font = 'bold 9px monospace'; ctx.fillText(`PUZZLE ${station.index + 1} / ${total}`, gx + 6, ground - 151); ctx.textAlign = 'left';
    }
  }
  function explorer(ctx, p, time, invulnerable = false) {
    if (invulnerable && Math.floor(time / 90) % 2) return;
    const moving = Math.abs(p.vx || 0) > .1;
    const stride = moving && p.grounded ? Math.floor(time / 100) % 2 : 0;
    const bob = moving && p.grounded ? stride : 0;
    ctx.save(); ctx.translate(Math.round(p.x + 14), Math.round(p.y + bob)); ctx.scale(p.facing === -1 ? -1 : 1, 1);
    // A small field scientist: dark outline, cream shirt, canvas backpack and hat.
    rect(ctx, '#4b4b37', -8, 0, 18, 3); rect(ctx, '#8e7851', -10, 3, 24, 5);
    rect(ctx, '#d8be8b', -7, 3, 16, 6); rect(ctx, '#eed5a0', -6, 7, 19, 13);
    rect(ctx, '#5f4930', -9, 8, 5, 10); rect(ctx, '#4f4937', 10, 9, 3, 4);
    rect(ctx, '#dfb27c', 11, 14, 5, 4); rect(ctx, '#826344', 0, 20, 11, 3);
    rect(ctx, '#617352', -20, 20, 12, 21); rect(ctx, '#a3aa73', -19, 21, 8, 16);
    rect(ctx, '#d5d1a6', -17, 23, 3, 14); rect(ctx, '#465c42', -20, 39, 11, 4);
    rect(ctx, '#63664a', -10, 21, 21, 21); rect(ctx, '#ebe5bf', -8, 22, 16, 17);
    rect(ctx, '#f7efce', -5, 23, 9, 12); rect(ctx, '#c5c59c', -10, 33, 7, 6);
    rect(ctx, '#9d9f71', -8, 39, 19, 4); rect(ctx, '#676d4e', 3, 23, 3, 17);
    rect(ctx, '#ede5bf', 5, 25, 12, 6); rect(ctx, '#edd2a0', 14, 27, 9, 6);
    rect(ctx, '#a2a981', 18, 27, 18, 7); rect(ctx, '#637b59', 19, 32, 9, 3); rect(ctx, '#d1c18c', 31, 28, 9, 4);
    rect(ctx, '#9a9d75', -7, 42, 7, 3 + stride * 2); rect(ctx, '#475440', -10 - stride * 2, 45, 12, 3);
    rect(ctx, '#bbb995', 5, 41, 6, 4 - stride); rect(ctx, '#535b40', 5 + stride * 2, 44 - stride, 12, 3);
    ctx.restore();
  }
  function tank(ctx, tankState, camera, ground, time, player) {
    const x = tankState.x - camera;
    ground = tankState.y ?? ground;
    ctx.save(); ctx.translate(Math.round(x), ground);
    const facing = tankState.facing || (tankState.mounted ? player.facing : 1) || 1;
    ctx.scale(facing, 1);
    rect(ctx, '#43513a', -54, -26, 108, 23); rect(ctx, '#334638', -48, -30, 96, 29);
    rect(ctx, '#9a9d6d', -45, -23, 89, 19);
    for (let i = 0; i < 5; i++) {
      rect(ctx, '#475e43', -42 + i * 18, -21, 14, 15); rect(ctx, '#b7b789', -39 + i * 18, -18, 8, 9);
    }
    for (let i = 0; i < 10; i++) {
      const phase = Math.abs(tankState.vx ?? (tankState.mounted ? player.vx : 0) ?? 0) > .1 ? Math.floor(time / 70) % 5 : 0;
      rect(ctx, '#7b865c', -50 + i * 10 + phase, -29, 6, 3); rect(ctx, '#77835b', -50 + i * 10 - phase, -5, 6, 3);
    }
    poly(ctx, '#6d8654', [[-51,-29],[-45,-53],[-24,-62],[33,-59],[51,-39],[46,-29]]);
    rect(ctx, '#91a46a', -39, -52, 66, 8); rect(ctx, '#57724a', -39, -44, 80, 12);
    rect(ctx, '#bec589', -43, -43, 14, 8); rect(ctx, '#3f5e42', 30, -43, 12, 12);
    rect(ctx, '#637b4e', -23, -75, 52, 21); rect(ctx, '#a0b178', -17, -77, 40, 8);
    rect(ctx, '#3c5c41', 19, -69, 64, 10); rect(ctx, '#708b5a', 22, -69, 57, 4); rect(ctx, '#344e3a', 78, -72, 9, 16);
    rect(ctx, '#dde0ac', -12, -44, 19, 5); rect(ctx, '#9baf75', -9, -38, 12, 4);
    if (tankState.mounted) {
      rect(ctx, '#d5bc87', -9, -89, 15, 13); rect(ctx, '#6e5b3a', -10, -92, 18, 5);
      rect(ctx, '#e3cda0', -12, -89, 22, 4); rect(ctx, '#3d4834', 3, -85, 3, 3);
      rect(ctx, '#e3dfb6', -13, -76, 23, 5);
    }
    ctx.restore();
    if (!tankState.mounted) {
      rect(ctx, '#305440', x - 64, ground - 111, 128, 21);
      ctx.fillStyle = '#f2e7b6'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.fillText('F · ENTRAR NO MC-01', x, ground - 97); ctx.textAlign = 'left';
    }
  }
  function bug(ctx, enemy, camera, time) {
    const x = Math.round(enemy.x - camera), y = Math.round(enemy.y ?? 495), frame = Math.floor(time / 130) % 2;
    rect(ctx, '#453b2b', x + 1, y, 18, 13); rect(ctx, '#92723f', x + 4, y + 2, 12, 9);
    rect(ctx, '#b39a58', x + 6, y + 3, 3, 8); rect(ctx, '#b39a58', x + 12, y + 3, 2, 8);
    rect(ctx, '#3d3e2e', x + 7, y - 5, 6, 6); rect(ctx, '#3d3e2e', x + 4, y - 8, 2, 6); rect(ctx, '#3d3e2e', x + 13, y - 8, 2, 6);
    for (let i = 0; i < 3; i++) {
      rect(ctx, '#4b4630', x - 4 - (i % 2 === frame ? 2 : 0), y + i * 5, 8, 3);
      rect(ctx, '#4b4630', x + 16, y + i * 5, 8 + (i % 2 === frame ? 2 : 0), 3);
    }
  }
  function parasite(ctx, boss, camera, time) {
    if (!boss?.active || boss.defeated) return;
    const x = boss.x - camera, y = boss.y ?? 446;
    ctx.strokeStyle = '#af7155'; ctx.lineWidth = 13; ctx.lineCap = 'square';
    ctx.beginPath(); ctx.moveTo(x - 40, y - 40); ctx.bezierCurveTo(x + 62, y - 70, x + 66, y + 70, x - 32, y + 35); ctx.stroke();
    ctx.strokeStyle = '#dbab79'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 32, y - 40); ctx.bezierCurveTo(x + 46, y - 60, x + 58, y + 61, x - 24, y + 35); ctx.stroke();
    rect(ctx, '#7f4e44', x + 16, y - 4, 15, 13);
    ctx.strokeStyle = '#b2815c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 34, y + 35); ctx.quadraticCurveTo(x - 95, y + 58 + Math.sin(time / 250) * 12, x - 88, y + 10); ctx.stroke();
    rect(ctx, '#294d3d', x - 90, y - 101, 180, 12); rect(ctx, '#d8b064', x - 87, y - 98, 174 * Math.max(0, boss.hp / (boss.maxHp || 18)), 6);
    ctx.fillStyle = '#315442'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.fillText('DESAFIO FINAL · FANTASIA', x, y - 113); ctx.textAlign = 'left';
  }
  function headsUp(ctx, state) {
    rect(ctx, '#edf0d6', 18, 14, state.solved >= 8 ? 145 : 109, 28);
    ctx.fillStyle = '#667d5b'; ctx.font = '10px monospace';
    const label = state.solved >= 8 ? '03 — LABORATÓRIO' : state.solved >= 4 ? '02 — CAMINHO' : '01 — FLORESTA';
    ctx.fillText(label, 28, 32);
    ctx.fillStyle = '#b99d62'; ctx.font = 'bold 22px system-ui';
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < (state.health ?? 3) ? '#fff0bd' : '#92ae8d';
      ctx.fillText('♥', W - 83 + i * 25, 37);
    }
    ctx.strokeStyle = '#d8b65b'; ctx.lineWidth = 3; ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
    ctx.strokeStyle = '#e9d88a'; ctx.lineWidth = 1; ctx.strokeRect(5.5, 5.5, W - 11, H - 11);
  }
  function draw(ctx, state = {}) {
    const camera = state.camera || 0, time = state.time || 0, ground = state.groundY || 512;
    ctx.save(); ctx.imageSmoothingEnabled = false; ctx.clearRect(0, 0, W, H);
    backdrop(ctx, camera, time, ground, state.solved >= 6);
    const start = Math.floor((camera - 300) / 880), end = Math.ceil((camera + W + 300) / 880);
    const labX = (state.worldWidth || 7800) - 680;
    for (let i = start; i <= end; i++) {
      const offset = i * 880;
      if (offset + 210 < labX - 200 && offset >= 0) house(ctx, offset + 210 - camera, ground, i);
      for (const [dx, variant] of [[120, 0], [600, 1], [788, 2]]) {
        if (offset + dx >= 0 && offset + dx < labX - 70) tree(ctx, offset + dx - camera, ground, i * 5 + variant);
      }
      if (offset >= 0 && offset < labX - 200) fence(ctx, offset + 66 - camera, ground, 127);
    }
    if (labX - camera < W + 100 && labX + 500 - camera > -100) labBuilding(ctx, labX - camera, ground);
    terrain(ctx, state);
    for (const p of state.platforms || []) if (p.x + p.w > camera - 20 && p.x < camera + W + 20) platform(ctx, p, camera);
    for (const st of state.stations || []) if (st.x > camera - 250 && st.x < camera + W + 250) marker(ctx, st, camera, ground, time, state.total || 8);
    (state.notes || []).forEach((n, i) => { if (!n.collected && n.x > camera - 30 && n.x < camera + W + 30) note(ctx, n.x - camera, n.y, time, i); });
    for (const e of state.enemies || []) if (e.alive && e.x > camera - 40 && e.x < camera + W + 40) bug(ctx, e, camera, time);
    const player = state.player || { x: 100, y: ground - 46, width: 28, height: 46, facing: 1, vx: 0, grounded: true };
    if (state.tank) tank(ctx, state.tank, camera, ground, time, player);
    if (!state.tank?.mounted) explorer(ctx, { ...player, x: player.x - camera }, time, state.invulnerable);
    for (const b of state.bullets || []) {
      rect(ctx, b.vehicle ? '#edd38b' : '#c2e4b8', b.x - camera - 8, b.y - 4, b.vehicle ? 20 : 15, 8);
      rect(ctx, b.vehicle ? '#fff0b2' : '#e7f2cc', b.x - camera + 3, b.y - 5, 7, 10);
    }
    parasite(ctx, state.boss, camera, time); headsUp(ctx, state);
    ctx.restore();
  }
  window.GameRenderer = Object.freeze({ draw, width: W, height: H });
})();
