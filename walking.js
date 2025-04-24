let walking = 0;
let walkingProgressValue = 0;
let walkingGoal = 1;

export { walking, walkingProgressValue, walkingGoal };
export function setWalkingProgressValue(value) {
  walkingProgressValue = value;
}
export function getWalkingProgressValue() {
  return walkingProgressValue;
}

export function getWalkingSpeed(stat) {
  return 1 + stat * 0.05;
}

export function calculateRemainingTime() {
  const walkingSpeed = getWalkingSpeed(walking);
  const remainingProgress = walkingGoal - walkingProgressValue;
  return remainingProgress / walkingSpeed;
}

export function resetWalkingProgress() {
  walking++;
  walkingProgressValue = 0;
}