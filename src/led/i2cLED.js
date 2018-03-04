var I2CDevice = require('./i2c');

class TriLED {
  constructor(r, g, b) {
    this.i2c = new I2CDevice(0x08);

    //this.setColor(r, g, b);
  }

  setColor(r, g, b, cb) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.updateLEDRGB(this.r, this.g, this.b, cb);
  }

  turnOn(cb) {
    this.updateLEDRGB(this.r, this.g, this.b, cb);
  }

  turnOff(cb) {
    this.updateLEDRGB(0, 0, 0, cb);
  }

  getChannel(channel, cb) {
    var size = channel == "rgb" ? 11 : 3;
    console.log(size);
    this.i2c.writeString(channel+"\0", () => {
      this.i2c.readString(size, (err, message) => {
        console.log(err);
        console.log(message);
        cb(message.toString());
      });
    });
  }

  r(cb) {
    this.getChannel('r', cb);
  }

  g(cb) {
    this.getChannel('g', cb);
  }

  b(cb) {
    this.getChannel('b', cb);
  }

  rgb(cb) {
    this.getChannel('rgb', (message) => {
      console.log(message);
    });
  }

  hsv(cb) {
    this.rgb((r, g, b) => {
      cb(rgbToHSV(r, g, b));
    });
  }

  updateLEDRGB(r, g, b, cb) {
    var dataStr = "";
    dataStr += this.padVal(r) + "-";
    dataStr += this.padVal(g) + "-";
    dataStr += this.padVal(b) + "\0";

    console.log(dataStr);
    this.i2c.sendMessage(dataStr, cb);
  }

  updateLEDHSV(h, s, v, cb) {
    const rgb = hsvToRGB(h, s, v);
    this.setColor(rgb.r, rgb.g, rgb.b, cb);
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

function rgbToHSV(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;
  var d = max - min;
  s = max == 0 ? 0 : d / max;
  if (max == min) {
    h = 0; // achromatic
  }
  else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: h*360,
    s: s*100,
    v: v*100
  };
}

function hsvToRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

module.exports = TriLED;
