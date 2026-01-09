import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { reset } from "../../API/Auth/authSlice"
import Sidebar from "../Components/Sidebar Components/Sidebar"
import ScreenError from "./ScreenError"
import { Tabs } from "antd"
import AdminVideoManagement from "../Components/Admin Home Components/Video Components/AdminVideoManagement"
import AdminSlogan from "../Components/Admin Home Components/Slogan Components/AdminSlogan"
import AdminServiceManagement from "../Components/Admin Home Components/Service Components/AdminServiceManagement"

const AdminHomePage = () => {

    const { videoBannerData,quoteData, serviceData } = useSelector((state) => state.root)

    useEffect(() => {
        document.title = "Admin Home Page Management - Next Studio"
    })

    const [show,setShow] = useState(true)

    const ScreenSize = () => {
        if(window.innerWidth <= 1080){
            setShow(false)
        }
        else {
            setShow(true)
        }
    }

    useEffect(() => {
        ScreenSize()
        window.addEventListener('resize',() => {ScreenSize()})
    },[])

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state) => state.auth)
    
    useEffect(() => {
    
        if (!user) {
          navigate('/administrator')
        }
    
        return () => {
          dispatch(reset())
        }
      }, [user, navigate, dispatch])


    return(
        <div>
            {!show ? <ScreenError/> : <div className="flex">
                <Sidebar/>
                {videoBannerData && quoteData && serviceData && (
                    <div className="flex flex-col w-full px-20 py-10 ml-[260px]">
                        <Tabs defaultActiveKey="1" items={[
                            {
                                key: "1",
                                label: "Video Banner",
                                children: <AdminVideoManagement/>
                            },
                            {
                                key: "2",
                                label: "Services",
                                children: <AdminServiceManagement/>
                            }
                        ]} />
                    </div>   
                )}
            </div>}
        </div>
    )
}

export default AdminHomePage;