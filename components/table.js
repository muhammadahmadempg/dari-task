import moment from "moment";
import { useCallback } from "react";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { Table } from "reactstrap";
import { TABLE_HEADINGS } from "../utils/constants";

export default function DataTable({ auditLog, tableSorting, setTableSorting }) {
  const onSortItem = useCallback(
    (name) => {
      let { fields = [], sortingOptions = [] } = tableSorting || {};
      const index = fields.indexOf(name);
      const sort_by = sortingOptions[index] == "asc" ? "desc" : "asc";
      if (index > -1) {
        fields.splice(index, 1);
        sortingOptions.splice(index, 1);
      }
      fields.unshift(name);
      sortingOptions.unshift(sort_by);
      setTableSorting({ fields, sortingOptions });
    },
    [setTableSorting, tableSorting]
  );

  const onDeleteSortItem = useCallback(
    (name) => {
      const { fields = [], sortingOptions = [] } = tableSorting;
      const index = fields.indexOf(name);
      if (index > -1) {
        fields.splice(index, 1);
        sortingOptions.splice(index, 1);
        setTableSorting({ fields, sortingOptions });
      }
    },
    [tableSorting, setTableSorting]
  );

  const getTableHeadingUi = useCallback(
    ({ name, label }) => {
      const index = tableSorting.fields.indexOf(name);
      const sort_by = tableSorting.sortingOptions[index] || "";
      if (sort_by.toLowerCase() == "desc")
        return (
          <th key={name}>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => onDeleteSortItem(name)}
            >
              {label}{" "}
            </span>
            <FaSortAlphaUp onClick={() => onSortItem(name)} color="blue" />
          </th>
        );
      return (
        <th key={name}>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => onDeleteSortItem(name)}
          >
            {label}{" "}
          </span>
          <FaSortAlphaDown
            color={sort_by.toLowerCase() == "asc" ? "blue" : ""}
            cursor={"pointer"}
            onClick={() => onSortItem(name)}
          />
        </th>
      );
    },
    [onSortItem, onDeleteSortItem, tableSorting]
  );
  return (
    <div>
      <Table>
        <thead>
          <tr>
            {TABLE_HEADINGS.map((item) => getTableHeadingUi({ ...item }))}
          </tr>
        </thead>
        <tbody>
          {auditLog.map((item) => {
            const {
              logId,
              applicationType,
              applicationId,
              actionType,
              actionDetails,
              creationTimestamp,
            } = item;
            const date = moment(creationTimestamp);
            return (
              <tr key={logId}>
                <td>{logId}</td>
                <td>{applicationType || "-"}</td>
                <td>{applicationId || "-"}</td>
                <td>{actionType}</td>
                <td>{actionDetails || "-/-"}</td>
                <td>{date.format("YYYY-MM-DD / HH:MM:ss")}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
