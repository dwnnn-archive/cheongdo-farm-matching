import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleAssistantRequest } from "./server/assistant.js";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.join(projectRoot, "dist");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }

  if (pathname.startsWith("/api/")) {
    if (pathname === "/api/health" && request.method === "GET") {
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }

    try {
      if (await handleAssistantRequest(request, response)) return;
    } catch (error) {
      console.error("Unable to handle assistant request:", error);
      if (!response.headersSent) {
        response.writeHead(500, {
          "Cache-Control": "no-store",
          "Content-Type": "application/json; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        });
        response.end(JSON.stringify({ error: "요청을 처리하지 못했습니다." }));
      }
      return;
    }
    response.writeHead(404).end("Not found");
    return;
  }

  const requestedPath = path.resolve(outputDirectory, `.${pathname}`);
  if (
    requestedPath !== outputDirectory &&
    !requestedPath.startsWith(`${outputDirectory}${path.sep}`)
  ) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  let filePath = requestedPath;
  try {
    const fileInfo = await stat(filePath);
    if (fileInfo.isDirectory()) filePath = path.join(filePath, "index.html");
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Unable to inspect requested file:", error);
      response.writeHead(500).end("Internal server error");
      return;
    }
    if (path.extname(filePath)) {
      response.writeHead(404).end("Not found");
      return;
    }
    filePath = path.join(outputDirectory, "index.html");
  }

  try {
    const content = await readFile(filePath);
    const contentType = contentTypes[path.extname(filePath)] ?? "application/octet-stream";
    response.writeHead(200, {
      "Cache-Control": "no-cache",
      "Content-Type": contentType,
      "X-Content-Type-Options": "nosniff",
    });
    response.end(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      response.writeHead(404).end("Not found");
      return;
    }
    console.error("Unable to serve requested file:", error);
    response.writeHead(500).end("Internal server error");
  }
});

const port = Number(process.env.PORT ?? 3001);
server.listen(port, "0.0.0.0", () => {
  console.log(`일손이음 is listening on port ${port}`);
});
