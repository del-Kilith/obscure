async function attemptToAcquireWakeLock() {
  const wakeStatus = createDebugDisplay('wakeLock', { defaultHolder: false })

  try {
    const wakeLock = await navigator.wakeLock.request('screen')
    wakeStatus.update(`Lock acquired: ${wakeLock.type}`)
  } catch (err) {
    wakeStatus.update(`Lock failed: ${err.name}`)
    console.error(err)
  }
}

const canvas = document.querySelector('canvas')
const resize = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
window.addEventListener('resize', resize)
resize()

const pipeline = RenderingPipeline(canvas)
pipeline.addRenderer(RippleRenderer)
pipeline.addRenderer(DustRenderer)
pipeline.start();

(async function () {
  await attemptToAcquireWakeLock()
  initialize(State.Dusk)
  const main = document.querySelector('main')

  const sequence = [
    async () => await transition(State.Dusk, State.Night, 2000),
    async () => await transition(State.Night, State.NightDeep, 2000),
    async () => await transition(State.NightDeep, State.Light, 2000),
    async () => await transition(State.Light, State.Day, 4000),
  ][Symbol.iterator]()

  await delay(2000)

  for (const line of lines) {
    const dbgline = line.replace('-','').replace('@', '')
    if (dbgline.length > 30) {
      console.warn(`Line is probably too long [${dbgline.length} chars]`, dbgline)
    }

    if (line === '$') {
      await stopTyping(main)
      await delay('pause.long')
      await fadeText(main, Delays.pause.long.min)
    } else if (line === '*') {
      await sequence.next().value()
    } else {
      const node = main.appendChild(document.createElement('p'))
      if (!container.classList.contains('typing')) {
        await prepareTyping(main, {before: Delays.pause.short.max, after: Delays.breath.min})
      }
      await type(node, line)
    }
    await delay(line.length <= 1 ? 'pause.short' : 'breath')
  }

  await stopTyping(main)

  const loopTransitionTime = 20
  const loopHoldThemeFor = 10
  const loop = [
    async () => await transition(State.Day  , State.Loop1, loopTransitionTime * 1000),
    async () => await transition(State.Loop1, State.Loop2, loopTransitionTime * 1000),
    async () => await transition(State.Loop2, State.Loop3, loopTransitionTime * 1000),
    async () => await transition(State.Loop3, State.Loop4, loopTransitionTime * 1000),
    async () => await transition(State.Loop4, State.Loop5, loopTransitionTime * 1000),
    async () => await transition(State.Loop5, State.Loop6, loopTransitionTime * 1000),
    async () => await transition(State.Loop6, State.Day  , loopTransitionTime * 1000),
  ]

  let i = 0
  while (true) {
    await loop[i++ % loop.length]()
    await sleep(loopHoldThemeFor * 1000)
  }
})()
