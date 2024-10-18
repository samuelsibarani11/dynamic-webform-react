/* eslint-disable no-unused-vars */
import React from "react";
import { ErrorMessage, useFormikContext } from "formik";
import { Label } from "flowbite-react";
import { supabase } from "../../../../lib/helper/supabase";
import { v4 as uuidv4 } from "uuid";
const SectionF = () => {
  const { setFieldValue } = useFormikContext();

  /* Backup
  const handleFileChange = async (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      try {
        // Upload to Supabase
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(public/${file.name}, file);

        if (error) {
          console.error("Upload error:", error.message);
          return; // Exit if upload failed
        }

        // Retrieve the public URL of the uploaded file
        const { data: fileData } = await supabase.storage
          .from("uploads")
          .getPublicUrl(public/${file.name});

        if (fileData.publicUrl) {
          // Set the URL to the form field
          setFieldValue("id_photo_url", fileData.publicUrl);
        } else {
          console.error("Failed to retrieve public URL");
        }
      } catch (uploadError) {
        console.error("Unexpected error during upload:", uploadError.message);
      }
    }
  };
  */

  const handleFileChange = async (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      try {
        // Generate a unique file name using UUID and timestamp
        const uniqueFileName = `${uuidv4()}_${Date.now()}_${file.name}`;

        // Upload to Supabase with the unique file name
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(`public/${uniqueFileName}`, file);

        if (error) {
          console.error("Upload error:", error.message);
          return; // Exit if upload failed
        }

        // Retrieve the public URL of the uploaded file
        const { data: fileData } = await supabase.storage
          .from("uploads")
          .getPublicUrl(`public/${uniqueFileName}`);

        if (fileData.publicUrl) {
          // Set the URL to the form field
          setFieldValue("id_photo_url", fileData.publicUrl);
        } else {
          console.error("Failed to retrieve public URL");
        }
      } catch (uploadError) {
        console.error("Unexpected error during upload:", uploadError.message);
      }
    }
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-bold mb-4">F. Upload KTP</h2>
      <div className="flex-1">
        <Label
          htmlFor="ktp-upload"
          className="block mb-2 text-sm font-medium text-gray-500"
        >
          Upload KTP <span className="text-red-600">*</span>
        </Label>
        <input
          type="file"
          id="ktp-upload"
          name="id_photo_url"
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          onChange={handleFileChange}
        />
        <ErrorMessage
          name="id_photo_url"
          component="div"
          className="text-red-600 text-sm mt-2"
        />
      </div>
    </div>
  );
};

export default SectionF;
