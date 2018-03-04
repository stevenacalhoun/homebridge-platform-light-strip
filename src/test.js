const argv = require('minimist')(process.argv.slice(2));
const TriLED = require('./ledController.js');
const i2c = require('./i2c');

var led = new TriLED(0, 0, 0);
var i2cDev = new i2c(0x08);

if (argv.rgb) {
  led.rgb((r, g, b) => {
    console.log(r);
    console.log(g);
    console.log(b);
  });
}

else if (argv.red) {
  led.r((r) => {
    console.log(r);
  });
}
else if (argv.green) {
  led.g((g) => {
    console.log(g);
  });
}
else if (argv.blue) {
  led.b((b) => {
    console.log(b);
  });
}
else {
  led.setColor(argv.r, argv.g, argv.b, () => {
    console.log("set color")
  });
}

