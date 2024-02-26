const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const jwt=require('jsonwebtoken')
const User=require('./models/User')
const ws=require('ws')
const bcrypt = require('bcrypt');
const Message=require('./models/Message');
const cookieParser=require('cookie-parser');
const fs=require('fs');
const cors=require('cors')


dotenv.config()

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


jwtSecret=process.env.JWT_SECRET
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));


const corsOptions = {
    credentials: true,
    origin: 'chat-app-ghiu-5paab474z-ishajain1408s-projects.vercel.app', // Replace with your frontend URL
};

app.use(cors(corsOptions));
app.use(cors(corsOptions));
app.options('/register', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Ensure this matches your frontend origin
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(204).send();
});
// app.use((req, res, next) => {
//     // Assuming you have a middleware that authenticates the user
//     if (req.user) {
//       UserModel.findByIdAndUpdate(req.user._id, { lastSeen: new Date() }, (err, user) => {
//         if (err) {
//           console.error(err);
//         }
//       });
//     }
//     next();
//   });
  

async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(userData);
                }
            });
        } else {
            reject('no token');
        }
    });
}

app.get('/test',(req,res)=>{
    res.json('test ok')
})
app.get('/messages/:userId',async(req,res)=>{
    const {userId}=(req.params);
   const userData=  await getUserDataFromRequest(req);
   const ourUserId=userData.userId;
  const messages= await  Message.find({
    sender:{$in:[userId,ourUserId]},
    recipient:{$in:[userId,ourUserId]},
   }).sort({createdAt:1});
   res.json(messages);
});
app.get('/people', async (req, res) => {
    try {
        const users = await User.find({}, { '_id': 1, 'username': 1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/profile' , (req,res)=>{
  const token=  req.cookies?.token;
  if(token){
  jwt.verify(token, jwtSecret, {},(err,userData)=>{
    if (err) throw err;
    res.json(userData);
  })
}else {
    res.status(401).json('no token')
}
})
// app.get('/offlineUsers', updateLastSeenMiddleware, async (req, res) => {
//     try {
//         // Fetch offline users with their last seen time
//         const offlineUsers = await UserModel.find({ online: false }).select('username lastSeen');
//         res.json(offlineUsers);
//     } catch (error) {
//         console.error('Error fetching offline users:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// const generateLoginToken = (userId, username) => {
//     return jwt.sign({ userId, username }, process.env.JWT_SECRET);
// };
const generateLoginToken = (userId, username) => {
    const token = jwt.sign({ userId, username }, jwtSecret, { expiresIn: '1h' });
    return token;
};


// Rest of your server-side code...

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = generateLoginToken(foundUser._id, foundUser.username);
        res.cookie('token', token, { sameSite: 'none', secure: true });

        res.status(200).json({
            id: foundUser._id,
            username: foundUser.username,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/verifyToken', (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, jwtSecret, (err, userData) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.status(200).json(userData);
    });
});

app.post('/logout', (req, res) => {
    // Clear the token cookie on the client-side
    res.cookie('token', { sameSite: 'none', secure: true }).json('ok');
    // res.status(200).json({ message: 'Logout successful' });
  });
  
  // Middleware to verify the token on each request
  const verifyTokenMiddleware = (req, res, next) => {
    const token = req.cookies?.token;
  
    if (!token) {
      // No token found, user is not authenticated
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, jwtSecret, (err, userData) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // Token is valid, continue processing
        req.userData = userData;
        next();
    });
  };


const generateToken = (userId, username) => {
    const token = jwt.sign({ userId, username }, jwtSecret, { expiresIn: '1h' });
    return token;
};

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Validate request payload
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken.' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = await User.create({ username, password: hashedPassword });

        // Set the cookie with the token
        const token = generateToken(newUser._id, newUser.username);
        res.cookie('token', token, { sameSite: 'none', secure: true });

        // Send a success response
        res.status(201).json({
            id: newUser._id,
            username: newUser.username, // Include the username in the response
        });
    } catch (error) {
        console.error(error);

        // Handle duplicate key error (MongoError: E11000)
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Duplicate key error. This username is already taken.' });
        }

        // Handle other errors
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const server =app.listen(4000);
const wss=new ws.WebSocketServer({server});
wss.on('connection',(connection, req)=>{
    function notifyAboutOnlinePeople() {
        [...wss.clients].forEach(client => {
          client.send(JSON.stringify({
            online: [...wss.clients].map(c => ({userId:c.userId,username:c.username})),
          }));
        });
      }
    
      connection.isAlive = true;
    
      connection.timer = setInterval(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
          connection.isAlive = false;
          clearInterval(connection.timer);
          connection.terminate();
          notifyAboutOnlinePeople();
          console.log('dead');
        }, 1000);
      }, 5000);
    
      connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
      });
 const cookies=req.headers.cookie;
 if(cookies){
  const tokenCookieString= cookies.split(';').find(str=>str.startsWith('token='));
  if(tokenCookieString){
    const token=tokenCookieString.split('=')[1];
    if(token){
        jwt.verify(token,jwtSecret,{},(err,userData)=>{
            if(err) throw err;
            const {userId,username}=userData;
             connection.userId=userId;
             connection.username=username;

        })
        }
  }
 }
//   connection.on('message',async(message)=>{
//     const messageData = JSON.parse(message.toString());
//      const {recipient,text,file}=messageData;
//      let filename=null;
//     //  if(file){
//     //     const parts=file.name.split('.');
//     //     const ext=parts[parts.length-1];
//     //     const filename=Date.now()+'.'+ext;
//     //     const path =__dirname+'/uploads' + filename;
//     //    const bufferData = new Buffer(file.data.split(',')[1],'base64'); 
//     //     fs.writeFile(path,bufferData,()=>{
//     //     })
        
//     //  }
//     if (file) {
//         const parts = file.name.split('.');
//         const ext = parts[parts.length - 1];
//         filename = Date.now() + '.' + ext;  // Remove the const keyword here
//         const path = path.join(__dirname, 'uploads', filename);
//         const bufferData = new Buffer(file.data.split(',')[1], 'base64');
//         fs.writeFile(path, bufferData, () => {
//             console.log;
//         });
//     }
//      if(recipient && (text||file)){
//       const messageDoc=  await Message.create({
//             sender:connection.userId,
//             recipient,
//             text,
//             file: file?filename :null
//         });
//         [...wss.clients]
//         .filter(c=>c.userId===recipient)
//         .forEach(c=>c.send(JSON.stringify({text,
//             sender:connection.userId,
//             recipient,
//             file:file? filename:null,
//             _id:messageDoc._id,
//         })))
//      }
//  });
 


connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const {recipient, text, file} = messageData;
    let filename = null;
    if (file) {
      console.log('size', file.data.length);
      const parts = file.name.split('.');
      const ext = parts[parts.length - 1];
      filename = Date.now() + '.'+ext;
      const path = __dirname + '/uploads/' + filename;
      const bufferData = new Buffer(file.data.split(',')[1], 'base64');
      fs.writeFile(path, bufferData, () => {
        console.log('file saved:'+path);
      });
    }
    if (recipient && (text || file)) {
      const messageDoc = await Message.create({
        sender:connection.userId,
        recipient,
        text,
        file: file ? filename : null,
      });
      console.log('created message');
      [...wss.clients]
        .filter(c => c.userId === recipient)
        .forEach(c => c.send(JSON.stringify({
          text,
          sender:connection.userId,
          recipient,
          file: file ? filename : null,
          _id:messageDoc._id,
        })));
    }
  });
  [...wss.clients].forEach(client=>{
    client.send(JSON.stringify({
        online:[...wss.clients].map(c=>({userId:c.userId,username:c.username}))
}))
 });
notifyAboutOnlinePeople();
});
