const {default: getData} = require('./getEventData');

exports.default = (event) => {
  const data = getData(event);
  console.log(data);
  return data;
};
