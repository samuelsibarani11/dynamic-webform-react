/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import SectionA from "./general-question/sectionA";
import SectionB from "./general-question/sectionB";
import SectionC from "./general-question/sectionC";
import SectionD from "./general-question/sectionD";
import SectionE from "./general-question/sectionE";
import SectionF from "./general-question/sectionF";
import SectionG from "./general-question/sectionG";
import SectionH from "./general-question/sectionH";

const Eform = () => {
  const [step, setStep] = useState(1);

  const sections = [
    SectionA,
    SectionB,
    SectionC,
    SectionD,
    SectionE,
    SectionF,
    SectionG,
    SectionH,
  ];

  const totalSteps = sections.length;

  const validationSchemas = [
    Yup.object({
      fullname: Yup.string().required("Nama Lengkap wajib diisi"),
      birth_place: Yup.string().required("Tempat Lahir wajib diisi"),
      birth_date: Yup.string().required("Tanggal Lahir wajib diisi"),
      gender: Yup.string().required("Jenis Kelamin wajib diisi"),
      id_number: Yup.string()
        .length(16, "Nomor KTP harus 16 digit")
        .required("Nomor KTP wajib diisi"),
      address: Yup.string().required("Alamat KTP wajib diisi"),
      domicili_address: Yup.string().required("Alamat Domisili wajib diisi"),
      mother_name: Yup.string().required("Nama Gadis Ibu Kandung wajib diisi"),
      home_status: Yup.string().required("Status Rumah wajib diisi"),
      last_education: Yup.string().required("Pendidikan Terakhir wajib diisi"),
      marital_status: Yup.string().required("Status Perkawinan wajib diisi"),
      spouse_name: Yup.string(),
      nationality: Yup.string().required("Kewarganegaraan wajib diisi"),
      mobile_number: Yup.string().required("Nomor HP/WA wajib diisi"),
      religion: Yup.string().required("Agama wajib diisi"),
      email: Yup.string()
        .email("Email tidak valid")
        .required("Email wajib diisi"),
    }),
    Yup.object({
      occupation: Yup.string().required("Bidang Pekerjaan wajib diisi"),
      employement_period: Yup.string().required("Lama Bekerja wajib diisi"),
      office_name: Yup.string().required("Nama Kantor wajib diisi"),
      job_title: Yup.string().required("Pangkat/Jabatan wajib diisi"),
      office_address: Yup.string().required("Alamat Kantor wajib diisi"),
    }),
    Yup.object({
      income_source: Yup.string().required("Sumber Pendapatan wajib diisi"),
      income_amount: Yup.string().required("Penghasilan/Bulan wajib diisi"),
      other_income_source: Yup.string(),
      other_income_amount: Yup.number()
        .typeError("Jumlah harus berupa angka")
        .positive("Jumlah harus positif")
        .nullable(),
    }),
    Yup.object({
      tenure: Yup.string().required("Jenis Simpanan harus dipilih."),
      loan_purpose: Yup.string().required(
        "Sumber Dana Pembukaan harus dipilih."
      ),
      plafond: Yup.number()
        .typeError("Setoran Awal harus berupa angka.")
        .positive("Setoran Awal harus lebih besar dari 0.")
        .required("Setoran Awal harus diisi."),
      spouse_name: Yup.string().required("Nama Ahli Waris harus diisi."),
      status: Yup.number().required(
        "Hubungan Dengan Ahli Waris harus dipilih."
      ),
    }),
    Yup.object({}),
    Yup.object({
      id_photo_url: Yup.string().required("ID Card is required"),
    }),
    Yup.object({
      selfie_photo_url: Yup.string().required("Selfie is required"),
    }),
    Yup.object({
      signature_url: Yup.string().required("Signature is required"),
    }),
  ];

  const handleNextStep = async (validateForm) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setStep(step + 1);
    } else {
      const firstErrorField = Object.keys(errors)[0];
      const errorField = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorField) {
        errorField.focus();
      }
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const getStepDescription = (step) => {
    switch (step) {
      case 1:
        return "Data Umum";
      case 2:
        return "Data Pekerjaan";
      case 3:
        return "Penghasilan";
      case 4:
        return "Buka Rekening ";
      case 5:
        return "Pernyataan ";
      case 6:
        return "Upload KTP";
      case 7:
        return "Selfie";
      case 8:
        return "Tanda Tangan";
      default:
        return "";
    }
  };

  const CurrentSection = sections[step - 1];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* STEPPER */}
      <div className="w-full flex justify-center py-6">
        <div className="w-full max-w-4xl">
          <ol className="flex items-center justify-between w-full">
            {sections.map((_, index) => (
              <li
                key={index}
                className="flex-1 flex flex-col items-center text-center"
              >
                <div className="flex items-center">
                  <span
                    className={`flex items-center justify-center w-8 h-8 border-2 ${
                      step > index + 1
                        ? "bg-blue-600 border-blue-600"
                        : step === index + 1
                        ? "bg-blue-100 border-blue-600"
                        : "bg-gray-100 border-gray-300"
                    } rounded-full lg:h-10 lg:w-10 ${
                      step > index + 1
                        ? "text-white"
                        : step === index + 1
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step > index + 1 ? (
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
                  className={`mt-1 text-xs lg:text-sm step-description ${
                    step === index + 1
                      ? "text-blue-600 font-semibold"
                      : "text-gray-500"
                  } hidden sm:block`}
                  style={{ maxWidth: "100px", textAlign: "center" }}
                >
                  {getStepDescription(index + 1)}
                </span>

                {index < totalSteps - 1 && (
                  <div
                    className={`h-1 w-full ${
                      step > index + 1 ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* FORMS */}
      <div className="flex justify-center w-full">
        <div className="max-w-4xl w-full bg-white p-8 shadow-md">
          <Formik
            initialValues={{
              fullname: "",
              birth_place: "",
              birth_date: "",
              gender: "",
              id_number: "",
              address: "",
              domicili_address: "",
              mother_name: "",
              email: "",
              home_status: "",
              last_education: "",
              marital_status: "",
              spouse_name: "",
              nationality: "",
              mobile_number: "",
              religion: "",
              occupation: "",
              employement_period: "",
              office_name: "",
              job_title: "",
              office_address: "",
              income_source: "",
              income_amount: "",
              other_income_source: "",
              other_income_amount: "",
              plafond: "",
              tenure: "",
              loan_purpose: "",
              id_photo_url: "",
              selfie_photo_url: "",
              signature_url: "",
              status: "",
            }}
            validationSchema={validationSchemas[step - 1]}
          >
            {({ validateForm }) => (
              <Form>
                <CurrentSection
                  handleNextStep={() => handleNextStep(validateForm)}
                  handlePreviousStep={handlePreviousStep}
                />
                <div className="flex justify-between">
                  {/* Conditionally render Previous button */}
                  {step > 1 && step < totalSteps && (
                    <Button
                      type="button"
                      onClick={handlePreviousStep}
                      className="bg-gray-500 text-white"
                    >
                      Previous
                    </Button>
                  )}
                  {step < totalSteps && (
                    <Button
                      type="button"
                      onClick={() => handleNextStep(validateForm)}
                      className="ml-auto bg-blue-500 text-white"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Eform;
