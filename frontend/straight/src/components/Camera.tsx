import Webcam from "react-webcam";
import { useRef, useEffect } from "react";

function Camera () {
        
    const webcamRef = useRef<Webcam>(null);
    const websocketRef = useRef<WebSocket | null>(null);
    
    useEffect(() => {
    // Establish WebSocket connection to Flask backend
        websocketRef.current = new WebSocket('ws://localhost:8000/screenshot');

        websocketRef.current.onopen = () => {
        console.log('WebSocket connected');
        };

        websocketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        };

    // Cleanup WebSocket on component unmount
        return () => {
        if (websocketRef.current) {
            websocketRef.current.close();
        }
        };
    }, []);


    useEffect(() => {
        const captureInterval = setInterval(() => {
        if (webcamRef.current && websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
            // Send the screenshot to the backend
                console.log(imageSrc)
                websocketRef.current.send(imageSrc);
            }
        }
        }, 33); // Capture approximately 30 times per second

        // Clear the interval on component unmount
        return () => clearInterval(captureInterval);
    }, []);


    return (
        <>
            <Webcam mirrored ref={webcamRef} screenshotFormat="image/jpeg"/> 
        </>
    );
}

export default Camera;