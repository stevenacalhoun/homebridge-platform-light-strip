var Gpio = require('onoff').Gpio;

class Pin {
  constructor(pin) {
    this.pin = new Gpio(pin, 'out');
  }

  setHigh() {
    this.pin..writeSync(1);
  }

  setLow() {
    this.pin..writeSync(0);
  }
}

