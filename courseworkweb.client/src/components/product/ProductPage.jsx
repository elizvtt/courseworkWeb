import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useCart } from '../CartContext';
import './productpage.css';
import 'react-toastify/dist/ReactToastify.css';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const notify = () => toast.success("Товар додано у кошик!");

  const { user } = useUser();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:5175/api/Products/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        const primaryImage = data.productImages.find((img) => img.isPrimary)?.imageUrl || '/images/default.png';
        setCurrentImage(primaryImage);
      })
      .catch((error) => console.error('Error fetching product:', error));
  }, [productId]);

  const handleAddToCart = (productId) => {
    if (!user || !user.id) {
      console.error('User is not logged in or user ID is missing.');
      return;
    }
    addToCart(user.id, productId);
  };

  const handleButtonClick = (productId) => {
    handleAddToCart(productId);
    notify();
  };

  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl);
  };

  if (!product) {
    return <div>Loading</div>;
  }

  return (
    <div className="product-page">
      <div className="product-page-container">
        {/* Первый столбик */}
        <div className="product-page-column product-page-left">
          <div className="product-page-thumbnails">
            {/* Миниатюры фотографий товара */}
            {product.productImages.map((img) => (
              <img
                key={img.id}
                src={`http://localhost:5175${img.imageUrl}`}
                alt={product.name}
                className="product-page-thumbnail"
                onClick={() => handleImageClick(img.imageUrl)}
              />
            ))}
          </div>
          <div className="product-page-images">
            {/* Главная фотография товара */}
            <img
              src={`http://localhost:5175${currentImage}`}
              alt={product.name}
              className="product-page-main-image"
            />
          </div>
        </div>
  
        {/* Второй столбик */}
        <div className="product-page-column product-page-right">
          <div className="product-page-title-container">
            <p className="product-page-title">{product.name}</p>
            <div className="product-availability-container">
              {product.quantity > 0 ? (
                <div className="availability-indicator">
                  <div className="circle circle-green"></div>
                  <span className="availability-text">Є в наявності</span>
                </div>
              ) : (
                <div className="availability-indicator">
                  <div className="circle circle-red"></div>
                  <span className="availability-text">Немає в наявності</span>
                </div>
              )}
            </div>
            
          </div>
          <div className="product-page-price-container">
            <div className="product-page-price">
              {product.discountPrice ? (
                <>
                  <span className="old-price">{product.price} грн</span>
                  <span className="discount-price">{product.discountPrice} грн</span>
                </>
              ) : (
                `${product.price} грн`
              )}
            </div>
            <button
              className="buy-button add-to-cart-button"
              disabled={product.quantity === 0}
              onClick={() => handleButtonClick(product.id)}>
              Купити<img src="/bag.svg" alt="bag" className="bag-icon" />
            </button>
          </div>
          <div className="product-page-extra-container">
            <p>Характеристика</p>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={3000} position="top-center"/>
    </div>
  );  
};

export default ProductPage;
