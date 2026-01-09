/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Form, message, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hiddenloading , ReloadData, showloading } from "../../../../API/Server/rootSlice";
import {URL} from '../../../../Url/Url'

const AdminTeamManagement = () => {

    const { teamData } = useSelector((state) => state.root)
    
    const [showAddEditModal,setShowAddEditModal] = useState(false)
    const [selectedItemforEdit,setSelectedItemforEdit] = useState(null)
    const [showDeleteModal,setShowDeleteModal] = useState(false)
    const [deleteID,setDeleteId] = useState(null)
    const [full_name,setFullName] = useState('')
    const [work_title,setWorkTitle] = useState('')
    const [team_image,setTeamImage] = useState('')
    const [preview,setPreview] = useState(null)
    const dispatch = useDispatch()

    

    const token = localStorage.getItem('token')

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        previewFile(file)
        
    }

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () =>{
            setTeamImage(reader.result);
            setPreview(reader.result)
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
            const data = await axios.delete(`${URL}/api/NextStudio/team/${id}`,config)
            dispatch(hiddenloading())
            if(data.data.success === true){
                message.success('Team Deleted Successfuly')
                dispatch(hiddenloading())
                dispatch(ReloadData(true))
            }
        }catch(err){
            message.error(err.message)
        }
    }

    const submitForm = async (e) => {
        e.preventDefault();
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }

            if(!full_name || !work_title || !team_image){
                message.error('Please Enter Full Name, Work Title & Image')
            }else{
            
            if(selectedItemforEdit){
                const teamId = selectedItemforEdit._id || selectedItemforEdit.id
                if (!teamId) {
                    message.error('Team member ID is missing')
                    return
                }
                dispatch(showloading())
                const {data} = await axios.patch(`${URL}/api/NextStudio/team/${teamId}`,{full_name,work_title,team_image},config)
                if(data.success === true){
                    setShowAddEditModal(false)
                    setFullName('');
                    setWorkTitle('');
                    setTeamImage('');
                    setPreview(null)
                    dispatch(ReloadData(true))
                    dispatch(hiddenloading())
                    message.success('team updated successfully')
                }
            }
            else{
                dispatch(showloading())
                const {data} = await axios.post(`${URL}/api/NextStudio/team`,{full_name,work_title,team_image},config)
                
                if(data.success === true){
                    
                    setShowAddEditModal(false)
                    setFullName('');
                    setWorkTitle('');
                    setTeamImage('');
                    setPreview(null)
                    dispatch(ReloadData(true))
                    dispatch(hiddenloading())
                    message.success('team created successfully')
                }
            }
            }
        }catch(err){
            dispatch(hiddenloading())
            message.error(err.message)
        }
    }

    useEffect(() => {
        if(selectedItemforEdit){
            setFullName(selectedItemforEdit.full_name)
            setWorkTitle(selectedItemforEdit.work_title)
            // Handle new API format with team_image_url or old format with team_image
            const imageUrl = selectedItemforEdit.team_image_url || 
                           (typeof selectedItemforEdit.team_image === 'string' 
                               ? selectedItemforEdit.team_image 
                               : selectedItemforEdit.team_image?.url);
            setTeamImage(selectedItemforEdit.team_image_url || selectedItemforEdit.team_image || '')
            setPreview(imageUrl || null)
        }
        else{
            setFullName('')
            setWorkTitle('')
            setTeamImage('')
            setPreview(null)
        }
    },[selectedItemforEdit])


    return(
        <div>
            <div className="flex flex-col">
                <div className=" flex  justify-end"> 
                    <button className="bg-Secondary text-white w-[200px] py-2 px-5 rounded" onClick={() => {
                    setSelectedItemforEdit(null);
                    setShowAddEditModal(true)
                }}>Add Team</button>
                </div>
                <hr className="mt-5 mb-5"/>
                <div className="flex flex-wrap gap-5">
                    {teamData && teamData.length > 0 && teamData.map((data, index) => {
                        // Handle new API format with team_image_url or old format with team_image
                        const imageUrl = data.team_image_url || 
                                       (typeof data.team_image === 'string' 
                                           ? data.team_image 
                                           : data.team_image?.url);
                        const itemId = data.id || data._id;
                        
                        return (
                            <div key={itemId || index} className="w-[255px] h-[400px] border-2 rounded mb-5">
                                <div className="flex flex-col">
                                    {imageUrl && (
                                        <img className="h-[250px] w-full object-cover rounded mb-2" src={imageUrl} alt="team"/>
                                    )}
                                    <h1 className="font-semibold uppercase text-center text-xl">{data.full_name}</h1>
                                    <h1 className="text-lg text-center mb-5">{data.work_title}</h1>
                                </div>
                                <div className="flex gap-5 justify-center px-5 ">
                                    <button className="bg-Secondary text-white w-[100px] py-2 px-5 rounded" onClick={() => {
                                        setSelectedItemforEdit(data)
                                        setShowAddEditModal(true)
                                    }}>Update</button>
                                    <button onClick={()=> {
                                        setDeleteId(itemId)
                                        setShowDeleteModal(true)             
                                    }} className="bg-red-500 text-white w-[100px] py-2 px-5 rounded">Delete</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
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
            <Modal visible={showAddEditModal}  footer={null} onCancel={() => {setShowAddEditModal(false); setSelectedItemforEdit(null)}}>
                <div>
                <h1 className="text-center text-xl uppercase font-semibold mt-5 mb-5">{selectedItemforEdit ? 'Edit Team' : 'Add Team'}</h1>
                <hr/>
                <form onSubmit={submitForm}>
                        <div className="flex flex-col gap-2 mt-2">
                            <label className="font-semibold uppercase ">Full Name:</label>
                            <input className="cinput w-full" placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} value={full_name} />
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <label className="font-semibold uppercase ">Work title:</label>
                            <input className="cinput w-full" placeholder="Title" onChange={(e) => setWorkTitle(e.target.value)} value={work_title} />
                        </div>
                    <div className="flex w-full items-center mt-5">
                        <div className="w-1/2">
                            <img className=" h-[145px] w-[200px]"  src={preview === null ? 'https://res.cloudinary.com/dtlrrlpag/image/upload/v1685707236/Next%20Studio/placeholder-image-gray-3x2_po4o0q.png' : preview} alt="pic" />
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                                <label className="font-semibold uppercase ">Image:</label>
                                <input className="cinput w-full" type="file" onChange={handleFileInputChange} />
                            
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-5 w-full">
                        <button type="submit" className="bg-Secondary text-white w-[150px] px-5 py-1 rounded">{selectedItemforEdit ? 'Update Team' : 'Add Team'}</button>
                    </div>
                </form>
                </div>
            </Modal>
        </div>
    )
}

export default AdminTeamManagement;