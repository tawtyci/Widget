const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
    ],
    target: "https://localhost:7044",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
