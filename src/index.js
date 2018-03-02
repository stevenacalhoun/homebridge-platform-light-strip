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

  this.led = new TriLED(255, 255, 255, 100);

  this.led.updateLEDHSV(this.hue/365.0, this.saturation/100.0, this.value/100.0);

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

myLEDStrip.prototype.getOn = function(callback) {
  callback(null, this.on);
}

myLEDStrip.prototype.setOn = function(on, callback) {
  if (on) {
    this.value = 100;
    this.log('Turning on');
  }
  else {
    this.value = 0;
    this.log('Turning off');
  }

  this.led.updateLEDHSV(this.hue/365.0, this.saturation/100.0, this.value/100.0);
  callback();
}

myLEDStrip.prototype.getValue = function(callback) {
  callback(null, this.value);
}

myLEDStrip.prototype.setValue = function(value, callback) {
  this.value = value;
  this.log('New Value: ' + this.value);
  this.led.updateLEDHSV(this.hue/365.0, this.saturation/100.0, this.value/100.0);
  callback();
}

myLEDStrip.prototype.getHue = function(callback) {
  callback(null, this.hue);
}

myLEDStrip.prototype.setHue = function(hue, callback) {
  this.hue = hue;
  this.log('New Hue: ' + this.hue);
  this.led.updateLEDHSV(this.hue/365.0, this.saturation/100.0, this.value/100.0);
  callback();
}

myLEDStrip.prototype.getSaturation = function(callback) {
  callback(null, this.saturation);
}

myLEDStrip.prototype.setSaturation = function(saturation, callback) {
  this.saturation = saturation;
  this.log('New Saturation: ' + this.saturation);
  this.led.updateLEDHSV(this.hue/365.0, this.saturation/100.0, this.value/100.0);
  callback();
}

myLEDStrip.prototype.getServices = function() {
  return [this.service];
};
