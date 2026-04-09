import axios from "axios"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaTrash, FaPlus } from "react-icons/fa";
import JoditEditor from "jodit-react";
import { ReloadData, hiddenloading, showloading, setPortfolioData, setPortfolioPagination } from "../../../API/Server/rootSlice";
import { Modal, message, Spin } from "antd";
import { URL } from "../../../Url/Url";
import Pagination from "./Pagination";
import { useLocation } from "react-router-dom";

// Utility function to extract YouTube video ID from various URL formats
const extractYouTubeVideoId = (url) => {
    if (!url || typeof url !== 'string') return null;
    
    // Remove whitespace
    url = url.trim();
    if (!url) return null;
    
    // Handle embed URLs: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^&\s?#]+)/);
    if (embedMatch) return embedMatch[1];
    
    // Handle watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/youtube\.com\/watch\?v=([^&\s?#]+)/);
    if (watchMatch) return watchMatch[1];
    
    // Handle short URLs: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^&\s?#]+)/);
    if (shortMatch) return shortMatch[1];
    
    // Handle mobile URLs: https://m.youtube.com/watch?v=VIDEO_ID
    const mobileMatch = url.match(/m\.youtube\.com\/watch\?v=([^&\s?#]+)/);
    if (mobileMatch) return mobileMatch[1];
    
    // Handle youtube.com/VIDEO_ID format (less common)
    const directMatch = url.match(/youtube\.com\/([^\/&\s?#]+)(?:\?|$)/);
    if (directMatch && !directMatch[1].includes('watch') && !directMatch[1].includes('embed')) {
        return directMatch[1];
    }
    
    return null;
};

// Function to generate YouTube embed URL
const getYouTubeEmbedUrl = (videoId) => {
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
};

const AdminPortfolioManagement = () => {

    const { portfolioData, reloadData } = useSelector((state) => state.root)
    const dispatch = useDispatch()
    const location = useLocation()
    const query = useMemo(() => new URLSearchParams(location.search), [location.search])
    const pageParam = query.get('page')
    const page = useMemo(() => (pageParam ? Number(pageParam) : 1), [pageParam])
    const isFetchingRef = useRef(false)
    const lastPageRef = useRef(null)
    const previousReloadDataRef = useRef(false)
    const hasInitializedRef = useRef(false)

    // Fetch function
    const fetchPortfolioData = useCallback(async (pageNum, skipLoading = false, updatePageRef = true) => {
        if (isFetchingRef.current) {
            return
        }
        
        isFetchingRef.current = true
        if (updatePageRef) {
            lastPageRef.current = pageNum
        }
        
        // Use local loading state instead of global to avoid blocking the entire component
        if (!skipLoading) {
            setIsLoadingPortfolio(true)
        }
        
        try {
            const response = await axios.get(`${URL}/api/NextStudio/portfolio?page=${pageNum}`, {
                validateStatus: function (status) {
                    return (status >= 200 && status < 300) || status === 304;
                }
            })
            
            const responseData = response.data?.portfolios || response.data?.portfolio || []
            const paginationData = response.data?.pagination || null
            
            // Always update the data, even if empty, so UI reflects current state
            dispatch(setPortfolioData(responseData))
            
            // Store pagination data if available
            if (paginationData) {
                dispatch(setPortfolioPagination(paginationData))
            }
        } catch (error) {
            if (error.response?.status !== 304) {
                message.error(error.response?.data?.message || 'Failed to fetch portfolio data')
            }
        } finally {
            isFetchingRef.current = false
            if (!skipLoading) {
                setIsLoadingPortfolio(false)
            }
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
        const isInitialLoad = !hasInitializedRef.current
        
        // Only fetch if:
        // 1. Initial load (first time)
        // 2. Page changed (and we've loaded at least once)
        // 3. ReloadData just became true
        if (isInitialLoad || pageChanged || reloadDataJustBecameTrue) {
            // Update refs BEFORE fetching to prevent duplicate calls
            if (isInitialLoad || pageChanged) {
                lastPageRef.current = page
                hasInitializedRef.current = true
            }
            if (reloadDataJustBecameTrue) {
                previousReloadDataRef.current = true
            }
            
            // Fetch data
            fetchPortfolioData(page, false, true).then(() => {
                // Only reset reloadData if it was the trigger
                if (reloadDataJustBecameTrue) {
                    dispatch(ReloadData(false))
                    previousReloadDataRef.current = false
                }
            })
        }
        
        // Update previousReloadDataRef to track current state
        if (!reloadData && previousReloadDataRef.current) {
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
    const [isSubmittingPortfolio, setIsSubmittingPortfolio] = useState(false)
    const [isDeletingPortfolio, setIsDeletingPortfolio] = useState(false)
    const [isAddingImage, setIsAddingImage] = useState(false)
    const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false)
    const token = localStorage.getItem('token')
    const editor = useRef(null);
    const fileInputRef = useRef(null);
    const newFileInputRef = useRef(null); 

    useEffect(() => {
        if(selectedItemforEdit){
            setCompanyName(selectedItemforEdit.company_name)
            setProjectName(selectedItemforEdit.project_name)
            setProjectCategory(selectedItemforEdit.project_category)
            // Handle both project_videos (plural) and project_video (singular) for backward compatibility
            const videos = selectedItemforEdit.project_videos || selectedItemforEdit.project_video
            if(Array.isArray(videos) && videos.length > 0){
                setProjectVideos(videos)
            } else if(videos && typeof videos === 'string'){
                setProjectVideos([videos])
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

    // Update preview when portfolioData changes and we're editing the same item
    useEffect(() => {
        if (selectedItemforEdit && portfolioData) {
            const portfolioId = selectedItemforEdit._id || selectedItemforEdit.id
            const updatedPortfolio = portfolioData.find(p => 
                (p._id || p.id) === portfolioId
            )
            if (updatedPortfolio) {
                // Update images if they have changed
                if (updatedPortfolio.project_image) {
                    const currentImageIds = preview.map(img => img.public_id || img._id || img.id).filter(Boolean)
                    const newImageIds = updatedPortfolio.project_image.map(img => img.public_id || img._id || img.id).filter(Boolean)
                    if (JSON.stringify(currentImageIds.sort()) !== JSON.stringify(newImageIds.sort())) {
                        setPreview(updatedPortfolio.project_image)
                        setProjectImage(updatedPortfolio.project_image)
                    }
                }
                // Update videos if they have changed
                const videos = updatedPortfolio.project_videos || updatedPortfolio.project_video
                if (videos) {
                    const currentVideos = Array.isArray(project_videos) ? project_videos.filter(v => v.trim() !== '') : []
                    const newVideos = Array.isArray(videos) ? videos : (videos ? [videos] : [])
                    if (JSON.stringify(currentVideos.sort()) !== JSON.stringify(newVideos.sort())) {
                        if (Array.isArray(videos) && videos.length > 0) {
                            setProjectVideos(videos)
                        } else if (videos && typeof videos === 'string') {
                            setProjectVideos([videos])
                        } else {
                            setProjectVideos([''])
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [portfolioData])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingPortfolio(true)
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            // Filter out empty video URLs
            const filteredVideos = project_videos.filter(video => video.trim() !== '')
            
            // Separate existing images (objects) from new images (base64 strings)
            // For updates, only send new images (base64 strings) - existing images are already on server
            // For adds, send all images as base64 strings
            let imagesToSend = []
            if(selectedItemforEdit){
                // For update: only send new images (base64 strings), not existing ones (objects)
                imagesToSend = project_image.filter(img => typeof img === 'string' && img.startsWith('data:'))
            } else {
                // For add: send all images as base64 strings
                imagesToSend = project_image.filter(img => typeof img === 'string' && img.startsWith('data:'))
            }
            
            if(selectedItemforEdit){
                const portfolioId = selectedItemforEdit._id || selectedItemforEdit.id
                if (!portfolioId) {
                    message.error('Portfolio ID is missing')
                    setIsSubmittingPortfolio(false)
                    return
                }
                const {data} = await axios.patch(`${URL}/api/NextStudio/portfolio/${portfolioId}`,{
                    project_name,project_category,project_description1,project_date,project_image: imagesToSend,project_videos: filteredVideos,company_name
                },config)
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
                    message.success('Portfolio Updated Successfully')
                    // Fetch latest data (skip loading indicator and don't update page ref to avoid triggering useEffect)
                    await fetchPortfolioData(page, true, false)
                }
            }else{
                const {data} = await axios.post(`${URL}/api/NextStudio/portfolio`,{
                    project_name,project_category,project_description1,project_date,project_image: imagesToSend,project_videos: filteredVideos,company_name
                },config)
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
                    message.success('Portfolio Added Successfully')
                    // Fetch latest data (skip loading indicator and don't update page ref to avoid triggering useEffect)
                    await fetchPortfolioData(page, true, false)
                }
            }
        }catch(err){
            message.error(err.response?.data?.messages || err.message || 'Failed to save portfolio')
        } finally {
            setIsSubmittingPortfolio(false)
        }
    }

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        const newImages = [];
        let loadedCount = 0;
        const inputElement = e.target;
    
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          const fileIndex = i;
          // eslint-disable-next-line no-loop-func
          reader.onload = () => {
            if (reader.readyState === 2) {
              newImages[fileIndex] = reader.result;
              loadedCount++;
              
              // Update state when all images are loaded
              if (loadedCount === files.length) {
                // For add mode, append to existing preview if any
                setProjectImage(prev => [...prev, ...newImages]);
                setPreview(prev => [...prev, ...newImages]);
                // Reset file input to clear the filename display
                if (inputElement) {
                  inputElement.value = '';
                }
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }
            }
          };
    
          reader.readAsDataURL(files[i]);
        }
      };
    
      const handleNewImageInput = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        const newImages = [];
        let loadedCount = 0;
        const inputElement = e.target;
    
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          const fileIndex = i;
          // eslint-disable-next-line no-loop-func
          reader.onload = () => {
            if (reader.readyState === 2) {
              newImages[fileIndex] = reader.result;
              loadedCount++;
              
              // Update state when all images are loaded
              if (loadedCount === files.length) {
                // For update mode, append to existing newPreview
                setProjectImage(prev => [...prev, ...newImages]);
                setNewPreview(prev => [...prev, ...newImages]);
                // Reset file input to clear the filename display
                if (inputElement) {
                  inputElement.value = '';
                }
                if (newFileInputRef.current) {
                  newFileInputRef.current.value = '';
                }
              }
            }
          };
    
          reader.readAsDataURL(files[i]);
        }
      };


      const handleImageDelete = async (id) => {
        if (!id) {
            message.error('Image ID is missing')
            return
        }
        
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
            // Use query parameter approach to handle public_ids with slashes
            // axios automatically URL-encodes query parameters
            const data = await axios.delete(`${URL}/api/NextStudio/portfolio/image/${portfolioId}`, {
                ...config,
                params: {
                    publicId: id
                }
            })
            if(data.data.success === true){
                message.success('Portfolio Image Deleted Successfully')
                // Immediately remove the image from preview (optimistic update)
                setPreview(prev => prev.filter(img => {
                    const imgId = img.public_id || img._id || img.id
                    return imgId !== id
                }))
                setProjectImage(prev => prev.filter(img => {
                    const imgId = img.public_id || img._id || img.id
                    return imgId !== id
                }))
                // Fetch latest data to sync with server
                await fetchPortfolioData(page, true, false)
            }

        }catch(err){
            message.error(err.response?.data?.message || err.message || 'Failed to delete image')
        }
    }

    const handleNewImages = async (e) => {
        e.preventDefault();
        setIsAddingImage(true)
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            if(selectedItemforEdit){
                const portfolioId = selectedItemforEdit._id || selectedItemforEdit.id
                if (!portfolioId) {
                    message.error('Portfolio ID is missing')
                    setIsAddingImage(false)
                    return
                }
                const {data} = await axios.patch(`${URL}/api/NextStudio/portfolio/image/${portfolioId}`,{
                    project_image
                },config)
                if(data.success === true){
                    // Clear the new preview arrays (base64 previews)
                    setNewPreview([])
                    // Clear only the new images from project_image (keep existing ones)
                    setProjectImage(prev => prev.filter(img => typeof img !== 'string' || !img.startsWith('data:')))
                    message.success('Portfolio Image Added Successfully')
                    // Fetch latest data to update preview with newly uploaded images
                    await fetchPortfolioData(page, true, false)
                }
            }
        }catch(err){
            message.error(err.response?.data?.messages || err.message || 'Failed to add image')
        } finally {
            setIsAddingImage(false)
        }
    }


    const handleDelete = async (id) => {
        if (!id) return
        
        setIsDeletingPortfolio(true)
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            const data = await axios.delete(`${URL}/api/NextStudio/portfolio/${id}`,config)
            if(data.data.success === true){
                message.success('Portfolio Deleted Successfully')
                // Fetch latest data (skip loading indicator and don't update page ref to avoid triggering useEffect)
                await fetchPortfolioData(page, true, false)
                // Close modal only after successful deletion
                setShowDeleteModal(false)
                setDeleteId(null)
            }
        }catch(err){
            message.error(err.response?.data?.message || err.message || 'Failed to delete portfolio')
        } finally {
            setIsDeletingPortfolio(false)
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
                {isLoadingPortfolio ? (
                    <div className="flex justify-center items-center h-[400px]">
                        <Spin size="large" />
                    </div>
                ) : (
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
                )}
                <div className="flex justify-center mt-5 ">
                       <Pagination page={page}/>
                </div>
            </div>
            <Modal 
                open={showAddEditModal}  
                footer={null} 
                maskClosable={!isSubmittingPortfolio && !isAddingImage}
                keyboard={!isSubmittingPortfolio && !isAddingImage}
                onCancel={() => {
                    if (!isSubmittingPortfolio && !isAddingImage) {
                        setShowAddEditModal(false)
                        setSelectedItemforEdit(null)
                    }
                }}
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
                {project_videos.map((video, index) => {
                    const videoId = extractYouTubeVideoId(video);
                    const embedUrl = getYouTubeEmbedUrl(videoId);
                    
                    return (
                        <div key={index} className="mb-4">
                            <div className="flex gap-2 mb-2">
                                <input 
                                    className="cinput w-full" 
                                    type="url" 
                                    placeholder={`Video URL ${index + 1} (e.g., https://www.youtube.com/watch?v=VIDEO_ID)`}
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
                            {embedUrl && (
                                <div className="mt-2 mb-2">
                                    <p className="text-sm text-gray-600 mb-1">Preview:</p>
                                    <div className="relative w-full max-w-sm mx-auto" style={{ paddingBottom: '56.25%', height: 0 }}>
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-[200px] rounded border"
                                            src={embedUrl}
                                            title={`YouTube video preview ${index + 1}`}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
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
                <input 
                    ref={fileInputRef}
                    className={selectedItemforEdit ? 'hidden' :'cinput w-full'} 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <div className="flex justify-end mt-3 gap-5 w-full">
                        <button 
                            type="submit" 
                            className="bg-Secondary text-white w-[150px] px-5 py-1 rounded flex items-center justify-center gap-2" 
                            disabled={isSubmittingPortfolio}
                        >
                            {isSubmittingPortfolio ? (
                                <>
                                    <Spin size="small" />
                                    {selectedItemforEdit ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                selectedItemforEdit ? 'Update Content' : 'Add'
                            )}
                        </button>
                </div>
                </div>
            </form>
            {/* Show existing images (for edit mode) and newly selected images (for add mode) */}
            <div className="flex flex-wrap gap-5 mt-5 justify-center items-center">
                    {preview.map((data, index) => {
                        // Check if this is a new image (base64 string) or existing image (object with url/public_id)
                        const isNewImage = typeof data === 'string' && data.startsWith('data:')
                        const imageId = isNewImage ? null : (data.public_id || data._id || data.id)
                        const imageUrl = isNewImage ? data : (data.url || data)
                        
                        return (
                            <div key={imageId || imageUrl || index} className="relative w-[200px] object-contain">
                                <img className="h-[135px] w-full object-cover" src={imageUrl} alt="pic"/>
                                {/* Show delete button only for existing images in edit mode */}
                                {selectedItemforEdit && imageId && (
                                    <button 
                                        className="text-red-500 ml-[180px] -mt-[130px] absolute z-10 hover:text-red-700" 
                                        onClick={() => handleImageDelete(imageId)}
                                        type="button"
                                    >
                                        <FaTrash/>
                                    </button>
                                )}
                                {/* Show remove button for newly added images in add mode */}
                                {!selectedItemforEdit && isNewImage && (
                                    <button 
                                        className="text-red-500 ml-[180px] -mt-[130px] absolute z-10 hover:text-red-700" 
                                        onClick={() => {
                                            const newPreviewList = preview.filter((_, i) => i !== index)
                                            const newProjectImageList = project_image.filter((_, i) => i !== index)
                                            setPreview(newPreviewList)
                                            setProjectImage(newProjectImageList)
                                        }}
                                        type="button"
                                    >
                                        <FaTrash/>
                                    </button>
                                )}
                            </div>
                        )
                    })}
            </div>
            {/* Show newly added images for update mode (separate from existing images) */}
            {selectedItemforEdit && newPreview.length > 0 && (
                <div className="flex flex-wrap gap-5 mt-5 justify-center items-center">
                    <label className="w-full font-bold">New Images (will be added after update):</label>
                    {newPreview.map((data, index) => (
                        <div key={index} className="relative w-[200px] object-contain">
                            <img className="h-[135px] w-full object-cover" src={data} alt="pic"/>
                            <button 
                                className="text-red-500 ml-[180px] -mt-[130px] absolute z-10 hover:text-red-700" 
                                onClick={() => {
                                    const newPreviewList = newPreview.filter((_, i) => i !== index)
                                    const newProjectImage = project_image.filter((_, i) => i !== (preview.length + index))
                                    setNewPreview(newPreviewList)
                                    setProjectImage(newProjectImage)
                                }}
                                type="button"
                            >
                                <FaTrash/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className={selectedItemforEdit ? 'flex flex-col gap-2' : 'hidden'}>
                <form onSubmit={handleNewImages}>
                    <label className='font-bold mt-10 mb-3'>Project Images</label>
                    <input 
                        ref={newFileInputRef}
                        className='cinput w-full' 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={selectedItemforEdit ? handleNewImageInput : handleImageChange}
                    />
                    <div className="flex justify-end mt-3 gap-5 w-full">
                        <button 
                            type="submit" 
                            className="bg-Secondary text-white w-[150px] px-5 py-1 rounded flex items-center justify-center gap-2" 
                            disabled={isAddingImage}
                        >
                            {isAddingImage ? (
                                <>
                                    <Spin size="small" />
                                    Adding...
                                </>
                            ) : (
                                'Add Image'
                            )}
                        </button>
                    </div>
                </form>
            </div>    
            </Modal>
            <Modal 
                open={showDeleteModal} 
                footer={null} 
                closable={!isDeletingPortfolio} 
                centered={true} 
                onCancel={() => {
                    if (!isDeletingPortfolio) {
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
                            disabled={isDeletingPortfolio}
                        >
                            {isDeletingPortfolio ? (
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
                                if (!isDeletingPortfolio) {
                                    setShowDeleteModal(false) 
                                    setDeleteId(null)
                                }
                            }}
                            disabled={isDeletingPortfolio}
                        >
                            Cancel
                        </button>
                    </div>
            </Modal>
        </div>
    )
}

export default AdminPortfolioManagement;