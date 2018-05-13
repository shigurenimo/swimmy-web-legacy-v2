require('./init')
const readPosts = require('./readers/readPosts')
const writeUserPosts = require('./writers/writeUserPosts')

const LIMIT = 20000

const main = async () => {
  console.time('all')

  const posts = await readPosts({ limit: LIMIT })

  await writeUserPosts(posts)

  console.timeEnd('all')
}

main().catch((err) => {
  console.error(err)
})
