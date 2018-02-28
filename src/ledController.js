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
    dataStr += this.padVal(this.r) + "-";
    dataStr += this.padVal(this.g) + "-";
    dataStr += this.padVal(this.b) + "-";
    dataStr += this.padVal(this.a) + "\0";

    console.log(dataStr);
    this.i2c.writeString(dataStr);
  }

  padVal(val) {
    var paddedVal = "";
    if (val < 10) {
      paddedVal = "00" + val;
    }
    else if (val < 100) {
      paddedVal = "0" + val;
    }
    else {
      paddedVal = "" + val
    }

    return paddedVal;
  }
}

module.exports = TriLED;
