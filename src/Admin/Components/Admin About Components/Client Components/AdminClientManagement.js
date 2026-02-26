import axios from "axios"
import { ReloadData, hiddenloading, showloading, setClientData } from "../../../../API/Server/rootSlice"
import { Modal, message, Spin } from "antd"
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
    const [isAddingClient, setIsAddingClient] = useState(false)
    const [isDeletingClient, setIsDeletingClient] = useState(false)
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

    // Function to fetch latest client data
    const fetchClientData = async () => {
        try {
            const response = await axios.get(`${URL}/api/NextStudio/client`)
            dispatch(setClientData(response.data.client))
        } catch (error) {
            console.error('Error fetching client data:', error)
        }
    }

    const handleDelete = async (id) => {
        if (!id) return
        
        setIsDeletingClient(true)
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            const data = await axios.delete(`${URL}/api/NextStudio/client/${id}`,config)
            if(data.data.success === true){
                message.success('Client Deleted Successfully')
                // Fetch latest client data after successful deletion
                await fetchClientData()
                // Close modal only after successful deletion
                setShowDeleteModal(false)
                setDeleteId(null)
            }
        }catch(err){
            message.error(err.response?.data?.message || err.message || 'Failed to delete client')
        } finally {
            setIsDeletingClient(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!client_image) {
            message.error('Please select an image')
            return
        }
        
        setIsAddingClient(true)
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            const {data} = await axios.post(`${URL}/api/NextStudio/client`,{client_image},config)
                
                if(data.success === true){
                    setShowAddEditModal(false)
                    setClientImage('');
                    setPreview(null)
                    message.success('Client created successfully')
                    // Fetch latest client data after successful addition
                    await fetchClientData()
                }
                
        }catch(err){
            message.error(err.response?.data?.message || err.message || 'Failed to add client')
        } finally {
            setIsAddingClient(false)
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
                    <input className="cinput w-full" type="file" onChange={handleFileInputChange} disabled={isAddingClient} />
                    <div className="flex justify-end mt-3 gap-5 w-full">
                        <button 
                            type="submit" 
                            className="bg-Secondary text-white w-[150px] px-5 py-1 rounded flex items-center justify-center gap-2" 
                            disabled={isAddingClient}
                        >
                            {isAddingClient ? (
                                <>
                                    <Spin size="small" />
                                    Adding...
                                </>
                            ) : (
                                'Add Client'
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
            <Modal 
                visible={showDeleteModal} 
                footer={null} 
                closable={!isDeletingClient} 
                centered={true} 
                onCancel={() => {
                    if (!isDeletingClient) {
                        setShowDeleteModal(false)
                        setDeleteId(null)
                    }
                }}
            >
                    <h1 className="text-center text-2xl">Are you sure want to delete?</h1>
                    <div className="flex justify-center items-center gap-5 mt-5">
                        <button 
                            className="bg-Secondary w-[80px] p-1 rounded text-white flex items-center justify-center gap-2" 
                            onClick={() => handleDelete(deleteID)}
                            disabled={isDeletingClient}
                        >
                            {isDeletingClient ? (
                                <>
                                    <Spin size="small" />
                                    Deleting...
                                </>
                            ) : (
                                'Ok'
                            )}
                        </button>
                        <button 
                            className="bg-red-500 w-[80px] p-1 rounded text-white" 
                            onClick={() => {
                                if (!isDeletingClient) {
                                    setShowDeleteModal(false) 
                                    setDeleteId(null)
                                }
                            }}
                            disabled={isDeletingClient}
                        >
                            Cancel
                        </button>
                    </div>
            </Modal>
        </div>
    )
}

export default AdminClientManagement;