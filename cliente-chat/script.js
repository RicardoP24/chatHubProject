const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const signUpLink = document.getElementById('signUpLink');
const signInLink = document.getElementById('signInLink');
const signUpContainer = document.querySelector('.sign-up-container');
const signInContainer = document.querySelector('.sign-in-container');

const currentUser = ''

// Show the register form by default
signUpContainer.classList.add('active');

// Toggle to show the register form
signUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    signInContainer.classList.remove('active');
    signUpContainer.classList.add('active');
});

// Toggle to show the login form
signInLink.addEventListener('click', (e) => {
    e.preventDefault();
    signUpContainer.classList.remove('active');
    signInContainer.classList.add('active');
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;


    const porta = 3000;

    const response = await fetch(`http://localhost:${porta}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
    });

    const result = await response.json();
    if (result.success) {
        currentUser=name
        obterMensagensRealTime();
        registerForm.reset();
    } else {
        alert('register failed: ' + result.message);

    }

});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;


    const porta = 3000;

    const response = await fetch(`http://localhost:${porta}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
    });

    const result = await response.json();
    if (result.success) {
        currentUser=name
        obterMensagensRealTime();
        loginForm.reset();
    } else {
        alert('Login failed: ' + result.message);

    }


});

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {

    var porta = 3000
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;
    if (messageText === '') return;

    const response = await fetch(`http://localhost:${porta}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentUser, message: messageText })
    });
    const data = await response.json();

    if (data.success) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${currentUser}:</strong> ${messageText}`;
        document.getElementById('chatWindow').appendChild(messageElement);
        document.getElementById('chatWindow').scrollTop = document.getElementById('chatWindow').scrollHeight
        messageInput.value = '';
        messageInput.focus();

    } else {
        console.error(data.error);
    }







    // Scroll to the bottom of the chat window
    document.getElementById('chatWindow').scrollTop = document.getElementById('chatWindow').scrollHeight;


}

async function obterPortaMelhorServidor() {

    const response = await fetch(`http://localhost:8020/obterMelhorServidor`);

    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }

    const resp = await response.json();

    return resp.bestPort;
}

function obterMensagensRealTime() {

    setTimeout(async () => {

        try {
            var porta = 3000;
            const response = await fetch(`http://localhost:${porta}/messages`);

            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const messages = await response.json();
            document.getElementById('chatWindow').innerHTML = ''

            for (let i of messages) {

                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.innerHTML = `<strong>${i.user}:</strong> ${i.message}`;
                document.getElementById('chatWindow').appendChild(messageElement);
                document.getElementById('chatWindow').scrollTop = document.getElementById('chatWindow').scrollHeight;
            }


        } catch (error) {
            console.error('Error fetching messages:', error);
            return null;
        }

    }, 1000);


}

