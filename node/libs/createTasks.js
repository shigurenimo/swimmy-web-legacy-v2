const createTasks = (posts) => {
  const length = posts.length

  const tasks = []

  for (let i = 0; i < length; ++i) {
    const n = parseInt(String(i / 500))

    if (!tasks[n]) {
      tasks[n] = []
    }

    const post = posts[i]

    tasks[n].push(post)
  }

  return tasks
}

exports.createTasks = createTasks
