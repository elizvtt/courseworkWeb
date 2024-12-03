import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './homepage.css';

function HomePage() {
    const ads = [
        'Ad 1 Content',
        'Ad 2 Content',
        'Ad 3 Content',
        'Ad 4 Content',
        'Ad 5 Content',
        'Ad 6 Content',
    ];
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
        prevIndex < ads.length - 2 ? prevIndex + 2 : 0
        );
    };
    
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 2 : ads.length - 2
        );
    };
    
    const renderDots = () => {
        const dots = [];
        for (let i = 0; i < ads.length / 2; i++) {
          dots.push(
            <div
              key={i}
              className={`dot ${i === currentIndex / 2 ? 'active' : ''}`}
            ></div>
          );
        }
        return dots;
    };
    
    return (
        <div className="ads-container">
            <button className="arrow left-arrow" onClick={handlePrev}>
                <img src="/arrow.svg" alt="Previous" />
            </button>
            <div className="ads-content">
                <div className="ad">{ads[currentIndex]}</div>
                <div className="ad">{ads[currentIndex + 1]}</div>
            </div>
            <button className="arrow right-arrow" onClick={handleNext}>
                <img src="/arrow.svg" alt="Next" />
            </button>
            <div className="dots-container">{renderDots()}</div>
        </div>
    );
}

export default HomePage;


