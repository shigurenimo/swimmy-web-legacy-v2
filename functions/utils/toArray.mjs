export const toArray = (list) => {
  if (!Array.isArray(list)) {
    return Object.keys(list).map((id) => {
      return Object.assign(list[id], {id})
    })
  }

  return list
}
