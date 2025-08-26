import dns from "node:dns/promises";
import tls from "node:tls";
import WebSocket from "ws";

// : 2606:4700:4700::1111,2606:4700:4700::1001
dns.setServers([
  "1.1.1.1",
  "1.0.0.1",
  "2606:4700:4700::1111",
  "2606:4700:4700::1001",
]);

const dnsResolve = await dns.resolve("wbs.mexc.fm");
console.log("dnsResolve", dnsResolve);

const domain = await dns.lookup("www.mexc.com");
console.log("lookup", domain);

const socket = new WebSocket("wss://wbs.mexc.com/ws", {
  rejectUnauthorized: false,
  headers: {
    "upgrade-insecure-requests": "1",
  },
  ciphers: tls.getCiphers().join(":"),
});

socket.on("message", function (data) {
  console.log(data);
});

socket.on("open", function () {
  console.log("open");
});

socket.on("close", function (code, reason) {
  console.log("close", code, reason.toString());
});

socket.onmessage = (event) => {
  console.log("message", event.data);
};
socket.onerror = (event) => {
  console.log("error", event);
};
socket.onclose = (event) => {
  console.log("close", event.code, event.reason);
};
