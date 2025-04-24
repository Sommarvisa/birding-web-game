import { birdList, firstTimeBirds } from './birds.js';

const birdJournalList = document.getElementById('birdJournalList');
const birdCount = document.getElementById('birdCount');

export function updateBirdJournalDisplay() {
  birdJournalList.innerHTML = ''; // Clear current journal

  birdList.forEach(bird => {
    const li = document.createElement('li');
    li.classList.add('journal-entry');

    if (!isBirdUnlocked(bird)) {
      li.textContent = '?';
      li.classList.add('locked');
    } else if (birdJournal.includes(bird.name)) {
      li.textContent = bird.name;
      li.classList.add('spotted');
    } else {
      li.textContent = bird.name;
      li.classList.add('unspotted');
    }

    birdJournalList.appendChild(li);
  });

  birdCount.textContent = `${birdJournal.length}/${birdList.filter(isBirdUnlocked).length}`;
}

function isBirdUnlocked(bird) {
  return knowledgeStat >= bird.knowledgeRequired;
}
