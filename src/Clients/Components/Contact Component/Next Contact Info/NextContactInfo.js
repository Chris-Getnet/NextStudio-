import { useSelector } from "react-redux";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import ReactWhatsapp from 'react-whatsapp';
import { useEffect, useState } from "react";
import LoadingPage from "../../../Screens/LoadingPage";

const NextContactInfo = () => {

    const { contactData } = useSelector((state) => state.root)
    const [size,setSize] = useState(22)

    const setslide = () => {
        if(window.innerWidth >= 615){
            setSize(22)
        }
        else if(window.innerWidth <= 615){
            setSize(19)
        }
    }   
        useEffect(() => {
            setslide()
            
            window.addEventListener('resize',() => {setslide()})
        },[])

    if (!contactData) {
        return <LoadingPage />;
    }

    return(
        <div className="flex flex-col">
        <div className="flex gap-5 justify-center items-center mt-16 w-full">
        
            <div className="flex md:flex-col md:gap-8 gap-20 justify-center items-center">
                <div className="flex flex-col justify-center items-center md:gap-3 gap-5">
                    <div className="flex flex-col justify-center items-center gap-3">
                        <h1 className="text-2xl text-orange-500"><FaMapMarkerAlt/></h1>
                        <h1 className="text-2xl sm2:text-lg font-semibold uppercase">Address</h1>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-center text-sm  sm2:text-xs">{contactData.street}, {contactData.building},</h1>
                        <h1 className="text-center  text-sm sm2:text-xs ">{contactData.floor},Addis Ababa, Ethiopia</h1>
                    </div>
                </div>
                <div className="bg-gray-600 md:w-[30vh] md:h-[3px] w-[3px] h-[30vh] sm2:h-[20vh] rounded"></div>
                <div className="flex flex-col justify-center items-center md:gap-3 gap-5">
                    <div className="flex flex-col justify-center items-center gap-3">
                        <h1 className="text-2xl text-orange-500"><FaPhoneAlt/></h1>
                        <h1 className="text-2xl sm2:text-lg font-semibold uppercase">Phone Number</h1>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-center text-sm sm2:text-xs ">{contactData.phonenumber_1},</h1>
                        <h1 className="text-center  text-sm sm2:text-xs">{contactData.phonenumber_2}</h1>
                    </div>
                </div>
                <div className="bg-gray-600 md:w-[30vh] md:h-[3px] w-[3px] h-[30vh] sm2:h-[20vh] rounded"></div>
                <div className="flex flex-col justify-center items-center md:gap-3 gap-5">
                    <div className="flex flex-col justify-center items-center gap-3">
                        <h1 className="text-2xl text-orange-400"><FaEnvelope/></h1>
                        <h1 className="text-2xl sm2:text-lg font-semibold uppercase">Email</h1>
                    </div>                  
                    <div className="flex flex-col gap-1">
                        <h1 className="text-center text-sm sm2:text-xs ">{contactData.email}</h1>
                        <br/>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex justify-center items-center vsmm:w-full mt-10 -mb-8 md:mb-0 gap-20 md:gap-16 csm:gap-10 md:mt-2">
            <a href={contactData.facebook_link}><i className="ri-facebook-circle-fill hover:text-Primary  vs2:text-xl text-2xl"></i></a>
            <a href={contactData.instagram_link}><i className="ri-instagram-line vs2:text-xl hover:text-Primary text-2xl"></i></a>
            <a href={contactData.twitter_link}><i className="ri-twitter-fill hover:text-Primary vs2:text-xl text-2xl"></i></a>
            <a href={contactData.youtube_link} ><i className="ri-youtube-line vs2:text-xl hover:text-Primary text-2xl"></i></a>
            <ReactWhatsapp className=" hover:text-Primary" number="+251911522909" message="Welcome to Next Studio!!!">
                                        <FaWhatsapp size={size}/>
                                
                                    </ReactWhatsapp>
        </div>
    </div>
    )
}

export default NextContactInfo;