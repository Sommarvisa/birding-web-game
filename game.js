import { birdList, getRandomBird, firstTimeBirds } from './birds.js';
import { updateBirdJournalDisplay } from './journal.js';
import {
  walkingStatDisplay,
  walkingClickable,
  walkingProgress,
  walkingLabel,
  countdownDisplay,
  logFilter,
  birdLogList,
  birdJournalList,
  birdCount,
  clearSaveButton,
  updateCountdownDisplay
} from './ui.js';
import {
    renderLocationActions,
    togglePause,
    locations,
    locationStats,
    locationProgress,
    isPausedByLocation,
    startLoopFor
  } from './locations.js';  

  import { stats
  } from './stats.js'

export let birdJournal = [];
export let knowledgeStat = 0;

let isPaused = true;
let remainingTime = 0;
let observingChance = 100;
let currentLocation = 'Park';

let birdLog = [];

loadGameState();
renderLocationActions(currentLocation);
updateActiveLocationUI(currentLocation);
updateDisplay();

export function saveGameState() {
    localStorage.setItem('birdJournal', JSON.stringify(birdJournal));
    localStorage.setItem('knowledgeStat', knowledgeStat.toString());
    localStorage.setItem('walkingStat', stats.walkingStat.toString());
    localStorage.setItem('birdLog', JSON.stringify(birdLog));
    localStorage.setItem('location', currentLocation)
    locations.forEach(loc => {
        localStorage.setItem(`stat_${loc.name}`, locationStats[loc.name]);
        localStorage.setItem(`progress_${loc.name}`, locationProgress[loc.name]);
        localStorage.setItem(`paused_${loc.name}`, isPausedByLocation[loc.name]);
      });
      
      
  }

  function loadGameState() {
    const savedJournal = localStorage.getItem('birdJournal');
    const savedKnowledge = localStorage.getItem('knowledgeStat');
    const savedLog = localStorage.getItem('birdLog');
    const savedLocation = localStorage.getItem('location');
    const savedWalkingStat = localStorage.getItem('walkingStat');

    locations.forEach(loc => {
        const savedStat = localStorage.getItem(`stat_${loc.name}`);
        const savedProgress = localStorage.getItem(`progress_${loc.name}`);
        const savedPause = localStorage.getItem(`paused_${loc.name}`);
        
        if (savedStat !== null) locationStats[loc.name] = parseInt(savedStat);
        if (savedProgress !== null) locationProgress[loc.name] = parseFloat(savedProgress);
        if (savedPause !== null) isPausedByLocation[loc.name] = savedPause === 'true';
      });
      
      
  
    if (savedJournal) birdJournal = JSON.parse(savedJournal);
    if (savedKnowledge) knowledgeStat = parseInt(savedKnowledge);
    if (savedWalkingStat) stats.walkingStat = parseInt(savedWalkingStat);
    if (savedLog) birdLog = JSON.parse(savedLog);
    if (savedLocation) currentLocation = savedLocation;

    updateBirdLogDisplay();
  }

export function updateDisplay() {
    document.getElementById('walkingStatDisplay').textContent = stats.walkingStat;
  updateCountdownDisplay();
}

export function performObserve() {
  const roll = Math.floor(Math.random() * 101);
  if (roll <= observingChance) {
    observeBird();
  } else {
    observingChance++;
  }
}

function observeBird() {
  const bird = getRandomBird();
  const isNew = addToJournal(bird.name);
  logBirdSighting(bird.name, isNew);
}

function addToJournal(birdName) {
  if (!birdJournal.includes(birdName)) {
    birdJournal.push(birdName);
    firstTimeBirds.push(birdName);
    updateBirdJournalDisplay(); // Update journal grid
    saveGameState();
    return true;
  }
  saveGameState();
  return false;
}

logFilter.addEventListener('change', updateBirdLogDisplay);

function logBirdSighting(bird, isNew) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let entry = `[${timestamp}] Observed a ${bird}`;
  if (isNew) entry += " for the first time!";
  birdLog.unshift(entry);
  updateBirdLogDisplay();
}

function updateBirdLogDisplay() {
  const filterValue = logFilter.value;
  birdLogList.innerHTML = '';

  let entries = birdLog;
  if (filterValue === 'firstTime') {
    entries = birdLog.filter(entry =>
      firstTimeBirds.some(bird => entry.includes(bird))
    );
  }

  entries.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry;
    birdLogList.appendChild(li);
  });
}

let lastTime = performance.now();
updateDisplay();
requestAnimationFrame(gameLoop);

function gameLoop(currentTime) {
  if (isPaused) return;
  const delta = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  walkingProgressValue += getWalkingSpeed(walking) * delta;
  if (walkingProgressValue >= walkingGoal) {
    doWalk();
  }

  calculateRemainingTime();
  walkingProgress.style.width = `${Math.min((walkingProgressValue / walkingGoal) * 100, 100)}%`;
  updateDisplay();
  requestAnimationFrame(gameLoop);
}

document.querySelectorAll('.subnav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const selected = link.textContent.trim();
      currentLocation = selected;
      saveGameState();
      updateActiveLocationUI(selected);
      renderLocationActions(selected); // update visible progress bar!
    });
  });
  
  
  function updateActiveLocationUI(selected) {
    document.querySelectorAll('.subnav-link').forEach(link => {
      if (link.textContent.trim() === selected) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderLocationActions(currentLocation);
    startLoopFor(currentLocation);
  });
  


if (clearSaveButton) {
    clearSaveButton.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear your save?")) {
        localStorage.clear();
        location.reload();
      }
    });
  }
