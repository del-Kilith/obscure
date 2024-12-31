/**
 * @typedef ICanvasInfo
 * @type { object }
 * @prop { number } width width of the canvas
 * @prop { number } height height of the canvas
 */

/**
 * @typedef ITimeContext
 * @type { object }
 * @prop { number } delta time elapsed since last frame
 * @prop { number } now current time since the application's start
 */

/**
 * @callback IRenderingFunction
 * @this { any } data
 * @param { CanvasRenderingContext2D } context canvas context
 * @param { ITimeContext } time time information
 * @param { ICanvasInfo } screen canvas information
 */

/**
 * @typedef IRenderer
 * @type { object }
 * @prop { number } priority
 * @prop { (screen: ICanvasInfo) => void } initialize
 * @prop { IRenderingFunction } execute
 */

/**
 * @typedef IRenderingPipeline
 * @type { object }
 * @prop { (renderer: IRenderer) => void } addRenderer
 * @prop { () => void } start
 */

/**
 * Renderers contain information utilized by the rendering pipeline.
 *
 * The priority of the renderer determines when the renderer is executed.
 * Higher priority renderers are executed last, meaning they will be
 * drawn on top of lower priority renderers. No guarantee is made with
 * regard to the order of execution of same-priority renderers.
 *
 * @param { number } priority priority of the renderer
 * @param { (screen: ICanvasInfo) => any } data data bound to the renderer
 * @param { IRenderingFunction } fn function invoked when it is time to render stuff
 * @returns { Readonly<IRenderer> }
 * @constructor
 */
function Renderer(priority, data, fn) {
  let execute

  return Object.freeze({
    priority,
    initialize: (screen) => execute = fn.bind(data(screen)),
    get execute () {
      return execute
    }
  })
}

const RendererPriority = {
  Low: 0,
  Med: 1,
  High: 2
}

/**
 *
 * @param { HTMLCanvasElement } canvas
 * @returns { Readonly<IRenderingPipeline> }
 * @constructor
 */
function RenderingPipeline(canvas) {
  const getScreenInfo = () => ({
    width: canvas.width,
    height: canvas.height,
  })

  const context = canvas.getContext('2d')
  const queue = []

  let lastFrameTime = 0

  function add(renderer) {
    queue.push(renderer)
    queue.sort((a, b) => b.priority - a.priority)
    renderer.initialize(getScreenInfo())
  }

  function begin(time) {
    const timeInfo = {
      delta: (time - lastFrameTime) / 1000,
      now: performance.now()
    }

    context.clearRect(0, 0, screen.width, screen.height)
    queue.forEach(renderer => renderer.execute(context, timeInfo, getScreenInfo()))

    lastFrameTime = time
    requestAnimationFrame(begin)
  }

  return Object.freeze({
    addRenderer: add,
    start: () => requestAnimationFrame(begin),
  })
}
