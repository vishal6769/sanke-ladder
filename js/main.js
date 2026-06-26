// Core Configuration and State Engines
import { gameState } from './core/state.js';
import { GAME_CONFIG } from './core/config.js';
import { checkPlacementValidity } from './core/rules.js';

// Modular Visual Component Renderers
import { renderGridStructure, getMousePos } from './modules/board.js';
import { animateDiceRoll } from './modules/dice.js';
import { drawSnakeBody } from './modules/snake.js';
import { drawLadderStructure } from './modules/ladder.js';

// User Interface Update Layer Managers
import { refreshUiCanvas, updatePlacementVisuals, renderPlayerPawns, updateStatusDisplay } from './ui/manager.js';

// Primary Viewport DOM Handle Bindings
const errorDiv = document.getElementById('error');
const diceBlock = document.getElementById('diceBlock');
const updateBtn = document.getElementById('update-btn');
const undoBtn = document.getElementById('undo-btn');

document.addEventListener('DOMContentLoaded', () => {
    // Render and build initial baseline gameplay metrics
    renderGridStructure(handleCellSelection);
    refreshUiCanvas();
    renderPlayerPawns();
    updateStatusDisplay();

    // Map actionable UI controls to unified event listener threads
    updateBtn.addEventListener('click', () => togglePlacementMode('snake'));
    undoBtn.addEventListener('click', () => togglePlacementMode('ladder'));
    document.getElementById('reset-btn').addEventListener('click', resetBoardData);
    diceBlock.addEventListener('click', handleDiceTurnCycle);
});

/**
 * Steps the placement tracking machine through building configuration gates
 */
function togglePlacementMode(type) {
    if (gameState.placementStep > 0) {
        resetPlacementEngine();
        return;
    }
    gameState.activeMode = type;
    gameState.placementStep = 1;
    errorDiv.innerText = `Mode Active: Click grid tile to select the ${type.toUpperCase()} start trigger point.`;

    if (type === 'snake') updateBtn.classList.add('placing-active');
    if (type === 'ladder') undoBtn.classList.add('placing-active');
}

/**
 * Evaluation callback handling player cell layout click interactions
 */
export function handleCellSelection(tileNumber) {
    if (gameState.placementStep === 0) return;

    // Gate 1: Selecting the initial starting cell anchor
    if (gameState.placementStep === 1) {
        if (gameState.teleportMap[tileNumber]) {
            errorDiv.innerText = "Placement Blocked: Element already occupies this space.";
            return;
        }
        gameState.tempStartTile = tileNumber;
        gameState.placementStep = 2;
        errorDiv.innerText = "Start Position Saved. Move mouse to trace and select target landing tile coordinate.";
        updatePlacementVisuals();
    } 
    // Gate 2: Saving the destination cell landing shortcut link
    else if (gameState.placementStep === 2) {
        const validation = checkPlacementValidity(
            gameState.tempStartTile,
            tileNumber,
            gameState.activeMode,
            gameState.teleportMap,
            GAME_CONFIG.cols
        );

        if (!validation.valid) {
            errorDiv.innerText = `Invalid: ${validation.msg}`;
            return;
        }

        gameState.teleportMap[gameState.tempStartTile] = tileNumber;
        errorDiv.innerText = `${gameState.activeMode.toUpperCase()} connected successfully.`;
        resetPlacementEngine();
    }
}

/**
 * Fires calculations, animations, and turn trackers for the active player pathing loops
 */
async function handleDiceTurnCycle() {
    if (gameState.isRolling || gameState.placementStep > 0) return;
    gameState.isRolling = true;
    errorDiv.innerText = '';

    const rolled = await animateDiceRoll(diceBlock);
    document.getElementById('diceResult').innerText = `Rolled: ${rolled}`;

    const activePlayer = gameState.players[gameState.activePlayerIndex];
    if (activePlayer.tile + rolled <= 100) {
        gameState.moveHistory.push({
            playerIndex: gameState.activePlayerIndex,
            previousTile: activePlayer.tile
        });

        activePlayer.tile += rolled;
        renderPlayerPawns();

        // Process landing on shortcut tiles (Snakes or Ladders)
        if (gameState.teleportMap[activePlayer.tile]) {
            const dest = gameState.teleportMap[activePlayer.tile];
            const isLadder = dest > activePlayer.tile;
            setTimeout(() => {
                errorDiv.style.color = isLadder ? "#2ecc71" : "#e74c3c";
                errorDiv.innerText = isLadder
                    ? `${activePlayer.name} climbed a Ladder to tile ${dest}!`
                    : `${activePlayer.name} slid down a Snake to tile ${dest}!`;
                activePlayer.tile = dest;
                renderPlayerPawns();
                if (activePlayer.tile === 100) handleVictory(activePlayer.name);
            }, 400);
        }

        // Run isolated victory verification check
        if (activePlayer.tile === 100) {
            handleVictory(activePlayer.name);
            gameState.isRolling = false;
            return;
        }
    } else {
        errorDiv.style.color = "#e74c3c";
        errorDiv.innerText = `Can't move! ${activePlayer.name} needs an exact ${100 - activePlayer.tile}.`;
    }

    // Step current playing sequence token index forward cleanly
    gameState.activePlayerIndex = (gameState.activePlayerIndex + 1) % gameState.players.length;
    updateStatusDisplay();
    gameState.isRolling = false;
}

/**
 * Updates UI to log victory states across error log components
 */
function handleVictory(name) {
    errorDiv.style.color = "#f1c40f";
    errorDiv.innerText = `Victory! ${name} completed the board layout match!`;
    setTimeout(resetBoardData, 3000);
}

/**
 * Resets temporary board builder parameters safely without modifying established shortcuts
 */
function resetPlacementEngine() {
    gameState.placementStep = 0;
    gameState.activeMode = null;
    gameState.tempStartTile = null;
    updateBtn.classList.remove('placing-active');
    undoBtn.classList.remove('placing-active');
    updatePlacementVisuals();
    refreshUiCanvas();
}

/**
 * Wipes memory parameters clean and sets up default baseline system configurations
 */
function resetBoardData() {
    gameState.teleportMap = { 93: 43, 12: 74 };
    gameState.moveHistory = [];
    gameState.activePlayerIndex = 0;
    gameState.players.forEach((player) => {
        player.tile = 1;
    });
    document.getElementById('diceResult').innerText = "Tap Dice To Roll";
    errorDiv.style.color = "#e74c3c";
    errorDiv.innerText = '';
    resetPlacementEngine();
    renderPlayerPawns();
    updateStatusDisplay();
}

/**
 * Listens for mouse movements to paint live transparent ghost previews across the screen canvas
 */
export function handleMouseHover(e, currentTile) {
    if (gameState.placementStep !== 2) return;

    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 1. Clear layout canvas and redraw established links so they remain visible
    refreshUiCanvas();

    // 2. Translate event coordinates into exact canvas container pixel locations
    const mouseCoordinates = getMousePos(e);

    // 3. Render floating, live transparent element preview lines tracking mouse movement
    if (gameState.activeMode === 'snake') {
        drawSnakeBody(ctx, gameState.tempStartTile, mouseCoordinates, true);
    } else if (gameState.activeMode === 'ladder') {
        drawLadderStructure(ctx, gameState.tempStartTile, mouseCoordinates, true);
    }
}
