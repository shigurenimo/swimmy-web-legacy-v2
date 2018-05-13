const { firestore } = require('firebase-admin')

module.exports = async ({ limit = 10 }) => {
  const store = firestore()

  const postsRef = store.collection('posts').limit(limit)

  console.time('readPosts')

  const postsQuerySnapshot = await postsRef.get()

  console.timeEnd('readPosts')

  const posts = postsQuerySnapshot.docs.map((queryDocumentSnapshot) => {
    const data = queryDocumentSnapshot.data()

    return { id: queryDocumentSnapshot.id, ...data }
  })

  return posts
}
