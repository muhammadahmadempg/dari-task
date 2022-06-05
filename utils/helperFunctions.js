export const getFilteredDataBasedOnQuery = (auditLog, query) => {
  let data = [...auditLog];
  const { action_type, application_id, application_type, to_date, from_date } =
    query;
  if (action_type) {
    data = data.filter(({ actionType }) => actionType === action_type);
  }
  if (application_type) {
    data = data.filter(
      ({ applicationType }) => applicationType === application_type
    );
  }
  if (application_id) {
    data = data.filter(({ applicationId }) => applicationId == application_id);
  }

  if (to_date && from_date) {
    data = data.filter(({ creationTimestamp }) => {
      const date = new Date(creationTimestamp).getTime();
      const toDate = new Date(to_date).getTime();
      const fromDate = new Date(from_date).getTime();
      return date >= fromDate && date <= toDate;
    });
  }
  return data;
};
