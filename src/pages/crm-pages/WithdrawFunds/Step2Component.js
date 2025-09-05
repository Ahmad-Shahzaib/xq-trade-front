import React from "react";
import { Field, ErrorMessage } from "formik";
import { Form, FormGroup, Label, Input, Alert } from "reactstrap";

const Step2Component = ({ selectedWithdrawMethod }) => {
  return (
    <Form>
      {selectedWithdrawMethod?.form?.form_data &&
        Object.keys(selectedWithdrawMethod.form.form_data).map((key) => {
          const field = selectedWithdrawMethod.form.form_data[key];
          return (
            <FormGroup key={key}>
              <Label for={key}>
                {field.label
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(" ")}
              </Label>
              {field.type === "file" ? (
                <Field
                  name={key}
                  render={({ field, form }) => (
                    <Input
                      type="file"
                      name={key}
                      onChange={(event) => {
                        form.setFieldValue(key, event.currentTarget.files[0]);
                      }}
                    />
                  )}
                />
              ) : (
                <Field
                  as={Input}
                  type={field.type}
                  name={key}
                  required={field.is_required === "required"}
                />
              )}
              <ErrorMessage name={key} component="div" className="text-danger" />
            </FormGroup>
          );
        })}
    </Form>
  );
};


export default Step2Component;