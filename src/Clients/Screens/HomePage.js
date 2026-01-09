import { useSelector } from "react-redux";
import VideoBanner from "../Components/Home Component/Video Banner/VideoBanner";
import MainNavbar from "../Components/Navbar Component/MainNavbar";
import Slogan from "../Components/Home Component/Slogan/Slogan";
import Footer from "../Components/Footer Component/Footer";
import Service from "../Components/Service Component/Service";
import RecentPortfolio from "../Components/Portfolio Component/Recent Portfolio Component/RecentPortfolio";
import { useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";

const HomePage = () => {

    const { videoBannerData, quoteData, serviceData, portfolioLengthData, contactData } = useSelector((state) => state.root)

    useEffect(() => {
        document.title = "Next Studio - Communication | Advertising | Production"
        window.scrollTo(0, 0);
    },[])

    return(
        <div>
            <MainNavbar/>
            <VideoBanner/>
            <Slogan/>
            <Service/>
            <RecentPortfolio/>
            <ScrollToTop smooth top="20" color="white" style={{
                backgroundColor: "#EF5B2C",
                width: "40px",
                height: "40px",
                borderRadius: "100%",
                alignItems: "center"
            }}
                viewBox="5 3 10 30"
                svgPath="M24,21a1,1,0,0,1-.71-.29L16,13.41l-7.29,7.3a1,1,0,1,1-1.42-1.42l8-8a1,1,0,0,1,1.42,0l8,8a1,1,0,0,1,0,1.42A1,1,0,0,1,24,21Z"
            />
            <Footer/>
        </div>
    )
}

export default HomePage;