export const updateTags = (tagsRef, tag) => {
  const tags = tagsRef.slice();
  let notFound = true;
  for (let i = 0, len = tags.length; i < len; ++i) {
    if (tags[i].id !== tag.id) {
      continue;
    }
    if (tag.count < 1 && tag.name !== 'スキ') {
      tags.splice(i, 1);
    } else {
      tags[i] = tag;
    }
    notFound = false;
  }
  if (notFound) {
    tags.push(tag);
  }
  return tags;
};
