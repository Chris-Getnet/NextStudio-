import { useSelector } from "react-redux";

const PortfolioContent1 = ({portfolioData}) => {

    return(
        <div>
            <div className="flex flex-col ">
                <div className="text-xl s3m:text-lg " dangerouslySetInnerHTML={{__html: portfolioData.project_description1}}/>
                <h1 className="text-xl s3m:text-lg mt-10 " ><strong>Date:- </strong>{portfolioData.project_date}</h1>
                <h1 className="text-xl s3m:text-lg mt-5 " ><strong>Client:- </strong>{portfolioData.company_name}</h1>
            </div>
        </div>
    )
}

export default PortfolioContent1;