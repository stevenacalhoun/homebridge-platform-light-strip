class I2CLED {
  constructor(i2cBus) {
    this.i2cBus = i2cBus;
    this.on = 0;
    this.h = 0;
    this.s = 0;
    this.v = 0;
  }

  getOn(on) {
    return this.on;
  }

  setOn(on) {
    this.on = on;
    return this.setValue(this.v);
  }

  getHue() {
    return this.h;
  }

  setHue(hue) {
    this.h = hue;
    return this.i2cBus.sendMessage("h"+this.h+"\0");
  }

  getSaturation() {
    return this.s;
  }

  setSaturation(saturation) {
    this.s = saturation;
    return this.i2cBus.sendMessage("s"+this.s+"\0");
  }

  getValue() {
    return this.v;
  }

  setValue(value) {
    this.v = value;
    return this.i2cBus.sendMessage("v"+(this.v*this.on)+"\0");
  }
}

module.exports = I2CLED;
