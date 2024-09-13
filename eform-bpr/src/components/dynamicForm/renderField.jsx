/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// RenderField.js
import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button, Select, Label, Radio, Textarea } from "flowbite-react";
import "./DynamicForm.css";
import {
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

const RenderField = ({
  field,
  formData,
  handleChange,
  setFormData,
  uploading,
  // signatureData,
  setSignatureData,
}) => {
  const canvasRef = useRef(null);

  // State dan Refs untuk kamera
  const [cameraStream, setCameraStream] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const videoRef = useRef(null);

  /* => CAMERA <=*/
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

  /* => SAME ADDRESS <= */
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

  const handleChangeAdress = (e) => {
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

  /* => FILE UPLOAD <= */
  const { handleFileChange } = useFileUpload(setFormData); // Menggunakan hook upload

  /* => SIGNATURE <= */
  const signatureCanvasRef = useRef(null);

  switch (field.type) {
    case "phone_number":
      return (
        <div>
          <Label htmlFor={field.name} value={field.label + "*"} />
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
        <div>
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

          {/* Menampilkan nama file yang diunggah setelah selesai */}
          {formData[field.name] && !uploading && (
            <p className="mt-2 text-sm text-gray-600">
              File yang diunggah: {formData[field.name].split("/").pop()}
            </p>
          )}
        </div>
      );

    case "address":
      return (
        <div>
          <Label
            htmlFor={field.name}
            value={field.label}
            className="text-gray-700 font-medium mb-2 block"
          />
          <Textarea
            id={field.name}
            name={field.name}
            onChange={handleChangeAdress}
            rows={3}
            required={field.validation?.required}
            value={formData[field.name] || ""}
            disabled={
              field.name === "domicili_address"
                ? formData.domicili_disabled
                : false
            }
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
        </div>
      );

    case "money":
      return (
        <div>
          <Label
            htmlFor={field.name}
            value={field.label}
            className="text-gray-700 font-medium block"
          />
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden mt-1">
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
        <div>
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
        <div>
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
        <div>
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
          <canvas ref={canvasRef} className="hidden" width={640} height={480} />
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
        <div>
          <h5>Signature:</h5>
          <SignatureCanvas
            ref={signatureCanvasRef}
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: "border border-gray-300 rounded",
            }}
            onEnd={() => {
              const signatureURL = signatureCanvasRef.current.toDataURL();
              // console.log("Captured Signature URL:", signatureURL); // Log for debugging
              setSignatureData(signatureURL); // Set signature data
            }}
          />
          <div className="mt-2">
            <Button
              className="btn btn-blue"
              onClick={() => {
                signatureCanvasRef.current.clear();
                clearSignature(signatureCanvasRef, setSignatureData);
              }}
            >
              Clear Signature
            </Button>
          </div>
          {formData.signature && (
            <div className="mt-3">
              <h5>Captured Signature:</h5>
              <img
                width={500}
                src={formData.signature}
                alt="Signature"
                className="border border-gray-300 rounded"
              />
            </div>
          )}
        </div>
      );

    case "list":
      return (
        <div className=" w-full">
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
        <div className=" w-full">
          <ol className="list-inside list-decimal w-full">
            <h5 className="text-2xl font-bold text-center mb-2">
              {field.head}{" "}
            </h5>
            {field.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
          <div className="desc bg-dark">{field.desc}</div>
          <div className="desc">{field.desc2}</div>
        </div>
      );

    case "date": {
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
        <div>
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
    }

    case "email":
      return (
        <div>
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
        <div>
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
        <div>
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
        <div>
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

export default RenderField;
