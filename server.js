const WebSocket = require('ws');

const http = require('http');
const fs = require('fs');
const path = require('path');


// Create a HTTP server
const server = http.createServer((req, res) => {
    const filePath = req.url === '/' ? './index.html' : `.${req.url}`;
    const ext = path.extname(filePath);
    let contentType = 'text/html';

    switch (ext) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '/css':
                contentType = 'text/css';
                break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Error loading file');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});


// Create a WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (error) {
            console.error('Invalid message received:', error);
        }
    });
    ws.on('close', () => console.log('Client disconnected'));
});


const PORT = 8082;

server.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})
