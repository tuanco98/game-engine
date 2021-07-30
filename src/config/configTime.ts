export const timeNow = () => {
  const newDay = new Date();
  const timeNow = `${newDay.getHours()}:${newDay.getMinutes()}:${newDay.getSeconds()} ${newDay.getDay()}/${newDay.getMonth()}/${newDay.getFullYear()}`;
  return timeNow;
};