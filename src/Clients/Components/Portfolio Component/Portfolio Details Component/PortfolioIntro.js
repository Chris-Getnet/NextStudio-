import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { useSelector } from "react-redux";

const PortfolioIntro = ({portfolioData}) => {

    useEffect(() => {
        AOS.init();
      }, []);

    return(
        <div className="mb-5">
            <div
                className="relative w-full h-[70vh] csm:h-[60vh] vs2:h-[50vh]  overflow-hidden"
            >
                {/* Blurred Background Image */}
                <div
                    className="absolute inset-0 z-[-1]"
                    style={{
                        backgroundImage: `url(${portfolioData.project_image && portfolioData.project_image[0] ? portfolioData.project_image[0].url : ''})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment:"fixed",
                        backgroundPosition:'center',
                        backgroundSize: 'cover',
                        filter: 'blur(10px)', // Adjust the blur level as needed
                    }}
                />

                {/* Text Content */}
                <div  className="flex flex-col  px-20 vvsm:p-3 vs2:gap-3 vvsm:gap-2 justify-center h-full items-center bg-black bg-opacity-30 text-white">
                    <h1 className=" text-[60px] vsm:w-[500px] vsm:text-[48px] vvsm:w-[400px] vvsm:text-[38px] csm:text-[30px] csm:w-[320px] font-Poppins font-bold text-center uppercase w-[650px] tex">{portfolioData.project_name}</h1>
                    <h1>{portfolioData.project_category}</h1>
                </div>
            </div>
        </div>
    )
}

export default PortfolioIntro;