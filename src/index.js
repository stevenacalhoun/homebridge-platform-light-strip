var TriLED = require('./ledController');

var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('led-strip-plugin', 'MyLEDStrip', myLEDStrip);
};

function myLEDStrip(log, config) {
  this.saturation = 255;
  this.hue = 255;
  this.value = 100;
  this.on = true;

  updateLED(this.hue, this.saturation, this.value);

  this.log = log;
  this.log("LED Strip init");
  this.name = config['name'];

  this.service = new Service.Lightbulb(this.name);

  this.service
    .setCharacteristic(Characteristic.Manufacturer, "Steven")
    .setCharacteristic(Characteristic.Model, "M1")
    .setCharacteristic(Characteristic.SerialNumber, "1");

  this.service
    .getCharacteristic(Characteristic.On)
      .on('get', this.getOn.bind(this))
      .on('set', this.setOn.bind(this));

  this.service
    .getCharacteristic(Characteristic.Brightness)
      .on('get', this.getValue.bind(this))
      .on('set', this.setValue.bind(this));

  this.service
    .getCharacteristic(Characteristic.Hue)
      .on('get', this.getHue.bind(this))
      .on('set', this.setHue.bind(this));

  this.service
    .getCharacteristic(Characteristic.Saturation)
      .on('get', this.getSaturation.bind(this))
      .on('set', this.setSaturation.bind(this));
}


function hslToRGB(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l;
  }
  else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if(t < 0.0) t += 1.0;
      if(t > 1.0) t -= 1.0;
      if(t < 1.0/6.0) return p + (q - p) * 6.0 * t;
      if(t < 1.0/2.0) return q;
      if(t < 2.0/3.0) return p + (q - p) * (2.0/3.0 - t) * 6.0;
      return p;
    }

    var q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
    var p = 2.0 * l - q;
    r = hue2rgb(p, q, h + 1.0/3.0);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1.0/3.0);
  }

  return [Math.round(r * 255.0), Math.round(g * 255.0), Math.round(b * 255.0)];
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

function updateLED(h, s, v) {
  var vals = HSVtoRGB(h/360.0, s/100.0, v/100.0);
  new TriLED(vals.r, vals.g, vals.b, 100);
}

myLEDStrip.prototype.getOn = function(callback) {
  callback(null, this.on);
}

myLEDStrip.prototype.setOn = function(on, callback) {
  this.on = on;
  this.log('New On State: ' + this.on);
  this.value = 0;
  updateLED(this.hue, this.saturation, this.value);
  callback();
}

myLEDStrip.prototype.getValue = function(callback) {
  callback(null, this.value);
}

myLEDStrip.prototype.setValue = function(value, callback) {
  this.value = value;
  this.log('New Value: ' + this.value);
  updateLED(this.hue, this.saturation, this.value);
  callback();
}

myLEDStrip.prototype.getHue = function(callback) {
  callback(null, this.hue);
}

myLEDStrip.prototype.setHue = function(hue, callback) {
  this.hue = hue;
  this.log('New Hue: ' + this.hue);
  updateLED(this.hue, this.saturation, this.value);
  callback();
}

myLEDStrip.prototype.getSaturation = function(callback) {
  callback(null, this.saturation);
}

myLEDStrip.prototype.setSaturation = function(saturation, callback) {
  this.saturation = saturation;
  this.log('New Saturation: ' + this.saturation);
  updateLED(this.hue, this.saturation, this.value);
  callback();
}

myLEDStrip.prototype.getServices = function() {
  return [this.service];
};
