import { useParams } from "react-router-dom";
import PortfolioNavbar from "../Components/Navbar Component/PortfolioNavbar";
import PortfolioIntro from "../Components/Portfolio Component/Portfolio Details Component/PortfolioIntro";
import PortfolioContent1 from "../Components/Portfolio Component/Portfolio Details Component/PortfolioContent1";
import Footer from "../Components/Footer Component/Footer";
import GallerySlider from "../Components/Portfolio Component/Portfolio Details Component/Portfolio Gallery/GallerySlider";
import VideoSection from "../Components/Portfolio Component/Portfolio Details Component/Video Section/VideoSection";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ScrollToTop from "react-scroll-to-top";
import axios from "axios";
import { URL } from "../../Url/Url";

const PortfolioDetailsPage = () => {

    const {id} = useParams()
    const dispatch = useDispatch()
    const [portfolioData, setPortfolioData] = useState(null)
    const [loading, setLoading] = useState(true)

    const { portfolioLengthData, contactData } = useSelector((state) => state.root)

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${URL}/api/NextStudio/portfolio/${id}`)
                const portfolio = response.data.portfolio
                setPortfolioData(portfolio)

                if (portfolio) {
                    document.title = `${portfolio.project_name} - Next Studio`;
                }
            } catch (error) {
                console.error('Error fetching portfolio:', error)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchPortfolio()
        }

        window.scrollTo(0, 0);
    }, [id]);
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
            </div>
        )
    }

    if (!portfolioData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-600 mb-2">Portfolio Not Found</h1>
                    <p className="text-gray-500">The requested portfolio could not be found.</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <PortfolioNavbar/>
            <PortfolioIntro portfolioData={portfolioData}/>
            <div className="w-full px-10 py-5 s3m:flex-col justify-center pds:gap-5 flex s3m:gap-5 mx-auto gap-10">
                <div className="s3m:w-full w-1/2">
                    <PortfolioContent1 portfolioData={portfolioData}/>
                </div>
                <div className="s3m:w-full s3m:items-center flex flex-col w-1/2">
                    <VideoSection portfolioData={portfolioData}/>
                    <div className="w-full s3m:w-[700px] vsm:w-[480px] pds3:w-[300px] pds3:px-0 s3m:px-7 ">
                         <GallerySlider portfolioData={portfolioData}/>
                    </div>
                </div>
            </div>

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

export default PortfolioDetailsPage;