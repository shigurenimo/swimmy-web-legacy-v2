require('./init')
const { readPosts } = require('./readers/readPosts')
const { writePhotoPosts } = require('./writers/writePhotoPosts')
const { writeThreadPosts } = require('./writers/writeThreadPosts')
const { writeUserPosts } = require('./writers/writeUserPosts')

const LIMIT = 20000

const main = async () => {
  console.time('all')

  const posts = await readPosts({limit: LIMIT})

  await writeUserPosts_(posts)
  await writePhotoPosts_(posts)
  await writeThreadPosts_(posts)

  console.timeEnd('all')
}

main().catch((err) => {
  console.error(err)
})

const writeUserPosts_ = async (...arges) => {
  console.time('writeUserPosts')

  await writeUserPosts(...arges)

  console.timeEnd('writeUserPosts')
}

const writePhotoPosts_ = async (...arges) => {
  console.time('writePhotoPosts')

  await writePhotoPosts(...arges)

  console.timeEnd('writePhotoPosts')
}

const writeThreadPosts_ = async (...arges) => {
  console.time('writeThreadPosts')

  await writeThreadPosts(...arges)

  console.timeEnd('writeThreadPosts')
}
