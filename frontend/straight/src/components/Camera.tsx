import Webcam from "react-webcam";
import { socket } from "../socket";

function Camera ({ isConnected }: { isConnected: boolean }) {

    if (isConnected) {
        setInterval(
            function() {socket.emit("image", "!!!")},
            1000
        );
    }
   
    return (
        <>
            <Webcam mirrored screenshotFormat="image/jpeg"/> 
        </>
    );
}

export default Camera;