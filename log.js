import { birdLogList, logFilter } from './ui.js';
import { firstTimeBirds } from './birds.js'; // Import firstTimeBirds

export let birdLog = [];

// Log a bird sighting with timestamp, and mark if it's a first-time sighting
export function logBirdSighting(bird, isNewBird) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let sightingMessage = `[${timestamp}] Observed a ${bird}`;

  // Check if it's a first-time sighting
  if (isNewBird) {
    if (!firstTimeBirds.includes(bird)) {
      firstTimeBirds.push(bird); // Add to firstTimeBirds array
    }
    sightingMessage += ' for the first time!';
  }

  birdLog.unshift({ bird: bird, message: sightingMessage, isFirstTime: isNewBird });
  updateBirdLogDisplay();  // Update the display after adding the sighting
}

// Update the bird log display based on the filter
export function updateBirdLogDisplay() {
  const filterValue = logFilter.value;
  birdLogList.innerHTML = '';  // Clear current list

  let logEntriesToDisplay = [];

  // Filter the log based on whether 'firstTime' is selected in the dropdown
  if (filterValue === 'firstTime') {
    // Filter log for first-time birds only
    logEntriesToDisplay = birdLog.filter(entry => entry.isFirstTime);
  } else {
    // Show all bird log entries if no filter is selected
    logEntriesToDisplay = birdLog;
  }

  // Ensure the log entries are displayed properly
  logEntriesToDisplay.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = entry.message;  // Use the message for display
    birdLogList.appendChild(li);
  });
}

// Filter event listener for when the user changes the filter dropdown
logFilter.addEventListener('change', updateBirdLogDisplay);
