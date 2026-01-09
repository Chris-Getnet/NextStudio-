import { useSelector } from "react-redux";
import AboutNavbar from "../Components/Navbar Component/AboutNavbar";
import AboutIntro from "../Components/About Component/About Intro/AboutIntro";
import AboutContent from "../Components/About Component/About Content/AboutContent";
import ClientList from "../Components/About Component/Client Component/ClientList";
import Footer from "../Components/Footer Component/Footer";
import OurTeam from "../Components/About Component/Team Components/OurTeam";
import { useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";

const AboutPage = () => {

    useEffect(() => {
        document.title = "About - Next Studio"
        window.scrollTo(0, 0);
    },[])

    const { aboutData, clientData, teamData, contactData } = useSelector((state) => state.root)

    return(
        <div>
            <AboutNavbar/>
            <AboutIntro/>
            <AboutContent/>
            <ClientList/>
            <OurTeam/>
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

export default AboutPage;