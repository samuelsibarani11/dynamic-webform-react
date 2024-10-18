/* eslint-disable no-unused-vars */
import { supabase } from "../../lib/helper/supabase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Import uuid untuk nama file unik
import Swal from 'sweetalert2';


// Fungsi untuk upload file
export const useFileUpload = (setFormData) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event, fieldName) => {
    const file = event.currentTarget.files[0];
    if (file) {
      try {
        setUploading(true); // Mulai proses upload

        // Buat nama file yang unik
        const uniqueFileName = `${uuidv4()}_${Date.now()}_${file.name}`;

        // Upload ke Supabase
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(`public/${uniqueFileName}`, file);

        if (error) {
          console.error("Upload error:", error.message);
          setUploading(false);
          return;
        }

        // Dapatkan public URL dari file yang diupload
        const { data: fileData } = supabase.storage
          .from("uploads")
          .getPublicUrl(`public/${uniqueFileName}`);

        if (fileData.publicUrl) {
          setFormData((prevData) => ({
            ...prevData,
            [fieldName]: fileData.publicUrl, // Simpan URL ke form
          }));
        } else {
          console.error("Gagal mendapatkan public URL");
        }

        setUploading(false); // Upload selesai
      } catch (uploadError) {
        console.error("Unexpected error during upload:", uploadError.message);
        setUploading(false);
      }
    }
  };

  return { uploading, handleFileChange };
};

// Fungsi untuk inisialisasi data form
export const initializeFormData = (schema) => {
  return schema.reduce((acc, section) => {
    if (section.fields) {
      section.fields.forEach((field) => {
        if (field.type === "checkbox") {
          acc[field.name] = false;
        } else {
          acc[field.name] = "";
        }
      });
    }
    return acc;
  }, {});
};

// Fungsi untuk validasi form
export const validateForm = (schema, currentSectionIndex, formData) => {
  let errors = {};
  let formIsValid = true;

  const currentSection = schema[currentSectionIndex];
  if (currentSection.fields) {
    currentSection.fields.forEach((field) => {
      const fieldValue = formData[field.name];
      const fieldLabel = field.label || field.name;

      // Check if the field is required
      if (field.validation?.required || field.required) {
        if (!fieldValue) {
          formIsValid = false;
          errors[field.name] = `${fieldLabel} wajib diisi`;
        }
      }

      // Additional validation based on field type
      switch (field.type) {
        case 'email':
          if (fieldValue && !/\S+@\S+\.\S+/.test(fieldValue)) {
            formIsValid = false;
            errors[field.name] = `${fieldLabel} harus berupa email yang valid`;
          }
          break;
        case 'phone_number':
          if (fieldValue && !/^[0-9]{10,15}$/.test(fieldValue)) {
            formIsValid = false;
            errors[field.name] = `${fieldLabel} harus berupa nomor telepon yang valid`;
          }
          break;
        case 'id_number':
          if (fieldValue && !/^[0-9]{16}$/.test(fieldValue)) {
            formIsValid = false;
            errors[field.name] = `${fieldLabel} harus terdiri dari 16 digit angka`;
          }
          break;
        case 'money':
          if (fieldValue && !/^[0-9]+$/.test(fieldValue)) {
            formIsValid = false;
            errors[field.name] = `${fieldLabel} harus berupa angka`;
          }
          break;
        case 'camera':
          if (!formData.selfie_photo_url) {
            formIsValid = false;
            errors[field.name] = `${fieldLabel} wajib diambil`;
          }
          break;
        case 'signature':
          if (!formData.signature_url) {
            formIsValid = false;
            errors[field.name] = `${fieldLabel} wajib diisi`;
          }
          break;
        case 'file':
          if (!formData[field.name]) {
            formIsValid = false;
            errors[field.name] = `${fieldLabel} wajib diunggah`;
          }
          break;
        // Add more cases for other field types as needed
      }
    });
  }

  return { errors, formIsValid };
};


// Fungsi untuk memulai kamera
export const startCamera = async (setCameraStream) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    setCameraStream(stream);
  } catch (err) {
    console.error("Error accessing camera: ", err);
    alert("Unable to access camera. Please check your camera settings.");
  }
};

// Fungsi untuk menangkap selfie (ganti ke supabase storage)
export const captureSelfie = async (
  cameraStream,
  videoRef,
  canvasRef,
  setSelfie,
  formData,
  setFormData,
  setCameraStream // Include the camera stream to stop it after capturing
) => {
  if (!videoRef.current || !canvasRef.current) {
    console.error("Video or canvas reference is not available.");
    return;
  }

  const video = videoRef.current;
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the video frame to the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the canvas content to a Blob
  canvas.toBlob(async (blob) => {
    if (blob) {
      // Create a unique filename for the selfie
      const filename = `selfie_${Date.now()}.jpg`;

      try {
        // Upload the selfie to Supabase
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(`selfie_photo/${filename}`, blob, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error.message);
          return;
        }

        // Retrieve the public URL for the uploaded selfie
        const { data: fileData } = await supabase.storage
          .from("uploads")
          .getPublicUrl(`selfie_photo/${filename}`);

        if (fileData.publicUrl) {
          // Set the public URL as the captured selfie URL in the form
          setFormData((prevState) => ({
            ...prevState,
            selfie_photo_url: fileData.publicUrl,
          }));

          // Update the selfie preview with the public URL
          setSelfie(fileData.publicUrl);

          // Optionally stop the camera after capturing the selfie
          stopCamera(cameraStream, setCameraStream, videoRef);
        } else {
          console.error("Failed to retrieve public URL");
        }
      } catch (uploadError) {
        console.error("Unexpected error during upload:", uploadError.message);
      }
    }
  }, "image/jpeg");
};

// Fungsi untuk menghentikan kamera dan membersihkan video stream
export const stopCamera = (cameraStream, setCameraStream, videoRef) => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
  }

  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
};

// Fungsi untuk menghapus signature
export const clearSignature = (signatureCanvasRef, setSignatureData) => {
  signatureCanvasRef.current.clear();
  setSignatureData(null);
};

// Phone Number Logic
export function handlePhoneNumberInput(value) {
  // Mengganti 0 di awal dengan 62
  if (value.startsWith("0")) {
    value = "62" + value.slice(1);
  }

  // Validasi hanya angka
  value = value.replace(/\D/g, "");

  return value;
}

// String Only Logic
export function handleAlphabetInput(value) {
  // Pastikan nilai adalah string
  value = String(value);

  // Hanya izinkan huruf (a-z, A-Z) dan spasi
  value = value.replace(/[^a-zA-Z\s]/g, "");

  return value;
}

// Number Only Logic
export function handleNumberInput(value) {
  // Pastikan nilai adalah string
  value = String(value);

  // Hanya izinkan angka (0-9)
  value = value.replace(/[^0-9]/g, "");

  return value;
}

// Format Money Logic
export const formatCurrency = (value) => {
  // Menghapus karakter non-digit
  const numericValue = value.replace(/\D/g, "");

  // Memformat ke format ribuan
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

export const parseCurrency = (value) => {
  // Menghapus semua karakter non-digit dan mengembalikan sebagai integer
  return parseInt(value.replace(/\D/g, ""), 10) || 0;
};


// Fungsi untuk submit form
export const submitForm = async (
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
) => {
  // Filter out 'list' type fields from formData
  const filteredFormData = Object.keys(formData).reduce((acc, key) => {
    const field = schema
      .flatMap((section) => section.fields || [])
      .find((field) => field.name === key);

    if (field && field.type !== "list") {
      acc[key] = formData[key];
    }
    return acc;
  }, {});

  try {
    const { data, error } = await supabase.from(table).insert([
      {
        ...filteredFormData,
        signature_url: signatureData,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    // Show success alert
    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data berhasil dikirim!',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });

    console.log("Data berhasil dikirim:", data);
    setFormData(initialFormData);
    setFormErrors({});
    setCurrentSectionIndex(0);
    setSelfie(null);
    setSignatureData(null);
  } catch (error) {
    console.error("Error inserting data:", error.message);
    // Show error alert
    await Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal mengirim data. Silakan coba lagi.',
    });
  }
};