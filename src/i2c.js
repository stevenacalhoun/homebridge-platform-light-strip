var I2C = require('raspi-i2c').I2C;

var i2c = new I2C();

class I2CDevice {
  constructor(address) {
    this.address = address;
    this.i = 0;
  }

  writeChar(char, cb) {
    var hexData = char.charCodeAt(0);
    i2c.writeByte(this.address, hexData, cb);
  };

  writeString(string, cb) {
    this.writeChar(string.charAt(this.i), () => {
      this.i++;
      if (this.i < string.length) {
        this.writeString(string);
      }
      else {
        this.i = 0;
      }
    });
  }
}

module.exports = I2CDevice;
