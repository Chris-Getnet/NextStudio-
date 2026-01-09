import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash} from "react-icons/fa";
import { login, reset } from '../../API/Auth/authSlice'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message, Spin } from "antd";

const AdminLoginPage = () => {

    useEffect(() => {
        document.title = "Admin Login - Next Studio"
    })
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      })

    
      const { email, password } = formData
    
      const navigate = useNavigate()
      const dispatch = useDispatch()
      const [view,setView] = useState(false)
      const [error, seterror] = useState(false)
      const passwordvisible = () => {
          if(view === false){
              return setView(true)
          }
          else{
              return setView(false)
          }
      }
    
      const { user, isError, isSuccess, messages, isLoading } = useSelector(
        (state) => state.auth
      )
    
      useEffect(() => {
        if (isError) {
            message.error(messages)
        }
    
        if (isSuccess || user) {
          
          navigate('/admindashboard/home')
        }
    
        dispatch(reset())
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [user, isError, isSuccess, messages, navigate, dispatch])
    
      const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
      }
    
      const onSubmit = (e) => {
        e.preventDefault()

        if(email.length === 0 && password.length ===0){
            seterror(true)
        }
        if(email && password){
        const userData = {
          email,
          password,
        }
    
        dispatch(login(userData))
      }
      }


    return(
        <div className="flex flex-col h-screen justify-center items-center w-full">
        <div className="flex flex-col justify-center items-center w-[320px] gap-5">
                <div className="w-[180px] sm:w-[20vh]">
                    <img src="https://res.cloudinary.com/dtlrrlpag/image/upload/v1671362225/Next%20Studio/Logo/Next_Studio_Logo_ygxexg.png" alt="Logo" />
                </div>
                <form onSubmit={onSubmit}>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col">
                            <input 
                                className="cinput w-[297px]" 
                                type="email" 
                                placeholder="Email" 
                                name="email" 
                                value={email} 
                                onChange={onChange}
                                disabled={isLoading}
                            />
                            <span className={`${error && email.length<=0 ? 'text-red-500': 'hidden'}`}>Please enter an email</span>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex justify-end items-center">
                                <input 
                                    className="cinput w-[300px]" 
                                    type={`${view === false ? "password" : "text"}`} 
                                    placeholder="Password" 
                                    value={password} 
                                    name="password" 
                                    id="password" 
                                    onChange={onChange}
                                    disabled={isLoading}
                                />
                                <i 
                                    type="button" 
                                    className=" absolute p-3 mt-2 " 
                                    onClick={passwordvisible}
                                    style={{ pointerEvents: isLoading ? 'none' : 'auto', opacity: isLoading ? 0.5 : 1 }}
                                >
                                    {view === false ? <FaEyeSlash/> : <FaEye/> }
                                </i>
                            </div>
                            <span className={`${error && password.length<=0 ? 'text-red-500': 'hidden'}`}>Please enter a password</span>
                        </div>
                        <button 
                            type="submit" 
                            className='cbutton w-[297px]' 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Spin size="small" />
                                    Logging in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </form>
        </div>
      
    </div>
    )
}

export default AdminLoginPage;