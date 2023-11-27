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
            
        }
        requestCamera();

        
    }, []);

    useEffect(() => {
        const peer = new Peer({ stream });
        peer.on("signal", data => peer.signal(data));
        connectionRef.current = peer;
        // peer.addStream(responseStream);
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
