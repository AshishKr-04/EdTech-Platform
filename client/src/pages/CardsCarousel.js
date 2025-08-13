import React from "react";
import "../pages/CardsCarousel.css";

const cardsData = [
    { name: "Deepak Kumar", job: "First Job", desc: "PW Skills Sales & Relationship Management...", category: "Banking & Finance" },
    { name: "RAHUL HAZRA", job: "First Job", desc: "PW Skills Sales & Relationship Management...", category: "Banking & Finance" },
    { name: "Khushboo Jha", job: "First Job", desc: "PW Skills Sales & Relationship Management...", category: "Banking & Finance" },
    { name: "Ujjwal Prasad", job: "First Job", desc: "PW Skills Sales & Relationship Management...", category: "Banking & Finance" },
    // Duplicate cards for continuous loop
    { name: "Deepak Kumar", job: "First Job", desc: "PW Skills Sales & Relationship Management...", category: "Banking & Finance" },
    { name: "RAHUL HAZRA", job: "First Job", desc: "PW Skills Sales & Relationship Management...", category: "Banking & Finance" },
    { name: "Khushboo Jha", job: "First Job", desc: "PW Skills Sales & Relationship Management...", category: "Banking & Finance" },
    { name: "Ujjwal Prasad", job: "First Job", desc: "PW Skills Sales & Relationship Management...", category: "Banking & Finance" }
];

export default function CardsCarousel() {
    return (
        <div className="carousel-container">
            <div className="carousel-track">
                {cardsData.map((card, index) => (
                    <div className="card" key={index}>
                        <div className="card-content">
                            <h3>{card.name}</h3>
                            <p>{card.job}</p>
                            <p>{card.desc}</p>
                        </div>
                        <div className="card-category">{card.category}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
