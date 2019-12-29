
class Storage {

  constructor() {
    this.callbacks = [];
    window.Depository = this;
  }

  addCall(callback) {
    this.callbacks.push(callback);
  }

  removeCall(callback) {
    let items = [];
    for (let item of this.callbacks) {
      if (item !== callback) {
        items.push(item);
      }
    }
    this.callbacks = items;
  }

  setItem(key, value) {
    localStorage.setItem(key, value);
    for (let item of this.callbacks) {
      item('set', key, value);
    }
  }

  getItem(key) {
    let value = localStorage.getItem(key);
    for (let item of this.callbacks) {
      item('get', key, value);
    }
    return value;
  }

  delItem(key){
    localStorage.removeItem(key);
    for (let item of this.callbacks) {
      item('del', key, '');
    }
  }

  clear() {
    localStorage.clear();
    for (let item of this.callbacks) {
      item('clear', '', '');
    }
  }
}

(function () {
  new Storage();
})();



