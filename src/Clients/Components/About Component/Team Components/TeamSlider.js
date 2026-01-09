import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import TeamCard from "./TeamCard";
import ImageSkeleton from "../../Common/ImageSkeleton";

const TeamSlider =  () =>  {

    const [progress,setProgress] = useState(0)
    const [slidetoshow,setslidetoshow] = useState(4)
    const { teamData } = useSelector((state) => state.root)
    
    const setslide = () => {
        if(window.innerWidth <= 1250 && window.innerWidth > 1000){
            setslidetoshow(3)
        }
        else if(window.innerWidth <=1000 && window.innerWidth > 650){
            setslidetoshow(2)
        }
        else if(window.innerWidth <= 650){
            setslidetoshow(1)
        }
    }   
        useEffect(() => {
            setslide()
            if (teamData && Array.isArray(teamData) && teamData.length > 0) {
                setProgress(100/(teamData.length - slidetoshow + 1))
            }
            window.addEventListener('resize',() => {setslide()})
        },[teamData, slidetoshow])

        const settings = {
          dots: true,
          infinite: false,
          speed: 500,
          slidesToShow: 4,
          slidesToScroll: 4,
          initialSlide: 0,
          responsive: [
            {
              breakpoint: 1290,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 800,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
              }
            },
            {
              breakpoint: 568,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
        };

    if (!teamData || !Array.isArray(teamData) || teamData.length === 0) {
        return (
            <div className="team relative">
                <div className="flex gap-4 overflow-hidden">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-64">
                                <ImageSkeleton
                                    width="w-24"
                                    height="h-24"
                                    rounded="rounded-full"
                                    className="mx-auto mb-4"
                                />
                                <ImageSkeleton
                                    width="w-3/4"
                                    height="h-4"
                                    rounded="rounded"
                                    className="mx-auto mb-2"
                                />
                                <ImageSkeleton
                                    width="w-1/2"
                                    height="h-3"
                                    rounded="rounded"
                                    className="mx-auto"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return(
        <div className="team relative">
            <Slider {...settings}>
                {teamData.map((data,index) => (
                    <div key={data.id}>
                        <TeamCard name={data.full_name} title={data.work_title} img={data.team_image_url || ''}/>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default TeamSlider;