import {Pagination, PaginationItem} from '@material-ui/lab';
import useStyles from './styles';
import { useSelector } from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import { useCallback } from 'react';

const Paginate = ({page}) => {
    const {portfolioPagination} = useSelector((state) => state.root)
    const classes = useStyles();
    const navigate = useNavigate();

    // Handle pagination click to avoid findDOMNode warning
    // Must be called before any early returns to follow React Hooks rules
    const handleChange = useCallback((event, value) => {
        navigate(`/admindashboard/portfolios?page=${value}`);
    }, [navigate]);

    // Use pagination data from API response
    const totalPages = portfolioPagination?.totalPages || 1

    // Don't render pagination if we don't have pagination data
    if (!portfolioPagination) {
        return null;
    }

    return(
        <Pagination
            classes={{ul:classes.ul}}
            count={totalPages}
            page={Number(page) || 1}
            variant="outlined"
            color="primary"
            onChange={handleChange}
            renderItem = {(item) => (
                <PaginationItem
                    {...item}
                    component={Link}
                    to={`/admindashboard/portfolios?page=${item.page}`}
                    disableRipple
                />
            )}
        />
    )
}

export default Paginate;