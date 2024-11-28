import { constants } from "../constants";
import Camera from "./Camera";
import { useState } from "react";

function ContentArea({ isConnected }: { isConnected: boolean }) {

    const [postureScore, setPostureScore] = useState(0);



    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4">
            <div className="rounded border border-gray-300 p-2">
                <Camera isConnected={isConnected} setPostureScore={setPostureScore}/>
            </div>
            <div className="rounded border border-gray-300 p-2 col-span-1 row-span-1">
                <div className="font-bold">{postureScore.toFixed(2)}</div>
                {postureScore < constants.postureThreshold ? "good posture" : "bad posture"}
            </div>
            <div className="rounded border border-gray-300 p-2 col-span-2">
            {/* Bottom content */}
            </div>
        </div>
    );
}

export default ContentArea;