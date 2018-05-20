export const getTime = (): () => number => {
  const a = new Date().getTime();
  return (): number => {
    const b = new Date().getTime();
    return b - a;
  };
};
