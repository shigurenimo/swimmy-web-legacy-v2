export const toArray = (list: any[] | Object): any[] => {
  if (!Array.isArray(list)) {
    return Object.keys(list).map((id) => {
      return { ...list[id], id };
    });
  }

  return list;
};
