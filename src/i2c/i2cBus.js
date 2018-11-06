var I2C = require('raspi-i2c').I2C;

var i2c = new I2C();

class I2CDevice {
  constructor(address) {
    this.address = address;
    this.i = 0;
    this.messages = [];
    this.writing = false;
  }

  writeChar(char) {
    var hexData = char.charCodeAt(0);

    return new Promise((resolve, reject) => {
      i2c.writeByte(this.address, hexData, () => {
        setTimeout(resolve, 20);
      });
    });
  };

  sendMessage(string) {
    this.messages.push(string);
    if (!this.writing) {
      const message = this.messages.shift();
      this.writing = true;
      return this.writeString(message);
    }
    else {
      return Promise.resolve();
    }
  }

  writeString(string) {
    return this.writeChar(string.charAt(this.i)).then(() => {
      this.i++;
      if (this.i < string.length) {
        return this.writeString(string);
      }
      else {
        this.i = 0;
        if (this.messages.length > 0) {
          const message = this.messages.shift();
          return this.writeString(message);
        }
        else {
          this.writing = false;
        }
      }
    });
  }

  readString(size) {
    return new Promise((resolve, reject) => {
      i2c.read(this.address, this.address, size, resolve);
    })
  }
}

module.exports = I2CDevice;
