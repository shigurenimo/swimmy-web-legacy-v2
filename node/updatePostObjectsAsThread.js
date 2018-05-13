const algoliasearch = require('algoliasearch')

require('./init')
const config = require('../functions/config')
const readPosts = require('./readers/readPosts')

const LIMIT = 40000

const main = async () => {
  const posts = await readPosts({ limit: LIMIT })

  const objects = posts.filter((post) => {
    return post.repliedPostCount > 0
  }).map((post) => {
    return createPostObject(post.id, post)
  })

  const { appId, key } = config['swimmy-171720'].algolia

  const client = algoliasearch(appId, key)

  const index = client.initIndex('posts-as-thread')

  console.log('objects.length', objects.length)

  await index.saveObjects(objects)
}

main().catch((err) => {
  console.error(err)
})

const createPostObject = (objectID, root) => {
  return {
    objectID: objectID,
    id: objectID,
    content: root.content,
    createdAt: root.createdAt / 1,
    ownerId: root.ownerId || '',
    owner: root.owner || null,
    photoCount: Object.keys(root.photoURLs || []).length,
    photoURLs: Object.keys(root.photoURLs || []).map((photoId) => {
      return root.photoURLs[photoId].photoURL
    }),
    photoURL: root.photoURL || '',
    repliedPostCount: root.repliedPostCount || 0,
    replyPostId: root.replyPostId || '',
    repliedPostIds: root.repliedPostIds || [],
    tags: Object.keys(root.tags).map((tagId) => {
      const tag = root.tags[tagId]
      return {
        id: `${objectID}-${tagId}`,
        tagId: tagId,
        name: tag.name,
        count: tag.count
      }
    }),
    updatedAt: root.updatedAt / 1
  }
}
