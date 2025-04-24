import { birdList, getRandomBird, firstTimeBirds } from './birds.js';
import { updateBirdJournalDisplay } from './journal.js';

export let birdJournal = [];
export let knowledgeStat = 0;

let walking = 0;
let walkingProgressValue = 0;
let walkingGoal = 4;
let isPaused = true;
let remainingTime = 0;
let observingChance = 100;

const walkingStatDisplay = document.getElementById('walkingStat');
const walkingProgress = document.getElementById('walkingProgress');
const walkingClickable = document.getElementById('walkingClickable');
const walkingLabel = document.getElementById('walkingLabel');
const countdownDisplay = document.getElementById('countdownDisplay');
const birdLogList = document.getElementById('birdLogList');
const logFilter = document.getElementById('logFilter');

let birdLog = [];

function getWalkingSpeed(stat) {
  return 1 + stat * 0.05;
}

function doWalk() {
  walking++;
  walkingProgressValue = 0;
  calculateRemainingTime();
  updateDisplay();
  doObserve();
}

function updateDisplay() {
  walkingStatDisplay.textContent = walking;
  walkingLabel.textContent = `Walking in the Park`;
  updateCountdownDisplay();
}

function updateCountdownDisplay() {
  let displayTime = remainingTime;
  let unit = 's';
  if (remainingTime >= 60) {
    displayTime = remainingTime / 60;
    unit = 'min';
  }
  if (remainingTime >= 3600) {
    displayTime = remainingTime / 3600;
    unit = 'h';
  }
  if (remainingTime >= 86400) {
    displayTime = remainingTime / 86400;
    unit = 'd';
  }
  if (remainingTime >= 31536000) {
    displayTime = remainingTime / 31536000;
    unit = 'y';
  }
  countdownDisplay.textContent = `${Math.floor(displayTime)} ${unit}`;
}

function calculateRemainingTime() {
  const walkingSpeed = getWalkingSpeed(walking);
  const remainingProgress = walkingGoal - walkingProgressValue;
  remainingTime = remainingProgress / walkingSpeed;
}

function doObserve() {
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
    return true;
  }
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

walkingClickable.addEventListener('click', () => {
  isPaused = !isPaused;
  walkingProgress.style.backgroundColor = isPaused ? '#bbb' : '#4a6741';
  if (!isPaused) {
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  }
});

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
