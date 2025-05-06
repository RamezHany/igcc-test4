import createCache from '@emotion/cache'
import { prefixer } from 'stylis'

const isBrowser = typeof document !== 'undefined'

export const createEmotionCache = () => {
  let insertionPoint

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]',
    )
    insertionPoint = emotionInsertionPoint ?? undefined
  }

  return createCache({
    key: 'mui-style',
    prepend: true,
    insertionPoint,
    stylisPlugins: [prefixer],
  })
}
