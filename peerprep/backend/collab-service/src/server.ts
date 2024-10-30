import { Server as WebSocketServer, WebSocket } from 'ws'; // Import WebSocket with its type.
import { createServer, IncomingMessage, Server as HTTPServer } from 'http'; // Import HTTP and its types.
import { Server as StaticServer } from 'node-static'; 
import { setupWSConnection, docs } from 'y-websocket/bin/utils'; 
import dotenv from 'dotenv';

dotenv.config();

const port = parseInt(process.env.PORT || '3003', 10);
const production = process.env.PRODUCTION != null;
const nostatic = process.env.NOSTATIC != null;

const staticServer = nostatic ? null : new StaticServer('../', { cache: production ? 3600 : false, gzip: production });

// Create an HTTP server to handle requests.
const server: HTTPServer = createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ response: 'ok' }));
    return;
  }

  if (staticServer && !(request.url || '').startsWith('/ws/')) {
    request.addListener('end', () => {
      staticServer.serve(request, response);
    }).resume();
  }
});

// Create WebSocket server attached to the HTTP server.
const wss = new WebSocketServer({ server });

wss.on('connection', (conn: WebSocket, req: IncomingMessage) => {
  setupWSConnection(conn, req, { gc: req.url !== '/ws/prosemirror-versions' });
});

// Log connection statistics every 10 seconds.
setInterval(() => {
  let conns = 0;
  docs.forEach((doc: any) => { conns += doc.conns.size; });

  const stats = {
    conns,
    docs: docs.size,
    websocket: `ws://localhost:${port}`,
    http: `http://localhost:${port}`,
  };

  console.log(`${new Date().toISOString()} Stats: ${JSON.stringify(stats)}`);
}, 10000);

server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${port} (${production ? 'production mode' : 'development mode'}${nostatic ? ' - no static content' : ' - serving static content'})`);
});
