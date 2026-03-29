function drawDieFace(scene, x, y, size, value) {
  const g = scene.add.graphics();
  const radius = Math.max(10, Math.floor(size * 0.12));

  g.fillStyle(0xffffff, 1);
  g.lineStyle(4, 0x1b355b, 1);
  g.fillRoundedRect(x, y, size, size, radius);
  g.strokeRoundedRect(x, y, size, size, radius);

  const margin = size * 0.23;
  const cx = x + size * 0.5;
  const cy = y + size * 0.5;
  const lx = x + margin;
  const rx = x + size - margin;
  const ty = y + margin;
  const by = y + size - margin;
  const dotR = Math.max(5, size * 0.07);

  const drawDot = (dx, dy) => {
    g.fillStyle(0x172236, 1);
    g.fillCircle(dx, dy, dotR);
  };

  if ([1, 3, 5].includes(value)) drawDot(cx, cy);
  if (value >= 2) {
    drawDot(lx, ty);
    drawDot(rx, by);
  }
  if (value >= 4) {
    drawDot(rx, ty);
    drawDot(lx, by);
  }
  if (value === 6) {
    drawDot(lx, cy);
    drawDot(rx, cy);
  }

  return g;
}

export function drawNumberVisual(scene, x, y, number, dieSize = 110) {
  const parts = [];

  if (number <= 6) {
    parts.push(drawDieFace(scene, x - dieSize / 2, y - dieSize / 2, dieSize, number));
    return parts;
  }

  if (number <= 12) {
    const left = Math.min(6, Math.ceil(number / 2));
    const right = Math.max(1, number - left);
    const gap = dieSize * 0.22;

    parts.push(drawDieFace(scene, x - dieSize - gap / 2, y - dieSize / 2, dieSize, left));
    parts.push(drawDieFace(scene, x + gap / 2, y - dieSize / 2, dieSize, right));
    return parts;
  }

  const txt = scene.add
    .text(x, y, String(number), {
      fontFamily: 'Arial Black',
      fontSize: Math.round(dieSize * 0.55),
      color: '#ffffff',
      stroke: '#0f1d30',
      strokeThickness: 6,
    })
    .setOrigin(0.5);

  parts.push(txt);
  return parts;
}
