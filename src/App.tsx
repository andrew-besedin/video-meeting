import { useEffect, useRef, useState } from 'react';
import Peer from "simple-peer";
import './App.css';
import io from "socket.io-client";

const socket = io();
function App() {

    const myVideoRef = useRef<HTMLVideoElement>(null);
    const opponentVideoRef = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance>();

    const [stream, setStream] = useState<MediaStream | undefined>();

    useEffect(() => {
        async function requestCamera() {
            const responseStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (myVideoRef.current) {
                myVideoRef.current.srcObject = responseStream;
            }
            setStream(responseStream);
            const peer = new Peer({ stream: responseStream, initiator: true, trickle: false });
            peer.on("signal", signal => socket.emit("join", signal));
            peer.on("stream", stream => {
                console.log("Video streamed");
                if (opponentVideoRef.current) {
                    opponentVideoRef.current.srcObject = stream;
                }
            });
            socket.on("connect-video", signal => {
                console.log("Video connected");
                peer.signal(signal);
            });
        }
        requestCamera();

        
    }, []);

    useEffect(() => {
        
    }, [stream]);

    return (
        <main>
            <div className='video__wrapper'>
                {/* {myVideoRef.current?.srcObject && */}
                    <video 
                        className="video"
                        playsInline 
                        ref={myVideoRef} 
                        autoPlay 
                    /> 
                {/* } */}
                {/* {opponentVideoRef.current?.srcObject && */}
                    <video 
                        className="video"
                        playsInline 
                        ref={opponentVideoRef} 
                        autoPlay 
                    />
                {/* } */}
            </div>
        </main>
    );
}

export default App;
