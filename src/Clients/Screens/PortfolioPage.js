import { useEffect } from "react";
import PortfolioNavbar from "../Components/Navbar Component/PortfolioNavbar";
import { useSelector } from "react-redux";
import AllPortfolio from "../Components/Portfolio Component/All Portfolio Component/AllPortfolio";
import Footer from "../Components/Footer Component/Footer";
import ScrollToTop from "react-scroll-to-top";

const PortfolioPage = () => {
    useEffect(() => {
        document.title = "Works - Next Studio"
        window.scrollTo(0, 0);
    },[])

    const { contactData,portfolioData,portfolioLengthData } = useSelector((state) => state.root)

    return(
        <div>
            <PortfolioNavbar/>
            <AllPortfolio/>
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

export default PortfolioPage;