/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import RenderField from "./renderField";
import sectionTitle from "./sectionTitle.json";
import "./Dynamicform.css";
import Stepper from "./Stepper";

import {
  initializeFormData,
  validateForm,
  submitForm,
  useFileUpload,
} from "./formUtils";

import { Button } from "flowbite-react";

const DynamicForm = ({ schema }) => {
  // const [name, setName] = useState("");
  // const [error, setError] = useState("");

  const title = sectionTitle[0].section_title;

  if (!Array.isArray(schema)) {
    console.error("Expected schema to be an array", schema);
    return null;
  }

  const initialFormData = initializeFormData(schema);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const { uploading } = useFileUpload(setFormData);

  const currentSection = schema[currentSectionIndex];

  const isFileUploaded = currentSection.fields.every(
    (field) =>
      field.type !== "file" || // Ignore non-file fields
      (formData[field.name] && formData[field.name] !== "") // Check if file is uploaded
  );

  // State dan Refs untuk tanda tangan
  const [signatureData, setSignatureData] = useState(null);

  useEffect(() => {
    if (signatureData) {
      setFormData((prevData) => ({
        ...prevData,
        signature_url: signatureData, // tambahkan signatureData ke formData
      }));
    }
  }, [signatureData, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errors, formIsValid } = validateForm(
      schema,
      currentSectionIndex,
      formData
    );

    // Error Debugging
    // console.log("Errors:", errors);
    // console.log("Form is valid:", formIsValid);

    setFormErrors(errors);

    if (formIsValid) {
      // console.log("Form Data:", formData);

      if (currentSectionIndex === schema.length - 1) {
        await submitForm(
          schema,
          formData,
          signatureData, // Pass the signatureData here
          initialFormData,
          setFormData,
          setFormErrors,
          setCurrentSectionIndex,
          setSignatureData // Pass setSignatureData here
        );
      } else {
        // Proceed to the next step
        setCurrentSectionIndex(currentSectionIndex + 1);
      }
    } else {
      console.log("Form not valid. Please check the errors.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSectionIndex]);

  return (
    <>
      <div>
        {/* SECTION TITLE */}
        <h1 className="text-2xl bg-gray-100 text-center form-text font-bold pb-6 py-6">
          {title}
        </h1>
      </div>
      <div className=" bg-gray-100 flex flex-col items-center px-4">
        {/* STEPPER */}
        <Stepper schema={schema} currentSectionIndex={currentSectionIndex} />

        {/* Form */}
        <div className="w-full max-w-4xl bg-white p-8 shadow-xl mt-8 rounded-2xl my-8">
          <form onSubmit={handleSubmit} className="w-full max-w-4xl">
            <>
              <h1 className="text-lg font-bold mb-4">
                {currentSection.title} *
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentSection.fields.map((field, index) => (
                  <div key={index} className="form-group">
                    <RenderField
                      field={field}
                      formData={formData}
                      handleChange={handleChange}
                      setFormData={setFormData}
                      uploading={uploading}
                      setSignatureData={setSignatureData}
                    />
                    {formErrors[field.name] && (
                      <div className="text-red-600 text-sm">
                        {formErrors[field.name]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* BUTTON */}
              <div className="flex justify-between mt-6">
                {currentSectionIndex > 0 && (
                  <Button
                    type="button"
                    color="gray"
                    onClick={() =>
                      setCurrentSectionIndex(currentSectionIndex - 1)
                    }
                  >
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className={`${currentSectionIndex === 0 ? "ml-auto" : ""}`}
                  disabled={uploading || !isFileUploaded}
                >
                  {currentSectionIndex === schema.length - 1
                    ? "Submit"
                    : "Next"}
                </Button>
              </div>
            </>
          </form>
        </div>
      </div>
    </>
  );
};

export default DynamicForm;
