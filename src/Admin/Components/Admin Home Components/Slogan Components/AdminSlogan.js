import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReloadData, hiddenloading, showloading } from "../../../../API/Server/rootSlice";
import { URL } from "../../../../Url/Url";
import { message } from "antd";
import JoditEditor from 'jodit-react';

const AdminSlogan = () => {

    const { quoteData } = useSelector((state) => state.root)

    const [quote_text,setQuoteText] = useState('')
    const editor = useRef(null)
    const token = localStorage.getItem('token')
    const dispatch = useDispatch()

    useEffect(() => {
        setQuoteText(quoteData.quote_text)
    },[quoteData])

    const onSubmit =  async (e) => {
        e.preventDefault();
        try{
            const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
            dispatch(showloading())
            const {data} = await axios.patch(`${URL}/api/NextStudio/quote/`,{
                quote_text
            },config)
            dispatch(hiddenloading())
            if(data.success === true){
                message.success('Slogan Updated Successfuly')
                dispatch(hiddenloading())
                dispatch(ReloadData(true))
            }
        }catch(err){
            dispatch(hiddenloading())
            message.error(err.message)
        }
    }

    return(
        <div className="flex flex-col gap-5">
            <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-5">
                    <JoditEditor
                    ref={editor}
                    value={quote_text}
                    onChange={newContent => setQuoteText(newContent)}     
                />
                </div>
                <div className="flex mt-5 justify-end w-full">
                     <button type="submit" className="bg-Secondary text-white w-[100px] py-2 px-5 rounded">Update</button>
                </div>
            </form>
        </div>
    )
}

export default AdminSlogan;