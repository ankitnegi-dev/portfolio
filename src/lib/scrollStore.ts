import { createRef } from 'react'

export const scrollProgress = createRef<number>() as React.MutableRefObject<number>
scrollProgress.current = 0

export const scrollTo = (target: number) => {
  const el = document.querySelector('.drei-scroll-container') as HTMLElement
    || document.querySelector('[data-scroll]') as HTMLElement
    || (document.querySelector('canvas')?.parentElement) as HTMLElement

  if (el) {
    const maxScroll = el.scrollHeight - el.clientHeight
    el.scrollTop = target * maxScroll
    return
  }

  const containers = document.querySelectorAll('div')
  for (const div of containers) {
    if (div.scrollHeight > div.clientHeight + 10 && div !== document.body) {
      const maxScroll = div.scrollHeight - div.clientHeight
      div.scrollTop = target * maxScroll
      return
    }
  }
}
