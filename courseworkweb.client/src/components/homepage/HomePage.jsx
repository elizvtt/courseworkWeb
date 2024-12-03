import React, { useState, useEffect } from 'react';
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
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Обновляем состояние при изменении размера окна
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 1400);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Проверка при монтировании компонента

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNext = () => {
        if (isSmallScreen) {
            setCurrentIndex((prevIndex) =>
                prevIndex < ads.length - 1 ? prevIndex + 1 : 0
            );
        } else {
            setCurrentIndex((prevIndex) =>
                prevIndex < ads.length - 2 ? prevIndex + 2 : 0
            );
        }
    };

    const handlePrev = () => {
        if (isSmallScreen) {
            setCurrentIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : ads.length - 1
            );
        } else {
            setCurrentIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 2 : ads.length - 2
            );
        }
    };

    const renderDots = () => {
        const dots = [];
        const totalPairs = Math.ceil(ads.length / (isSmallScreen ? 1 : 2));
        const activePair = Math.floor(currentIndex / (isSmallScreen ? 1 : 2));

        for (let i = 0; i < totalPairs; i++) {
            dots.push(
                <div
                    key={i}
                    className={`dot ${i === activePair ? 'active' : ''}`}
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
                {!isSmallScreen && currentIndex + 1 < ads.length && (
                    <div className="ad">{ads[currentIndex + 1]}</div>
                )}
            </div>
            <button className="arrow right-arrow" onClick={handleNext}>
                <img src="/arrow.svg" alt="Next" />
            </button>
            <div className="dots-container">{renderDots()}</div>
        </div>
    );
}

export default HomePage;
