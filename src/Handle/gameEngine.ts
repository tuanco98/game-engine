let total = 10000;
const gameEngine = (number: number) : boolean => {
  const rand = Math.round(Math.random());
  if (number === rand) return true;
  return false;
}
export const gamePlay = (number: number, amount: number) => {
  if (gameEngine(number)) {
    total += amount;
    return true;
  }
  total-= amount;
  return false;
}