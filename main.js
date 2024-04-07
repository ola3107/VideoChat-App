import './style.css'
let localStream;
let remoteStream;
let peerConnnection;



let servers = {
    iceServers: [
        {
            urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}


let initialize = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})

    document.getElementById('user-1').srcObject = localStream
}

let createOffer = async () => {
    peerConnnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream

    localStream.getTracks().forEach(track => peerConnnection.addTrack(track, localStream))

    peerConnnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track))
    }

    peerConnnection.onicecandidate = (event) => {
        if(event.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnnection.localDescription)
        }
    }

    let offer = await peerConnnection.createOffer()
    await peerConnnection.setLocalDescription(offer)

    document.getElementById('offer-sdp').value = JSON.stringify(offer)
}

let createAnswer = async () => {
    peerConnnection = new RTCPeerConnection(servers)

    remoteStream = new MediaStream()
    document.getElementById('user-2').srcObject = remoteStream

    localStream.getTracks().forEach(track => peerConnnection.addTrack(track, localStream))

    peerConnnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track))
    }

    peerConnnection.onicecandidate = (event) => {
        if(event.candidate) {
            document.getElementById('answer-sdp').value = JSON.stringify(peerConnnection.localDescription)
        }
    }

    let offer = document.getElementById('offer-sdp').value
    if(!offer) return alert('Please enter offer SDP')

    offer = JSON.parse(offer)
    await peerConnnection.setRemoteDescription(offer)

    let answer = await peerConnnection.createAnswer()
    await peerConnnection.setLocalDescription(answer)

    document.getElementById('answer-sdp').value = JSON.stringify(answer)
}

let addAnswer = async () => {
    let answer = document.getElementById('answer-sdp').value
    if(!answer) return alert('Please enter answer SDP')

    answer = JSON.parse(answer)
    if (!peerConnnection.currentRemoteDescription)
     await peerConnnection.setRemoteDescription(answer)

}

initialize()
document.getElementById('create-answer').addEventListener('click', createAnswer)
document.getElementById('create-offer').addEventListener('click', createOffer)
document.getElementById('add-answer').addEventListener('click', addAnswer)


