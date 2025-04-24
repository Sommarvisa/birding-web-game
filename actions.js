import { stats } from "./stats.js";
import { performObserve,
    updateDisplay,
    saveGameState
 } from "./game.js";
import { renderLocationActions } from "./locations.js";

export function performAction(location, actionType) {
    if (location === 'Park' && actionType === 'walk') {
        stats.walkingStat++;
    }

    if (location === 'Park' && actionType === 'explore') {
        stats.exploringStat++;
    }

    // Add more actions here later...
    performObserve();
    updateDisplay();
    saveGameState();
}

/* function doWalk() {
    calculateRemainingTime();
    updateDisplay();
    doObserve();
    saveGameState();
  } */