import { gameState } from '../core/state.js';
import { drawSnakeBody } from '../modules/snake.js';
import { drawLadderStructure } from '../modules/ladder.js';
import { gridBlocks } from '../modules/board.js';

export function refreshUiCanvas() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let key in gameState.teleportMap) {
        const start = parseInt(key);
        const end = gameState.teleportMap[key];
        if (end > start) drawLadderStructure(ctx, start, end);
        else drawSnakeBody(ctx, start, end);
    }
}

export function updatePlacementVisuals() {
    gridBlocks.forEach((cell) => {
        const el = cell.element;
        el.classList.remove('selected-placement-start', 'valid-placement-target');

        if (gameState.placementStep === 2 && cell.tileNum === gameState.tempStartTile) {
            el.classList.add('selected-placement-start');
        }
    });
}

export function renderPlayerPawns() {
    document.querySelectorAll('.pawn').forEach((pawn) => pawn.remove());
    gameState.players.forEach((player) => {
        const targetCell = document.getElementById(`grid-tile-${player.tile}`);
        if (targetCell) {
            const pawn = document.createElement('div');
            pawn.className = `pawn ${player.class}`;
            targetCell.appendChild(pawn);
        }
    });
}

export function updateStatusDisplay() {
    const nextPlayer = gameState.players[gameState.activePlayerIndex];
    const statusLabel = document.getElementById('activePlayerName');
    if (statusLabel) {
        statusLabel.innerText = nextPlayer.name;
        statusLabel.style.color = nextPlayer.color;
    }
}
