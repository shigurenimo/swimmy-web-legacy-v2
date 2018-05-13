import { getPosts } from '../functions/src/api/posts/getPosts'

import { updatePostObjects } from '../functions/lib/api/posts/updatePostObjects'

const main = async () => {
  const posts = await getPosts({ limit: 3000 })

  await updatePostObjects(posts)
}

main().catch((err) => {
  console.error(err)
})
