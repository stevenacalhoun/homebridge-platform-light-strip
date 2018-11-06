var I2CBus = require('./i2c/i2cBus');
var I2CLED = require('./led/i2cLED');

var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('led-strip-plugin', 'MyLEDStrip', myLEDStrip);
};

function myLEDStrip(log, config) {
  this.log = log;
  this.log("LED Strip init");

  // i2c Bus
  this.i2cBus = new I2CBus(0x08);

  // LED
  this.led = new I2CLED(this.i2cBus);

  // Accessory info
  this.name = config['name'];
  this.service = new Service.Lightbulb(this.name);

  // Assign getters/setters for characteristics
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

myLEDStrip.prototype.getOn = function(cb) {
  cb(null, this.led.getOn());
}

myLEDStrip.prototype.setOn = function(on, cb) {
  this.log('New On: ' + on);
  this.led.setOn(on).then(cb);
}

myLEDStrip.prototype.getValue = function(cb) {
  cb(null, this.led.getValue());
}

myLEDStrip.prototype.setValue = function(value, cb) {
  this.log('New Value: ' + value);
  this.led.setValue(value).then(cb);
}

myLEDStrip.prototype.getHue = function(cb) {
  cb(null, this.led.getHue());
}

myLEDStrip.prototype.setHue = function(hue, cb) {
  this.log('New Hue: ' + hue);
  this.led.setHue(hue).then(cb);
}

myLEDStrip.prototype.getSaturation = function(cb) {
  cb(null, this.led.getSaturation());
}

myLEDStrip.prototype.setSaturation = function(saturation, cb) {
  this.log('New Saturation: ' + saturation);
  this.led.setSaturation(saturation).then(cb);
}

myLEDStrip.prototype.getServices = function() {
  return [this.service];
};
