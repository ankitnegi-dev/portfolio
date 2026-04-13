import { createRef } from 'react'

export const scrollProgress = createRef<number>() as React.MutableRefObject<number>
scrollProgress.current = 0

export const scrollEl = createRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement | null>
scrollEl.current = null

export const instantScrollTo = (target: number) => {
  const el = scrollEl.current
  if (el) {
    const maxScroll = el.scrollHeight - el.clientHeight
    el.style.scrollBehavior = 'auto'
    el.scrollTop = target * maxScroll
    el.style.scrollBehavior = ''
  } else {
    const attempt = (tries: number) => {
      const containers = Array.from(document.querySelectorAll('div'))
      const scrollable = containers.find(
        (div) =>
          div.scrollHeight > div.clientHeight + 50 &&
          div !== document.body &&
          div.clientHeight > 100
      )
      if (scrollable) {
        scrollEl.current = scrollable as HTMLDivElement
        scrollable.style.scrollBehavior = 'auto'
        scrollable.scrollTop = target * (scrollable.scrollHeight - scrollable.clientHeight)
        scrollable.style.scrollBehavior = ''
      } else if (tries > 0) {
        setTimeout(() => attempt(tries - 1), 100)
      }
    }
    attempt(20)
  }
}

export const restoreScroll = (target: number) => {
  instantScrollTo(target)
}
