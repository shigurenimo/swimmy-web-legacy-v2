const { readPosts } = require('./readers/readPosts')

const main = async () => {
  const posts = await readPosts({ limit: 3000 })

  // await updatePostObjects(posts)
}

main().catch((err) => {
  console.error(err)
})
