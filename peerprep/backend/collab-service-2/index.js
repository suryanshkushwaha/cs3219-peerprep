const { Hocuspocus } = require("@hocuspocus/server");

const server = new Hocuspocus({
  port: 1234,
  async onConnect() {
    console.log('🔮')
  }
});

server.listen(() => {
  console.log("Hocuspocus server is running on ws://127.0.0.1:1234");
});