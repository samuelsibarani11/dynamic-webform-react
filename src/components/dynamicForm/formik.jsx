/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";

import sectionTitle from "./sectionTitle.json";
import { Button, Select, Label, Radio, Textarea } from "flowbite-react";

const formik = ({ schema }) => {
  const { uploading, handleFileChange } = useFileUpload(setFormData); // Menggunakan hook upload
  const [formErrors, setFormErrors] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const currentSection = schema[currentSectionIndex];
  const title = sectionTitle[0].section_title;

  const toProperCase = (text) => {
    return text.replace(/\w\S*/g, (w) =>
      w.replace(/^\w/, (c) => c.toUpperCase())
    );
  };
  const getStepDescription = (index) => {
    return toProperCase(schema[index]?.stepper || `Step ${index + 1}`);
  };
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
        <div className="w-full flex justify-center py-6">
          <div className="w-full max-w-4xl">
            <ol className="flex items-center justify-between w-full">
              {schema.map((section, index) => (
                <li
                  key={index}
                  className="flex-1 flex flex-col items-center text-center"
                >
                  <div className="flex items-center">
                    <span
                      className={`flex items-center justify-center w-8 h-8 border-2 ${
                        currentSectionIndex > index
                          ? "bg-blue-600 border-blue-600"
                          : currentSectionIndex === index
                          ? "bg-blue-100 border-blue-600"
                          : "bg-gray-100 border-gray-300"
                      } rounded-full lg:h-10 lg:w-10 ${
                        currentSectionIndex > index
                          ? "text-white"
                          : currentSectionIndex === index
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    >
                      {currentSectionIndex > index ? (
                        <svg
                          className="w-3 h-3 lg:w-4 lg:h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 16 12"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M1 5.917 5.724 10.5 15 1.5"
                          />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </span>
                  </div>

                  <span
                    className={`mt-1 text-xs lg:text-sm ${
                      currentSectionIndex === index
                        ? "text-blue-600 font-semibold"
                        : "text-gray-500"
                    } hidden sm:inline`}
                    style={{ maxWidth: "100px", textAlign: "center" }}
                  >
                    {getStepDescription(index)}
                  </span>

                  {index < schema.length - 1 && (
                    <div
                      className={`h-1 w-full ${
                        currentSectionIndex > index
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* FORM */}
        <div className="w-full max-w-4xl bg-white p-8 shadow-xl mt-8 rounded-2xl my-8">
          <form onSubmit={handleSubmit}>
            {currentSection && (
              <>
                <h1 className="text-lg font-bold mb-4">
                  {currentSection.title}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentSection.fields.map((field, index) => (
                    <div key={index} className="form-group">
                      {renderField(field)}
                      {formErrors[field.name] && (
                        <p className="text-red-500">{formErrors[field.name]}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <Button
                    color="gray"
                    onClick={() =>
                      setCurrentSectionIndex(
                        Math.max(currentSectionIndex - 1, 0)
                      )
                    }
                    disabled={currentSectionIndex === 0}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading} // Disable tombol jika masih uploading
                  >
                    {currentSectionIndex === schema.length - 1
                      ? "Submit"
                      : "Next"}
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default formik;
