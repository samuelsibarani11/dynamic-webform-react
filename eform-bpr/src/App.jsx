/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/client/header/header";
import Dashboard from "./components/client/dashboard/Dashboard";
import formSchema from "./components/client/form/Form1/formSchema.json";
import FormApplyBpr from "./components/client/form/Form1/FormApplyBpr";
import FormApplyBpr2 from "./components/client/form/Form2/FormApplyBpr2";
import DashboardJson from "./components/client/dashboard/Dashboard.json"



export default function App() {
  const handleFormSubmit = (formData) => {
    console.log("Form Data:", formData);
  };
  
  const initialValues = formSchema.reduce((acc, section) => {
    section.fields.forEach((field) => {
      acc[field.name] = "";
    }); 
    return acc;
  }, {});
  


  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/form-ksm"
            element={
              <FormApplyBpr
                schema={formSchema}
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
              />
            }
          />
          <Route
            path="/form-ksm2"
            element={
              <FormApplyBpr2
                schema={formSchema}
                initialValues={initialValues}
                onSubmit={handleFormSubmit}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}
