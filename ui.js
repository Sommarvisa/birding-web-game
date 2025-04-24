// === ui.js ===

// === UI ELEMENT REFERENCES ===

// Stats
export const walkingStatDisplay = document.getElementById('walkingStat');

// Progress bar
export const walkingClickable = document.getElementById('walkingClickable');
export const walkingProgress = document.getElementById('walkingProgress');
export const walkingLabel = document.getElementById('walkingLabel');
export const countdownDisplay = document.getElementById('countdownDisplay');

// Log
export const logFilter = document.getElementById('logFilter');
export const birdLogList = document.getElementById('birdLogList');

// Journal (only needed on journal.html)
export const birdJournalList = document.getElementById('birdJournalList');
export const birdCount = document.getElementById('birdCount');

// Buttons
export const clearSaveButton = document.getElementById('clearSaveButton');

export function updateCountdownDisplay(remainingTime) {
  let displayTime = remainingTime;
  let unit = 's';

  if (remainingTime >= 31536000) {
    displayTime = remainingTime / 31536000;
    unit = 'y';
  } else if (remainingTime >= 86400) {
    displayTime = remainingTime / 86400;
    unit = 'd';
  } else if (remainingTime >= 3600) {
    displayTime = remainingTime / 3600;
    unit = 'h';
  } else if (remainingTime >= 60) {
    displayTime = remainingTime / 60;
    unit = 'min';
  }
}

export function updateBirdCount(currentCount, totalCount) {
  birdCount.textContent = `${currentCount}/${totalCount}`;
}

export function setupTabs() {
    journalTabButton.addEventListener('click', () => {
      mainTab.style.display = 'none';
      journalTab.style.display = 'block';
    });
  
    mainTabButton.addEventListener('click', () => {
      journalTab.style.display = 'none';
      mainTab.style.display = 'block';
    });
  }