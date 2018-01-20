const getData = require('./getEventData');

module.exports = (event) => {
  const data = getData(event);
  console.log(data);
  return data;
};
