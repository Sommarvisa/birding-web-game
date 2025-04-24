// === birds.js ===

// List of all possible birds
export const birdList = [
    { name: "House Sparrow", rarity: "common", knowledgeRequired: 0 },
    { name: "Northern Cardinal", rarity: "common", knowledgeRequired: 0 },
    { name: "Blue Jay", rarity: "common", knowledgeRequired: 0 },
    { name: "American Robin", rarity: "common", knowledgeRequired: 0 },
    { name: "Mourning Dove", rarity: "common", knowledgeRequired: 0 },
    { name: "European Starling", rarity: "common", knowledgeRequired: 0 },
    { name: "Downy Woodpecker", rarity: "common", knowledgeRequired: 0 },
    { name: "Carolina Wren", rarity: "rare", knowledgeRequired: 2 },
    { name: "Canada Goose", rarity: "rare", knowledgeRequired: 2 },
    { name: "Mallard", rarity: "rare", knowledgeRequired: 2 },
  ];
  
  // Track first-time sightings
  export const firstTimeBirds = [];
  
  export function getRandomBird() {
    const index = Math.floor(Math.random() * birdList.length);
    return birdList[index];
  }
  