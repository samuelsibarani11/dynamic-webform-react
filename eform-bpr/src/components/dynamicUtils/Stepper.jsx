/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

const Stepper = ({ schema, currentSectionIndex }) => {
  const toProperCase = (text) => {
    return text.replace(/\w\S*/g, (w) =>
      w.replace(/^\w/, (c) => c.toUpperCase())
    );
  };

  const getStepDescription = (index) => {
    return toProperCase(schema[index]?.stepper || `Step ${index + 1}`);
  };

  return (
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
                    currentSectionIndex > index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Stepper;
