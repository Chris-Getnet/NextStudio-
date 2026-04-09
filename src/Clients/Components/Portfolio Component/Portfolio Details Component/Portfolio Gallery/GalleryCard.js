const GalleryCard = ({pic,width,height}) => {

    const imageStyle = {
        width: width,
        height: height,
      };

    return(
        <div className="flex justify-center">
            <img style={imageStyle} className=" object-cover rounded border-2 hover:shadow-xl mb-2" src={pic} alt="portfolio"/>
        </div>
    )
}

export default GalleryCard;