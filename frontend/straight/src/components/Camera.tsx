import Webcam from "react-webcam";
import { useRef, useCallback } from "react";
import { socket } from "../socket";

function Camera ({ isConnected }: { isConnected: boolean }) {

    // if (isConnected) {
    //     setInterval(
    //         function() {socket.emit("image", "!!!")},
    //         1000
    //     );
    // }

    const webcamRef = useRef<Webcam | null>(null);
    const capture = useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();
          socket.emit("image", imageSrc);
        },
        [webcamRef]
      );

    if (isConnected) {
        setInterval(
            function() {capture},
            1000
        );
    }
   
    return (
        <>
            <Webcam mirrored ref={webcamRef} screenshotFormat="image/jpeg"/> 
        </>
    );
}

export default Camera;