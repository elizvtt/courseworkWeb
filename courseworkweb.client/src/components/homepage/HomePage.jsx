import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useCart } from '../CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './homepage.css';

function HomePage() {
    const ads = [
        '/public/ad1.jpg',
        '/public/ad2.jpg',
        '/public/ad3.jpg',
        '/public/ad4.jpg',
        '/public/ad5.jpg',
        '/public/ad6.jpg',
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

    const notify = () => toast.success("Товар додано у кошик!");

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

    const filteredProducts = useMemo(() => 
        products.filter((product) => product.discountPrice), 
        [products]
    );

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
            alert("Будь ласка, зареєструйтесь для покупки товару.");
            return;
        }
        addToCart(user.id, productId);
    };

    const handleButton = (productId) => {
        handleAddToCart(productId);
        // notify();
        if (user && user.id) {
            notify();
        }
    };    
   

    return (
        <div className="homepage">
            {/* Реклама */}
            <div className="ads-container">
                <button className="arrow left-arrow" onClick={handlePrev}>
                    <img src="/arrow.svg" alt="Previous" />
                </button>
                <div className="ads-content">
                    <div className="ad">
                        {/* Отображаем картинку вместо текста */}
                        <img src={ads[currentIndex]} alt={`Ad ${currentIndex + 1}`} />
                    </div>
                    {!isSmallScreen && currentIndex + 1 < ads.length && (
                        <div className="ad">
                            <img src={ads[currentIndex + 1]} alt={`Ad ${currentIndex + 2}`} />
                        </div>
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
                    <div className="top-items-list">
                        {filteredProducts.map((product) => {
                            const primaryImage = product.productImages.find((img) => img.isPrimary)?.imageUrl || '/images/default.png';
                            return (
                                <div key={product.id} className="top-product-item">
                                    <Link key={product.id} to={`/Products/${product.id}`} className="top-item-list">
                                        <img
                                        src={`http://localhost:5175${primaryImage}`}
                                        alt={product.name}
                                        className="top-item-image"
                                        />
                                        <div className="top-item-name">{product.name}</div>
                                        <div className="top-item-price">
                                            <span className="old-price">{product.price} грн</span>
                                            <span className="discount-price">{product.discountPrice} грн</span>
                                        </div>
                                    </Link>
                                    <button className="buy-button" onClick={() => handleButton(product.id)}>
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
                <div className="categories-container" ref={categoriesRef} onScroll={handleScrollCategories}>
                    <div className="categories">
                        {categories.map((category) => (
                            <div key={category.id} className="category">
                                <Link to={`/Products?categoryId=${category.id}`}>
                                    <span>{category.name}</span>
                                </Link>
                                {category.subcategories && category.subcategories.length > 0 && (
                                    <div className="subcategories">
                                        {category.subcategories.map((subcategory) => (
                                            <div key={subcategory.id} className="subcategory">
                                                <Link to={`/Products?categoryId=${subcategory.id}`}>
                                                    <span>{subcategory.name}</span>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                <div className="brands-container" ref={brandsRef} onScroll={handleScrollBrands}>
                    <div className="brands">
                        {brands.map((brand, index) => (
                            <Link key={index} to={`/Products?brand=${brand}`} className="brand">
                            <span>{brand}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="all-item-section">
                <h2 className="section-title">
                    <Link to="/Products" className="products-link">Всі товари</Link>
                </h2>
                <div className="line-container"></div>

                <div className="all-items-list">
                {products
                    .sort(() => Math.random() - 0.5)
                    .slice(0, getItemsToShow())
                    .map((product) => {
                        const primaryImage = product.productImages.find((img) => img.isPrimary)?.imageUrl ||
                            '/images/default.png';

                    return (
                        <div key={product.id} className="all-product-item">
                            <Link key={product.id} to={`/Products/${product.id}`} className="all-item-list">
                                <img
                                    src={`http://localhost:5175${primaryImage}`}
                                    alt={product.name}
                                    className="all-item-image"
                                />
                                <div className="top-item-name">{product.name}</div>
                                <div className="all-item-price">
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
                            <button className="buy-button" onClick={() => handleButton(product.id)}>
                                <img src="/bag.svg" alt="bag" className="bag-icon" />
                            </button>
                        </div>
                    );
                })}
                <Link to="/Products" className="view-more-link">
                    <div className="top-item view-more-container">
                        <span className="view-more-symbol">{'>'}</span>   
                    </div>
                </Link>
            </div>
        </div>
        <ToastContainer autoClose={3000} position="top-center"/></div>
    );
}

export default HomePage;
