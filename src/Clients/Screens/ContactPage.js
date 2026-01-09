import { useSelector } from "react-redux";
import ApplyForm from "../Components/Contact Component/Apply Form/ApplyForm";
import ContactForm from "../Components/Contact Component/Contact Form/ContactForm";
import NextContactInfo from "../Components/Contact Component/Next Contact Info/NextContactInfo";
import NextMap from "../Components/Contact Component/Next Map/NextMap";
import BottomFooter from "../Components/Footer Component/BottomFooter";
import ContactNavbar from "../Components/Navbar Component/ContactNavbar";
import { useEffect } from "react";
import ScrollToTop from "react-scroll-to-top";


const ContactPage = () => {

    useEffect(() => {
        document.title = "Contact - Next Studio"
        window.scrollTo(0, 0);
    },[])

    const { contactData } = useSelector((state) => state.root)

    return(
        <div>
            <ContactNavbar/>
            <NextMap/>
            <NextContactInfo/>
            <ContactForm/>
            <ApplyForm/>
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
            <BottomFooter/>
        </div>
    )
}

export default ContactPage;