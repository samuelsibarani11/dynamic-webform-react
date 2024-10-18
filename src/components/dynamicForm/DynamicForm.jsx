/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import "./DynamicForm.css";
import sectionTitle from "./sectionTitle.json";
import {
  initializeFormData,
  validateForm,
  submitForm,
  startCamera,
  captureSelfie,
  stopCamera,
  clearSignature,
  useFileUpload,
  handlePhoneNumberInput,
  handleAlphabetInput,
  handleNumberInput,
  formatCurrency,
  parseCurrency,
} from "./formUtils";

import { Button, Select, Label, Radio, Textarea } from "flowbite-react";
import { useParams } from "react-router-dom";
import forms from '../../../public/schemas/Dashboard.json'

const DynamicForm = () => {
  const [schema, setTes] = useState([]);
  const [table, setTable] = useState("");
  const [title, setTitle] = useState("");
  // const title = sectionTitle[0].section_title;
  let { formName } = useParams();



  console.log(formName)

  useEffect(() => {
    const matchedForm = forms.find(form => form.ctaLink === `/${formName}`);
    // const matchedTable = forms.find(form => form.table === `/${formName}`);

    if (matchedForm) {
      const schemaName = matchedForm.schemaName;
      const tableName = matchedForm.table;
      const sectionTitle = matchedForm.title;

      // Fetch Title Name
      setTitle(sectionTitle)

      // Fetch Table Name
      setTable(tableName)

      const schemaPath = `/schemas/${schemaName.split('/').pop()}`;
      fetch(schemaPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load schema: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          setTes(data); // Set the schema from the JSON file
        })
        .catch(error => {
          console.error("Failed to load schema", error);
        });
    } else {
      console.error(`No matching form found for formName: ${formName}`);
    }
  }, [formName]);

  // console.log('schema' + JSON.stringify(schema))
  console.log('table name: ' + table)


  // Validasi jika schema bukan array
  if (!Array.isArray(schema)) {
    console.error("Expected schema to be an array", schema);
    return null;
  }

  // Inisialisasi data form
  const initialFormData = initializeFormData(schema);

  // State untuk data form, error, dan indeks section saat ini
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  // Stepper -> Submit
  const toProperCase = (text) => {
    return text.replace(/\w\S*/g, (w) =>
      w.replace(/^\w/, (c) => c.toUpperCase())
    );
  };

  const getStepDescription = (index) => {
    return toProperCase(schema[index]?.stepper || `Step ${index + 1}`);
  };

  // Handle File (Digunakan Di handleSubmit)
  const { uploading, handleFileChange } = useFileUpload(setFormData); // Menggunakan hook upload

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errors, formIsValid } = validateForm(
      schema,
      currentSectionIndex,
      formData
    );
    console.log("Errors:", errors); // Cek apakah ada error
    console.log("Form is valid:", formIsValid); // Cek apakah form valid

    setFormErrors(errors);

    if (formIsValid) {
      console.log("Form Data:", formData); // Cek data form sebelum submit

      if (currentSectionIndex === schema.length - 1) {
        // Logika upload file dan submit form
        console.log("Submitting form...");

        // Coba untuk submit form
        await submitForm(
          formData,
          schema,
          signatureData,
          setFormData,
          initialFormData,
          setFormErrors,
          setCurrentSectionIndex,
          setSelfie,
          setSignatureData,
          table
        );
      } else {
        // Jika belum di step terakhir, lanjutkan ke step berikutnya
        setCurrentSectionIndex(currentSectionIndex + 1);
      }
    } else {
      console.log("Form not valid. Please check the errors.");
    }
  };

  // State dan Refs untuk kamera
  const [cameraStream, setCameraStream] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // State dan Refs untuk tanda tangan
  const [signatureData, setSignatureData] = useState(null);
  const signatureCanvasRef = useRef(null);

  // Camera
  // Set srcObject ketika cameraStream berubah
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((err) => {
        console.error("Error attempting to play video:", err);
      });
    }
  }, [cameraStream]);

  // Hentikan stream kamera saat komponen unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Handle Change (ada fungsi untuk sama dengan ktp checkbox)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      // Jika checkbox "Sama dengan Alamat KTP" aktif, ubah juga Alamat Domisili saat Alamat KTP diubah
      if (formData.same_as_ktp && name === "address") {
        return {
          ...prevData,
          [name]: value,
          domicili_address: value, // Alamat Domisili mengikuti Alamat KTP
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  // Fungsi agar setelah next auto ke atas
  useEffect(() => {
    // Scroll ke atas halaman setiap kali currentSectionIndex berubah
    window.scrollTo(0, 0);
  }, [currentSectionIndex]);
  const formRef = useRef(null);

  // Address Logic
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prevData) => {
      if (checked && name === "same_as_ktp") {
        // Saat checkbox dicentang, set Alamat Domisili sama dengan Alamat KTP dan disable
        return {
          ...prevData,
          [name]: checked,
          domicili_address: prevData.address, // Isi otomatis Alamat Domisili
          domicili_disabled: true, // Disable Alamat Domisili
        };
      } else if (!checked && name === "same_as_ktp") {
        // Saat checkbox tidak dicentang, enable Alamat Domisili dan kosongkan jika perlu
        return {
          ...prevData,
          [name]: checked,
          domicili_disabled: false, // Enable Alamat Domisili
        };
      }
      return {
        ...prevData,
        [name]: checked,
      };
    });
  };

  // Merender semua field
  const renderField = (field) => {
    switch (field.type) {
      case "phone_number":
        return (
          <div className="mb-4">
            <Label htmlFor={field.name} value={field.label} />
            <input
              type="tel"
              id={field.name}
              name={field.name}
              onChange={(e) => {
                const formattedValue = handlePhoneNumberInput(e.target.value);
                // Update formData
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [field.name]: formattedValue,
                }));
              }}
              required={field.validation?.required}
              className="w-full border border-gray-300 p-2 rounded-xl"
              value={formData[field.name] || ""}
            />
          </div>
        );

      case "file":
        return (
          <div className="mb-4">
            <label
              htmlFor={field.name}
              className="text-gray-700 font-medium mb-2 block"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type="file"
              onChange={(event) => handleFileChange(event, field.name)}
              className={field.style}
            />
            {uploading && <p>Uploading...</p>} {/* Indikator upload */}
            {formData[field.name] && (
              <p className="mt-2 text-sm text-gray-600">
                File yang diunggah: {formData[field.name].split("/").pop()}
              </p>
            )}
          </div>
        );

      case "address":
        return (
          <div className="mb-4">
            <Label
              htmlFor={field.name}
              value={field.label}
              className="text-gray-700 font-medium mb-2 block"
            />
            {field.name === "domicili_address" && (
              <div className="flex items-center mt-2">
                <input
                  id="same_as_ktp"
                  name="same_as_ktp"
                  type="checkbox"
                  onChange={handleCheckboxChange}
                  checked={formData.same_as_ktp || false}
                  className="mr-2 rounded"
                />
                <Label
                  htmlFor="same_as_ktp"
                  value="Sama dengan Alamat KTP"
                  className="text-gray-700 font-medium"
                />
              </div>
            )}
            <Textarea
              id={field.name}
              name={field.name}
              onChange={handleChange}
              rows={3}
              required={field.validation?.required}
              value={formData[field.name] || ""}
              disabled={
                field.name === "domicili_address"
                  ? formData.domicili_disabled
                  : false
              }
            />

          </div>
        );

      case "money":
        return (
          <div className="mb-4">
            <Label
              htmlFor={field.name}
              value={field.label}
              className="text-gray-700 font-medium mb-2 block"
            />
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <span className="bg-gray-200 text-gray-700 px-3 py-2">Rp.</span>
              <input
                type="text" // Ubah ke text untuk memudahkan kontrol input
                id={field.name}
                name={field.name}
                onChange={(e) => {
                  const formattedValue = formatCurrency(e.target.value); // Tampilan diformat
                  const numericValue = parseCurrency(e.target.value); // Simpan sebagai integer
                  handleChange({
                    target: {
                      name: field.name,
                      value: numericValue, // Simpan nilai integer ke formData
                    },
                  });
                  e.target.value = formattedValue; // Tampilkan format uang ke user
                }}
                onInput={(e) => {
                  // Mencegah input non-numerik
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
                required={field.validation?.required}
                className="w-full border-none p-2 rounded-r-xl focus:ring-2 focus:ring-blue-500 transition duration-300"
                value={formatCurrency(formData[field.name]?.toString() || "")} // Tampilkan data terformat
              />
            </div>
          </div>
        );

      case "select":
        return (
          <div className="mb-4">
            <Label htmlFor={field.name} value={field.label} />
            <Select
              id={field.name}
              name={field.name}
              onChange={handleChange}
              required={field.validation?.required}
              value={formData[field.name] || ""}
            >
              <option value="">Pilih...</option>
              {field.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        );

      case "radio":
        return (
          <div className="mb-4">
            <Label value={field.label} />
            <div className="flex space-x-4">
              {" "}
              {/* Tambahkan flex dan space-x untuk membuatnya horizontal */}
              {field.options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <Radio
                    id={`${field.name}-${option.value}`}
                    name={field.name}
                    value={option.value}
                    label={option.label}
                    onChange={handleChange}
                    required={field.validation?.required}
                    checked={formData[field.name] === option.value}
                  />
                  <Label
                    htmlFor={`${field.name}-${option.value}`}
                    className="ml-2"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case "camera":
        return (
          <div className="mb-4">
            {!cameraStream && !selfie && (
              <Button
                className="btn"
                onClick={() => startCamera(setCameraStream)}
              >
                Open Camera
              </Button>
            )}
            {cameraStream && !selfie && (
              <div>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                />
                <div className="mt-2">
                  <Button
                    className="my-3"
                    color="success"
                    onClick={() =>
                      captureSelfie(
                        cameraStream,
                        videoRef,
                        canvasRef,
                        setSelfie,
                        formData,
                        setFormData,
                        setCameraStream
                      )
                    }
                  >
                    Capture Selfie
                  </Button>
                  <Button
                    color="failure"
                    onClick={() =>
                      stopCamera(cameraStream, setCameraStream, videoRef)
                    }
                  >
                    Stop Camera
                  </Button>
                </div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="hidden"
              width={640}
              height={480}
            />
            {selfie && (
              <div className="mt-3">
                <h5>Captured Selfie:</h5>
                <img src={selfie} alt="Selfie" className="w-full" />
              </div>
            )}
          </div>
        );

      case "signature":
        return (
          <div className="mb-4">
            <h5>Signature:</h5>
            <SignatureCanvas
              ref={signatureCanvasRef}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className: "border border-gray-300",
              }}
              onEnd={() => {
                const signatureUrl = signatureCanvasRef.current.toDataURL();
                setSignatureData(signatureUrl);
                setFormData(prevData => ({...prevData, signature_url: signatureUrl}));
              }}
            />
            <div className="mt-2">
              <Button
                color="secondary"
                onClick={() =>
                  clearSignature(signatureCanvasRef, setSignatureData)
                }
              >
                Clear Signature
              </Button>
            </div>
            {signatureData && (
              <div className="mt-3">
                <h5>Captured Signature:</h5>
                <img src={signatureData} alt="Signature" className="w-full" />
              </div>
            )}
          </div>
        );

      case "list":
        return (
          <div className="mb-4 w-full">
            <h5 className="text-lg font-bold">{field.label}</h5>
            <ul className="list-disc w-full">
              {field.items.map((item, index) => (
                <li key={index} className="mb-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );

      case "list-number":
        return (
          <div className="mb-4 w-full">
            <ol className="list-inside list-decimal w-full">
              <h5 className="text-2xl font-bold text-center mb-2">
                {field.head}{" "}
              </h5>
              {field.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
            <div className="desc">{field.desc}</div>
            <div className="desc">{field.desc2}</div>
          </div>
        );

      case "date":
        const today = new Date();

        // Hitung batasan umur 18 tahun dari hari ini
        const minDate = new Date(
          today.getFullYear() - 50,
          today.getMonth(),
          today.getDate()
        )
          .toISOString()
          .split("T")[0];

        // Hitung batasan umur 50 tahun dari hari ini
        const maxDate = new Date(
          today.getFullYear() - 21,
          today.getMonth(),
          today.getDate()
        )
          .toISOString()
          .split("T")[0];

        return (
          <div className="mb-4">
            <Label htmlFor={field.name} value={field.label} />
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              onChange={handleChange}
              required={field.validation?.required}
              className="w-full border border-gray-300 p-2 rounded-xl"
              value={formData[field.name] || ""}
              min={minDate} // Batasan umur minimal (50 tahun lalu)
              max={maxDate} // Batasan umur maksimal (18 tahun lalu)
            />
          </div>
        );

      case "email":
        return (
          <div className="mb-4">
            <Label htmlFor={field.name} value={field.label} />
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              onChange={handleChange}
              required={field.validation?.required}
              className="w-full border border-gray-300 p-2 rounded-xl"
              value={formData[field.name] || ""}
            />
          </div>
        );

      // Karena id_number dan employement number sama isinya, type jsonnya aja yang diganti?
      case "id_number":
        return (
          <div className="mb-4">
            <Label htmlFor={field.name} value={field.label} />
            <input
              type="text" // Menggunakan text agar bisa memodifikasi input
              id={field.name}
              name={field.name}
              maxLength={16}
              onChange={(e) => {
                const formattedValue = handleNumberInput(e.target.value);

                // Update formData
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [field.name]: formattedValue,
                }));
              }}
              required={field.validation?.required}
              className="w-full border border-gray-300 p-2 rounded-xl"
              value={formData[field.name] || ""}
            />
          </div>
        );

      case "employement_period":
        return (
          <div className="mb-4">
            <Label htmlFor={field.name} value={field.label} />
            <input
              type="text" // Menggunakan text agar bisa memodifikasi input
              id={field.name}
              name={field.name}
              onChange={(e) => {
                const formattedValue = handleNumberInput(e.target.value);

                // Update formData
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [field.name]: formattedValue,
                }));
              }}
              required={field.validation?.required}
              className="w-full border border-gray-300 p-2 rounded-xl"
              value={formData[field.name] || ""}
            />
          </div>
        );

      default:
        return (
          <div className="mb-4">
            <Label htmlFor={field.name} value={field.label} />
            <input
              type="text"
              id={field.name}
              name={field.name}
              onChange={(e) => {
                const formattedValue = handleAlphabetInput(e.target.value);

                // Update formData
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  [field.name]: formattedValue,
                }));
              }}
              required={field.validation?.required}
              className="w-full border border-gray-300 p-2 rounded-xl"
              value={formData[field.name] || ""}
            />
          </div>
        );
    }
  };

  const currentSection = schema[currentSectionIndex];

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
                      className={`flex items-center justify-center w-8 h-8 border-2 ${currentSectionIndex > index
                        ? "bg-blue-600 border-blue-600"
                        : currentSectionIndex === index
                          ? "bg-blue-100 border-blue-600"
                          : "bg-gray-100 border-gray-300"
                        } rounded-full lg:h-10 lg:w-10 ${currentSectionIndex > index
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
                    className={`mt-1 text-xs lg:text-sm ${currentSectionIndex === index
                      ? "text-blue-600 font-semibold"
                      : "text-gray-500"
                      } hidden sm:inline`}
                    style={{ maxWidth: "100px", textAlign: "center" }}
                  >
                    {getStepDescription(index)}
                  </span>

                  {index < schema.length - 1 && (
                    <div
                      className={`h-1 w-full ${currentSectionIndex > index
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
                    Kembali
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploading} // Disable tombol jika masih uploading
                  >
                    {currentSectionIndex === schema.length - 1
                      ? "Submit"
                      : "Lanjut"}
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

export default DynamicForm;
