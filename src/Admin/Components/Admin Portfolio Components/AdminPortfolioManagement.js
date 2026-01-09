import axios from "axios"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaTrash, FaPlus } from "react-icons/fa";
import JoditEditor from "jodit-react";
import { ReloadData, hiddenloading, showloading, setPortfolioData, setPortfolioPagination } from "../../../API/Server/rootSlice";
import { Modal, message } from "antd";
import { URL } from "../../../Url/Url";
import Pagination from "./Pagination";
import { useLocation } from "react-router-dom";

const AdminPortfolioManagement = () => {

    const { portfolioData, reloadData } = useSelector((state) => state.root)
    const dispatch = useDispatch()
    const location = useLocation()
    const query = useMemo(() => new URLSearchParams(location.search), [location.search])
    const pageParam = query.get('page')
    const page = useMemo(() => (pageParam ? Number(pageParam) : 1), [pageParam])
    const isFetchingRef = useRef(false)
    const lastPageRef = useRef(null)
    const previousReloadDataRef = useRef(reloadData)

    // Fetch function
    const fetchPortfolioData = useCallback(async (pageNum) => {
        if (isFetchingRef.current) {
            return
        }
        
        isFetchingRef.current = true
        lastPageRef.current = pageNum
        
        try {
            dispatch(showloading())
            const response = await axios.get(`${URL}/api/NextStudio/portfolio?page=${pageNum}`, {
                validateStatus: function (status) {
                    return (status >= 200 && status < 300) || status === 304;
                }
            })
            
            const responseData = response.data?.portfolios || response.data?.portfolio || []
            const paginationData = response.data?.pagination || null
            
            if (responseData.length > 0 || response.status === 304) {
                dispatch(setPortfolioData(responseData))
            }
            
            // Store pagination data if available
            if (paginationData) {
                dispatch(setPortfolioPagination(paginationData))
            }
            
            dispatch(hiddenloading())
        } catch (error) {
            dispatch(hiddenloading())
            if (error.response?.status !== 304) {
                message.error(error.response?.data?.message || 'Failed to fetch portfolio data')
            }
        } finally {
            isFetchingRef.current = false
        }
    }, [dispatch])

    // Single useEffect - handle both page and reloadData
    useEffect(() => {
        // Skip if already fetching
        if (isFetchingRef.current) {
            return
        }

        const pageChanged = lastPageRef.current !== page && lastPageRef.current !== null
        const reloadDataJustBecameTrue = reloadData && !previousReloadDataRef.current
        const isInitialLoad = lastPageRef.current === null
        
        // Only fetch if:
        // 1. Initial load (first time)
        // 2. Page changed (and we've loaded at least once)
        // 3. ReloadData just became true
        if (isInitialLoad || pageChanged || reloadDataJustBecameTrue) {
            // Update refs BEFORE fetching to prevent duplicate calls
            if (isInitialLoad || pageChanged) {
                lastPageRef.current = page
            }
            if (reloadDataJustBecameTrue) {
                previousReloadDataRef.current = true
            }
            
            // Fetch data
            fetchPortfolioData(page).then(() => {
                // Only reset reloadData if it was the trigger
                if (reloadDataJustBecameTrue) {
                    dispatch(ReloadData(false))
                    previousReloadDataRef.current = false
                }
            })
        } else if (!reloadData) {
            // Reset ref when reloadData becomes false (but don't fetch)
            previousReloadDataRef.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, reloadData])

    const [showAddEditModal,setShowAddEditModal] = useState(false)
    const [selectedItemforEdit,setSelectedItemforEdit] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteID,setDeleteId] = useState(null)
    const [company_name,setCompanyName] = useState('')
    const [project_name,setProjectName] = useState('')
    const [project_category,setProjectCategory] = useState('')
    const [project_description1,setProjectDescription1] = useState('')
    const [project_date,setProjectDate] = useState('')
    const [project_videos,setProjectVideos] = useState([''])
    const [project_image,setProjectImage] = useState([])
    const [preview, setPreview] = useState([])
    const [newPreview,setNewPreview] = useState([])
    const token = localStorage.getItem('token')
    const editor = useRef(null); 

    useEffect(() => {
        if(selectedItemforEdit){
            setCompanyName(selectedItemforEdit.company_name)
            setProjectName(selectedItemforEdit.project_name)
            setProjectCategory(selectedItemforEdit.project_category)
            // Handle both array and string formats for videos
            if(Array.isArray(selectedItemforEdit.project_video)){
                setProjectVideos(selectedItemforEdit.project_video)
            } else if(selectedItemforEdit.project_video){
                setProjectVideos([selectedItemforEdit.project_video])
            } else {
                setProjectVideos([''])
            }
            setProjectDescription1(selectedItemforEdit.project_description1)
            setProjectDate(selectedItemforEdit.project_date)
            setProjectImage(selectedItemforEdit.project_image)
            setPreview(selectedItemforEdit.project_image)
        }
        else {
            setCompanyName('')
            setProjectName('')
            setProjectCategory('')
            setProjectDescription1('')
            setProjectDate('')
            setProjectVideos([''])
            setProjectImage([])
            setPreview([])
        }
    },[selectedItemforEdit])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            dispatch(showloading())
            // Filter out empty video URLs
            const filteredVideos = project_videos.filter(video => video.trim() !== '')
            if(selectedItemforEdit){
                const portfolioId = selectedItemforEdit._id || selectedItemforEdit.id
                if (!portfolioId) {
                    message.error('Portfolio ID is missing')
                    return
                }
                const {data} = await axios.patch(`${URL}/api/NextStudio/portfolio/${portfolioId}`,{
                    project_name,project_category,project_description1,project_date,project_image,project_video: filteredVideos,company_name
                },config)
                dispatch(hiddenloading())
                if(data.success === true){
                    setShowAddEditModal(false)
                    setCompanyName('')
                    setProjectCategory('')
                    setProjectDescription1('')
                    setProjectDate('')
                    setProjectImage([])
                    setProjectName('')
                    setProjectVideos([''])
                    setPreview([])
                    message.success('Portfolio Added Successfuly')
                    dispatch(hiddenloading())
                    dispatch(ReloadData(true))
                }
            }else{
                const {data} = await axios.post(`${URL}/api/NextStudio/portfolio`,{
                    project_name,project_category,project_description1,project_date,project_image,project_video: filteredVideos,company_name
                },config)
                dispatch(hiddenloading())
                if(data.success === true){
                    setShowAddEditModal(false)
                    setCompanyName('')
                    setProjectCategory('')
                    setProjectDescription1('')
                    setProjectDate('')
                    setProjectImage([])
                    setProjectName('')
                    setProjectVideos([''])
                    setPreview([])
                    message.success('Portfolio Added Successfuly')
                    dispatch(hiddenloading())
                    dispatch(ReloadData(true))
                }
            }
        }catch(err){
            dispatch(hiddenloading())
            message.error(err.response.data.messages)
        }
    }

    const handleImageChange = (e) => {
        const files = e.target.files;
        const imagesArray = [];
    
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          // eslint-disable-next-line no-loop-func
          reader.onload = () => {
            if (reader.readyState === 2) {
              imagesArray.push(reader.result);
              setProjectImage(imagesArray);
              setPreview(imagesArray)
            }
          };
    
          reader.readAsDataURL(files[i]);
        }
      };
    
      const handleNewImageInput = (e) => {
        const files = e.target.files;
        const imagesArray = [];
    
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          // eslint-disable-next-line no-loop-func
          reader.onload = () => {
            if (reader.readyState === 2) {
              imagesArray.push(reader.result);
              setProjectImage(imagesArray);
              setNewPreview(imagesArray)
            }
          };
    
          reader.readAsDataURL(files[i]);
        }
      };


      const handleImageDelete = async (id) => {
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            const portfolioId = selectedItemforEdit?._id || selectedItemforEdit?.id
            if (!portfolioId) {
                message.error('Portfolio ID is missing')
                return
            }
            dispatch(showloading())
            const data = await axios.delete(`${URL}/api/NextStudio/portfolio/${portfolioId}/${id}`,config)
            dispatch(hiddenloading())
            if(data.data.success === true)
                setShowAddEditModal(false)
                message.success('Portfolio Delete Successfuly')
                dispatch(hiddenloading())
                dispatch(ReloadData(true))

        }catch(err){
            message.error(err.message)
        }
    }

    const handleNewImages = async (e) => {
        e.preventDefault();
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            dispatch(showloading())
            if(selectedItemforEdit){
                const portfolioId = selectedItemforEdit._id || selectedItemforEdit.id
                if (!portfolioId) {
                    message.error('Portfolio ID is missing')
                    dispatch(hiddenloading())
                    return
                }
                const {data} = await axios.patch(`${URL}/api/NextStudio/portfolio/image/${portfolioId}`,{
                    project_image
                },config)
                dispatch(hiddenloading())
                if(data.success === true){
                    setShowAddEditModal(false)  
                    setProjectImage([])
                    setNewPreview([])
                    message.success('Portfolio Image Added Successfuly')
                    dispatch(hiddenloading())
                    dispatch(ReloadData(true))
                }
            }
        }catch(err){
            dispatch(hiddenloading())
            message.error(err.response.data.messages)
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
            const data = await axios.delete(`${URL}/api/NextStudio/portfolio/${id}`,config)
            dispatch(hiddenloading())
            if(data.data.success === true)
                message.success('Portfolio Delete Successfuly')
                dispatch(hiddenloading())
                dispatch(ReloadData(true))

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
                    }}>Add Work</button>
                </div>
                <hr className="mt-5 mb-5"/>
                <div className="flex flex-wrap justify-center items-center gap-5">
                    {portfolioData && portfolioData.length > 0 ? portfolioData.map((data, index) => {
                        // Handle project_image - could be array or object
                        const firstImage = Array.isArray(data.project_image) && data.project_image.length > 0
                            ? data.project_image[0]
                            : data.project_image;
                        const imageUrl = typeof firstImage === 'string' 
                            ? firstImage 
                            : firstImage?.url;
                        const itemId = data.id || data._id;
                        
                        return (
                            <div key={itemId || index} className="flex flex-col w-[300px] h-[460px] border-2 rounded-md">
                                {imageUrl && (
                                    <img className="h-[350px] object-cover rounded-t-md border-b-2 mx-auto w-full" src={imageUrl} alt="newImage"/>
                                )}
                                <h1 className="text-xl h-[50px] ml-2 mr-2 mt-1 font-semibold text-center">{data.project_name}</h1>
                                <div className="flex mt-2 w-full">
                                    <button className="w-1/2 bg-Secondary rounded-r-none rounded-t-none rounded-md p-3 text-white" onClick={() => {
                                        setSelectedItemforEdit(data);
                                        setShowAddEditModal(true)
                                    }}>Update</button>
                                    <button className="w-1/2 bg-red-600 rounded-md rounded-l-none rounded-t-none text-white p-3" onClick={() => {
                                        setDeleteId(itemId)
                                        setShowDeleteModal(true)
                                    }}>Delete</button>
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="w-full text-center py-10">
                            <p className="text-gray-500">No portfolio items found. Click "Add Work" to create one.</p>
                        </div>
                    )}
                </div>
                <div className="flex justify-center mt-5 ">
                       <Pagination page={page}/>
                </div>
            </div>
            <Modal 
                open={showAddEditModal}  
                footer={null} 
                maskClosable={false}
                keyboard={false}
                onCancel={() => {setShowAddEditModal(false); setSelectedItemforEdit(null)}}
            >
                <h1 className="text-center text-xl uppercase font-semibold mt-5">{selectedItemforEdit ? 'Update Work' : 'Add Work'}</h1>
                <form onSubmit={handleSubmit}>
                <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="flex flex-col">
                        <label className="font-bold">Company Name</label>
                        <input className="cinput w-full" type="text" onChange={(e) => setCompanyName(e.target.value)} value={company_name}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-bold">Project Name</label>
                        <input className="cinput w-full" type="text" onChange={(e) => setProjectName(e.target.value)} value={project_name}/>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="flex flex-col">
                        <label className="font-bold">Project Category</label>
                        <input className="cinput w-full" type="text" onChange={(e) => setProjectCategory(e.target.value)} value={project_category}/>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-bold">Project Date</label>
                        <input className="cinput w-full" type="date" onChange={(e) => setProjectDate(e.target.value)} value={project_date}/>
                    </div>
                </div>
                <label className="font-bold mt-5">Project Youtube Links</label>
                {project_videos.map((video, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input 
                            className="cinput w-full" 
                            type="url" 
                            placeholder={`Video URL ${index + 1}`}
                            onChange={(e) => {
                                const newVideos = [...project_videos]
                                newVideos[index] = e.target.value
                                setProjectVideos(newVideos)
                            }} 
                            value={video}
                        />
                        {project_videos.length > 1 && (
                            <button
                                type="button"
                                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                onClick={() => {
                                    const newVideos = project_videos.filter((_, i) => i !== index)
                                    setProjectVideos(newVideos.length > 0 ? newVideos : [''])
                                }}
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    className="bg-Secondary text-white px-4 py-2 rounded mt-2 flex items-center gap-2 hover:bg-opacity-90"
                    onClick={() => setProjectVideos([...project_videos, ''])}
                >
                    <FaPlus /> Add Video
                </button>
                <label className="font-bold mt-5">Project Description</label>
                <JoditEditor
                    className="mt-3"
                    ref={editor}
                    value={project_description1}
                    onChange={newContent => setProjectDescription1(newContent)}     
                />
                <label className={selectedItemforEdit ? 'hidden' :'font-bold mt-5 mb-3'}>Project Images</label>
                <input className={selectedItemforEdit ? 'hidden' :'cinput w-full'} type="file" multiple onChange={handleImageChange}/>
                <div className="flex justify-end mt-3 gap-5 w-full">
                        <button type="submit" className="bg-Secondary text-white w-[150px] px-5 py-1 rounded">{selectedItemforEdit ? 'Update Content' : 'Add'}</button>
                </div>
                </div>
            </form>
            <div className="flex flex-wrap gap-5 mt-5 justify-center items-center">
                    {preview.map((data, index) => (
                        <div key={data._id || data.url || index} className=" w-[200px] object-contain">
                            <img className="h-[135px] object-cover" src={selectedItemforEdit ? data.url : data} alt="pic"/>
                            <button className={selectedItemforEdit ? 'text-red-500 ml-[180px] -mt-[130px] absolute z-10' : 'hidden'} onClick={() => {
                                handleImageDelete(data._id)
                            }}><FaTrash/></button>
                        </div>
                    ))}
            </div>
            <div className={selectedItemforEdit ? "flex flex-wrap gap-5 mt-5 justify-center items-center" : "hidden"}>
                    {newPreview.map((data, index) => (
                        <div key={index} className=" w-[200px] object-contain">
                            <img className="h-[135px] object-cover" src={data} alt="pic"/>
                        </div>
                    ))}
            </div>
            <div className={selectedItemforEdit ? 'flex flex-col gap-2' : 'hidden'}>
                <form onSubmit={handleNewImages}>
                    <label className='font-bold mt-10 mb-3'>Project Images</label>
                    <input className='cinput w-full' type="file" multiple onChange={selectedItemforEdit ? handleNewImageInput : handleImageChange}/>
                    <div className="flex justify-end mt-3 gap-5 w-full">
                        <button type="submit" className="bg-Secondary text-white w-[150px] px-5 py-1 rounded">Add Image</button>
                    </div>
                </form>
            </div>    
            </Modal>
            <Modal open={showDeleteModal} footer={null} closable={false} centered={true} onCancel={() => {setShowDeleteModal(false); setDeleteId(null)}}>
                    <h1 className="text-center text-2xl">Are you sure want to delete?</h1>
                    <div className="flex justify-center items-center gap-5 mt-5">
                        <button className="bg-Secondary w-[80px] p-1 rounded text-white" onClick={() => {handleDelete(deleteID); setShowDeleteModal(false)}}>Ok</button>
                        <button className="bg-red-500 w-[80px] p-1 rounded text-white" onClick={() => {
                            setShowDeleteModal(false) 
                            setDeleteId(null)
                        }}>Cancel</button>
                    </div>
            </Modal>
        </div>
    )
}

export default AdminPortfolioManagement;