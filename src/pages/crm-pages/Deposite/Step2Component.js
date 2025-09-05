import React, { useEffect, useState } from "react";
import { Field, ErrorMessage } from "formik";
import { FormGroup, Label, Input } from "reactstrap";
import { useTranslation } from "react-i18next";

const Step2Component = ({ selectedGateway, setFieldValue, formValues }) => {
  const [description, setDescription] = useState("");

  // console.log('des', description);

  const { t } = useTranslation()
  useEffect(() => {
    if (selectedGateway?.method?.description) {
      let html = selectedGateway.method.description;

      // Replace known phrases inside the HTML with translations
      html = html.replace(
        /Please transfer USDT to our official wallet address\s*:/i,
        t("usdt_transfer_instruction")
      );

      setDescription(html);
    }
  }, [selectedGateway, t]);
const isMobile = window.innerWidth <= 768;
  return (
    <>
      <div
        id="depositDescription"
        dangerouslySetInnerHTML={{ __html: description }}
       
      ></div>

      {selectedGateway?.method?.forms?.form_data &&
        Object.keys(selectedGateway?.method?.forms?.form_data).map((key) => {
          const field = selectedGateway?.method?.forms?.form_data[key];
          return (
            <FormGroup key={key} style={
              isMobile ? { marginBottom: "1rem" } : { marginBottom: "2rem" }
            }>
              <Label for={key}>
                {t(
                  field.label
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ")
                )}
              </Label>

              {field.type === "file" ? (
                <Input
                  type="file"
                  id={key}
                  name={key}
                  onChange={(event) => {
                    setFieldValue(key, event.target.files[0]);
                  }}
                />
              ) : (
                <Field
                  as={Input}
                  id={key}
                  type={field.type}
                  name={key}
                  required={field.is_required === "required"}
                />
              )}
              <ErrorMessage name={key} component="div" className="text-danger" />
            </FormGroup>
          );
        })}
    </>
  );
};

export default Step2Component;
