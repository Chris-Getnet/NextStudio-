import { useSelector } from "react-redux"
import ImageSkeleton from "../../Common/ImageSkeleton";

const AboutIntro = () => {

    const {aboutData} = useSelector((state) => state.root)

    if (!aboutData || !aboutData.intro_image_url) {
        return (
            <div className="mb-5">
                <ImageSkeleton
                    width="w-full"
                    height="h-[100vh] llg:h-[90vh] sm2:h-[70vh] csm:h-[60vh] vs2:h-[50vh] vvsm:h-[40vh]"
                    rounded=""
                    className="mb-5"
                />
            </div>
        );
    }

    return(
        <div className="mb-5">
                <div className="w-full h-[100vh] llg:h-[90vh] llg:bg-contain sm2:h-[70vh] csm:h-[60vh] vs2:h-[50vh] vvsm:h-[40vh]" style={{backgroundImage: `url(${aboutData.intro_image_url})`,backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>

                </div>

        </div>
    )
}

export default AboutIntro;