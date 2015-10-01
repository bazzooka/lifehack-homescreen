let Events = {
  isTouch: 'ontouchstart' in window,
  touchStart: 'ontouchstart' in window ? 'touchstart' : 'mousedown' ,
  touchMove: 'ontouchstart' in window ? 'touchmove' : 'mousemove',
  touchEnd: 'ontouchstart' in window ? 'touchend' : 'mouseup',

  /**
   * Gather touch / click position from events
   **/
  getTouchEvents: (e) => {
    return {
      x: e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || (e.targetTouches && e.targetTouches[0] && e.targetTouches[0].clientX) || (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX),
      y: e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || (e.targetTouches && e.targetTouches[0] && e.targetTouches[0].clientY) || (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientY)
    }
  }
};
module.exports = Events;
