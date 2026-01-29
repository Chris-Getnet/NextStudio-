import { useState } from "react";
import { URL } from "../../../../Url/Url";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ReloadData } from "../../../../API/Server/rootSlice";
import Swal from 'sweetalert2'
import { Spin } from "antd";

const ContactForm = () => {

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [messages,setMessages] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
      

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            setIsLoading(true)
            
            const {data} = await axios.post(`${URL}/api/NextStudio/contact/send-mail`, {
                name,email,messages
            });
    
            if(data.success === true){
                setIsLoading(false)
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your Message Submit Successfully.',
                    showConfirmButton: false,
                    timer: 2000
                  })
                setName('')
                setEmail('')
                setMessages('')
                dispatch(ReloadData(true))
            }
        } catch (error) {
            setIsLoading(false)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Failed to send message',
                text: error.response?.data?.message || error.message || 'Please try again later.',
                showConfirmButton: true
            })
        }
      };
    return(
        <div className='mt-16 md:mt-4 flex justify-center items-center'>
        <div className=" w-[60%] vs2:w-[80%] ">
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-5'>
                    <input className='cinput w-full' value={name} onChange={(e) => setName(e.target.value)} name="name" placeholder='Full Name' type="text"/>
                    <input className='cinput w-full' value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" placeholder='Email Address'/>
                    <textarea className='ctextarea w-full' name="message"  value={messages} onChange={(e) => setMessages(e.target.value)} placeholder='Message' type="text"/>
                    <button className='cbutton w-[120px] mb-5' type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Spin size="small" />
                                Submitting...
                            </span>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </div>
            </form>
        </div>
        </div>
    )
}

export default ContactForm;