/* eslint-disable no-unused-vars */
import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Label, TextInput } from "flowbite-react";

const SectionD = () => {
  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-bold mb-4">D. DATA PEMBUKAAN REKENING</h2>

      {/* Jenis Simpanan */}
      <div className="mb-4">
        <Label value="Jenis Simpanan *" />
        <div className="flex gap-4 mt-2">
          <label className="flex items-center">
            <Field type="radio" name="tenure" value="Gaji" />
            <span className="ml-2">Gaji</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="tenure" value="Hasil Usaha" />
            <span className="ml-2">Hasil Usaha</span>
          </label>
        </div>
        <ErrorMessage
          name="tenure"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Sumber Dana Pembukaan */}
      <div className="mb-4">
        <Label value="Sumber Dana Pembukaan *" />
        <div className="flex gap-4 mt-2">
          <label className="flex items-center">
            <Field type="radio" name="loan_purpose" value="Tabungan" />
            <span className="ml-2">Tabungan</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="loan_purpose" value="Deposito" />
            <span className="ml-2">Deposito</span>
          </label>
        </div>
        <ErrorMessage
          name="loan_purpose"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Setoran Awal */}
      <div className="items-center mb-4">
        <Label htmlFor="plafond" value="Setoran Awal" className="mr-4" />
        <div className="flex w-full">
          <span className="bg-gray-200 text-gray-600 rounded-l-md px-3 flex items-center">
            Rp.
          </span>
          <Field name="plafond">
            {({ field }) => (
              <TextInput
                id="plafond"
                placeholder="1.000.000"
                className="rounded-l-none"
                {...field}
              />
            )}
          </Field>
        </div>
        <ErrorMessage
          name="plafond"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Nama Ahli Waris */}
      <div className="mb-4">
        <Label htmlFor="spouse_name" value="Nama Ahli Waris" />
        <Field
          name="spouse_name"
          as={TextInput}
          placeholder="Nama Lengkap"
          className="mt-1"
        />
        <ErrorMessage
          name="spouse_name"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Hubungan Dengan Ahli Waris */}
      <div className="mb-4">
        <Label value="Hubungan Dengan Ahli Waris *" />
        <div className="flex gap-4 mt-2">
          <label className="flex items-center">
            <Field type="radio" name="status" value="1" />
            <span className="ml-2">Suami</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="status" value="2" />
            <span className="ml-2">Istri</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="status" value="3" />
            <span className="ml-2">Anak</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="status" value="4" />
            <span className="ml-2">Lainnya</span>
          </label>
        </div>
        <ErrorMessage
          name="status"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </div>
  );
};

export default SectionD;
