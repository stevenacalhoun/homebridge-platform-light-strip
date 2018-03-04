var TriLED = require('../led');

var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('led-strip-plugin', 'MyLEDStrip', myLEDStrip);
};

function myLEDStrip(log, config) {
  this.hue = 0;
  this.saturation = 0;
  this.value = 0;
  this.on = true;

  this.led = new TriLED(255, 255, 255);

  //this.led.updateLEDHSV(
  //  this.hue/365.0,
  //  this.saturation/100.0,
  //  this.value/100.0
  //);

  //this.led.hsv((hsv) => {
  //  this.hue = hsv.h;
  //  this.saturation = hsv.s;
  //  this.value = hsv.v;
  //});

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
  this.on = on;
  if (on) {
    this.log('Turning on');
    this.led.turnOn(() => { console.log("Turning on") });
  }
  else {
    this.log('Turning off');
    this.led.turnOff(() => { console.log("Turning on") });
  }

  callback();
}

myLEDStrip.prototype.getValue = function(cb) {
  cb(null, this.value);
  //this.led.hsv((hsv) => {
  //  callback(null, hsv.v);
  //});
}

myLEDStrip.prototype.setValue = function(value, callback) {
  this.value = value;
  this.log('New Value: ' + this.value);
  this.led.updateLEDHSV(
    this.hue/365.0,
    this.saturation/100.0,
    this.value/100.0,
    () => { console.log("Updating"); }
  );
  callback();
}

myLEDStrip.prototype.getHue = function(cb) {
  cb(null, this.hue);
  //this.led.hsv((hsv) => {
  //  callback(null, hsv.h);
  //});
}

myLEDStrip.prototype.setHue = function(hue, callback) {
  this.hue = hue;
  this.log('New Hue: ' + this.hue);
  //this.led.updateLEDHSV(
  //  this.hue/365.0,
  //  this.saturation/100.0,
  //  this.value/100.0,
  //  () => { console.log("Updating"); }
  //);
  callback();
}

myLEDStrip.prototype.getSaturation = function(cb) {
  cb(null, this.saturation);
  //this.led.hsv((hsv) => {
  //  callback(null, hsv.s);
  //});
}

myLEDStrip.prototype.setSaturation = function(saturation, callback) {
  this.saturation = saturation;
  this.log('New Saturation: ' + this.saturation);
  this.led.updateLEDHSV(
    this.hue/365.0,
    this.saturation/100.0,
    this.value/100.0,
    () => { console.log("Updating"); }
  );
  callback();
}

myLEDStrip.prototype.getServices = function() {
  return [this.service];
};
