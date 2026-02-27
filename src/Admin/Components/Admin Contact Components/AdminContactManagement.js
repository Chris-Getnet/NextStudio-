import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { ReloadData, hiddenloading, showloading, setContactData } from "../../../API/Server/rootSlice"
import { Form, message, Spin } from "antd"
import { URL } from "../../../Url/Url"

const AdminContactManagement = () => {

    const { contactData } = useSelector((state) => state.root)

    const [isUpdatingContact, setIsUpdatingContact] = useState(false)
    const token = localStorage.getItem('token')
    const dispatch = useDispatch()

    // Function to fetch latest contact data
    const fetchContactData = async () => {
        try {
            const response = await axios.get(`${URL}/api/NextStudio/contact`)
            dispatch(setContactData(response.data.contact))
        } catch (error) {
            console.error('Error fetching contact data:', error)
        }
    }

    const onFinished = async (values) => {
        setIsUpdatingContact(true)
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            const responce = await axios.patch(`${URL}/api/NextStudio/contact/`,{
                ...values
            },config)
            if(responce.data.status){
                message.success('Contact Updated Successfully')
                // Fetch latest data
                await fetchContactData()
            }
        }catch(err){
            message.error(err.response?.data?.message || err.message || 'Failed to update contact')
        } finally {
            setIsUpdatingContact(false)
        }
    }

    return(
        <div className="flex flex-col w-full mt-5 justify-center items-center">
            <Form onFinish={onFinished} layout="vertical" initialValues={contactData}>
                <div className="flex gap-10">
                <div className="flex flex-col">
                    <Form.Item className=" font-semibold" label="Street:" name={"street"}>
                        <input className="cinput w-[400px]"  placeholder="Location"/>
                    </Form.Item>
                    <Form.Item className=" font-semibold" label="Building:" name={"building"}>
                        <input className="cinput w-[400px]"  placeholder="Location"/>
                    </Form.Item>
                    <Form.Item className=" font-semibold" label="Floor:" name={"floor"}>
                        <input className="cinput w-[400px]"  placeholder="Location"/>
                    </Form.Item>
                    <Form.Item className=" font-semibold" label="Phone Number 1:" name={"phonenumber_1"}>
                        <input className="cinput w-[400px]" placeholder="Phone Number 1"/>
                    </Form.Item>
                    <Form.Item className=" font-semibold" label="Phone Number 2:" name={"phonenumber_2"}>
                        <input className="cinput w-[400px]" placeholder="Phone Number 2"/>
                    </Form.Item>
                </div>
                <div className="flex flex-col">
                    <Form.Item className=" font-semibold" label="Email:" name={"email"}>
                        <input className="cinput w-[400px]" placeholder="Email"/>
                    </Form.Item>
                    <Form.Item className=" font-semibold" label="Instagram Link:" name={"instagram_link"}>
                        <input className="cinput w-[400px]" placeholder="Instagram Link"/>
                    </Form.Item>
                    <Form.Item className=" font-semibold" label="Facebook Link:" name={"facebook_link"}>
                        <input className="cinput w-[400px]" placeholder="Linkedin Link"/>
                    </Form.Item>
                    <Form.Item className=" font-semibold" label="Twitter Link:" name={"twitter_link"}>
                        <input className="cinput w-[400px]" placeholder="Twitter Link"/>
                    </Form.Item>
                    <Form.Item className=" font-semibold" label="YouTube Link:" name={"youtube_link"}>
                        <input className="cinput w-[400px]" placeholder="Linkedin Link"/>
                    </Form.Item>
                    <div className="flex justify-end w-full">
                        <button 
                            type="submit"
                            className="bg-Secondary text-white w-[100px] py-2 px-5 rounded flex items-center justify-center gap-2" 
                            disabled={isUpdatingContact}
                        >
                            {isUpdatingContact ? (
                                <>
                                    <Spin size="small" />
                                    Updating...
                                </>
                            ) : (
                                'Update'
                            )}
                        </button>
                    </div>
                </div>
                </div>
            </Form>
        </div>
    )
}

export default AdminContactManagement;