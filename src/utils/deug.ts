export const debugNote = (text: string): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(text);
  }
};
