Math.clamp = function (n, min, max) {
  return Math.min(Math.max(n, min), max)
}

/**
 * Arrays utility methods
 */
const Arrays = Object.create(Object.prototype)

/**
 * Creates a new array of the specified size where each element has been
 * initialized with a value provided by the init function
 *
 * @param size the size of the array to create
 * @param init the init function
 * @returns unknown[]
 */
Arrays.ofSize = function (size, init) {
  return new Array(size).fill(0).map(init)
}

/**
 * Random utility methods
 */
const Random = Object.create(Object.prototype)

/**
 * Returns a new number in the range, inclusive of both min and max values
 *
 * @param { number } max largest possible value
 * @param { number } min smallest possible value
 * @return number
 */
Random.range = function (max, min = 0) {
  return Math.random() * (max - min) + min
}

/**
 * Returns a random element of the passed array
 *
 * @param array
 * @returns {*}
 */
Random.choice = function (array) {
  return array[Math.floor(Random.range(array.length))]
}

/**
 * Returns one of the passed arguments at random
 *
 * @param values
 * @return {*}
 */
Random.of = function (...values) {
  return Random.choice(values)
}

function sleep(/* number */ ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
