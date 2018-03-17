import { getEventData } from './getEventData';

export const eventDataLog = (event) => {
  const data = getEventData(event);
  console.log(data);
  return data;
};
