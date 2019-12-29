
if (!Function.prototype.bind) {
  Function.prototype.bind = function () {
    let self = this,
      context = [].shift.call(arguments),
      args = [].slice.call(arguments);
    return function () {
      self.apply(context, [].concat.call(args, [].slice.call(arguments)));
    }
  }
}

class Timer {

  /**
   *
   * @param callback
   * @param time 时间间隔 ms
   * @param limit 跳动次数
   * @param delay 第一次启动时的延迟时间
   */
  constructor(callback, time, limit, delay) {

    this.callback = callback;
    this.time = time;
    this.delay = delay;
    this.limitTemp = limit;
    this.timeoutId = null;
    this.intervalId = null;
    if (delay > 0) {
      this.timeoutId = this.startTimeout();
    } else {
      this.callback(this.limitTemp);
      this.intervalId = this.startInterval();
    }

  }

  startInterval() {
    return setInterval(() => {
      if (this.limitTemp === 0) {
        this.destroy();
        return
      }
      this.limitTemp--;
      this.callback(this.limitTemp);
    }, this.time)
  }

  startTimeout() {
    return setTimeout(() => {
      this.startInterval();
    }, this.delay);
  }

  destroy() {
    if (this.timeoutId){
      clearTimeout(this.timeoutId);
    }
    if (this.intervalId){
      clearInterval();
    }
  }

}

export {Timer};
