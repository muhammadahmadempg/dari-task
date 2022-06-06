import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
const queryString = require("querystring");
export default function PaginationComponent({ total_pages = 0 }) {
  const {
    query: { page = 1, ...restQuery },
    push,
  } = useRouter();

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ReactPaginate
        nextLabel="Next"
        pageCount={total_pages}
        previousLabel="Previous"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-link"
        pageItemClassName="page-item"
        nextClassName="page-link"
        previousClassName="page-link"
        breakLabelClassName="page-link"
        forcePage={page - 1}
        onPageChange={({ selected: page }) => {
          push(
            `/?${queryString.stringify({ ...restQuery, page: page + 1 })}`,
            undefined,
            { shallow: true }
          );
        }}
        activeClassName="bg-primary text-white"
        activeLinkClassName="bg-primary text-white"
        breakLabel="..."
        hrefBuilder={(page) => {
          return `/?${queryString.stringify({ ...restQuery, page })}`;
        }}
      />
    </div>
  );
}
