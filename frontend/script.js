const socket = new WebSocket('ws://172.20.10.5:8082');
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const fileInput = document.getElementById('file-input');

// Send text message
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.send(JSON.stringify({ type: 'text', message }));
        appendMessage(`You: ${message}`);
    }
});

// Send File
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64Data = reader.result;
            socket.send(JSON.stringify({ type: 'file', filename: file.name, fileData: base64Data }));
        };
        reader.readAsDataURL(file);
    }
});

// Handle incoming messages
socket.addEventListener('message', (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === 'text') {
            appendMessage(`Client ${data.message}`);
        } else if (data.type === 'file') {
            appendFileLink(data.filename, data.fileData);
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
});


// Display messages
function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageContainer.appendChild(messageElement);
}

// Display file download link
function appendFileLink(fileName, fileData) {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    link.textContent = `Download ${fileName}`;
    messageContainer.appendChild(link);
}