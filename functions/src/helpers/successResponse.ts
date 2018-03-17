export const successResponse = (res, result?) => {
  if (typeof result !== 'undefined') {
    if (typeof result === 'string') {
      res.end(result);
    } else {
      res.json(result);
    }
  } else {
    res.end('200');
  }
};
