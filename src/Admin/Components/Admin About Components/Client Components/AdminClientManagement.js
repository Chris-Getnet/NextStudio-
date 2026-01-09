import axios from "axios"
import { ReloadData, hiddenloading, showloading } from "../../../../API/Server/rootSlice"
import { Modal, message } from "antd"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import {URL} from '../../../../Url/Url'

const AdminClientManagement = () => {

    const [showAddEditModal,setShowAddEditModal] = useState(false)
    const [selectedItemforEdit,setSelectedItemforEdit] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteID,setDeleteId] = useState(null)
    const [client_image,setClientImage] = useState(null)
    const [preview,setPreview] = useState(null)
    const dispatch = useDispatch()

    const { clientData } = useSelector((state) => state.root)

    const token = localStorage.getItem('token')

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        
        transformFile(file)
    }

    const transformFile = (file) => {
        const reader = new FileReader();
        if(file){
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setClientImage(reader.result);
                setPreview(reader.result)
            };
        }
    }

    const handleDelete = async (id) => {
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            dispatch(showloading())
            const data = await axios.delete(`${URL}/api/NextStudio/client/${id}`,config)
            dispatch(hiddenloading())
            if(data.data.success === true){
                message.success('Client Deleted Successfuly')
                dispatch(hiddenloading())
                dispatch(ReloadData(true))
            }
        }catch(err){
            message.error(err.message)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            dispatch(showloading())
            const {data} = await axios.post(`${URL}/api/NextStudio/client`,{client_image},config)
                
                if(data.success === true){
                    dispatch(showloading())
                    setShowAddEditModal(false)
                    setClientImage('');
                    setPreview(null)
                    dispatch(ReloadData(true))
                    dispatch(hiddenloading())
                    message.success('Client created successfully')
                }
                
        }catch(err){
                    message.error(err.message)
        }
    }


    return(
        <div>
            <div className="flex flex-col">
                <div className=" flex  justify-end"> 
                    <button className="bg-Secondary text-white w-[200px] py-2 px-5 rounded" onClick={() => {
                    setSelectedItemforEdit(null);
                    setShowAddEditModal(true)
                }}>Add Client</button>
                </div>
                <hr className="mt-5 mb-5"/>
                <div className="flex flex-wrap gap-5">
                    {clientData && clientData.length > 0 && clientData.map((data, index) => {
                        // Handle new API format with client_image_url or old format with client_image
                        const imageUrl = data.client_image_url || 
                                       (typeof data.client_image === 'string' 
                                           ? data.client_image 
                                           : data.client_image?.url);
                        const itemId = data.id || data._id;
                        
                        return (
                            <div key={itemId || index} className="flex flex-col w-[300px] h-[190px] border-2 rounded">
                                {imageUrl && (
                                    <img className=" w-[300px] h-[150px] " src={imageUrl} alt="Clients" />
                                )}
                                <button onClick={() => {
                                    setDeleteId(itemId)
                                    setShowDeleteModal(true)
                                }} className="bg-red-500 mt-[2px] text-white w-full p-2">Delete</button>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Modal visible={showAddEditModal}  footer={null} onCancel={() => {setShowAddEditModal(false); setSelectedItemforEdit(null)}}>
            <h1 className="text-center text-xl uppercase font-semibold mt-5 mb-5">Add Clients</h1>
                <img className="w-full h-[250px] border-2 rounded object-cover " src={preview === null ? 'https://res.cloudinary.com/dtlrrlpag/image/upload/v1685707236/Next%20Studio/placeholder-image-gray-3x2_po4o0q.png' : preview} alt=""/>
                <form onSubmit={handleSubmit}>
                    <input className="cinput w-full" type="file" onChange={handleFileInputChange} />
                    <div className="flex justify-end mt-3 gap-5 w-full">
                        <button type="submit" className="bg-Secondary text-white w-[150px] px-5 py-1 rounded">Add Client</button>
                    </div>
                </form>
            </Modal>
            <Modal visible={showDeleteModal} footer={null} closable={false} centered={true} onCancel={() => {setShowDeleteModal(false); setDeleteId(null)}}>
                    <h1 className="text-center text-2xl">Are you sure want to delete?</h1>
                    <div className="flex justify-center items-center gap-5 mt-5">
                        <button className="bg-primary w-[80px] p-1 rounded text-white" onClick={() => {handleDelete(deleteID); setShowDeleteModal(false)}}>Ok</button>
                        <button className="bg-red-500 w-[80px] p-1 rounded text-white" onClick={() => {
                            setShowDeleteModal(false) 
                            setDeleteId(null)
                        }}>Cancel</button>
                    </div>
            </Modal>
        </div>
    )
}

export default AdminClientManagement;