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

    this.i2c.sendMessage(dataStr);
  }

  updateLEDHSV(h, s, v) {
    const rgb = HSVtoRGB(h, s, v);
    this.setColor(rgb.r, rgb.g, rgb.b);
    this.updateLED();
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

function HSVtoRGB(h, s, v) {
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
