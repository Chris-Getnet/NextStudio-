import {
    FaHome,
    FaInfo,
    FaBriefcase,
    FaSignOutAlt,
    FaAddressBook,
}from "react-icons/fa";
import {IoIosSettings} from 'react-icons/io'
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, reset } from '../../../API/Auth/authSlice'
import './sidebar.css'

const Sidebar = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const menuItem=[
        {
            path:"/admindashboard/home",
            name:"Home Page",
            icon:<FaHome/>
        },
        {
            path:"/admindashboard/about",
            name:"About Page",
            icon:<FaInfo/>
        },
        {
            path:"/admindashboard/portfolios",
            name:"Portfolio Page",
            icon:<FaBriefcase/>
        },
        {
            path:"/admindashboard/contact",
            name:"Contact Page",
            icon:<FaAddressBook/>
        },
        {
            path:"/admindashboard/setting",
            name:"Setting",
            icon:<IoIosSettings/>
        }
        
    ]
    const onLogout = () => {
        dispatch(logout())  
        dispatch(reset())
        navigate('/administrator')
     }
    return (
        <div>
           <div className='bg-Secondary w-[250px] fixed flex flex-col text-white h-[100vh] transition-all'>
               
                <div className='mt-10 mb-10 '>
                    <img className='flex w-[100px] h-[100px] rounded-full bg-white object-contain ml-[70px] ' src="https://res.cloudinary.com/dtlrrlpag/image/upload/v1671362225/Next%20Studio/Logo/Next_Studio_Logo_ygxexg.png" alt="Logo" />
                </div>

               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeClassName="active">
                           <div className="icon">{item.icon}</div>
                           <div className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }
               <div  className='fixed bottom-0 left-0'>
                    <button className="link" onClick={onLogout}>
                        <div className="icon"><FaSignOutAlt/></div>
                        <div className="link_text">Logout</div>
                    </button>
               </div>
           </div>
        </div>
    );
};

export default Sidebar;