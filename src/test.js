var SerialPort = require("serialport")
var port = new SerialPort("COM2", {
  autoOpen: true
})
var int = 0
port.on("open", function() {
  console.log("open")
  setInterval(function() {
    console.log("write", int)
    port.write(String.fromCharCode(int))
    int++
  }, 1000)
})
port.on("data", function(data) {
  console.log(data)
})