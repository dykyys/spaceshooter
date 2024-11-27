export const updateGameTime = (time: string) =>
  String(Number(time) + 1).padStart(2, '0');
