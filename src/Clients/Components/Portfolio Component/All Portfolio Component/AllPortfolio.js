import { Link, useLocation } from "react-router-dom";
import Pagination from "./Pagination";
import { useSelector } from "react-redux";


function useQuery() {
    return new URLSearchParams(useLocation().search)
}

const AllPortfolio = () => {

    const { portfolioData } = useSelector((state) => state.root)

    const query = useQuery()
    const page = query.get('page') || 1; 

    return(
        <div className="flex flex-col mt-24 justify-center items-center gap-10 sm:gap-5">
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-6xl sm:text-4xl text-Secondary font-extrabold uppercase">Our Work</h1>
                <h1 className="text-xl sm:text-sm mt-8 sm:mt-3 uppercase font-thin">a selection of projects</h1>
            </div>
            <div className="flex flex-col justify-center gap-5 items-center mb-10">
            <div className="flex flex-wrap gap-1 justify-center items-center mb-10">
                {portfolioData.map((p) => (
                    <Link to={`/portfolios/${p.id}`}>
                        <div style={{backgroundImage: `url(${p.project_image && p.project_image[0] ? p.project_image[0].url : ''})`, backgroundPosition: 'center', backgroundSize:'cover'}} className={`w-[400px] h-[300px] vsmm:w-[300px] vsmm:h-[200px]  text-xl text-transparent items-end font-semibold hover:text-white `}>
                            <div className=" flex items-end w-full h-full p-5 hover:bg-opacity-80 hover:bg-Primary">{p.project_name}</div>
                        </div>
                    </Link>
                ))}   
            </div>
            <div className="flex justify-center mt-5 ">
                <Pagination page={page}/>
            </div>
            </div>
        </div>
    )
}
export default AllPortfolio;