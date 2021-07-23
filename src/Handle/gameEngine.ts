const gameEngine = (number: number) : boolean => {
  const rand = Math.floor(Math.random() *2);
  if (number === rand) return true;
  return false;
}
export const gamePlay = (number: number, amount: number) => {
  if (gameEngine(number)) {
    console.log('You win')
  } else {
    console.log('You lose')
  }
}