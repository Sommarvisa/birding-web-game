// This is the starting point: main.js
import { setupUI, updateDisplay } from './ui.js';
import { startGameLoop } from './stats.js';
import { initializeBirding } from './birding.js';

window.addEventListener('DOMContentLoaded', () => {
    setupUI();
    initializeBirding();
    updateDisplay();
    startGameLoop();
});