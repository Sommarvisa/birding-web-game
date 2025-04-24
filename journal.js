import { birdList, firstTimeBirds } from './birds.js';
import { birdJournal, knowledgeStat } from './game.js';

const birdJournalList = document.getElementById('birdJournalList');
const birdCount = document.getElementById('birdCount');

export function updateBirdJournalDisplay() {
    birdJournalList.innerHTML = '';
    birdList.forEach(bird => {
      const li = document.createElement('li');
      li.classList.add('journal-entry');
  
      if (knowledgeStat < bird.knowledgeRequired) {
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
  
    birdCount.textContent = `${birdJournal.length}/${birdList.filter(bird => knowledgeStat >= bird.knowledgeRequired).length}`;
  }  

function isBirdUnlocked(bird) {
  return knowledgeStat >= bird.knowledgeRequired;
}
