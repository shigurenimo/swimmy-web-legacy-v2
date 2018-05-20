export const failureResponse = (res, err): void => {
  console.error(err);
  res.end('500');
};
