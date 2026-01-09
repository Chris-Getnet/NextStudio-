import { Modal, message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ReloadData, hiddenloading, showloading } from "../../../../API/Server/rootSlice";
import Swal from "sweetalert2";
import { URL } from "../../../../Url/Url";
import FileUpload from "../../Common/FileUpload";

const ApplyForm = () => {
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [messages, setMessages] = useState('');
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setFile(reader.result);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(showloading());

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phonenumber', phonenumber);
    formData.append('messages', messages);
    formData.append('file', file);

    try {
      const { data } = await axios.post(`${URL}/api/NextStudio/contact/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success === true) {
        dispatch(hiddenloading());
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your Message Submit Successfully.',
          showConfirmButton: false,
          timer: 2000
        });
        setName('');
        setEmail('');
        setPhoneNumber('');
        setMessages('');
        setFile(null);
        dispatch(ReloadData(true));
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      dispatch(hiddenloading());
      message.error('Failed to submit application. Please try again later.');
    }
  };

  return (
    <div>
      <div className="cparallex flex flex-col justify-center items-center w-full h-[60vh] mt-16 mb-20 gap-10">
        <div className="flex flex-col gap-3 items-center justify-center">
          <h1 className="text-white vsm:text-xl text-4xl font-semibold">INTERESTED IN WORKING WITH US?</h1>
          <h1 className="text-white vsm:text-xs text-lg">Send us your CV and cover letter so we can get to know you</h1>
        </div>
        <button className="cbutton w-[100px]" onClick={() => { setShowAddEditModal(true) }}>Apply Form</button>
      </div>
      <Modal visible={showAddEditModal} width="60%" footer={null} onCancel={() => { setShowAddEditModal(false) }} maskClosable={false} keyboard={false}>
        <div className="flex flex-col gap-2 justify-center items-center">
          <br />
          <h1 className="text-2xl font-semibold uppercase">Apply Form</h1>
          <div className="w-[150px] h-[3px] bg-slate-700 rounded"></div>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="flex w-full flex-col mt-8 gap-1">
            <div>
              <label>Full Name:</label>
              <input className="cinput w-full" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" />
            </div>
            <div>
              <label>Email Address</label>
              <input className="cinput w-full" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" />
            </div>
            <div>
              <label>Phone Number:</label>
              <input className="cinput w-full" type="number" value={phonenumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="251987654321" />
            </div>
            <div>
              <label>Message:</label>
              <textarea className="ctextarea w-full" type="text" value={messages} onChange={(e) => setMessages(e.target.value)} placeholder="Message" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CV:</label>
              <FileUpload
                accept=".pdf,.doc,.docx"
                placeholder="Choose your CV or drag it here"
                onChange={handleFileInputChange}
                maxSize={5}
              />
            </div>
            <button className="cbutton w-28" type="submit">Submit</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ApplyForm;
