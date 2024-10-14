/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Field, ErrorMessage } from "formik";
import { Label, TextInput, Select } from "flowbite-react";
import $ from "jquery";


const SectionA = ({ values }) => {
  return (
    <>
      {/* field nama lengkap */}
      <div>
        <h2 className="text-lg font-bold mb-4">A. DATA UMUM</h2>
        <Label htmlFor="fullname" value="Nama Lengkap" />
        <Field
          name="fullname"
          as={TextInput}
          placeholder="Nama Lengkap"
          className="mt-1"
        />
        <ErrorMessage
          name="fullname"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* field tempat tanggal lahir */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birth_place" value="Tempat & Tgl Lahir" />
          <Field
            name="birth_place"
            as={TextInput}
            placeholder="Tempat/Nama Kota"
            className="mt-1"
          />
          <ErrorMessage
            name="birth_place"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
        <div>
          <Field
            name="birth_date"
            type="date"
            as={TextInput}
            className="mt-7"
          />
          <ErrorMessage
            name="birth_date"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
      </div>

      {/* Jenis Kelamin */}
      <div>
        <Label htmlFor="gender" value="Jenis Kelamin" />
        <div className="flex gap-4">
          <label className="flex items-center">
            <Field type="radio" name="gender" value="Pria" className="mr-2" />
            <span>Pria</span>
          </label>
          <label className="flex items-center">
            <Field type="radio" name="gender" value="Wanita" className="mr-2" />
            <span>Wanita</span>
          </label>
        </div>
        <ErrorMessage
          name="gender"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Dokumen Identitas */}
      <div>
        <Label htmlFor="id_number" value="Dokumen Identitas" />
        <div className="grid grid-cols-2 gap-4">
          <Field name="id_type" as={Select} className="mt-1">
            <option value="KTP">KTP</option>
            <option value="SIM">SIM</option>
          </Field>
          <Field
            name="id_number"
            as={TextInput}
            placeholder="No. KTP"
            className="mt-1"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={16} // Membatasi input maksimal 16 digit
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Membatasi input hanya angka
            }}
          />
        </div>
        <ErrorMessage
          name="id_number"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Alamat KTP */}
      <div>
        <Label htmlFor="address" value="Alamat KTP" />
        <Field
          name="address"
          as={TextInput}
          placeholder="Alamat Lengkap"
          className="mt-1"
        />
        <ErrorMessage
          name="address"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Alamat Domisili */}
      <div>
        <Label htmlFor="domicili_address" value="Alamat Domisili" />
        <Field
          name="domicili_address"
          as={TextInput}
          placeholder="Alamat Lengkap"
          className="mt-1"
        />
        <ErrorMessage
          name="domicili_address"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Nama Gadis Ibu Kandung */}
      <div>
        <Label htmlFor="mother_name" value="Nama Gadis Ibu Kandung" />
        <Field
          name="mother_name"
          as={TextInput}
          placeholder="Nama Gadis Ibu Kandung"
          className="mt-1"
        />
        <ErrorMessage
          name="mother_name"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Status Rumah */}
      <div>
        <Label htmlFor="home_status" value="Status Rumah" />
        <div className="flex gap-4">
          <label className="flex items-center">
            <Field
              type="radio"
              name="home_status"
              value="Milik Sendiri"
              className="mr-2"
            />
            <span>Milik Sendiri</span>
          </label>
          <label className="flex items-center">
            <Field
              type="radio"
              name="home_status"
              value="Kontrak/Sewa"
              className="mr-2"
            />
            <span>Kontrak/Sewa</span>
          </label>
          <label className="flex items-center">
            <Field
              type="radio"
              name="home_status"
              value="Milik Keluarga"
              className="mr-2"
            />
            <span>Milik Keluarga</span>
          </label>
        </div>
        <ErrorMessage
          name="home_status"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Pendidikan Terakhir */}
      <div>
        <Label htmlFor="last_education" value="Pendidikan Terakhir" />
        <div className="flex gap-4">
          <label className="flex items-center">
            <Field
              type="radio"
              name="last_education"
              value="SD"
              className="mr-2"
            />
            <span>SD</span>
          </label>
          <label className="flex items-center">
            <Field
              type="radio"
              name="last_education"
              value="SMP"
              className="mr-2"
            />
            <span>SMP</span>
          </label>
          <label className="flex items-center">
            <Field
              type="radio"
              name="last_education"
              value="SMA"
              className="mr-2"
            />
            <span>SMA</span>
          </label>
          <label className="flex items-center">
            <Field
              type="radio"
              name="last_education"
              value="Akademi/S1/S2"
              className="mr-2"
            />
            <span>Akademi/S1/S2</span>
          </label>
        </div>
        <ErrorMessage
          name="last_education"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Status Perkawinan */}
      <div>
        <Label htmlFor="marital_status" value="Status Perkawinan" />
        <div className="flex gap-4">
          <label className="flex items-center">
            <Field
              type="radio"
              name="marital_status"
              value="Kawin"
              className="mr-2"
            />
            <span>Kawin</span>
          </label>
          <label className="flex items-center">
            <Field
              type="radio"
              name="marital_status"
              value="Belum Kawin"
              className="mr-2"
            />
            <span>Belum Kawin</span>
          </label>
          <label className="flex items-center">
            <Field
              type="radio"
              name="marital_status"
              value="Cerai"
              className="mr-2"
            />
            <span>Cerai</span>
          </label>
        </div>
        <ErrorMessage
          name="marital_status"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Kewarganegaraan */}
      <div>
        <Label htmlFor="nationality" value="Kewarganegaraan" />
        <div className="flex gap-4">
          <label className="flex items-center">
            <Field
              type="radio"
              name="nationality"
              value="WNI"
              className="mr-2"
            />
            <span>WNI</span>
          </label>
          <label className="flex items-center">
            <Field
              type="radio"
              name="nationality"
              value="WNA"
              className="mr-2"
            />
            <span>WNA</span>
          </label>
        </div>
        <ErrorMessage
          name="nationality"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Nomor HP */}
      <div>
        <Label htmlFor="mobile_number" value="Nomor HP/WA" />
        <Field
          name="mobile_number"
          as={TextInput}
          placeholder="Nomor HP/WA"
          className="mt-1"
          inputMode="numeric"
          pattern="[0-9]*"
          onInput={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
        />
        <ErrorMessage
          name="mobile_number"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Agama */}
      <div>
        <Label htmlFor="religion" value="Agama" />
        <Field name="religion" as={Select} className="mt-1">
          <option value="">Pilih Agama</option>
          <option value="Islam">Islam</option>
          <option value="Kristen">Kristen</option>
          <option value="Katolik">Katolik</option>
          <option value="Hindu">Hindu</option>
          <option value="Buddha">Buddha</option>
          <option value="Konghucu">Konghucu</option>
        </Field>
        <ErrorMessage
          name="religion"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>

      {/* Email */}
      <div className="mb-5">
        <Label htmlFor="email" value="Email" />
        <Field
          name="email"
          as={TextInput}
          placeholder="Email"
          className="mt-1"
        />
        <ErrorMessage
          name="email"
          component="div"
          className="text-red-500 text-sm"
        />
      </div>
    </>
  );
};

export default SectionA;
