import { GAME_CONFIG } from '../core/config.js';
import { handleCellSelection, handleMouseHover } from '../main.js';

export let gridBlocks = [];

export function renderGridStructure() {
    const grid = document.getElementById('board-grid');
    if (!grid) return;
    grid.innerHTML = '';
    gridBlocks = [];

    grid.style.gridTemplateColumns = `repeat(${GAME_CONFIG.cols}, ${GAME_CONFIG.cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${GAME_CONFIG.rows}, ${GAME_CONFIG.cellSize}px)`;

    for (let r = GAME_CONFIG.rows - 1; r >= 0; r--) {
        for (let c = 0; c < GAME_CONFIG.cols; c++) {
            let tileNumber = (r % 2 === 0)
                ? (r * GAME_CONFIG.cols + c + 1)
                : (r * GAME_CONFIG.cols + (GAME_CONFIG.cols - 1 - c) + 1);

            const cell = document.createElement('div');
            cell.classList.add('cell', tileNumber % 2 === 0 ? 'cell-even' : 'cell-odd');
            cell.id = `grid-tile-${tileNumber}`;
            cell.innerText = tileNumber;

            cell.addEventListener('click', () => handleCellSelection(tileNumber));
            
            // TRACK MOUSE MOVEMENT HERE
            cell.addEventListener('mousemove', (e) => handleMouseHover(e, tileNumber));

            grid.appendChild(cell);
            gridBlocks.push({ tileNum: tileNumber, element: cell });
        }
    }
    gridBlocks.sort((a, b) => a.tileNum - b.tileNum);
}

export function getTileCenter(tileNumber) {
    const zeroBased = tileNumber - 1;
    const r = Math.floor(zeroBased / GAME_CONFIG.cols);
    let c = zeroBased % GAME_CONFIG.cols;
    if (r % 2 === 1) c = (GAME_CONFIG.cols - 1) - c;

    return {
        x: c * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2,
        y: ((GAME_CONFIG.rows - 1) - r) * GAME_CONFIG.cellSize + GAME_CONFIG.cellSize / 2
    };
}

// NEW: Translates browser cursor events into exact pixel coordinates inside the board container
export function getMousePos(e) {
    const container = document.getElementById('board-grid').parentElement;
    const rect = container.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}
