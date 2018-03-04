var I2C = require('raspi-i2c').I2C;

var i2c = new I2C();

class I2CDevice {
  constructor(address) {
    this.address = address;
    this.i = 0;
    this.messages = [];
    this.writing = false;
  }

  writeChar(char, cb) {
    var hexData = char.charCodeAt(0);
    i2c.writeByte(this.address, hexData, () => {
      setTimeout(cb, 20);
    });
  };

  sendMessage(string, cb) {
    this.messages.push(string);
    if (!this.writing) {
      const message = this.messages.shift();
      this.writing = true;
      this.writeString(message, cb);
    }
  }

  writeString(string, cb) {
    this.writeChar(string.charAt(this.i), () => {
      this.i++;
      if (this.i < string.length) {
        this.writeString(string, cb);
      }
      else {
        this.i = 0;
        if (this.messages.length > 0) {
          const message = this.messages.shift();
          this.writeString(message, cb);
        }
        else {
          this.writing = false;
          cb();
        }
      }
    });
  }

  readString(size, cb) {
    i2c.read(this.address, this.address, size, cb);
  }
}

module.exports = I2CDevice;
