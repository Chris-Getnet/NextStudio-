import { useSelector } from "react-redux";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
import LoadingPage from "../../Screens/LoadingPage";

const ListService = () => {

    const { serviceData } = useSelector((state) => state.root)
    const [expandedServices, setExpandedServices] = useState([]);

    useEffect(() => {
        AOS.init({
          duration: 1000, 
          easing: 'ease-out-back',
        });
      }, []);

    const toggleService = (index) => {
        setExpandedServices((prevExpandedServices) => {
          const isExpanded = prevExpandedServices.includes(index);
          return isExpanded
            ? prevExpandedServices.filter((i) => i !== index)
            : [...prevExpandedServices, index];
        });
      };

    if (!serviceData || !Array.isArray(serviceData)) {
        return <LoadingPage />;
    }

    return(
        <div data-aos="fade-up"  className="flex flex-wrap justify-center gap-5 items-center mt-10">
           {serviceData.map((service,index) => (
                <div key={index}>
                <button onClick={() => toggleService(index)}>
                    <div  className="flex flex-col w-[420px] vsm2:w-[300px]">

                        <div className="flex gap-5 justify-between items-center h-[80px]">

                            <div className="flex gap-5 items-center">

                                <div>
                                    {service.service_icon && service.service_icon.url && (
                                        <img src={service.service_icon.url} className="h-[80px] " alt="newimage"/>
                                    )}
                                </div>

                                <div>

                                    <h1 className="text-xl font-semibold">{service.service_title}</h1>

                                </div>
                            </div>

                            <div >
                                {expandedServices.includes(index) ? <FaAngleUp/> : <FaAngleDown/>  }
                            </div>

                        </div>
                        <div>

                        {expandedServices.includes(index) && <div className="h-[150px] vsm2:h-[200px] text-sm text-left font-thin"  dangerouslySetInnerHTML={{__html: service.service_description}}/>}

                        </div>

                    </div>
                </button>
                <hr/>
                </div>
           ))}
        </div>
    )
}

export default ListService;