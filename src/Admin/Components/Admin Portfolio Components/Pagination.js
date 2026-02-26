import {Pagination, PaginationItem} from '@material-ui/lab';
import useStyles from './styles';
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import { forwardRef } from 'react';

const PaginationLink = forwardRef(function PaginationLink(props, ref) {
    return <Link ref={ref} {...props} />;
});

const Paginate = ({page}) => {
    const {portfolioPagination} = useSelector((state) => state.root)
    const classes = useStyles();

    // Use pagination data from API response
    const totalPages = portfolioPagination?.totalPages || 1

    // Don't render pagination if we don't have pagination data
    if (!portfolioPagination) {
        return null;
    }

    return(
        <Pagination
            classes={{ul:classes.ul}}
            count = {totalPages}
            page = {Number(page) || 1}
            variant="outlined"
            color="primary"
            renderItem = {(item) => (
                <PaginationItem
                    {...item}
                    component={PaginationLink}
                    to={`/admindashboard/portfolios?page=${item.page}`}
                    disableRipple
                />
            )}
        />
    )
}

export default Paginate;