import { message } from "antd"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { reset, updatePassword } from "../../../API/Auth/authSlice"
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {

    const [oldview,oldsetView] = useState(false)
    const [newview,newsetView] = useState(false)
    const [confirmview,confirmsetView] = useState(false)
    const [error, seterror] = useState(false)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    
      const {  oldPassword, newPassword, confirmPassword } = formData

    const oldpasswordvisible = () => {
        if(oldview === false){
            return oldsetView(true)
        }
        else{
            return oldsetView(false)
        }
    }
    const newpasswordvisible = () => {
        if(newview === false){
            return newsetView(true)
        }
        else{
            return newsetView(false)
        }
    }
    const confirmpasswordvisible = () => {
        if(confirmview === false){
            return confirmsetView(true)
        }
        else{
            return confirmsetView(false)
        }
    }
    const { user, isError, isSuccess, messages } = useSelector(
        (state) => state.auth
      )
    useEffect(() => {
        if (isError) {
            message.error(messages)
        }
        if (isSuccess) {
            message.success("Password updated Successfuly")
        }
    
        dispatch(reset())
      }, [user, isError, isSuccess, messages, dispatch])

    
      const onChange = (e) => {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }))
      }
    
      const onSubmit = (e) => {
        e.preventDefault()

        if(oldPassword.length === 0 && newPassword.length === 0 && confirmPassword.length === 0){
            seterror(true)
            return
        }

        // Validate all fields are filled
        if(!oldPassword || !newPassword || !confirmPassword){
            message.error('Please fill in all fields')
            seterror(true)
            return
        }

        // Validate old password is not the same as new password
        if(oldPassword === newPassword){
            message.error('New password must be different from old password')
            return
        }

        // Validate new password matches confirm password
        if(newPassword !== confirmPassword){
            message.error('New password and confirm password do not match')
            return
        }

        // All validations passed, submit the form
        const userData = {
            oldPassword,
            newPassword,
            confirmPassword
        }

        dispatch(updatePassword(userData))
        setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword:''
        })
        seterror(false)
      }

    return(
        <div className="flex flex-col w-full mt-5 justify-center items-center">
            <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col">
                        <label className=" font-semibold">Old Password:</label>
                        <div className="flex justify-end items-center">
                            <input className="cinput w-[500px]" type={`${oldview === false ? "password" : "text"}`} name="oldPassword" value={oldPassword} onChange={onChange}  placeholder="Old password"/>
                            <i type="button " className=" absolute p-5 mt-2 " onClick={oldpasswordvisible}>{oldview === false ? <FaEyeSlash/> : <FaEye/> }</i>
                        </div>
                        <span className={`${error && oldPassword.length<=0 ? 'text-red-500': 'hidden'}`}>Please enter your current password</span>
                    </div>
                    <div className="flex flex-col">
                        <label className=" font-semibold">New Password:</label>
                        <div className="flex justify-end items-center">
                            <input className="cinput w-[500px]" type={`${newview === false ? "password" : "text"}`} name="newPassword" value={newPassword} onChange={onChange}  placeholder="New Password"/>
                            <i type="button " className=" absolute p-5 mt-2 " onClick={newpasswordvisible}>{newview === false ? <FaEyeSlash/> : <FaEye/> }</i>
                        </div>
                        <span className={`${error && newPassword.length<=0 ? 'text-red-500': 'hidden'}`}>Please enter a new password</span>
                        <span className={`${oldPassword && newPassword && oldPassword === newPassword ? 'text-red-500': 'hidden'}`}>New password must be different from old password</span>
                    </div>
                    <div className="flex flex-col">
                        <label className=" font-semibold">Confirm Password:</label>
                        <div className="flex justify-end items-center">
                            <input className="cinput w-[500px]" type={`${confirmview === false ? "password" : "text"}`} name="confirmPassword" value={confirmPassword} onChange={onChange}  placeholder="Confirm Password"/>
                            <i type="button " className=" absolute p-5 mt-2 " onClick={confirmpasswordvisible}>{confirmview === false ? <FaEyeSlash/> : <FaEye/> }</i>
                        </div>
                        <span className={`${error && confirmPassword.length<=0 ? 'text-red-500': 'hidden'}`}>Please confirm your new password</span>
                        <span className={`${newPassword && confirmPassword && newPassword !== confirmPassword ? 'text-red-500': 'hidden'}`}>Passwords do not match!</span>
                    </div>
                    <div className="flex justify-end w-full">
                        <button className="bg-Secondary text-white w-[100px] py-2 px-5 rounded">Save</button>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default ChangePassword