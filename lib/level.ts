export function calculateLevel(
    xp: number
  ) {
    return Math.floor(xp / 1000) + 1;
  }
  
  export function getLevelProgress(
    xp: number
  ) {
    return xp % 1000;
  }
  
  export function getNextLevelXP(
    xp: number
  ) {
    return 1000 - (xp % 1000);
  }