/*
 * Module dependencies
 */
var offset = require('offset');
var event = require('event');
var raf = require('raf');
var bind = require('bind');
var asap = require('asap');

/*
 * Export ScrollSpy
 */

exports = module.exports = ScrollSpy;


/**
 * ScrollSpy
 *
 * @param {HTMLElement} element
 * @return {ScrollSpy}
 */
function ScrollSpy(element) {
  if (!(this instanceof ScrollSpy)) return new ScrollSpy(element);
  this.el = element;
  this.doc = element.ownerDocument || (element.document && (element.document.documentElement ||
    element.document.body.parentNode || element.document.body));
  this.dispatch = bind(this, dispatch);
  this.scrollHandler = bind(this, scrollHandler);
  this.req = false;
  this.running = false;
  this.listeners = [];
}

exports.prototype.start = function () {
  if (this.running) this.stop();
  event.bind(this.el, 'scroll', this.scrollHandler);
  this.running = true;
  return this;
};

exports.prototype.stop = function () {
  this.running = false;
  event.unbind(this.el, 'scroll', this.scrollHandler);
  if (this.req !== false) raf.cancel(this.req);
  return this;
};

exports.prototype.add = function (element, topOffset, leftOffset) {
  var handler = new ScrollHandler(this, element, topOffset, leftOffset);
  this.listeners.push(handler);
  return handler;
};

exports.prototype.remove = function (element, topOffset, leftOffset) {
  this.listeners = this.listeners.filter(function (listener) {
    return (element === undefined || listener.el === element) && (
      topOffset === undefined || topOffset === listener.topOffset) &&
      (leftOffset === undefined || leftOffset === listener.leftOffset);
  });
  return this;
};
exports.prototype.enter = enter;
exports.prototype.leave = leave;

function ScrollHandler(spy, element, topOffset, leftOffset) {
  this.el = element;
  this.spy = spy;
  this.topOffset = topOffset || 0;
  this.leftOffset = leftOffset || undefined;
}

ScrollHandler.prototype.offset = function (topOffset, leftOffset) {
  if (arguments.length === 0) return {
    top: this.topOffset,
    left: this.leftOffset
  };
  else {
    this.topOffset = topOffset;
    this.leftOffset = leftOffset;
  }
  return this;
};

ScrollHandler.prototype.end = function () {
  return this.spy;
};
ScrollHandler.prototype.enter = enter;
ScrollHandler.prototype.leave = leave;
/*!
 * utility functions
 */

function scrollHandler() {
  if (this.req === false) this.req = raf(this.dispatch);
}

function dispatch() {
  var length = this.listeners.length,
    scrollY = this.el.pageYOffset || this.el.scrollTop || this.doc.scrollTop,
    scrollX =
      this.el.pageXOffset || this.el.scrollLeft || this.doc.scrollLeft,
    offsetTop = 0,
    offsetLeft = 0,
    doc = this.doc;
  for (var i = 0; i < length; i++) {
    var listener = this.listeners[i],
      coords = offset(listener.el),
      exec_enter = false,
      exec_leave = false; //console.log('dispatch!', coords.top, listener.topOffset)
    if (!listener.is_top && coords.top <= listener.topOffset) {
      listener.is_top = true;
      listener.scrollY = scrollY;
      exec_enter = true;
    } else if (listener.is_top && scrollY < listener.scrollY) {
      listener.is_top = false;
      exec_leave = true;
    }
    if (listener.leftOffset !== undefined) {
      if (!listener.is_left && coords.left <= listener.leftOffset) {
        listener.is_left = true;
        listener.scrollX = scrollX;
        exec_enter = true;
      } else if (listener.is_left && scrollX < listener.scrollX) {
        listener.is_left = false;
        exec_leave = true;
      }
    }
    exec(listener, exec_enter, exec_leave);
  }
  this.req = false;
}

function exec(listener, enter, leave) {
  asap(function () {
    if (enter && (enter = listener.enter_ || listener.spy.enter_)) enter
      .call(listener.el, listener.is_top, listener.is_left);
    if (leave && (leave = listener.leave_ || listener.spy.leave_)) leave
      .call(listener.el, listener.is_left, listener.is_left);
  });
}

function enter(fn) {
  this.enter_ = fn;
  return this;
}

function leave(fn) {
  this.leave_ = fn;
  return this;
}
