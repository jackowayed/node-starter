io.setPath('/client/');

function message(obj){
  var el = document.createElement('p');
  if ('announcement' in obj) el.innerHTML = '<em>' + esc(obj.announcement) + '</em>';
  else if ('message' in obj) el.innerHTML = '<b>' + esc(obj.message[0]) + ':</b> ' + esc(obj.message[1]);
  document.getElementById('chat').appendChild(el);
  document.getElementById('chat').scrollTop = 1000000;
}

function send(){
  var val = document.getElementById('text').value;
  socket.send(val);
  message({ message: ['you', val] });
  document.getElementById('text').value = '';
}

function esc(msg){
  return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

var socket = new io.Socket(null, {port: 80});
socket.connect();
socket.on('message', function(data){
  var obj = JSON.parse(data);

  if ('buffer' in obj){
    document.getElementById('form').style.display='block';
    document.getElementById('chat').innerHTML = '';
    
    for (var i in obj.buffer) message(obj.buffer[i]);
  } else message(obj);
});      
