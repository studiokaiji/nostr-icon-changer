export const containsWords = (words: string[], text: string): boolean => {
  for (const word of words) {
    if (text.includes(word)) {
      return true;
    }
  }
  return false;
};
