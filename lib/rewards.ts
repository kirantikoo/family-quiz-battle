export function getLevelFromXP(
    xp: number
  ) {
    return Math.floor(xp / 1000) + 1;
  }
  
  export function getXPForNextLevel(
    xp: number
  ) {
    const currentLevel =
      Math.floor(xp / 1000);
  
    return (
      (currentLevel + 1) * 1000 - xp
    );
  }