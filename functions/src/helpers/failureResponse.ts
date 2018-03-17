export const failureResponse = (res, err) => {
  console.error(err);
  res.end('500');
};
