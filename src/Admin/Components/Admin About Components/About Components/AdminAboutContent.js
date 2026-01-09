import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ReloadData, hiddenloading, showloading } from "../../../../API/Server/rootSlice"
import { message } from "antd"
import {URL} from '../../../../Url/Url'
import JoditEditor from 'jodit-react';

const AdminAboutContent = () => {

    const { aboutData } = useSelector((state) => state.root)

    const [preview,setPreview] = useState(null)
    const [intro_image,setIntroImage] = useState('')
    const [originalImage, setOriginalImage] = useState(null)
    const [imageChanged, setImageChanged] = useState(false)
    const [about_desc,setAboutDesc] = useState('')
    const dispatch = useDispatch()
    const token = localStorage.getItem('token')
    const editor = useRef(null);

    useEffect(() => { 
        if (aboutData) {
            // Handle new API format with intro_image_url or old format with intro_image
            const imageUrl = aboutData.intro_image_url || 
                           (typeof aboutData.intro_image === 'string' 
                               ? aboutData.intro_image 
                               : aboutData.intro_image?.url);
            
            // Store original image data for update logic
            const originalImageData = aboutData.intro_image_public_id 
                ? { public_id: aboutData.intro_image_public_id, url: imageUrl }
                : aboutData.intro_image;
            
            setIntroImage(aboutData.intro_image_url || aboutData.intro_image || '')
            setOriginalImage(originalImageData)
            setImageChanged(false)
            setPreview(imageUrl || null)
            setAboutDesc(aboutData.about_desc || '')
        }
    },[aboutData])

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        
        transformFile(file)
    }

    

    const transformFile = (file) => {
        const reader = new FileReader();
        if(file){
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setIntroImage(reader.result);
                setPreview(reader.result)
                setImageChanged(true)
            };
        }
    }
   
    const onSubmit = async (e) => {
        e.preventDefault();
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            dispatch(showloading())
            
            // Only send intro_image if a new image was selected
            // If no new image, send the original Cloudinary object or omit it
            const payload = {
                about_desc
            }
            
            // Only include intro_image if it was changed (new base64 image)
            // or if it's the original Cloudinary object structure
            if (imageChanged && intro_image) {
                // New image selected (base64 string)
                payload.intro_image = intro_image
            } else if (originalImage && typeof originalImage === 'object' && originalImage.public_id) {
                // Keep original Cloudinary object if no new image was selected
                payload.intro_image = originalImage
            } else if (originalImage && typeof originalImage === 'string') {
                // Original was a string URL, keep it
                payload.intro_image = originalImage
            }
            
            const {data} = await axios.patch(`${URL}/api/NextStudio/about/`, payload, config)
            dispatch(hiddenloading())
            if(data.success === true){
                message.success('About content Updated Successfuly')
                dispatch(hiddenloading())
                dispatch(ReloadData(true))
            }
        }catch(err){
            dispatch(hiddenloading())
            message.error(err.response?.data?.message || err.message || 'Failed to update about content')
        }
    }



    return(
        <div className="flex flex-col gap-8">
            <div>
            <img className="w-full h-[400px] border-2 rounded object-cover " src={preview === null ? 'https://res.cloudinary.com/dtlrrlpag/image/upload/v1685707236/Next%20Studio/placeholder-image-gray-3x2_po4o0q.png' : preview}  alt=""/>
            </div>
            <div className="flex w-full items-center gap-5" >
                <div className="w-full ">
                    <form onSubmit={onSubmit}>
                        
                        <input className="cinput w-full mb-5" type="file" onChange={handleFileInputChange}  />
                        
                        <h1 className="text-xl font-bold uppercase text-center mb-5">Next Studio Description</h1>

                        <JoditEditor
                            ref={editor}
                            value={about_desc}
                            onChange={newContent => setAboutDesc(newContent)}     
                        />  

                        <div className="flex justify-end mt-5 gap-5 w-full">
                            <button type="submit" className="bg-Secondary text-white w-[150px] px-5 py-1 rounded">Update</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminAboutContent;