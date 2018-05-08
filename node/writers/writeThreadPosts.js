const { firestore } = require('firebase-admin')

const { createTasks } = require('../libs/createTasks')

const writeThreadPosts = async (allPosts) => {
  const posts = allPosts.filter((post) => post.repliedPostCount > 0)

  const tasks = createTasks(posts)

  const store = firestore()

  const promises = tasks.map((task) => {
    const posts = task

    const batch = store.batch()

    posts.forEach((post) => {
      const ref = store.collection('posts-as-thread').doc(post.id)

      batch.set(ref, post)
    })

    return batch.commit()
  })

  return Promise.all(promises)
}

exports.writeThreadPosts = writeThreadPosts
