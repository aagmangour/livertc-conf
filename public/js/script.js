const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer(undefined, {
	host: "/",
	port: "9000"
});
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};

//video play
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => { 
    startVideo(myVideo, stream);

    myPeer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        startVideo(video, userVideoStream);
      });
    });

    socket.on("peer-connected", (userId) => {
      console.log("Peer is Connected");
      addUsertoCall(userId, stream);
    });


  });
  
  function addUsertoCall(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  
  call.on("stream", (userVideoStream) => {
    startVideo(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
}

function startVideo(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
 

//end call
socket.on("peer-left", (userId) => {
  if (peers[userId]) peers[userId].close();
});
// enter the room
myPeer.on("open", (id) => {
  socket.emit("peer-joined", ROOM_ID, id);
});

// URL Copy To Clipboard
document.getElementById("invite-button").addEventListener("click", copyRoomLink);

function copyRoomLink() {
  const c_url = window.location.href;
  copyToClipboard(c_url);
  alert("Url Copied to Clipboard");
}

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

// End Call
document.getElementById("end-button").addEventListener("click", endCall);

function endCall() {
  window.location.href = "/";
}
