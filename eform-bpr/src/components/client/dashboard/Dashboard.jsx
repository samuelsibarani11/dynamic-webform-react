/* eslint-disable no-unused-vars */
import React from "react";
import "./Dashboard.css";
import cardData from "./Dashboard.json";

const Dashboard = () => {
  return (
    <>
      <div className="mx-auto max-w-5xl p-5 flex-col-reverse">
        <div className="text-2xl"> Webform SMP</div>
        <div className="">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ducimus,
          dolorum.
        </div>
      </div>
      <div className="flex-container mx-auto max-w-5xl p-5">
        {cardData.map((card, index) => (
          <div key={index} className="card shadow-md">
            <a
              className={`bg-white card1 ${card.background}`}
              href={card.ctaLink}
            >
              <p className="text-2xl font-semibold">{card.title}</p>
              <p className="small line-clamp-2">{card.description}</p>
              <button
                className="small text-blue-700 font-semibold bg-transparent border-none cursor-pointer"
                onClick={() => (window.location.href = card.ctaLink)}
              >
                {card.ctaText}
              </button>
              <div className="go-corner">
                <div className="go-arrow">→</div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
