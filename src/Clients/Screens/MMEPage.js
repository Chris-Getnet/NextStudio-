import { BsFillCalendar2EventFill } from "react-icons/bs";
import { FaClock, FaPhoneAlt } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import BottomFooter from "../Components/Footer Component/BottomFooter";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ReloadData, hiddenloading, showloading } from "../../API/Server/rootSlice";
import { message } from "antd";
import {URL} from '../../Url/Url'
import Swal from 'sweetalert2'

const MMEPage = () => {
  const question = ["YES! WOULDN`T MISS IT.", "NO. SORRY TO MISS IT."];

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [reason, setReason] = useState(null);
  const dispatch = useDispatch()

  const handleRadioChangeQ1 = (value) => {
    setAnswer(value);
  };

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value); // Update the phone number state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try{
        if(name === null && email === null && phoneNumber === null && answer === null){
            message.error("No input received. Please provide valid input.")
        }
        else if(name === null || email === null || phoneNumber === null || answer === null){
            message.error("No input received. Please provide valid input.")
        }
        else{
            dispatch(showloading())

            const { data } = await axios.post(`${URL}/api/NextStudio/contact/mme/send-mail`,{name,email,phoneNumber,answer,reason})

            if(data.success === true){
                dispatch(showloading())
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your RSVP Submit Successfully.',
                    showConfirmButton: false,
                    timer: 2000
                })
                setName("")
                setEmail("")
                setPhoneNumber("")
                setAnswer("")
                setReason("")
                dispatch(ReloadData(true))
                dispatch(hiddenloading())
            }
        }
    }
    catch(err){
        dispatch(hiddenloading())
        message.error(err.message)
    }
  };

  return (
    <div>
      <div className="flex flex-col w-full">
        <div className="bg-radial-gradient from-[#165f3c] to-[#024225] flex w-full h-[40vh]  justify-center">
          
          <div className="flex p-5 flex-col text-white text-4xl lg:text-2xl mme3:text-xl nsm:text-base vs2:text-sm  text-center items-center justify-center leading-relaxed tracking-widest">
          <img
            className="w-[300px] object-contain mb-5"
            src="https://res.cloudinary.com/dtlrrlpag/image/upload/v1739735202/NextClient/Marathon_Motors_Logo__PNG_bfajdo.png"
            alt="logo"
          />
            <h1>Launching Ceremony of the Hyundai IONIQ 5</h1>
            <h1>& Hyundai KONA Electric,Along with an Electric Vehicle Workshop</h1>

          </div>
        </div>
        <div className="flex p-8 pds:flex-col w-full h-[80vh] pds:h-[110vh] bg-[#f9f9f9]  items-center">
          <div className="flex flex-col mme:w-full w-1/2 items-center">
            <h1 className="text-center text-2xl uppercase ">
              Will you Attend?
            </h1>
            <div className="w-4/5 vsm:w-5/6 vs2:w-full  mt-5">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                  <input
                    className="cinput w-full"
                    placeholder="Enter your Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="flex w-full pds3:flex-col items-center vsm:gap-5">
                    <input
                      className="cinput w-1/2 pds3:w-full"
                      placeholder="Enter your Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <PhoneInput
                      className="cinput  w-1/2 pds3:w-full"
                      international
                      defaultCountry="ET"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                    />
                  </div>
                  <div className="flex w-full vsm2:flex-col vsm2:gap-2 ">
                    {["Yes", "No"].map((value, index) => (
                      <div
                        className="flex w-1/2 vsm2:w-full vsm2:justify-start tt:text-xs justify-center items-center gap-5"
                        key={value}
                      >
                        <div className="gap-5 flex justify-center">
                          <input
                            className="radio-button"
                            type="radio"
                            id={`radio-${value}`}
                            name="selectValue"
                            value={value}
                            checked={answer === value}
                            onChange={() => handleRadioChangeQ1(value)}
                          />
                          <label htmlFor={`radio-${value}`}>
                            {question[index]}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <textarea
                      className="ctextarea w-full"
                      placeholder="Reason"
                      type="text"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      disabled={answer !== "No"}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="rbutton w-[150px]">RSVP</button>
                  </div>
                </div>
              </form>
              <div className="flex flex-col gap-2 mt-5">
                <h1 className="text-center text-2xl font-bold"> 
                  or
                </h1>
                <h1 className="text-center text-xl mme5:text-lg ">
                    please use the numbers below to inform us.
                </h1>
                <div className="flex gap-5 justify-center items-center mt-8 mb-8 pds:flex-col">
                    <a href="tel:+251944036914">
                      <div className="bg-radial-gradient from-[#165f3c] to-[#024225] w-[300px] p-2 rounded flex gap-5 items-center justify-center text-white">
                        <FaPhoneAlt />
                        <h1>+251944036914</h1>
                      </div>
                    </a>
                    <a href="tel:+251951119080">
                      <div className="bg-radial-gradient from-[#165f3c] to-[#024225] w-[300px] p-2 rounded flex gap-5 items-center justify-center text-white">
                        <FaPhoneAlt />
                        <h1>+251951119080</h1>
                      </div>
                    </a>
                </div>
              </div>
            
            </div>
          </div>
          
          <div className="flex flex-col pds:w-full w-1/2 mt-10 gap-4 justify-center items-center">
              <h1 className="text-center pds3:w-full pds3:text-xs w-4/6">
              Please click the button below to access the pictures of The Launching Ceremony of 
              the Hyundai Ioniq 5 & Hyundai Kona Electric, Along with an Electric Vehicle Workshop.
              </h1>
              <a href="https://photos.app.goo.gl/xUmSuqDYGZsdu1gi6">
                <button className="rbutton w-[100px]">Pictures</button>
              </a>
            </div>
        </div>
        <div className="flex w-full s3m:flex-col h-[50vh] s3m:h-[80vh]">
          <div className="w-1/2 s3m:w-full">
            <iframe
              title="Hyundai Marathon Motors Map"
              className="w-full h-[50vh] vsm:h-[40vh] border-gray-200 border-2"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5184.431783389153!2d38.74020571573454!3d8.907538017580583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b830ee23bdbb7%3A0x252c0818572fc324!2sHyundai-Marathon%20Motors!5e0!3m2!1sen!2set!4v1739719025376!5m2!1sen!2set"
              frameborder="0"
              allowfullscreen=""
            ></iframe>
          </div>
          <div className=" flex flex-col p-5 gap-8 justify-center items-center w-1/2 s3m:w-full s3m:mt-10">
            <h1 className="uppercase font-bold text-xl">When & where</h1>
            <div className="flex flex-col gap-5 items-start">
              <div className="flex items-center  gap-5">
                <BsFillCalendar2EventFill />
                <h1>Thursday, 20 February 2025</h1>
              </div>
              <div className="flex items-center gap-5">
                <FaClock />
                <h1>02:00 PM</h1>
              </div>
              <div className="flex items-center gap-5">
                <FaMapLocationDot />
                <div className="block vsmm:hidden">
                  <h1>The State-Of-The-Art Hyundai Vehicle Assembly Plant,</h1>
                  <h1>Addis Ababa, Ethiopia</h1>
                </div>
                <div className="hidden vsmm:block">
                  <h1>The State-Of-The-Art Hyundai Vehicle Assembly </h1>
                  <h1>Plant, Addis Ababa, Ethiopia</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-0 w-full">
        <BottomFooter />
      </div>
    </div>
  );
};

export default MMEPage;
