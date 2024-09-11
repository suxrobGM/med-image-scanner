import * as path from "path";
import express from "express";
import * as corsProxy from "cors-anywhere";

const app = express();
const port = process.env.PORT || 8002;
const host = process.env.HOST || "0.0.0.0"
const corsPort = port + 1;

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Serve the OHIF Viewer React app
app.use(express.static("ohif"));

app.all("*", (req, res) => {
  return res.sendFile(path.resolve("ohif", "index.html"));
});

app.listen(port, host, () => {
  console.log(`> Server is running on ${host}:${port}`);
});

corsProxy
  .createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"],
  })
  .listen(corsPort, host, () => {
    console.log(`> CORS Anywhere is running on ${host}:${corsPort}`);
  });
