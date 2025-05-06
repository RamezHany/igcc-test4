import React, { FC, ReactNode, useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '@/config/theme'
import { useRouter } from 'next/router'
import { StyledEngineProvider } from '@mui/material/styles'
import rtlPlugin from 'stylis-plugin-rtl'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'

interface Props {
  children: ReactNode
}

const MUIProvider: FC<Props> = ({ children }) => {
  const { locale } = useRouter()
  const isRtl = locale === 'ar'
  
  const emotionCache = useMemo(
    () =>
      createCache({
        key: isRtl ? 'muirtl' : 'muiltr',
        stylisPlugins: isRtl ? [prefixer, rtlPlugin] : [prefixer],
        prepend: true,
      }),
    [isRtl]
  )

  const themeWithDirection = useMemo(
    () =>
      createTheme({
        ...theme,
        direction: isRtl ? 'rtl' : 'ltr',
      }),
    [isRtl]
  )

  return (
    <StyledEngineProvider injectFirst>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={themeWithDirection}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </StyledEngineProvider>
  )
}

export default MUIProvider
