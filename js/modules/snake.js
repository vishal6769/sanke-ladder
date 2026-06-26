import { getTileCenter } from './board.js';

/**
 * Draws a fully rendered snake body complete with an animated face layer
 * @param {CanvasRenderingContext2D} ctx - Target 2D drawing environment
 * @param {number} start - The starting Head tile index number
 * @param {number|Object} end - The ending Tail tile index number, or a live {x, y} coordinate vector map
 * @param {boolean} isGhost - Applies alpha opacity for active real-time mouse previews
 */
export function drawSnakeBody(ctx, start, end, isGhost = false) {
    const head = getTileCenter(start);
    // Determine if the destination input is a localized tile center or raw mouse pixel mapping coordinates
    const tail = (end && typeof end.x === 'number') ? end : getTileCenter(end);
    const midX = (head.x + tail.x) / 2;

    ctx.save();
    if (isGhost) ctx.globalAlpha = 0.5;

    // --- LAYER 1: Shadow Base Glow ---
    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.bezierCurveTo(midX + 50, head.y + 10, midX - 50, tail.y - 10, tail.x, tail.y);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();

    // --- LAYER 2: Outer Green Snake Scales Body ---
    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.bezierCurveTo(midX + 50, head.y + 10, midX - 50, tail.y - 10, tail.x, tail.y);
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // --- LAYER 3: Inner Spine Accent Striping ---
    ctx.beginPath();
    ctx.moveTo(head.x, head.y);
    ctx.bezierCurveTo(midX + 50, head.y + 10, midX - 50, tail.y - 10, tail.x, tail.y);
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 4;
    ctx.stroke();

    // --- LAYER 4: Dynamic Head Rotation Math ---
    // Calculate the angle from the first curve coordinate control handle point back to the anchor skull
    const controlPointX = midX + 50;
    const controlPointY = head.y + 10;
    const dx = controlPointX - head.x;
    const dy = controlPointY - head.y;
    const angle = Math.atan2(dy, dx);

    ctx.translate(head.x, head.y);
    ctx.rotate(angle);

    // --- LAYER 5: The Snake Head Skull Oval ---
    ctx.beginPath();
    // Draws an elongated jaw structure pointing forward down its directional orientation line
    ctx.ellipse(0, 0, 11, 8, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#27ae60';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#1e7e34';
    ctx.stroke();

    // --- LAYER 6: Reptilian Glowing Slit Eyes ---
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(3, -3, 2.5, 0, 2 * Math.PI); // Left Eye
    ctx.arc(3, 3, 2.5, 0, 2 * Math.PI);  // Right Eye
    ctx.fill();

    // Black center pupils
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(4, -3, 1, 0, 2 * Math.PI);
    ctx.arc(4, 3, 1, 0, 2 * Math.PI);
    ctx.fill();

    // --- LAYER 7: Forked Red Tongue ---
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(10, 0);   // Root inside mouth
    ctx.lineTo(16, 0);   // Main tongue shaft extended out
    ctx.moveTo(16, 0);
    ctx.lineTo(20, -3);  // Left fork fork prong tip
    ctx.moveTo(16, 0);
    ctx.lineTo(20, 3);   // Right fork prong tip
    ctx.stroke();

    ctx.restore();
}
