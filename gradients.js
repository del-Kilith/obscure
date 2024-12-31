const _canvas = document.createElement('canvas')
const _ctx = _canvas.getContext('2d', { willReadFrequently: true })
const _resolution = 1000

_canvas.width = _resolution
_canvas.height = 4

/**
 * Prepares the gradient to be queried through getColorAtPercent
 * @param { { gradient, rippleColor } } from initial gradient
 * @param { { gradient, rippleColor } } to final gradient
 */
function updateGradientGuideline(from, to) {
  function drawGradient(c1, c2, row) {
    const grd = _ctx.createLinearGradient(0, row, _resolution, 1)
    grd.addColorStop(0, c1)
    grd.addColorStop(1, c2)
    _ctx.fillStyle = grd
    _ctx.fillRect(0, row, _resolution, 1)
  }

  drawGradient(from.gradient[0], to.gradient[0], 0)
  drawGradient(from.gradient[1], to.gradient[1], 1)
  drawGradient(from.gradient[2], to.gradient[2], 2)
  drawGradient(from.rippleColor, to.rippleColor, 3)
}

/**
 * Returns the color at the requested percentage of the gradient
 * @param row indicates which of the 4 stops to pick
 * @param percent a number between 0 and 1
 */
function getColorAtPercent(row, percent) {
  const pixel = Math.floor(percent * _resolution)
  const [r, g, b] = _ctx.getImageData(pixel, row, 1, 1).data
  const hex = n => n.toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}
