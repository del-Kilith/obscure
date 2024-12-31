const State = {
  /**
   * Returns the value associated with the key for the current state
   * @param { ('t00' | 't05' | 't10' | 'txt' | 'rippleColor' | 'rippleMaxOpacity') } value
   */
  get: function (value) {
    return root.style.getPropertyValue(`--${value}`)
  },
  Dusk: {
    gradient: [
      'rgba(104,  76, 154, 1)',
      'rgba(166, 103, 171, 1)',
      'rgba(204, 125, 154, 1)', // 296 28.8 537
    ],
    text: 'black',
    rippleColor: '#AB678E',
    rippleMaxOpacity: 70,
    name: 'Dusk'
  },
  Night: {
    gradient: [
      'rgba( 30,  43,  88, 1)',
      'rgba( 37,  53, 105, 1)',
      'rgba( 53,  50, 131, 1)',
    ],
    text: '#e4dae5',
    rippleColor: '#255769',
    rippleMaxOpacity: 80,
    name: 'Night'
  },
  NightDeep: {
    gradient: [
      'rgb(0,8,32)',
      'rgb(0,8,32)',
      'rgb(0,8,32)',
    ],
    text: '#b1b1b1',
    rippleColor: '#080020',
    rippleMaxOpacity: 150,
    name: 'Night Deep'
  },
  Light: {
    gradient: [
      'rgba(255, 255, 255, 1)',
      'rgba(255, 255, 255, 1)',
      'rgba(255, 255, 255, 1)'
    ],
    text: 'black',
    rippleColor: '#FFFFFF',
    rippleMaxOpacity: 0,
    name: 'Light'
  },
  Day: {
    gradient: [
      '#FFA5D5', // 'hsl(328, 100, 92.4)',
      '#FFAFAF', // 'hsl(  0, 100, 94.3)',
      '#FFD79F', // 'hsl( 35, 100, 81.2)',
    ],
    rippleColor: '#FFD7AF',
    rippleMaxOpacity: 70,
    text: 'black',
    name: 'Day'
  },
  Loop0: {
    gradient: [
      '#995ac6',
      '#dd7070',
      '#e79c4d'
    ],
    rippleColor: '#DDA770',
    rippleMaxOpacity: 70,
    text: 'black',
    name: 'Loop0'
  },
  Loop1: {
    gradient: [
      '#5b5ac6',
      '#dd70d6',
      '#e67cad'
    ],
    rippleColor: '#DD70A0',
    rippleMaxOpacity: 70,
    text: 'black',
    name: 'Loop1'
  },
  Loop2: {
    gradient: [
      '#4f80bf',
      '#a66edd',
      '#f180f5'
    ],
    rippleColor: '#9997E7',
    rippleMaxOpacity: 70,
    text: 'black',
    name: 'Loop2'
  },
  Loop3: {
    gradient: [
      '#55af67',
      '#7bb3d1',
      '#936bf3'
    ],
    rippleColor: '#6EDDAF',
    rippleMaxOpacity: 70,
    text: 'black',
    name: 'Loop3'
  },
  Loop4: {
    gradient: [
      '#66bc59',
      '#7dcd8d',
      '#7cc9cf'
    ],
    rippleColor: '#7DCDB5',
    rippleMaxOpacity: 70,
    text: 'black',
    name: 'Loop4'
  },
  Loop5: {
    gradient: [
      '#d3c468',
      '#abd889',
      '#6bf3f3'
    ],
    rippleColor: '#8DFA94',
    rippleMaxOpacity: 70,
    text: 'black',
    name: 'Loop5'
  },
  Loop6: {
    gradient: [
      '#fa857e',
      '#faca8d',
      '#dff36b'
    ],
    rippleColor: '#F3FA8D',
    rippleMaxOpacity: 70,
    text: 'black',
    name: 'Loop6'
  }
}

const root = document.querySelector(':root')
const transitionDebugText = createDebugDisplay('state')

/**
 * Sets the [t00, t05, t10] properties in the root node
 *
 * @param gradient an array of length three of valid color string
 */
function setRootGradient(gradient) {
  root.style.setProperty('--t00', gradient[0])
  root.style.setProperty('--t05', gradient[1])
  root.style.setProperty('--t10', gradient[2])
}

/**
 * Initializes the state of the application
 *
 * @param state the initial state
 */
function initialize(state) {
  transitionDebugText.update(`Holding state ${state.name}`)

  setRootGradient(state.gradient)
  root.style.setProperty('--txt', state.text)
  root.style.setProperty('--rippleColor', state.rippleColor)
  root.style.setProperty('--rippleMaxOpacity', state.rippleMaxOpacity)
}

/**
 * Transitions from one state to another over a set period of time
 *
 * @param from the state to transition from
 * @param to the state to transition to
 * @param duration transition duration in milliseconds
 */
function transition(from, to, duration) {
  transitionDebugText.update(`Transition from ${from.name} to ${to.name} [requested: ${duration / 1000}s]`)

  const startTime = performance.now()
  return new Promise(resolve => {
    const finish = function () {
      initialize(to)
      resolve()
    }

    const step = function (percent) {
      const gradient = [0, 1, 2].map(row => getColorAtPercent(row, percent))
      setRootGradient(gradient)

      const rippleColor = getColorAtPercent(3, percent)
      root.style.setProperty('--rippleColor', rippleColor)

      const f_rmo = from.rippleMaxOpacity
      const t_rmo = to.rippleMaxOpacity
      const maxOpacity = f_rmo + (t_rmo - f_rmo) * percent
      root.style.setProperty('--rippleMaxOpacity', maxOpacity)
    }

    const loop = function (time) {
      const percent = (time - startTime) / duration

      if (percent < 1) {
        step(percent)
        requestAnimationFrame(loop)
      } else {
        finish()
      }
    }

    updateGradientGuideline(from, to)
    requestAnimationFrame(loop)
  })
}
