const Delays = {
  char: {
    min: 50,
    max: 100
  },
  pause: {
    short: {
      min: 400,
      max: 800
    },
    long: {
      min: 1000,
      max: 2000,
    }
  },
  breath: {
    min: 300,
    max: 500
  }
}

const textDebugInfo = createDebugDisplay(false)

async function delay(/* string | number */ pathOrTime = 0) {
  if (typeof pathOrTime === 'number') {
    return await sleep(pathOrTime)
  } else {
    const time = pathOrTime.split('.').reduce((acc, cur) => acc[cur], Delays)
    return await sleep(Random.range(time.max, time.min))
  }
}

async function prepareTyping(container, { before, after }) {
  textDebugInfo.update(`Preparing container for typing: [before: ${before}, after: ${after}]`)
  await delay(before)
  container.classList.add('typing')
  const node = container.appendChild(document.createElement('p'))
  node.innerHTML = '&nbsp;'
  await delay(after)
  container.removeChild(node)
}

/**
 * Stops the typing animation, attempts to coincide the stopping with
 * the cursor's disappearance of the animation
 */
async function stopTyping(container) {
  function roundUpToMultipleOfTen(toRound) {
    if (toRound % 10 === 0) {
      return toRound
    } else {
      return (10 - toRound % 10) + toRound
    }
  }

  const currentTime = Math.round(Date.now())
  const timeOfACycle = 2 * 1000
  const sleepUntil = roundUpToMultipleOfTen(currentTime) + timeOfACycle
  const sleepFor = sleepUntil - currentTime

  textDebugInfo.update(`Stopping - awaiting ${sleepFor / 1000}s`)
  await sleep(sleepFor)

  container.classList.remove('typing')
}

async function type(
  /* HTMLElement */ container,
  /* string[] */ text
) {
  textDebugInfo.update(`Typing line`)
  for (const char of text) {
    if (char === '@') {
      await delay('pause.long')
    } else if (char === '-') {
      await delay('pause.short')
    } else {
      container.textContent += char
    }
    await delay('char')
  }
}


async function fadeText(
  /* HTMLElement */ container,
  /* number */ duration
) {
  textDebugInfo.update(`Fading text`)
  await container.animate([{ opacity: 0 }], { duration }).finished
  container.replaceChildren()
  container.style.opacity = '1'
}

