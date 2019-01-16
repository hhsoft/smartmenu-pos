<template>
<v-app id="app">
  <router-view></router-view>
</v-app>
</template>

<script>
// const SerialPort = require('serialport')
// const port = new SerialPort('COM3', {
//   baudRate: 57600
// })
// SerialPort.list((err, ports) => {
//   console.log('ports', ports);
//
// })
export default {
  name: 'pos',
  methods: {

  }
}
</script>

<style>
/* CSS */

html,
body,
#app {
  height: 100%;
  overflow: hidden !important;
}

.dialog {
  max-width: 800px !important;
  overflow: hidden !important;
}
</style>
