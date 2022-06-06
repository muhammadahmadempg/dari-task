import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import PaginationComponent from "../components/pagination";
import Search from "../components/search";
import DataTable from "../components/table";
import {
  getDataAfterPageWiseData,
  getDataAfterPagination,
  getFilteredDataBasedOnQuery,
} from "../utils/helperFunctions";
import { fetchData } from "../utils/networkLayer";
export default function IndexPage({
  actionTypes,
  applicationTypes,
  filteredData: filtered_data,
  result: { auditLog = [] } = {},
  totalPages,
  per_page,
}) {
  const [filteredData, setFilteredData] = useState(filtered_data || []);
  const [tableSorting, setTableSorting] = useState({
    fields: [],
    sortingOptions: [],
  });
  const [total_pages, setTotalPages] = useState(totalPages || 0);
  const router = useRouter();
  const { query } = router;
  useEffect(() => {
    const { filteredData, totalPages } = getDataAfterPagination(
      getFilteredDataBasedOnQuery(auditLog, query),
      { page: query.page }
    );
    setTotalPages(totalPages);
    setFilteredData(
      _.orderBy(
        [...filteredData],
        tableSorting.fields,
        tableSorting.sortingOptions
      )
    );
  }, [query, auditLog]);
  useEffect(() => {
    setFilteredData(
      _.orderBy(
        [...filteredData],
        tableSorting.fields,
        tableSorting.sortingOptions
      )
    );
  }, [tableSorting]);
  return (
    <Container className="mt-3">
      <Search
        {...{
          actionTypes,
          applicationTypes,
          router,
        }}
      />
      <DataTable
        setTableSorting={setTableSorting}
        tableSorting={tableSorting}
        auditLog={filteredData || []}
      />

      <PaginationComponent per_page={per_page} total_pages={total_pages} />
    </Container>
  );
}

export const getServerSideProps = async (ctx) => {
  const data = await fetchData();
  if (data.success) {
    const {
      result: { auditLog = [] },
    } = data || { result: {} };
    const actionTypes = {};
    const applicationTypes = {};
    auditLog.forEach(({ actionType, applicationType }) => {
      if (actionType) {
        actionTypes[actionType] = 1;
      }
      if (applicationType) {
        applicationTypes[applicationType] = 1;
      }
    });

    return {
      props: {
        ...data,
        ...getDataAfterPagination(
          getFilteredDataBasedOnQuery(auditLog, ctx.query),
          { page: ctx.query.page }
        ),
        actionTypes: Object.keys(actionTypes),
        applicationTypes: Object.keys(applicationTypes),
      },
    };
  }

  return {
    props: props,
  };
};
