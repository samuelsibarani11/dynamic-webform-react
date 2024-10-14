/* eslint-disable no-unused-vars */
import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Label, TextInput } from "flowbite-react";

const SectionB = () => {
  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-bold mb-4">B. DATA PEKERJAAN</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bidang Pekerjaan */}
        <div>
          <Label htmlFor="occupation" value="Bidang Pekerjaan *" />
          <Field name="occupation">
            {({ field }) => (
              <TextInput
                id="occupation"
                placeholder="Bidang Pekerjaan"
                {...field}
              />
            )}
          </Field>
          <ErrorMessage
            name="occupation"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Lama Bekerja */}
        <div>
          <Label htmlFor="employement_period" value="Lama Bekerja (Bulan) *" />
          <Field name="employement_period">
            {({ field }) => (
              <TextInput
                id="employement_period"
                placeholder="Lama Bekerja"
                {...field}
                inputMode="numeric" // Ensures numeric keyboard on mobile devices
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Restricts input to numbers only
                }}
              />
            )}
          </Field>

          <ErrorMessage
            name="employement_period"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Nama Kantor */}
        <div>
          <Label htmlFor="office_name" value="Nama Kantor *" />
          <Field name="office_name">
            {({ field }) => (
              <TextInput
                id="office_name"
                placeholder="Nama Kantor"
                {...field}
              />
            )}
          </Field>
          <ErrorMessage
            name="office_name"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Pangkat/Jabatan */}
        <div>
          <Label htmlFor="job_title" value="Pangkat/Jabatan *" />
          <Field name="job_title">
            {({ field }) => (
              <TextInput
                id="job_title"
                placeholder="Pangkat/Jabatan"
                {...field}
              />
            )}
          </Field>
          <ErrorMessage
            name="job_title"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>

        {/* Alamat Kantor */}
        <div className="md:col-span-2">
          <Label htmlFor="office_address" value="Alamat Kantor *" />
          <Field name="office_address">
            {({ field }) => (
              <TextInput
                id="office_address"
                placeholder="Alamat Kantor"
                {...field}
              />
            )}
          </Field>
          <ErrorMessage
            name="office_address"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionB;
