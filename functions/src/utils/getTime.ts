export const getTime = () => {
  const a = new Date().getTime();
  return () => {
    const b = new Date().getTime();
    return b - a;
  };
};
