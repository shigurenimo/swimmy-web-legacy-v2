const { firestore } = require('firebase-admin')

const { createTasks } = require('../libs/createTasks')

const writePhotoPosts = async (allPosts) => {
  const posts = allPosts.filter((post) => post.photoURL)

  const tasks = createTasks(posts)

  const store = firestore()

  const promises = tasks.map((task) => {
    const posts = task

    const batch = store.batch()

    posts.forEach((post) => {
      const ref = store.collection('posts-as-photo').doc(post.id)

      batch.set(ref, post)
    })

    return batch.commit()
  })

  return Promise.all(promises)
}

exports.writePhotoPosts = writePhotoPosts
