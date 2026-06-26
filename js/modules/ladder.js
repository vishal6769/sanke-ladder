import { getTileCenter } from './board.js';

export function drawLadderStructure(ctx, start, end, isGhost = false) {
    const bottom = getTileCenter(start);
    
    // LIVE DETECTOR: If end has an .x property, use it directly as raw mouse coordinates
    const top = (end && typeof end.x === 'number') ? end : getTileCenter(end);

    const dx = top.x - bottom.x;
    const dy = top.y - bottom.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const halfWidth = 8;

    ctx.save();
    if (isGhost) ctx.globalAlpha = 0.5;
    
    ctx.translate(bottom.x, bottom.y);
    ctx.rotate(angle);

    ctx.strokeStyle = '#2980b9';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -halfWidth); ctx.lineTo(distance, -halfWidth);
    ctx.moveTo(0, halfWidth);  ctx.lineTo(distance, halfWidth);
    ctx.stroke();

    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -halfWidth); ctx.lineTo(distance, -halfWidth);
    ctx.moveTo(0, halfWidth);  ctx.lineTo(distance, halfWidth);
    ctx.stroke();

    ctx.strokeStyle = '#edf2f7';
    ctx.lineWidth = 2;
    const spacing = 18;
    const totalRungs = Math.floor(distance / spacing);
    
    ctx.beginPath();
    for (let i = 1; i < totalRungs; i++) {
        ctx.moveTo(i * spacing, -halfWidth + 1);
        ctx.lineTo(i * spacing, halfWidth - 1);
    }
    ctx.stroke();
    ctx.restore();
}
