import Webcam from "react-webcam";
import { useRef, useCallback, useEffect } from "react";
import { socket } from "../socket";
import * as poseDetection from '@tensorflow-models/pose-detection'
import '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl';
import { sqrt } from "@tensorflow/tfjs-core";

function Camera ({ isConnected }: { isConnected: boolean }) {

    const webcamRef = useRef<any>(null);
    const modelRef = useRef<poseDetection.PoseDetector | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // useEffect with [] as second parameter means the code is run once at initial render time
    useEffect(() => {
        const loadModel = async () => {
            const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER, minPoseScore: 0.3};
            modelRef.current = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
        }
        loadModel();

        const interval = setInterval(
            function() {
                if (webcamRef.current) {
                    // console.log('image captured');
                    capture();
                }
            }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    // function takes in datauri imageSrc string, converts into HTMLimage, then runs model inference
    // this is the main function and calls others as helpers
    const runPoseEstimation = async (imageSrc: string) => {
        if (modelRef.current) {
            const img = new Image();
            img.src = imageSrc;
            img.onload = async () => {
                if (modelRef.current) {
                    const poses = await modelRef.current.estimatePoses(img);
                    // console.log(poses);
                    displayPose(poses);
                    processPose(poses);
                }
            }
            
        }
        return null;
    }

    const displayPose = (poses: poseDetection.Pose[]) => {
        const canvas = canvasRef.current;
        if (canvas && wrapperRef.current) {
            canvas.height = wrapperRef.current.clientHeight;
            canvas.width = wrapperRef.current.clientWidth;
        }
        const ctx = canvas?.getContext("2d");
        if (ctx && webcamRef.current && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 0.3;
            const pose = poses[0];
            if (pose) {
                pose.keypoints.forEach((keypoint) => {
                    if (keypoint && keypoint.score && keypoint.score > 0.3) {
                        ctx.beginPath();
                        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
                        ctx.fillStyle = "red";
                        ctx.fill();
                    }
                    });
            }
        }
    }

    
    const processPose = (poses: poseDetection.Pose[]) => {
        // add this function to process poses
        let postureStats = {} as { eyesShouldersY: number; noseEarsY: number; eyeDistance: number; shoulderDistance: number };

        const pose = poses[0];

        const rEye = pose.keypoints[1];
        const lEye = pose.keypoints[2];

        const lShoulder = pose.keypoints[5];
        const rShoulder = pose.keypoints[6];

        const lEar = pose.keypoints[3];
        const rEar = pose.keypoints[4];

        const nose = pose.keypoints[0];

        const eyeMidpoint = {"x": (lEye.x + rEye.x)/2, "y": (lEye.y + rEye.y)/2};
        const shoulderMidpoint = {"x": (lShoulder.x + rShoulder.x)/2, "y": (lShoulder.y + rShoulder.y)/2};
        const earMidpoint = {"x": (lEar.x + rEar.x)/2, "y": (lEar.y + rEar.y)/2};

        postureStats.eyesShouldersY = shoulderMidpoint.y - eyeMidpoint.y;
        postureStats.noseEarsY = nose.y - earMidpoint.y;
        postureStats.eyeDistance = Math.sqrt((lEye.x-rEye.x)^2 + (lEye.y-rEye.y)^2);
        postureStats.shoulderDistance = Math.sqrt((lShoulder.x-rShoulder.x)^2 + (lShoulder.y-rShoulder.y)^2);

        
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

   
    return (
        <>
        <div ref = {wrapperRef} className="cameraWrapper" style={{position: 'relative'}}>
            <Webcam mirrored ref={webcamRef} screenshotFormat="image/jpeg"/>
            <canvas ref={canvasRef} style={{position: 'absolute', top: 0, left: 0}}/>
        </div>
        </>
    );
}

export default Camera;