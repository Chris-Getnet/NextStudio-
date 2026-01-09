import { Link, useParams } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa'
import { useRef, useState, useEffect } from "react";

const MainNavbar = () => {
    const navRef = useRef()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const { url } = useParams()

    // Disable body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_bar")
        setIsMenuOpen(!isMenuOpen)
        console.log(url)
    }
    return(
        <header className="sticky top-0 z-50">
            <Link to="/" className="w-[15vh] sm:w-[10vh]">
                <img src="https://res.cloudinary.com/dtlrrlpag/image/upload/v1671362225/Next%20Studio/Logo/Next_Studio_Logo_ygxexg.png" alt="Logo" className="cursor-pointer" />
            </Link>
            <nav className="sm:flex sm:flex-col sm:text-xl sm:gap-20" ref={navRef}>   
                <Link to='/about'>About</Link>
                <Link to='/portfolios'>Works</Link>
                <Link to='/contact'>Contact</Link>
                <button className="nav-btn nav-close-btn" onClick={showNavbar}> <FaTimes/></button>
            </nav>
            <button className="nav-btn show-btn" onClick={showNavbar}><FaBars/></button>
        </header>
    )
}

export default MainNavbar;