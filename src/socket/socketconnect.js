import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');
function sendSocket(port,msg) {
  socket.emit(port, msg);
}

function recieveSocket(user,toFront){
  socket.on(user, message => toFront(null,message));
}
function closeSocket(){
  socket.close();
}
export { sendSocket ,recieveSocket,closeSocket};
