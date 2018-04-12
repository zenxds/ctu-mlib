import Events from './Events'

class Swipe {
  constructor(elem, options={}) {
    this.elem = typeof elem == 'string' ? document.querySelector(elem) : elem
    this.options = mix({ threshold: 30 }, options)
    this.events = new Events()

    this.bindEvents()
  }

  bindEvents() {
    this.start = this.start.bind(this)
    this.move = this.move.bind(this)
    this.end = this.end.bind(this)
    this.cancel = this.cancel.bind(this)

    this.elem.addEventListener("touchstart", this.start, false)
    this.elem.addEventListener("touchmove", this.move, false)
    this.elem.addEventListener("touchend", this.end, false)
    this.elem.addEventListener("touchcancel", this.cancel, false)
    window.addEventListener('scroll', this.cancel)
  }

  unbindEvents() {
    this.elem.removeEventListener("touchstart", this.start)
    this.elem.removeEventListener("touchmove", this.move)
    this.elem.removeEventListener("touchend", this.end)
    this.elem.removeEventListener("touchcancel", this.cancel)
    window.removeEventListener('scroll', this.cancel)
  }

  start(event) {
    if (!event.touches) {
      return
    }

    this.x1 = event.touches[0].pageX
    this.y1 = event.touches[0].pageY
  }

  move(event) {
    if (!event.touches) {
      return
    }

    this.x2 = event.touches[0].pageX
    this.y2 = event.touches[0].pageY

    let len = event.touches.length
    if (len > 1) {
      event.preventDefault()
    }
  }

  end(event) {
    if (!event.changedTouches) {
      return
    }

    let { threshold } = this.options

    if ((this.x2 && Math.abs(this.x1 - this.x2) > threshold) || (this.y2 && Math.abs(this.y1 - this.y2) > threshold)) {
        let direction = this._getDirection(this.x1, this.x2, this.y1, this.y2)
        this.swipeTimeout = setTimeout(() => {
          this.events.emit('swipe' + direction)
        }, 0)
    }

    this.x1 = this.x2 = this.y1 = this.y2 = null
  }

  cancel() {
    clearTimeout(this.swipeTimeout)
  }

  destroy() {
    this.cancel()
    this.unbindEvents()
    this.events.off()
  }

  _getDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }
}

export default Swipe

function mix(target, ...sources) {
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i]

    for (let prop in source) {
      target[prop] = source[prop]
    }
  }
  return target
}
