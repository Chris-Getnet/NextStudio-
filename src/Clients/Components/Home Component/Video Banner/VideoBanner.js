import { useState } from "react";
import { IoVolumeHighSharp, IoVolumeMuteSharp } from "react-icons/io5"
import ImageSkeleton from "../../Common/ImageSkeleton";

const { useSelector } = require("react-redux")

const VideoBanner = () => {

    const { videoBannerData } = useSelector((state) =>  state.root) 
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        setIsMuted(!isMuted);
    }; 

    if (!videoBannerData || !videoBannerData.banner_video_url) {
        return (
            <div className="bg-fixed relative">
                <ImageSkeleton
                    width="w-full"
                    height="h-screen llg:h-[90vh] sm2:h-[70vh] csm:h-[60vh] vs2:h-[50vh] vvsm:h-[40vh]"
                    rounded=""
                />
                <button
                    className="absolute bottom-4 right-4 text-gray-400 p-2 rounded-full opacity-50 cursor-not-allowed"
                    disabled
                >
                    <IoVolumeMuteSharp />
                </button>
            </div>
        );
    }

    return(
        <div className="bg-fixed relative">
            <video className="w-full h-screen llg:h-[90vh] object-cover sm2:h-[70vh] csm:h-[60vh] vs2:h-[50vh] vvsm:h-[40vh]" src={videoBannerData.banner_video_url}  autoPlay loop muted={isMuted}/>
            <button
                className="absolute bottom-4 right-4 text-Primary  p-2 rounded-full"
                onClick={toggleMute}
            >
                {isMuted ? <IoVolumeHighSharp /> : <IoVolumeMuteSharp />}
            </button>
        </div>
    )
} 

export default VideoBanner;