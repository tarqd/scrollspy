var offset  = require('offset')
  , event   = require('event')
  , raf     = require('raf')
  , bind    = require('bind')
  , emitter = require('emitter')
  , throttle = require('throttle')
  , spy     = ScrollSpy.prototype
  , handler   = ScrollHandler.prototype
  , exports = module.exports = ScrollSpy

function ScrollSpy(element) {
  if (!(this instanceof ScrollSpy)) return new ScrollSpy(element)
  this.el = element
  this.doc = element.ownerDocument || (element.document && (element.document.documentElement || element.document.body.parentNode || element.document.body))
  this.dispatch = bind(this, dispatch)
  this.scrollHandler  =  bind(this, scrollHandler)
  this.req = false
  this.queue = raf
  this.listeners = []
}
emitter(spy)
spy.start = function(delay) {
  this.queue = delay === undefined ? bind(null, raf) : function(fn) { return setTimeout(fn, delay) } 
  event.bind(this.el, 'scroll', this.scrollHandler)
  return this
}

spy.stop = function() {
  event.unbind(this.el, 'scroll', this.scrollHandler)
  if (this.req !== false)
    raf.cancel(this.req)
  return this
}

spy.add = function(element, topOffset, leftOffset) {
  var handler = new ScrollHandler(this, element, topOffset, leftOffset)
  this.listeners.push(handler)
  return handler
}

spy.remove = function(element, topOffset, leftOffset) {
  this.listeners = this.listeners.filter(function (listener) {
    return (element === undefined || listener.el === element) 
      && (topOffset === undefined || topOffset === listener.topOffset)
      && (leftOffset === undefined || leftOffset === listener.leftOffset)
  })
  return this
}


function ScrollHandler(spy, element, topOffset, leftOffset) {
  this.el = element
  this.spy = spy
  this.topOffset = topOffset || 0
  this.leftOffset = leftOffset || undefined
  this.fixed = 0
}
emitter(handler)
handler.offset = function(topOffset, leftOffset) {
  if (arguments.length == 0) return {top: this.topOffset, left: this.leftOffset}
  else {
    this.topOffset = topOffset
    this.leftOffset =leftOffset
  }
  return this
}

handler.end = function() {
  return this.spy
}

handler.enter = enter 
handler.leave = leave


/*!
 * utility functions
 */ 
function scrollHandler(e) {
  if (this.req === false) this.req = this.queue(this.dispatch)
}

function dispatch() {
  var length = this.listeners.length
    , scrollY =  this.el.pageYOffset || this.el.scrollTop || this.doc.scrollTop
    , scrollX =  this.el.pageXOffset || this.el.scrollLeft || this.doc.scrollLeft
    , offsetTop = 0
    , offsetLeft = 0
    , doc = this.doc
  this.req = false
  
  for(var i = 0; i < length; i++) {
    var listener = this.listeners[i]
      , coords = offset(listener.el)

    if (!listener.fixed_top && coords.top <= listener.topOffset) {
      listener.fixed_top = true
      listener.scrollY = scrollY
      listener.emit('enter:top', listener.el)
      listener.emit('enter', listener.el)
    } else if (listener.fixed_top && scrollY < listener.scrollY) {
      listener.fixed_top = false
      listener.emit('leave:top', listener.el)
      listener.emit('leave')
    }

    if (listener.leftOffset !== undefined) {
      if (!listener.fixed_left && coords.left <= listener.leftOffset) {
        listener.fixed_left = true
        listener.scrollX = scrollX
        listener.emit('enter:left', listener.el)
        listener.emit('enter', listener.el)
      } else if (listener.fixed_left && scrollX < listener.scrollX) {
        listener.fixed_left = false
        listener.emit('leave:left', listener.el)
        listener.emit('leave', listener.el)
      }
    } 
  
  }
}

function enter(fn) {
  if (this.enter_) {
    this.off('enter', this.enter_)
    this.off('enter', this.enter_)
  }

  this.enter_ = fn
  this.on('enter', fn)
  this.on('enter', fn)
  return this
}

function leave(fn) {
  if (this.leave_) {
    this.off('leave', this.leave_)
    this.off('leave', this.leave_)
  }
  this.leave_ = fn
  this.on('leave', fn)
  this.on('leave', fn)
  return this
}

