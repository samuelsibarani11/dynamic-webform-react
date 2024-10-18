/* eslint-disable no-unused-vars */
import React from "react";
import { Navbar } from "flowbite-react";
import "./header.css";

const Header = () => {
  const currentPath = window.location.pathname;

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white">
      <Navbar fluid rounded className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center w-full">
          {/* Left Section: Logo */}
          <img
            src="./src/assets/bpr-asset/bpr-smp-logo.png"
            width={125}
            alt="BPR SMP Logo"
          />

          {/* Right Section: Home Icon */}
          {currentPath !== "/" && (
            <a href="/" className="flex items-center">
              <img
                src="./src/assets/bpr-asset/home.png"
                width={120}
                alt="Home"
              />
            </a>
          )}
        </div>
      </Navbar>
    </header>
  );
};

export default Header;
