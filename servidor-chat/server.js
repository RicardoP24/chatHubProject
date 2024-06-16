const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const dotenv = require('dotenv');
const app = express();
const PORT1 = 3000;
const PORT2 = 3001;
const PORT3 = 3002;
const cors = require('cors');
const bcrypt = require('bcrypt');

dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

//MongoDB
// Conectando ao banco de dados
mongoose.connect('mongodb+srv://chathubdatabase:hhw24NvuheYfCE7p@cluster0.4onbkjl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));


const chatSchema = new mongoose.Schema({
    user: String,
    message: String,
});
const userSchema = new mongoose.Schema({
    name: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

const Chat = mongoose.model('chat', chatSchema);


app.get('/messages', async (req, res) => {
    try {
        const messages = await Chat.find();
        res.status(200).json(messages);
    } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.post('/messages', async (req, res) => {
    const { sender, content } = req.body;
    try {
        const newMessage = new Message({ sender, content });
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Mensagem salva com sucesso' });
    } catch (err) {
        console.error('Erro ao salvar mensagem:', err);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Senha incorreta' });
        }
        res.status(200).json({ success: true, message: 'Login bem-sucedido' });
    } catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

app.post('/register', async (req, res) => {

    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ success: true, message: 'Usuário registrado com sucesso' });
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});



function UpdateOnZookeeper(porta,load) {

        const systemInfo = {
            porta,
            load
        };

        const postData = JSON.stringify(systemInfo);

        const options = {
            hostname: ip_servidor_zookeeper,
            port: 8000,
            path: '/registrarNos',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log('Porta: ',porta,"/ Carga: ",load);
            });
         });

        req.on('error', (err) => {
            console.error('Error sending system info:', err);
        });

        req.end(postData);

}


 

app.listen(PORT1, () => {
    console.log(`Server running on port ${PORT1}`);
});
app.listen(PORT2, () => {
    console.log(`Server running on port ${PORT2}`);
});
app.listen(PORT3, () => {
    console.log(`Server running on port ${PORT3}`);
});