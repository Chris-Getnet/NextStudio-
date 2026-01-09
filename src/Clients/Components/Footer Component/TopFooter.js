import { useSelector } from "react-redux";

const TopFooter = () => {

    const { contactData } = useSelector((state) => state.root)

    if (!contactData) {
        return (
            <div className="flex flex-col w-full mt-5">
                <div className="bg-black vs2:h-[50vh] llg:h-[40vh] md:h-[30vh] bg-opacity-70 w-full h-[50vh] flex justify-center items-center">
                    <div className="text-white text-center">
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-600 rounded w-32 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-600 rounded w-48 mx-auto mb-2"></div>
                            <div className="h-4 bg-gray-600 rounded w-40 mx-auto"></div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center bg-black bg-opacity-70 vsmm:w-full vs2:p-1 p-5 gap-20">
                    <div className="w-8 h-8 bg-gray-600 animate-pulse rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-600 animate-pulse rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-600 animate-pulse rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-600 animate-pulse rounded-full"></div>
                </div>
            </div>
        );
    }

    return(
        <div className="flex flex-col w-full mt-5">
            <div>
                <div className="bg-black vs2:h-[50vh] llg:h-[40vh] md:h-[30vh] bg-opacity-70 w-full h-[50vh] flex justify-center items-center">
            <div className="flex vs2:flex-col gap-20 sm2:gap-10 sm:gap-5  ">
                <div className="flex flex-col justify-center items-center vs2:gap-3 vs2:mt-8 gap-8">
                    <h1 className="text-white text-2xl sm2:text-lg font-semibold uppercase">Address</h1>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-white text-center text-sm  sm2:text-xs">{contactData.street}, {contactData.building},</h1>
                        <h1 className="text-white text-center  text-sm sm2:text-xs ">{contactData.floor},Addis Ababa, Ethiopia</h1>
                    </div>
                </div>
                <div className="bg-white vs2:w-[30vh] vs2:h-[3px] w-[3px] h-[30vh] sm2:h-[20vh] rounded"></div>
                <div className="flex flex-col justify-center items-center vs2:gap-3 gap-8">
                    <h1 className="text-white text-2xl smm:text-lg font-semibold uppercase">Phone Number</h1>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-white text-center text-sm sm2:text-xs ">{contactData.phonenumber_1},</h1>
                        <h1 className="text-white text-center  text-sm sm2:text-xs">{contactData.phonenumber_2}</h1>
                    </div>
                </div>
                <div className="bg-white vs2:w-[30vh] vs2:h-[3px] w-[3px] h-[30vh] sm2:h-[20vh] rounded"></div>
                <div className="flex flex-col justify-center items-center vs2:gap-3 gap-8">
                    <h1 className="text-white text-2xl sm2:text-lg font-semibold uppercase">Email</h1>
                    <div className="flex flex-col gap-1">
                        <h1 className="text-white text-center text-sm sm2:text-xs ">{contactData.email}</h1>
                        <br/>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex justify-center items-center bg-black bg-opacity-70 vsmm:w-full vs2:p-1 p-5 gap-20">
            <a href={contactData.facebook_link}><i className="ri-facebook-circle-fill hover:text-Primary text-white vs2:text-xl text-2xl"></i></a>
            <a href={contactData.instagram_link}><i className="ri-instagram-line vs2:text-xl hover:text-Primary text-white text-2xl"></i></a>
            <a href={contactData.twitter_link}><i className="ri-twitter-x-line text-white hover:text-Primary vs2:text-xl text-2xl"></i></a>
            <a href={contactData.youtube_link} ><i className="ri-youtube-line vs2:text-xl hover:text-Primary text-white text-2xl"></i></a>
        </div>

            </div>


    </div>
    )
}

export default TopFooter;