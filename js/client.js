const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('msgInput');
const messageContainer = document.querySelector('.container');

// Audio to be played while receiving messages
var audio = new Audio('chat-tone.mp3');

// Function which will append event information to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    
    if(position == 'left'){
        audio.play();
    }
}

// If the form gets submitted, let the server receive
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})

// Ask new user for his/her name and let the server receive
const names = prompt('Enter your name to join');
socket.emit('new-user-joined', names)

// If new user joins, let the server receive the event
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
})

// If server sends the message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info into the container
socket.on('left', name => {
    append(`${name} left the chat`, 'right')
})