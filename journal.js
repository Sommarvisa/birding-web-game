import { birdList } from './birds.js';

const birdJournal = JSON.parse(localStorage.getItem('birdJournal')) || [];
const knowledgeStat = parseInt(localStorage.getItem('knowledgeStat')) || 0;

const birdJournalList = document.getElementById('birdJournalList');
const birdCount = document.getElementById('birdCount');

export function updateBirdJournalDisplay() {
  if (!birdJournalList || !birdCount) return;

  const unlockedBirds = birdList.filter(isBirdUnlocked);

  birdJournalList.innerHTML = '';
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

  birdCount.textContent = `${birdJournal.length}/${unlockedBirds.length}`;
}

function isBirdUnlocked(bird) {
  return knowledgeStat >= bird.knowledgeRequired;
}

updateBirdJournalDisplay();