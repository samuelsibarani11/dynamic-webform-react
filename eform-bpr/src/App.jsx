/* eslint-disable no-unused-vars */
// import Eform from "./components/client/form/form";
import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/client/header/header";
import Dashboard from "./components/client/dashboard/Dashboard";
import DynamicForm from "./components/dynamicForm/DynamicForm";

import formSchema from "./components/dynamicForm/formSchema.json";

export default function App() {
  const handleFormSubmit = (formData) => {
    console.log("Form Data:", formData);
  };

  const initialValues = formSchema.reduce((acc, section) => {
    section.fields.forEach((field) => {
      acc[field.name] = ''; // Default empty string for each field
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
              <DynamicForm schema={formSchema} initialValues={initialValues} onSubmit={handleFormSubmit} />
            }
          />
        </Routes>
      </Router>
    </>
  );
}
