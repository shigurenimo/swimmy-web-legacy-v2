const { firestore } = require('firebase-admin')

const readPosts = async ({limit = 10}) => {
  const store = firestore()

  const postsRef = store.collection('posts').limit(limit)

  const postsQuerySnapshot = await postsRef.get()

  const posts = postsQuerySnapshot.docs.map((queryDocumentSnapshot) => {
    const data = queryDocumentSnapshot.data()

    return { id: queryDocumentSnapshot.id, ...data }
  })

  return posts
}

exports.readPosts = readPosts
