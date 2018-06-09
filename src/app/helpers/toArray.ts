export const toArray = (list) => {
  if (!list) {
    return [];
  }

  if (!Array.isArray(list)) {
    return Object
      .keys(list)
      .map((id) => list[id]);
  }

  return list;
};
