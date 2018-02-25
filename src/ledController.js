var I2CDevice = require('./i2c');

class TriLED {
  constructor(r, g, b, a) {
    this.i2c = new I2CDevice(0x08);

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.updateLED();
  }

  setColor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.updateLED();
  }

  setBrightness(a) {
    this.a = a;
  }

  turnOn() {
    this.a = 100;
    this.updateLED();
  }

  turnOff() {
    this.a = 0;
    this.updateLED();
  }

  updateLED() {
    var dataStr = "";
    dataStr += ("0" + this.r).slice(-3) + "-";
    dataStr += ("0" + this.g).slice(-3) + "-";
    dataStr += ("0" + this.b).slice(-3) + "-";
    dataStr += ("0" + this.a).slice(-3) + "\0";

    console.log(dataStr);
    this.i2c.writeString(dataStr);
  }
}

module.exports = TriLED;
