/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useFormikContext, ErrorMessage } from "formik";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../lib/helper/supabase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SectionH = ({ handlePreviousStep }) => {
  const { values, setFieldValue } = useFormikContext();
  const navigate = useNavigate();
  const sigCanvas = useRef(null);

  const clearSignature = () => {
    sigCanvas.current.clear();
    setFieldValue("signature_url", null);
  };

  const saveSignature = () => {
    const dataURL = sigCanvas.current.toDataURL("image/png");
    setFieldValue("signature_url", dataURL);
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting form...");
      console.log("Form values before submission:", values);

      const { data, error } = await supabase.from("loans").insert([
        {
          fullname: values.fullname,
          birth_place: values.birth_place,
          birth_date: values.birth_date,
          gender: values.gender,
          id_number: values.id_number,
          address: values.address,
          domicili_address: values.domicili_address,
          mother_name: values.mother_name,
          email: values.email,
          home_status: values.home_status,
          last_education: values.last_education,
          marital_status: values.marital_status,
          spouse_name: values.spouse_name,
          nationality: values.nationality,
          mobile_number: values.mobile_number,
          religion: values.religion,
          occupation: values.occupation,
          employement_period: values.employement_period,
          office_name: values.office_name,
          job_title: values.job_title,
          office_address: values.office_address,
          income_source: values.income_source,
          income_amount: values.income_amount,
          other_income_source: values.other_income_source,
          other_income_amount: values.other_income_amount,
          plafond: values.plafond,
          tenure: values.tenure,
          loan_purpose: values.loan_purpose,
          id_photo_url: values.id_photo_url,
          selfie_photo_url: values.selfie_photo_url,
          signature_url: values.signature_url,
          status: values.status,
          created_at: new Date().toISOString(), // Add created_at with current timestamp
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success("Data berhasil dikirim!", {
        autoClose: 2000, // Set duration to 2 seconds
      });

      setTimeout(() => {
        window.location.reload(); // Refresh the page after 2 seconds
      }, 2000); // Match the duration of the toast
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-bold mb-4">
        H. TANDA TANGAN & RECAPTCHA <span className="text-red-600">*</span>
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Tanda Tangan
        </label>
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className:
              "border border-gray-300 rounded-lg p-2 h-24 w-full bg-gray-50 mb-2",
          }}
          onEnd={() => saveSignature()}
        />
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={clearSignature}
            className="py-2 px-4 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm"
          >
            Clear
          </button>
        </div>
        <ErrorMessage
          name="signature_url"
          component="div"
          className="text-red-600 text-sm mt-2"
        />
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          onClick={handlePreviousStep}
          className="bg-gray-500 text-white"
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="ml-auto bg-green-500 text-white"
        >
          Submit
        </Button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SectionH;
