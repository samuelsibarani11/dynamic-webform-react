/* eslint-disable no-unused-vars */
import React from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { Label, TextInput } from "flowbite-react";

const SectionC = () => {
  const { values, setFieldValue } = useFormikContext();

  // Helper function to format number with thousand separators
  const formatNumber = (value) => {
    if (!value) return "";
    const parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
  };

  // Helper function to remove formatting from number
  const parseNumber = (value) => {
    return value.replace(/\D/g, "");
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-bold mb-4">C. SUMBER PENGHASILAN</h2>

      {/* Sumber Pendapatan Dari */}
      <div className="mb-4">
        <Label value="Sumber Pendapatan Dari *" />
        <div className="flex gap-4 mt-2">
          <label className="flex items-center">
            <Field type="radio" name="income_source" value="Gaji" />
            <span className="ml-2">Gaji</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="income_source" value="Hasil Usaha" />
            <span className="ml-2">Hasil Usaha</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="income_source" value="Hasil Investasi" />
            <span className="ml-2">Hasil Investasi</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="income_source" value="Lainnya" />
            <span className="ml-2">Lainnya</span>
          </label>
        </div>
        <ErrorMessage
          name="income_source"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Penghasilan / Bulan */}
      <div className="mb-4">
        <Label value="Penghasilan / Bulan *" />
        <div className="flex gap-4 mt-2">
          <label className="flex items-center">
            <Field type="radio" name="income_amount" value="s.d 5jt" />
            <span className="ml-2">s.d 5jt</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="income_amount" value=">5jt s/d 10jt" />
            <span className="ml-2">&gt;5jt s/d 10jt</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="income_amount" value=">10jt" />
            <span className="ml-2">&gt;10jt</span>
          </label>
        </div>
        <ErrorMessage
          name="income_amount"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Sumber Pendapatan Lainnya dan Jumlah */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <Label
            htmlFor="other_income_source"
            value="Sumber Pendapatan Lainnya"
          />
          <Field name="other_income_source">
            {({ field }) => (
              <TextInput
                id="other_income_source"
                placeholder="Sumber Pendapatan Lainnya"
                {...field}
              />
            )}
          </Field>
          <ErrorMessage
            name="other_income_source"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
        <div className="items-center">
          <Label
            htmlFor="other_income_amount"
            value="Jumlah"
            className="mr-4"
          />
          <div className="flex w-full">
            <span className="bg-gray-200 text-gray-600 rounded-l-md px-3 flex items-center">
              Rp.
            </span>
            <Field name="other_income_amount">
              {({ field }) => (
                <TextInput
                  id="other_income_amount"
                  placeholder="1.000.000"
                  className="rounded-l-none"
                  value={formatNumber(field.value)}
                  onChange={(e) => {
                    const parsedValue = parseNumber(e.target.value);
                    setFieldValue(field.name, parsedValue);
                  }}
                />
              )}
            </Field>
          </div>
          <ErrorMessage
            name="other_income_amount"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SectionC;
