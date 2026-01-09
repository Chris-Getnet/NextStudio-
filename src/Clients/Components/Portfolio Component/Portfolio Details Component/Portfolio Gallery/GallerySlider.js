import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import GalleryCard from "./GalleryCard";

const GallerySlider = ({portfolioData}) => {
    const [width,setWidth] = useState('')
    const [height,setHeight]= useState('')

    const setslide = () => {
        if(window.innerWidth <= 1920 && window.innerWidth > 1300){
            setWidth('640px')
            setHeight('360px')
        }
        else if(window.innerWidth <=1300 && window.innerWidth > 1145){
            setWidth('560px')
            setHeight('315px')
        }
        else if(window.innerWidth <=1145 && window.innerWidth > 980){
            setWidth('426px')
            setHeight('240px')
        }
        else if(window.innerWidth <= 980 && window.innerWidth > 699){
            setWidth('640px')
            setHeight('360px')
        }
        else if(window.innerWidth <= 699 && window.innerWidth > 500){
            setWidth('426px')
            setHeight('240px')
        }
        else if(window.innerWidth <= 500 ){
            setWidth('300px')
            setHeight('169px')
        }
    }   
        useEffect(() => {
            setslide()
            window.addEventListener('resize',() => {setslide()})
        },[])

    const settings = {
        dots: true,
        nextArrow: false,
        prevArrow: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
      };


    return(
        <div>
            <Slider {...settings}>
                {portfolioData.project_image.slice(1,5).map((img,index) => (
                    <div key={index}>
                        <GalleryCard pic={img.url} width={width} height={height}/>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default GallerySlider;