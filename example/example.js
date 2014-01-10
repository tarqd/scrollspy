function start(){
  var nav = document.getElementById("nav")
  var spy = require('scrollspy')(window)
  spy
    .enter(setClass('fixed'))
    .leave(setClass(''))
    .start()
    .add(nav)
}

function setClass(value) {
  return function () {
    this.setAttribute('class', value);
  }
}

