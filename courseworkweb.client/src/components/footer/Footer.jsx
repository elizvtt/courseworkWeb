import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

function Footer() {
    const [categories, setCategories] = useState([]);
    const categoriesRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:5175/api/Categories')
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error('Помилка під час завантаження категорій:', error));
    }, []);


  return (
    <footer>
         <div className="footer-container">
            <div className="footer-left">
                <h3 className="footer-brand">Magaz</h3>
                <p className="footer-download">Завантажуй застосунок</p>
                <img src="/download.png" alt="Download App" className="footer-download-img" />
            </div>

            <div className="footer-center">
                <h3 className="footer-title">Категорії</h3>
                <div className="footer-categories">
                    {categories.filter(category => category.parentId === null).map((category) => (
                    <div key={category.id} className="footer-category">
                        <Link to={`/Products?categoryId=${category.id}`}>
                            <span>{category.name}</span>
                        </Link>
                    </div>
                    ))}
                </div>
            </div>

        
            <div className="footer-right">
                <h3 className="footer-contact-title">Зв’язатися з нами</h3>
                <p className="footer-contact">
                    +38(068)-140-3512 <br />
                    +38(066)-140-8794
                </p>
                <img src="/social_media.svg" alt="Social Media" className="footer-social-img" />
            </div>
        </div> 

        
        <div className="footer-bottom">
            <hr className="footer-line" />
            <p className="footer-year">2024</p>
      </div> 

    </footer>
  );
}

export default Footer;
