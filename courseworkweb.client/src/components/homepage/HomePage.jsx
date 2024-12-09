import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useCart } from '../CartContext';
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
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);

    const { user} = useUser(); 
    const { addToCart } = useCart();

    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrollProgressProducts, setScrollProgressProducts] = useState(20);
    const [scrollProgressCategories, setScrollProgressCategories] = useState(20);
    const [scrollProgressBrands, setScrollProgressBrands] = useState(20);

    const productsRef = useRef(null);
    const categoriesRef = useRef(null);
    const brandsRef = useRef(null);

    // Зміна розміру вікна
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 1400);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Підключення до бази даних
    useEffect(() => {
        fetch('http://localhost:5175/api/Categories')
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error('Помилка під час завантаження категорій:', error));

        fetch('http://localhost:5175/api/Products')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);

                const uniqueBrands = [...new Set(data.map((product) => product.brand))];
                setBrands(uniqueBrands);
            })
            .catch((error) => console.error('Помилка під час завантаження товарів:', error));
    }, []);

    // Перемикання реклами
    const handleNext = () => {
        if (isSmallScreen) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
        } else {
            setCurrentIndex((prevIndex) => (prevIndex + 2) % ads.length);
        }
    };

    const handlePrev = () => {
        if (isSmallScreen) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + ads.length) % ads.length);
        } else {
            setCurrentIndex((prevIndex) => (prevIndex - 2 + ads.length) % ads.length);
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
                    onClick={() => setCurrentIndex(i * (isSmallScreen ? 1 : 2))}
                ></div>
            );
        }
        return dots;
    };

    // Прокрутка товарів
    const handleScrollProducts = () => {
        const scrollWidth = productsRef.current.scrollWidth;
        const scrollLeft = productsRef.current.scrollLeft;
        const progress = (scrollLeft / (scrollWidth - productsRef.current.clientWidth)) * 100;
        setScrollProgressProducts(Math.min(Math.max(progress, 20), 100));
    };

    // Прокрутка категорій
    const handleScrollCategories = () => {
        const scrollWidth = categoriesRef.current.scrollWidth;
        const scrollLeft = categoriesRef.current.scrollLeft;
        const progress = (scrollLeft / (scrollWidth - categoriesRef.current.clientWidth)) * 100;
        setScrollProgressCategories(Math.min(Math.max(progress, 20), 100));
    };

    // Прокрутка брендів
    const handleScrollBrands = () => {
        const scrollWidth = brandsRef.current.scrollWidth;
        const scrollLeft = brandsRef.current.scrollLeft;
        const progress = (scrollLeft / (scrollWidth - brandsRef.current.clientWidth)) * 100;
        setScrollProgressBrands(Math.min(Math.max(progress, 20), 100));
    };

    const  getItemsToShow = () => {
        if (window.innerWidth <= 660) {
            return 0;
        } else if (window.innerWidth <= 1040) {
            return 1;
        } else if (window.innerWidth <= 1470) {
            return 2;
        } else if (window.innerWidth <= 1500)  {
            return 3;
        } else if (window.innerWidth <= 2200)  {
            return 4;
        } else {
            return 5;
        }
    }
    
    // Додавання в корзину
    const handleAddToCart = (productId) => {
        if (!user || !user.id) {
            console.error("User is not logged in or user ID is missing.");
            return;
        }
        addToCart(user.id, productId);
    };
   

    return (
        <div className="homepage">
            {/* Реклама */}
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
            </div>
            <div className="dots-container">
                {renderDots()}
            </div>

            {/* Топ товари */}
            <div className="section">
                <h2 className="section-title">Топ товари</h2>
                <div className="moving-line-container">
                    <div
                        className="moving-line-green"
                        style={{ width: `${scrollProgressProducts}%` }}
                    ></div>
                </div>
                <div
                    className="top-items-container"
                    ref={productsRef}
                    onScroll={handleScrollProducts}
                >
                    <div className="top-items">
                        {products
                            .filter((product) => product.discountPrice) // Виводяться тільки товари зі скидкою
                            .map((product) => {
                            const primaryImage =
                                product.productImages.find((img) => img.isPrimary)?.imageUrl ||
                                '/images/default.png';
                            return (
                                <div key={product.id} className="top-item">
                                    <img src={`http://localhost:5175${primaryImage}`} alt={product.name} className="top-item-image" />
                                    <div className="top-item-name">{product.name}</div>
                                    <div className="top-item-price">{product.discountPrice} грн</div>
                                    <div className="top-item-oldprice">{product.price} грн</div>
                                    <button className="buy-button" onClick={() => handleAddToCart(product.id)}>
                                        <img src="/bag.svg" alt="bag" className="bag-icon" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            {/* Категорії */}
            <div className="section">
                <h2 className="section-title">Категорії</h2>
                <div className="moving-line-container">
                    <div
                        className="moving-line-pink"
                        style={{ width: `${scrollProgressCategories}%` }}
                    ></div>
                </div>
                <div
                    className="categories-container"
                    ref={categoriesRef}
                    onScroll={handleScrollCategories}
                >
                    <div className="categories">
                        {categories.map((category) => (
                            <div key={category.id} className="category">
                                <span>{category.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Бренди */}
            <div className="section">
                <h2 className="section-title">Бренди</h2>
                <div className="moving-line-container">
                    <div
                        className="moving-line-green"
                        style={{ width: `${scrollProgressBrands}%` }}
                    ></div>
                </div>
                <div
                    className="brands-container"
                    ref={brandsRef}
                    onScroll={handleScrollBrands}
                >
                    <div className="brands">
                        {brands.map((brand, index) => (
                            <div key={index} className="brand">
                                <span>{brand}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="game-section">
                <h3>Вигравай та отримуй бонуси на наступну покупку</h3>
                <div className="game-ad">
                    <button className="game-button">Грати</button>
                </div>
            </div>


            <div className="all-item-section">
                <h2 className="section-title">
                    <Link to="/Products" className="products-link">Всі товари</Link>
                </h2>
                <div className="line-container"></div>

                <div className="all-items">
                {products
                    .slice(0, getItemsToShow())
                    .map((product) => {
                        const primaryImage = product.productImages.find((img) => img.isPrimary)?.imageUrl ||
                            '/images/default.png';

                    return (
                        <div key={product.id} className="top-item">
                            <Link key={product.id} to={`/Products/${product.id}`} className="all-item">
                                <img
                                    src={`http://localhost:5175${primaryImage}`}
                                    alt={product.name}
                                    className="top-item-image"
                                />
                                <div className="top-item-name">{product.name}</div>
                                <div className="top-item-price">
                                    {product.discountPrice ? (
                                        <>
                                            <span className="old-price">{product.price} грн</span>
                                            <span className="discount-price">{product.discountPrice} грн</span>
                                        </>
                                    ) : (
                                        `${product.price} грн`
                                    )}
                                </div>
                            </Link>
                            <button className="buy-button" onClick={() => handleAddToCart(product.id)}>
                                <img src="/bag.svg" alt="bag" className="bag-icon" />
                            </button>
                        </div>
                    );
                })}

                    <div className="top-item view-more-container">
                        <Link to="/Products" className="view-more-link">
                            <span className="view-more-symbol">{'>'}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
