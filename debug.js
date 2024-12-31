const isDebug = location.hash.includes('debug') || Boolean(location.hostname.match(/localhost/))
const container = document.querySelector('#debug')
const holder = container.appendChild(document.createElement('div'))

console.log('Debug mode:', isDebug)
console.log('Version: 0.0.1')

if (!isDebug) {
  console.log = () => {}
  console.info = () => {}
  console.warn = () => {}
  console.error = () => {}
} else {
  const timeDisplay = createDebugDisplay()
  const increment = 0.1
  let count = 0
  const updateTime = () => {
    count += increment
    timeDisplay.update(`${count.toFixed(1)}s`)
    setTimeout(updateTime, 1000 * increment)
  }
  setTimeout(updateTime, 1000 * increment)
}

function createDebugDisplay(defaultHolder = true) {
  const parent = defaultHolder ? holder : container.appendChild(document.createElement('div'))
  const element = parent.appendChild(document.createElement('p'))

  return {
    update: content => {
      if (!isDebug) {
        return
      }
      element.innerText = content
    }
  }
}
