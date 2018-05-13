require('./init')
const readPosts = require('./readers/readPosts')
const writePostsAsAnonymous = require('./writers/writePostsAsAnonymous')

const LIMIT = 40000

const main = async () => {
  console.time('all')

  const posts = await readPosts({ limit: LIMIT })

  await writePostsAsAnonymous(posts)

  console.timeEnd('all')
}

main().catch((err) => {
  console.error(err)
})
