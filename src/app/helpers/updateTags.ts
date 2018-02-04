export const updateTags = (_tags, tag) => {
  const tags = _tags.slice();
  for (let i = 0, len = this.tags.length; i < len; ++i) {
    if (tags[i].id !== tag.id) {
      continue;
    }
    tags[i] = tag;
  }
  return tags;
};
