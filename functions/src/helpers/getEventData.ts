export const getEventData = (event) => {
  const previousData = event.data.previous.data();
  const currentData = event.data.data();

  let data = null;

  if (!previousData) {
    data = currentData;
  }

  if (!currentData) {
    data = previousData;
  }

  if (previousData && currentData) {
    data = {
      previous: previousData,
      current: currentData
    };
  }

  return data;
};
