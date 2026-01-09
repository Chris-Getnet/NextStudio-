import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ReloadData, hiddenloading, showloading } from "../../../../API/Server/rootSlice"
import { Modal, message } from "antd"
import JoditEditor from "jodit-react";
import {URL} from '../../../../Url/Url'

const AdminServiceManagement = () => {

    const { serviceData } = useSelector((state) => state.root)

    const [showAddEditModal,setShowAddEditModal] = useState(false)
    const [selectedItemforEdit,setSelectedItemforEdit] = useState(null)
    const [service_title,setServiceTitle] = useState('')
    const [service_description,setServiceDescription] = useState('')
    const [service_icon,setServiceIcon] = useState(null)
    const [preview,setPreview] = useState(null)
    const editor = useRef(null);
    const token = localStorage.getItem('token')
    const dispatch = useDispatch()

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        
        transformFile(file)
    }

    const transformFile = (file) => {
        const reader = new FileReader();
        if(file){
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setServiceIcon(reader.result);
                setPreview(reader.result)
            };
        }
    }
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if selectedItemforEdit exists and has an ID
        if (!selectedItemforEdit) {
            message.error('No service selected for update')
            return
        }
        
        // Try both _id and id properties
        const serviceId = selectedItemforEdit._id || selectedItemforEdit.id
        
        if (!serviceId) {
            message.error('Service ID is missing')
            return
        }
        
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            dispatch(showloading())
            const {data} = await axios.patch(`${URL}/api/NextStudio/service/${serviceId}`,{
                service_icon,service_title,service_description
            },config)
            dispatch(hiddenloading())
            if(data.success === true){
                setShowAddEditModal(false)
                setServiceIcon(null)
                setServiceTitle("")
                setServiceDescription("")
                setPreview(null)
                setSelectedItemforEdit(null)
                message.success('Services Updated Successfuly')
                dispatch(hiddenloading())
                dispatch(ReloadData(true))
            }
        }catch(err){
            dispatch(hiddenloading())
            message.error(err.response?.data?.message || err.message || 'Failed to update service')
        }
    } 

    useEffect(() => {
        if(selectedItemforEdit){
            // Handle new API format with service_icon_url or old format with service_icon
            const iconUrl = selectedItemforEdit.service_icon_url || 
                          (typeof selectedItemforEdit.service_icon === 'string' 
                              ? selectedItemforEdit.service_icon 
                              : selectedItemforEdit.service_icon?.url);
            setServiceIcon(selectedItemforEdit.service_icon_url || selectedItemforEdit.service_icon || '')
            setServiceTitle(selectedItemforEdit.service_title)
            setServiceDescription(selectedItemforEdit.service_description)
            setPreview(iconUrl || '')
        }else{
            setPreview('')
            setServiceTitle('')
            setServiceIcon('')
            setServiceDescription('')
        }
    },[selectedItemforEdit])
    

    return(
        <div>
            <div className="flex flex-col">
                <div className="flex flex-wrap justify-center items-center gap-10">
                    {serviceData && serviceData.length > 0 && serviceData.map((data, index) => {
                        // Handle new API format with service_icon_url or old format with service_icon
                        const iconUrl = data.service_icon_url || 
                                      (typeof data.service_icon === 'string' 
                                          ? data.service_icon 
                                          : data.service_icon?.url);
                        const itemId = data.id || data._id;
                        
                        return (
                            <div key={itemId || index} className="w-[285px] h-[385px] border-2 rounded-md">
                                {iconUrl && (
                                    <img className=" border-b-2 rounded-md" src={iconUrl} alt="services icon"/>
                                )}
                                <h1 className="text-lg mt-5 font-bold text-center">{data.service_title}</h1>
                                <button className="w-full p-2 rounded-md mt-3 text-white rounded-t-none bg-Secondary" onClick={() => {
                                    setSelectedItemforEdit(data)
                                    setShowAddEditModal(true)}}>Update</button>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Modal open={showAddEditModal}  footer={null} onCancel={() => {setShowAddEditModal(false); setSelectedItemforEdit(null)}}>
                <h1 className="text-center text-xl uppercase font-semibold mt-5 mb-5">Edit Services</h1>
                <div className="w-full h-[200px] flex justify-center items-center">
                <img className=" h-[180px] object-cover border-2 rounded-md"  src={preview === null ? 'https://res.cloudinary.com/dtlrrlpag/image/upload/v1685707236/Next%20Studio/placeholder-image-gray-3x2_po4o0q.png' : preview}  alt=""/>
                </div>
                <form onSubmit={handleSubmit}>
                    <label className="font-bold mt-5">Service Icon:</label>
                    <input className="cinput w-full" type="file" accept="image/gif" onChange={handleFileInputChange} />
                    <label className="font-bold mt-5">Service Title:</label>
                    <input className="cinput w-full" onChange={(e) => setServiceTitle(e.target.value)} value={service_title} />
                    <label className="font-bold">Service Description:</label>
                    <JoditEditor
                    ref={editor}
                    value={service_description}
                    onChange={newContent => setServiceDescription(newContent)}     
                    />
                    <div className="flex justify-end mt-3 gap-5 w-full">
                        <button type="submit" className="bg-Secondary text-white w-[150px] px-5 py-1 rounded">Update</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default AdminServiceManagement;