const express = require('express');
const app = express();
let randomColor = require('randomcolor');
const uuid = require('uuid');

//middlewares
app.use(express.static('public'));

//routes
// app.get('/', (req,res)=>{
//     res.sendFile(__dirname + '/client/index.html');
// });

//Listen on port 5000
const server = app.listen(process.env.PORT || 5000);

//socket.io instantiation
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})

const messages = []

io.on('connection', socket => {
    const { room } = socket.handshake.query
    if (room) {
        console.log(`Connection established to ${room}`)

        socket.join(room)
        const userId = uuid.v4()
        socket.on('send_message', message => {
            messages.push({
                user: {
                    id: userId
                },
                message: {
                    id: uuid.v4(),
                    text: message
                }
            })
            io.to(room).emit('show_message', messages)
        })
    }
})

const users = []
const connnections = []

//listen on every connection
// io.on('connect', (socket) => {
//     console.log('New user connected')
//     //add the new socket to the connections array
//     connnections.push(socket)
//     //initialize a random color for the socket
//     let color = randomColor()

//     //Set the first username of the user as 'Anonymous'
//     socket.username = 'Anonymous'
//     socket.color = color

//     //listen on change_username
//     socket.on('change_username', data => {
//         let id = uuid.v4() // create a random id for the user
//         socket.id = id
//         socket.username = data.nickName
//         users.push({id, username: socket.username, color: socket.color})
//         updateUsernames()
//     })

//     //update Usernames in the client
//     const updateUsernames = () => {
//         io.sockets.emit('get users', users)
//     }

//     //listen on new_message
//     socket.on('new_message', (data) => {
//         //broadcast the new message
//         io.sockets.emit('new_message', {message : data.message, username : socket.username,color: socket.color})
//     })

//     //Disconnect
//     socket.on('disconnect', data => {

//         if(!socket.username)
//             return
//         //find the user and delete from the users list
//         let user = undefined
//         for(let i= 0; i<users.length; i++){
//             if(users[i].id === socket.id){
//                 user = users[i]
//                 break
//             }
//         }
//         users.splice(user,1)
//         //Update the users list
//         updateUsernames()
//         connnections.splice(connnections.indexOf(socket),1)
//     })
// })