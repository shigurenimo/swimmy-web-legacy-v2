exports.default = (event) => {
  return event.data.previous
    ? event.data.previous.data()
    : event.data.data();
};
