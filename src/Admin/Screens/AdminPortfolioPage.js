import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Sidebar from "../Components/Sidebar Components/Sidebar"
import { Tabs, Spin } from "antd"
import { reset } from "../../API/Auth/authSlice"
import ScreenError from "./ScreenError"
import AdminPortfolioManagement from "../Components/Admin Portfolio Components/AdminPortfolioManagement"
const AdminPortfolioPage = () => {

    const { portfolioData, isLoading } = useSelector((state) => state.root)

    useEffect(() => {
        document.title = "Admin Portfolio Page Management - Next Studio"
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, navigate])

    return(
        <div>
            {!show ? <ScreenError/> : <div className="flex">
                <Sidebar/>
                <div className="flex flex-col w-full px-20 py-10 ml-[260px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[400px]">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Tabs defaultActiveKey="1" items={[
                            {
                                key: "1",
                                label: "Portfolio",
                                children: <AdminPortfolioManagement/>
                            }
                        ]} />
                    )}
                </div>
            </div>}
        </div>
    )
}

export default AdminPortfolioPage;