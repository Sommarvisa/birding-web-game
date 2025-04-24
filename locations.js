import { stats } from './stats.js';
import { performAction } from './actions.js';

export const locations = [
  { name: 'Park', goal: 10, label: 'Strolling in the Park', actionType: 'walk' },
  { name: 'Forest', goal: 14, label: 'Hiking in the Forest' },
  { name: 'Dunes', goal: 12, label: 'Roam the Dunes' },
  { name: 'Grassland', goal: 11, label: 'Wandering the Meadows' },
  { name: 'Wetland', goal: 16, label: 'Wading the Marshes' },
  { name: 'River', goal: 13, label: 'Following the Riverbank' },
  { name: 'Ocean', goal: 18, label: 'Walking the Shoreline' }
];

export let locationStats = {};
export let locationProgress = {};
export let isPausedByLocation = {};
let lastTimestamps = {};

export function renderLocationActions(currentLocation) {
  const container = document.getElementById('actionContainer');
  if (!container) return;
  container.innerHTML = '';

  // Base bar
  if (currentLocation === 'Park') {
    renderProgressBar({ location: 'Park', actionType: 'walk', label: 'Strolling in the Park', goal: 10 });
    if (stats.walkingStat >= 5) {
      renderProgressBar({ location: 'Park', actionType: 'explore', label: 'Exploring the Park', goal: 12 });
    }
  } else {
    const config = locations.find(loc => loc.name === currentLocation);
    if (config) {
      renderProgressBar({ location: config.name, actionType: config.actionType || 'walk', label: config.label, goal: config.goal });
    }
  }
}

function renderProgressBar({ location, actionType, label, goal }) {
  const container = document.getElementById('actionContainer');

  const wrapper = document.createElement('div');
  wrapper.className = 'progress-section';

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.id = `bar-${location}-${actionType}`;

  const fill = document.createElement('div');
  fill.className = 'progress-fill';
  fill.style.transition = 'width 0.2s linear';
  const paused = isPausedByLocation[`${location}-${actionType}`] ?? true;
  fill.style.backgroundColor = paused ? '#bbb' : '#4a6741';

  const progressKey = `${location}-${actionType}`;
  if (!(progressKey in isPausedByLocation)) {
    isPausedByLocation[progressKey] = true;
    localStorage.setItem(`paused_${progressKey}`, 'true');
  } 
  const stat = locationStats[progressKey] ?? 0;
  const progress = locationProgress[progressKey] ?? 0;
  const percent = Math.min((progress / goal) * 100, 100);
  fill.style.width = `${percent}%`;

  progressBar.appendChild(fill);

  const countdown = document.createElement('span');
  countdown.className = 'countdown-overlay';
  countdown.textContent = `${Math.ceil((goal - progress) / (1 + stat * 0.05))}s`;
  progressBar.appendChild(countdown);

  const labelEl = document.createElement('p');
  labelEl.className = 'progress-label';
  labelEl.textContent = label;

  wrapper.appendChild(progressBar);
  wrapper.appendChild(labelEl);
  container.appendChild(wrapper);

  progressBar.addEventListener('click', () => {
    Object.keys(isPausedByLocation).forEach(key => {
      if (key !== progressKey && !isPausedByLocation[key]) {
        isPausedByLocation[key] = true;
        localStorage.setItem(`paused_${key}`, 'true');
        updateBarColor(key);
      }
    });

    togglePause(progressKey);
  });

  startLoopFor(progressKey, goal, actionType, location);
}

function updateBarColor(key) {
  const fill = document.querySelector(`#bar-${key} .progress-fill`);
  if (fill) fill.style.backgroundColor = isPausedByLocation[key] ? '#bbb' : '#4a6741';
}

export function togglePause(key) {
    isPausedByLocation[key] = !isPausedByLocation[key];
    updateBarColor(key);
    localStorage.setItem(`paused_${key}`, isPausedByLocation[key]);
  
    if (!isPausedByLocation[key]) {
      const config = parseKey(key); // new helper
      lastTimestamps[key] = performance.now();
      requestAnimationFrame(timestamp => runLoop(key, timestamp, config.goal, config.actionType, config.location));
    }
  }

  function parseKey(key) {
    const [location, actionType] = key.split('-');
    const config = locations.find(l => l.name === location && l.actionType === actionType) || {};
    return {
      location,
      actionType,
      goal: config.goal ?? (actionType === 'walk' ? 10 : 12) // fallback for dynamic bars
    };
  }
  

export function startLoopFor(key, goal, actionType, location) {
  if (!isPausedByLocation[key]) {
    lastTimestamps[key] = performance.now();
    requestAnimationFrame(timestamp => runLoop(key, performance.now(), goal, actionType, location));
  }
}

function runLoop(key, currentTime, goal, actionType, location) {
  if (isPausedByLocation[key]) return;

  const delta = (lastTimestamps[key] !== undefined)
    ? (currentTime - lastTimestamps[key]) / 1000
    : 0;

  lastTimestamps[key] = currentTime;
  if (delta > 1) return;

  const stat = locationStats[key] ?? 0;
  const speed = 1 + stat * 0.05;
  locationProgress[key] = (locationProgress[key] ?? 0) + speed * delta;
  localStorage.setItem(`progress_${key}`, locationProgress[key]);

  if (locationProgress[key] >= goal) {
    locationStats[key] = (locationStats[key] ?? 0) + 1;
    locationProgress[key] = 0;
    localStorage.setItem(`stat_${key}`, locationStats[key]);
    localStorage.setItem(`progress_${key}`, locationProgress[key]);
    performAction(location, actionType);
  }

  const fill = document.querySelector(`#bar-${key} .progress-fill`);
  if (fill) fill.style.width = `${Math.min((locationProgress[key] / goal) * 100, 100)}%`;

  const countdown = document.querySelector(`#bar-${key} .countdown-overlay`);
  if (countdown) countdown.textContent = `${Math.ceil((goal - locationProgress[key]) / speed)}s`;

  requestAnimationFrame(timestamp => runLoop(key, timestamp, goal, actionType, location));
}
