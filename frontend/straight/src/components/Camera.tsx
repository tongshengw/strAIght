import Webcam from "react-webcam";
import { useRef, useCallback, useEffect } from "react";
import { socket } from "../socket";
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl';

function Camera ({ isConnected }: { isConnected: boolean }) {

    const webcamRef = useRef<any>(null);
    const modelRef = useRef<poseDetection.PoseDetector | null>(null);

    // useEffect with [] as second parameter means the code is run once at initial render time
    useEffect(() => {
        const loadModel = async () => {
            const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
            modelRef.current = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
        }
        loadModel();
    }, []);

    // function takes in datauri imageSrc string, converts into HTMLimage, then runs model inference
    const runPoseEstimation = async (imageSrc: string) => {
        if (modelRef.current) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = async () => {
                if (modelRef.current) {
                    const poses = await modelRef.current.estimatePoses(img);
                    console.log(poses);
                    const postureData = processPoses(poses);
                    return postureData;
                }
            }
            
        }
        return null;
    }

    
    const processPoses = (poses: poseDetection.Pose[]) => {
        // add this function to process poses
        return poses
    }


    const capture = useCallback(
        () => {
            const imageSrc: string = webcamRef.current.getScreenshot();
            runPoseEstimation(imageSrc);
            if (isConnected) {
            socket.emit("image", imageSrc);
            }
        },
        [webcamRef]
    );


    useEffect(() => {
        const interval = setInterval(
            function() {
                if (webcamRef.current) {
                    console.log('image captured');
                    capture();
                }
            }, 1000);
        
        return () => clearInterval(interval);
    }, []);
   
    return (
        <>
            <Webcam mirrored ref={webcamRef} screenshotFormat="image/jpeg"/> 
        </>
    );
}

export default Camera;