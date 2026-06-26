import { PLAYER_BLUEPRINTS } from './config.js';

export let gameState = {
    activePlayerIndex: 0,
    players: JSON.parse(JSON.stringify(PLAYER_BLUEPRINTS)).map((player) => {
        player.tile = 1;
        return player;
    }),
    teleportMap: {
        93: 43,
        12: 74
    },
    moveHistory: [],
    isRolling: false,
    activeMode: null,
    placementStep: 0,
    tempStartTile: null
};
