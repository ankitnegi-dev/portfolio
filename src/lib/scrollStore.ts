import { createRef } from 'react'

export const scrollProgress = createRef<number>() as React.MutableRefObject<number>
scrollProgress.current = 0
