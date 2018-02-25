var Gpio = require('onoff').Gpio,
    led = new Gpio(16, 'out');

function trunOn() {
  led.writeSync(1);
}

function trunOff() {
  led.writeSync(0);
}

if(process.argv.indexOf('on') != -1) {
  turnOn();
}
else {
  turnOff();
}
