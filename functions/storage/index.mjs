import * as functions from 'firebase-functions'

import { onChangeIcons } from './onChangeIcons'

export default functions.storage.object().onChange((event) => {
  // リソースの状態
  const resourceState = event.data.resourceState

  if (resourceState === 'not_exists') {
    return null
  }

  // metadataの更新回数
  const metageneration = event.data.metageneration

  if (resourceState === 'exists' && metageneration > 1) {
    return null
  }

  // リソースのタイプ
  const contentType = event.data.contentType

  if (!contentType.startsWith('image/')) {
    return null
  }

  const filePath = event.data.name

  if (filePath.includes('icons/')) {
    return onChangeIcons(event)
  }

  return null
})
