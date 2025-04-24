export const locations = [
    { name: 'Park', goal: 10, label: 'Walking in the Park' },
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

locations.forEach(loc => {
    const storedStat = localStorage.getItem(`stat_${loc.name}`);
    const storedProgress = localStorage.getItem(`progress_${loc.name}`);
    const storedPaused = localStorage.getItem(`paused_${loc.name}`);

    locationStats[loc.name] = storedStat ? parseInt(storedStat) : 0;
    locationProgress[loc.name] = storedProgress ? parseFloat(storedProgress) : 0;
    isPausedByLocation[loc.name] = storedPaused ? storedPaused === 'true' : true;
});

let lastTimestamps = {};

export function renderLocationActions(currentLocation) {
    const container = document.getElementById('actionContainer');
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'progress-section';

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.id = `bar-${currentLocation}`;

    const fill = document.createElement('div');
    fill.className = 'progress-fill';
    fill.style.transition = 'width 0.2s linear';
    fill.style.backgroundColor = isPausedByLocation[currentLocation] ? '#bbb' : '#4a6741';

    const config = getLocationConfig(currentLocation);
    const goal = config ? config.goal : 10;
    const percent = Math.min((locationProgress[currentLocation] / goal) * 100, 100);
    fill.style.width = `${percent}%`;

    progressBar.appendChild(fill);

    const countdown = document.createElement('span');
    countdown.className = 'countdown-overlay';
    countdown.textContent = `${Math.ceil((goal - locationProgress[currentLocation]) / (1 + locationStats[currentLocation] * 0.05))}s`;
    progressBar.appendChild(countdown);

    const label = document.createElement('p');
    label.className = 'progress-label';
    label.textContent = config?.label || `Exploring ${currentLocation}`;

    wrapper.appendChild(progressBar);
    wrapper.appendChild(label);
    container.appendChild(wrapper);

    progressBar.addEventListener('click', () => {
        // Pause all others first
        locations.forEach(loc => {
            if (loc.name !== currentLocation && !isPausedByLocation[loc.name]) {
                isPausedByLocation[loc.name] = true;
                localStorage.setItem(`paused_${loc.name}`, 'true');
                updateBarColor(loc.name);
            }
        });

        togglePause(currentLocation);
    });
}

function updateBarColor(location) {
    const fill = document.querySelector(`#bar-${location} .progress-fill`);
    if (fill) {
        fill.style.backgroundColor = isPausedByLocation[location] ? '#bbb' : '#4a6741';
    }
}

export function togglePause(location) {
    isPausedByLocation[location] = !isPausedByLocation[location];
    updateBarColor(location);
    localStorage.setItem(`paused_${location}`, isPausedByLocation[location]);

    if (!isPausedByLocation[location]) {
        lastTimestamps[location] = performance.now();
        requestAnimationFrame(timestamp => runLoop(location, timestamp));
    }
}

export function startLoopFor(location) {
    if (!isPausedByLocation[location]) {
        lastTimestamps[location] = performance.now();
        requestAnimationFrame(timestamp => runLoop(location, timestamp));
    }
}

function getLocationConfig(name) {
    return locations.find(loc => loc.name === name);
}

function runLoop(location, currentTime) {
    if (isPausedByLocation[location]) return;

    const delta = (lastTimestamps[location] !== undefined)
        ? (currentTime - lastTimestamps[location]) / 1000
        : 0;

    lastTimestamps[location] = currentTime;

    if (delta > 1) return;

    const speed = 1 + locationStats[location] * 0.05;
    locationProgress[location] += speed * delta;

    localStorage.setItem(`progress_${location}`, locationProgress[location]);

    const config = getLocationConfig(location);
    const goal = config ? config.goal : 10;

    if (locationProgress[location] >= goal) {
        locationStats[location]++;
        locationProgress[location] = 0;
        localStorage.setItem(`stat_${location}`, locationStats[location]);
        localStorage.setItem(`progress_${location}`, locationProgress[location]);
        import('./game.js').then(mod => mod.doObserve(location));
    }

    const fill = document.querySelector(`#bar-${location} .progress-fill`);
    const percent = Math.min((locationProgress[location] / goal) * 100, 100);
    if (fill) fill.style.width = `${percent}%`;

    const countdown = document.querySelector(`#bar-${location} .countdown-overlay`);
    if (countdown) countdown.textContent = `${Math.ceil((goal - locationProgress[location]) / speed)}s`;

    requestAnimationFrame(timestamp => runLoop(location, timestamp));
}
