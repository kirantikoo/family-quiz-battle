export function updateStreak(
    lastPlayedDate: string,
    currentStreak: number
  ) {
    const today =
      new Date().toDateString();
  
    if (!lastPlayedDate) {
      return {
        streak: 1,
        date: today,
      };
    }
  
    const previous =
      new Date(lastPlayedDate);
  
    const current =
      new Date(today);
  
    const difference =
      Math.floor(
        (current.getTime() -
          previous.getTime()) /
          (1000 * 60 * 60 * 24)
      );
  
    if (difference === 1) {
      return {
        streak: currentStreak + 1,
        date: today,
      };
    }
  
    if (difference > 1) {
      return {
        streak: 1,
        date: today,
      };
    }
  
    return {
      streak: currentStreak,
      date: today,
    };
  }