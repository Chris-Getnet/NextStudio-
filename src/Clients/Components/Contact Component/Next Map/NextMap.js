import { useState } from "react";

const NextMap = () => {
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const handleMapLoad = () => {
        setIsMapLoaded(true);
    };

    return(
        <div className="flex flex-col w-full justify-center items-center" >
            <div className="relative m-1 transition w-[80%] h-[80vh] sm:w-[90%] sm:h-[40vh] rounded-xl">
                {!isMapLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
                        <div className="text-gray-500 text-lg font-medium">Loading Map...</div>
                    </div>
                )}
                <iframe
                    title="Next Studio Map"
                    className={`w-full h-[80vh] sm:h-[40vh] rounded-xl border-gray-200 border-2 transition-opacity duration-300 ${
                        isMapLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5506788386347!2d38.78527161432643!3d9.013425491715571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b853a4f1e63d1%3A0xe12e347fa0982445!2sNext+Studio!5e0!3m2!1sam!2sua!4v1562524792210!5m2!1sam!2sua"
                    frameBorder="0"
                    allowFullScreen
                    onLoad={handleMapLoad}
                ></iframe>
            </div>
        </div>
    )
}

export default NextMap;