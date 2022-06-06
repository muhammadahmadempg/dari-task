import { useFormik } from "formik";
import moment from "moment";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
const queryString = require("querystring");
const getCurrentDate = () => {
  const date = moment();
  date.hours(23);
  date.minutes(59);
  date.seconds(59);
  return `${date.format("YYYY-MM-DD")}`;
};
export default function Search({ actionTypes, applicationTypes }) {
  const router = useRouter();
  const {
    to_date = "",
    from_date = "",
    application_id = "",
    action_type = "",
    application_type = "",
  } = router.query;

  const onSubmit = useCallback(
    (values) => {
      const {
        to_date,
        from_date,
        application_id,
        action_type,
        application_type,
      } = values || {};

      const toBePushed = {
        ...(!!to_date && { to_date }),
        ...(!!from_date && { from_date }),
        ...(!!application_id && { application_id }),
        ...(!!action_type && { action_type }),
        ...(!!application_type && { application_type }),
      };
      if (Object.keys(toBePushed || {}).length > 0) {
        router.replace(
          `/?${queryString.stringify({ ...toBePushed, page: 1 })}`,
          undefined,
          {
            shallow: true,
          }
        );
      } else {
        router.replace("/", undefined, { shallow: true });
      }
    },
    [router]
  );
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      to_date,
      from_date,
      action_type,
      application_type,
      application_id,
    },
    onSubmit: onSubmit,
  });

  const getOptions = useCallback(
    (data) => (
      <>
        {" "}
        <option value={""}>Please Select</option>
        {data.map((item) => {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          );
        })}
      </>
    ),
    []
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={2}>
          <FormGroup>
            <Label size="sm">Employee Name</Label>
            <Input size={"sm"} disabled placeholder="N/A" />
          </FormGroup>
        </Col>

        <Col md={2}>
          <FormGroup>
            <Label size="sm">Action Type</Label>
            <Input
              value={values.action_type}
              onChange={handleChange}
              name="action_type"
              type="select"
              placeholder="Action Type"
              size={"sm"}
            >
              {getOptions(actionTypes)}
            </Input>
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label size="sm">Application Type</Label>
            <Input
              type="select"
              onChange={handleChange}
              name="application_type"
              value={values.application_type}
              placeholder="Application Type"
              size={"sm"}
            >
              {getOptions(applicationTypes)}
            </Input>
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label size="sm">From Date</Label>
            <Input
              type="datetime-local"
              onChange={handleChange}
              name="from_date"
              value={values.from_date}
              placeholder="From Date"
              size={"sm"}
              max={getCurrentDate()}
            />
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Label size="sm">To Date</Label>
            <Input
              type="datetime-local"
              onChange={handleChange}
              name="to_date"
              value={values.to_date}
              placeholder="To Date"
              size={"sm"}
              max={"2022-01-31T23:59"}
            />
          </FormGroup>
        </Col>

        <Col md={2}>
          <FormGroup>
            <Label size="sm">Application Id</Label>
            <Input
              type="text"
              onChange={handleChange}
              name="application_id"
              placeholder="Application Id"
              value={values.application_id}
              size="sm"
            />
          </FormGroup>
        </Col>
        <Col md={2}>
          <FormGroup>
            <Input
              className="btn btn-success mt-4"
              value={"Search Logger"}
              type="submit"
              size={"sm"}
            />
          </FormGroup>
        </Col>
      </Row>
    </Form>
  );
}
