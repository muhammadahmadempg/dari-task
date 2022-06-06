import _ from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import Search from "../components/search";
import DataTable from "../components/table";
import { getFilteredDataBasedOnQuery } from "../utils/helperFunctions";
import { fetchData } from "../utils/networkLayer";
export default function IndexPage({
  actionTypes,
  applicationTypes,
  filteredData: filtered_data,
  result: { auditLog = [] } = {},
}) {
  const [filteredData, setFilteredData] = useState(filtered_data || []);
  const [tableSorting, setTableSorting] = useState({
    fields: [],
    sortingOptions: [],
  });
  const router = useRouter();
  const { query } = router;
  useEffect(() => {
    const data = getFilteredDataBasedOnQuery(auditLog, query);

    setFilteredData(
      _.orderBy([...data], tableSorting.fields, tableSorting.sortingOptions)
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
    const filteredData = getFilteredDataBasedOnQuery(auditLog, ctx.query);

    return {
      props: {
        ...data,
        filteredData,
        actionTypes: Object.keys(actionTypes),
        applicationTypes: Object.keys(applicationTypes),
      },
    };
  }

  return {
    props: props,
  };
};
