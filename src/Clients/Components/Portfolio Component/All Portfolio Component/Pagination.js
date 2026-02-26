import {Pagination, PaginationItem} from '@material-ui/lab';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { ReloadData, hiddenloading, setPortfolioData, showloading } from '../../../../API/Server/rootSlice';
import { useDispatch, useSelector } from 'react-redux';
import { forwardRef, useEffect } from 'react';
import useStyles from './styles';
import { URL } from '../../../../Url/Url';

const PaginationLink = forwardRef(function PaginationLink(props, ref) {
    return <Link ref={ref} {...props} />;
});

const Paginate = ({page}) => {

    const {portfolioData,portfolioLengthData} = useSelector((state) => state.root)
    const classes = useStyles();
    const dispatch = useDispatch()

	    const getPortfolioData = async (page) => {
        try{
          dispatch(showloading())
          const responce = await axios.get(`${URL}/api/NextStudio/portfolio?page=${page}`)
          dispatch(setPortfolioData(responce.data.portfolios))
          dispatch(ReloadData(false))
          dispatch(hiddenloading())
        }catch(error){
          dispatch(hiddenloading())
        }
      }

      const total = portfolioLengthData.length
      const limit = 6

      const numberOfPage = Math.ceil(total/limit)

    useEffect(() => {
        if(page || !portfolioData){
            getPortfolioData(page)
        }
    },[page])

    return(
        <Pagination
            classes={{ul:classes.ul}}
            count = {numberOfPage}
            page = {Number(page) || 1}
            variant="outlined"
            color="primary"
            renderItem = {(item) => (
                <PaginationItem
                    {...item}
                    component={PaginationLink}
                    to={`/portfolios?page=${item.page}`}
                    disableRipple
                />
            )}
        />
    )
}

export default Paginate;