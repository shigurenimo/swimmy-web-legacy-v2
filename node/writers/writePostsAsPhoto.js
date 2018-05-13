const { firestore } = require('firebase-admin')

const { createTasks } = require('../libs/createTasks')

module.exports = async (allPosts) => {
  const posts = allPosts.filter((post) => post.photoURL)

  const tasks = createTasks(posts)

  const store = firestore()

  const promises = tasks.map((task) => {
    const posts = task

    const batch = store.batch()

    posts.forEach((post) => {
      const ref = store.collection('posts-as-photo').doc(post.id)

      if (!posts.owner) {
        post.ownerId = null
      }

      batch.set(ref, post)
    })

    return batch.commit()
  })

  console.time('writePhotoPosts')

  await Promise.all(promises)

  console.timeEnd('writePhotoPosts')
}
