// Serveur HTTP statique minimal pour WaveCheck (dossier html)
// Usage : node server.js

const http = require("http");
const path = require("path");
const fs = require("fs");

const PORT = 3000;
const ROOT = path.join(__dirname, "html");

// Détermine le type MIME basique à partir de l'extension
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    case ".json":
      return "application/json; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

const server = http.createServer((req, res) => {
  const urlPath = req.url === "/" ? "/index.html" : req.url;
  const safePath = urlPath.split("?")[0].split("#")[0];
  const filePath = path.join(ROOT, safePath);

  // Empêche toute sortie du répertoire ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Accès refusé");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Fichier non trouvé");
    }

    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    stream.pipe(res);
    stream.on("error", () => {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Erreur serveur");
    });
  });
});

server.listen(PORT, () => {
  console.log(`WaveCheck disponible sur http://localhost:${PORT}`);
});

