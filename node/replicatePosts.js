require('./init')
const readPosts = require('./readers/readPosts')
const writePostsAsAnonymous = require('./writers/writePostsAsAnonymous')
const writePostsAsPhoto = require('./writers/writePostsAsPhoto')
const writePostsAsThread = require('./writers/writePostsAsThread')
const writeUserPosts = require('./writers/writeUserPosts')

const LIMIT = 40000

const main = async () => {
  console.time('all')

  const posts = await readPosts({ limit: LIMIT })

  await writePostsAsAnonymous(posts)
  await writePostsAsPhoto(posts)
  await writePostsAsThread(posts)
  await writeUserPosts(posts)

  console.timeEnd('all')
}

main().catch((err) => {
  console.error(err)
})
