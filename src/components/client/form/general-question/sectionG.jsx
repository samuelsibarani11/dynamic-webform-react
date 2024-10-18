/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { useFormikContext } from "formik";
import { supabase } from "../../../../lib/helper/supabase";

const SectionG = () => {
  const [cameraStream, setCameraStream] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { values, setFieldValue } = useFormikContext(); // Accessing setFieldValue from useFormikContext

  useEffect(() => {
    // Log a message when SectionG is rendered
    console.log("Rendering SectionG");

    // Log all values from the form
    console.log("Form values:", values);

    // Cleanup camera stream on unmount
    return () => {
      if (cameraStream) {
        const tracks = cameraStream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [cameraStream, values]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing the camera", error);
    }
  };

  const captureSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (blob) {
        // Create a unique filename for the selfie
        const filename = `selfie_${Date.now()}.jpg`;

        // Upload the selfie to Supabase
        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(`selfie_photo/${filename}`, blob, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error.message);
        } else {
          // Retrieve the public URL for the uploaded selfie
          const { data: fileData } = await supabase.storage
            .from("uploads")
            .getPublicUrl(`selfie_photo/${filename}`);

          if (fileData.publicUrl) {
            // Set the public URL in the Formik field
            setFieldValue("selfie_photo_url", fileData.publicUrl);

            // Update the selfie preview
            setSelfie(fileData.publicUrl);
          } else {
            console.error("Failed to retrieve public URL");
          }
        }
      }
    }, "image/jpeg");
  };

  const stopCamera = () => {
    if (cameraStream) {
      const tracks = cameraStream.getTracks();
      tracks.forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-bold mb-4">G. Selfie (memegang KTP)</h2>
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-auto border border-gray-300 rounded-lg"
          style={{ display: cameraStream ? "block" : "none" }}
        ></video>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        {selfie && (
          <img
            src={selfie}
            alt="Selfie"
            className="w-full h-auto mt-4 border border-gray-300 rounded-lg"
          />
        )}
      </div>
      <div className="flex items-center mt-2 gap-4">
        <button
          type="button"
          className="py-2 px-4 text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm"
          onClick={() => {
            if (cameraStream) {
              captureSelfie();
              stopCamera();
            } else {
              startCamera();
            }
          }}
        >
          {cameraStream ? "Capture Selfie" : "Open Camera"}
        </button>
        {cameraStream && (
          <button
            type="button"
            className="py-2 px-4 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm"
            onClick={stopCamera}
          >
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
};

export default SectionG;
