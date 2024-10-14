/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useFormikContext } from "formik";

const SectionE = () => {
  const { values } = useFormikContext();

  // Log values to check if they are being received correctly
  console.log("Rendering SectionD", values);

  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-bold mb-4">E. PERNYATAAN</h2>
      <p className="mb-2 font-semibold">
        Sehubungan dengan pengisian data diatas, saya menyatakan sebagai
        berikut:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Data yang saya sampaikan adalah benar.</li>
        <li>
          Dana yang telah saya setor tidak berasal dari dan/atau untuk tujuan
          Pencucian Uang (Money Laundering) dan Pendanaan Terorisme.
        </li>
        <li>Marketing dilarang menerima uang tunai dari nasabah.</li>
        <li>
          Akan mematuhi seluruh ketentuan dan syarat umum pembukaan rekening
          yang berlaku di PT. BPR Tata Asia dengan segala perubahannya nanti.
        </li>
        <li>
          Pencairan Deposito sebelum tanggal jatuh tempo akan dikenakan denda
          oleh bank sebesar 5% dari nominal deposito secara prorata.
        </li>
      </ul>
    </div>
  );
};

export default SectionE;
