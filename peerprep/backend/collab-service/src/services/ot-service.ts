import ShareDB from 'sharedb';
import WebSocket from 'ws';
import * as ShareDBMongo from 'sharedb-mongo';

// MongoDB connection using environment variables (from .env file)
const db = new ShareDBMongo(process.env.DB_CLOUD_URI || 'mongodb://localhost:27017/sharedb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'sharedb'
});

const share = new ShareDB({ db });

// Open a WebSocket server to sync real-time operations
function startWebSocketServer() {
    const wss = new WebSocket.Server({ port: parseInt(process.env.WS_PORT || '3003') });
    
    wss.on('connection', (ws) => {
        const stream = new WebSocketJSONStream(ws);
        share.listen(stream);
    });

    console.log(`WebSocket server started on ws://localhost:${process.env.WS_PORT || '3003'}`);
}

// Helper to create a document if not exists
export function createDoc(collection: string, docId: string, callback: (err: any, doc: any) => void) {
    const connection = share.connect();
    const doc = connection.get(collection, docId);
    doc.fetch((err) => {
        if (err) throw err;
        if (doc.type === null) {
            doc.create({ content: '' }, callback);
        } else {
            callback(null, doc);
        }
    });
}

// Export the WebSocket server for starting
export function startOTService() {
    startWebSocketServer();
}

class WebSocketJSONStream {
    private ws: WebSocket;
    constructor(ws: WebSocket) {
        this.ws = ws;
    }

    // Handles sending and receiving JSON over WebSocket
    write(message: any) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }
    }

    end() {
        this.ws.close();
    }
}
