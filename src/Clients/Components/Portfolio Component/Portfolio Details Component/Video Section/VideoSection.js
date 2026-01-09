import { useEffect, useState } from "react";
import ReactPlayer from 'react-player'
import { useSelector } from "react-redux";

const VideoSection = ({portfolioData}) => {

    const [width,setWidth] = useState('')
    const [height,setHeight]= useState('')

    const setDimensions = () => {
        const videoCount = portfolioData?.project_videos?.length || 0;

        // Adjust dimensions based on screen size and video count
        if(window.innerWidth <= 1920 && window.innerWidth > 1300){
            // For multiple videos, make them smaller
            if (videoCount > 1) {
                setWidth('480px')
                setHeight('270px')
            } else {
                setWidth('640px')
                setHeight('360px')
            }
        }
        else if(window.innerWidth <=1300 && window.innerWidth > 1145){
            if (videoCount > 1) {
                setWidth('420px')
                setHeight('236px')
            } else {
                setWidth('560px')
                setHeight('315px')
            }
        }
        else if(window.innerWidth <=1145 && window.innerWidth > 980){
            if (videoCount > 1) {
                setWidth('350px')
                setHeight('197px')
            } else {
                setWidth('426px')
                setHeight('240px')
            }
        }
        else if(window.innerWidth <= 980 && window.innerWidth > 699){
            if (videoCount > 1) {
                setWidth('480px')
                setHeight('270px')
            } else {
                setWidth('640px')
                setHeight('360px')
            }
        }
        else if(window.innerWidth <= 699 && window.innerWidth > 500){
            if (videoCount > 1) {
                setWidth('350px')
                setHeight('197px')
            } else {
                setWidth('426px')
                setHeight('240px')
            }
        }
        else if(window.innerWidth <= 500 ){
            if (videoCount > 1) {
                setWidth('280px')
                setHeight('158px')
            } else {
                setWidth('300px')
                setHeight('169px')
            }
        }
    }
        useEffect(() => {
            setDimensions()
            window.addEventListener('resize',() => {setDimensions()})
            return () => window.removeEventListener('resize', setDimensions)
        },[portfolioData?.project_videos?.length])

    const videoCount = portfolioData?.project_videos?.length || 0;

    // Determine grid layout based on video count
    const getGridClasses = (count) => {
        if (count === 1) return 'grid-cols-1';
        if (count === 2) return 'grid-cols-1 md:grid-cols-2';
        if (count === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        if (count >= 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3';
        return 'grid-cols-1';
    };

    return(
        <div>
            {portfolioData.project_videos && portfolioData.project_videos.length > 0 ? (
                <div className={`grid gap-6 ${getGridClasses(videoCount)} justify-items-center`}>
                    {portfolioData.project_videos.map((videoUrl, index) => (
                        <div
                            key={index}
                            className={`flex justify-center ${videoCount === 1 ? 'w-full' : ''}`}
                        >
                            <ReactPlayer
                                url={videoUrl}
                                controls={true}
                                width={width}
                                height={height}
                                className="rounded-lg overflow-hidden shadow-lg"
                                style={{ maxWidth: '100%' }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="hidden"></div>
            )}
        </div>
    )
}

export default VideoSection;