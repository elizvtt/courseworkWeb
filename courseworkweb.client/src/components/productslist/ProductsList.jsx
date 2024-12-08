// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './productlist.css';
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [filters, setFilters] = useState({
//     price: { min: 0, max: 100000 },
//     name: '',
//     sortBy: 'name-asc',
//   });

//   useEffect(() => {
//     fetch('http://localhost:5175/api/Products')
//       .then((response) => response.json())
//       .then((data) => setProducts(data))
//       .catch((error) => console.error('Error fetching products:', error));
//   }, []);

//   const handlePriceChange = (values) => {
//     setFilters({ ...filters, price: { min: values[0], max: values[1] } });
//   };

//   // Функція сорутвання
//   const filteredProducts = products
//     .filter((product) => {
//       return (
//         product.price >= filters.price.min &&
//         product.price <= filters.price.max &&
//         product.name.toLowerCase().includes(filters.name.toLowerCase()) &&
//         (filters.onlyDiscounted ? product.discountPrice !== null : true)
//       );
//     })
//     .sort((a, b) => {
//       switch (filters.sortBy) {
//         case 'name-asc':
//           if (a.name < b.name) return -1;
//           if (a.name > b.name) return 1;
//           return 0;
//         case 'name-desc':
//           if (a.name < b.name) return 1;
//           if (a.name > b.name) return -1;
//           return 0;
//         case 'price-asc':
//           return a.price - b.price;
//         case 'price-desc':
//           return b.price - a.price;
//         case 'discount':
//           return (a.discountPrice || a.price) - (b.discountPrice || b.price);
//         default:
//           return 0;
//       }
//     });

//   return (
//     <div className="container">
//       <div className="filters-container">
//         <h3>Фільтр</h3>
//         <div className="filter">
//           <label>Вартість</label>
//           <div className="price-range">
//             <input
//               type="number"
//               value={filters.price.min}
//               onChange={(e) => setFilters({ ...filters, price: { ...filters.price, min: e.target.value } })}
//             />
//             <span> - </span>
//             <input
//               type="number"
//               value={filters.price.max}
//               onChange={(e) => setFilters({ ...filters, price: { ...filters.price, max: e.target.value } })}
//             />
//           </div>
//         </div>

//         {/* Фільтр ціни */}
//         <div className="filter">
//           <Slider
//             range
//             min={0}
//             max={100000}
//             value={[filters.price.min, filters.price.max]}
//             onChange={handlePriceChange}
//             tipFormatter={(value) => `${value} грн`}
//           />
//         </div>

//         {/* Сортування */}
//         <div className="filter radio-group">
//           <p>&#11137; Сортувати за ім'ям</p>
//           <label className="radio-label">
//             <input
//               type="radio"
//               name="sortBy"
//               checked={filters.sortBy === 'name-asc'}
//               onChange={() => setFilters({ ...filters, sortBy: 'name-asc' })}
//             />
//             A - Я
//           </label>
//           <br />
//           <label className="radio-label">
//             <input
//               type="radio"
//               name="sortBy"
//               checked={filters.sortBy === 'name-desc'}
//               onChange={() => setFilters({ ...filters, sortBy: 'name-desc' })}
//             />
//             Я - A
//           </label>
//           <br />
//           <p>&#11137; Сортувати за ціною</p>
//           <label className="radio-label">
//             <input
//               type="radio"
//               name="sortBy"
//               checked={filters.sortBy === 'price-asc'}
//               onChange={() => setFilters({ ...filters, sortBy: 'price-asc' })}
//             />
//             За зростанням
//           </label>
//           <br />
//           <label className="radio-label">
//             <input
//               type="radio"
//               name="sortBy"
//               checked={filters.sortBy === 'price-desc'}
//               onChange={() => setFilters({ ...filters, sortBy: 'price-desc' })}
//             />
//             За спаданням
//           </label>
//           <br />
//           <label className="radio-label">
//             <input
//               type="radio"
//               name="sortBy"
//               checked={filters.sortBy === 'discount'}
//               onChange={() => setFilters({ ...filters, sortBy: 'discount' })}
//             />
//             Акційні товари
//           </label>
//         </div>
//       </div>

//       {/* Список товарів */}
//       <div className="products-container">
//         <div className="items-list">
//           {filteredProducts.map((product) => {
//             const primaryImage =
//               product.productImages.find((img) => img.isPrimary)?.imageUrl || '/images/default.png';

//             return (
//               <Link key={product.id} to={`/Products/${product.id}`} className="item-list">

//                 <img
//                   src={`http://localhost:5175${primaryImage}`}
//                   alt={product.name}
//                   className="item-image"
//                 />
//                 <div className="item-name">{product.name}</div>
//                 <div className="item-price">
//                   {product.discountPrice ? (
//                     <>
//                       <span className="old-price">{product.price} грн</span>
//                       <span className="discount-price">{product.discountPrice} грн</span>
//                     </>
//                   ) : (
//                     `${product.price} грн`
//                   )}
//                 </div>
//                 <button className="buy-button">
//                   <img src="/bag.svg" alt="bag" className="bag-icon" />
//                 </button>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;


// Добавление товара в корзину

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useCart } from '../CartContext';
import Slider from 'rc-slider';
import axios from 'axios';
import './productslist.css';
import 'rc-slider/assets/index.css';


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    price: { min: 0, max: 100000 },
    name: '',
    sortBy: 'name-asc',
  });

  const { user} = useUser(); 
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:5175/api/Products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
    
  }, []);

  const handlePriceChange = (values) => {
    setFilters({ ...filters, price: { min: values[0], max: values[1] } });
  };
  
  // додавання в корзину
  const handleAddToCart = (productId) => {
    if (!user || !user.id) {
      console.error("User is not logged in or user ID is missing.");
      return;
    }
    addToCart(user.id, productId); // Передаем user.id в addToCart
  };
  
  // функція фільтрації
  const filteredProducts = products
    .filter((product) => {
      return (
        product.price >= filters.price.min &&
        product.price <= filters.price.max &&
        product.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'name-asc':
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        case 'name-desc':
          if (a.name < b.name) return 1;
          if (a.name > b.name) return -1;
          return 0;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'discount':
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        default:
          return 0;
      }
    });

  return (
    <div className="container">
      <div className="filters-container">
        <h3>Фільтр</h3>
        <div className="filter">
          <label>Вартість</label>
          <div className="price-range">
            <input
              type="number"
              value={filters.price.min}
              onChange={(e) => setFilters({ ...filters, price: { ...filters.price, min: e.target.value } })}
            />
            <span> - </span>
            <input
              type="number"
              value={filters.price.max}
              onChange={(e) => setFilters({ ...filters, price: { ...filters.price, max: e.target.value } })}
            />
          </div>
        </div>

        <div className="filter">
          <Slider
            range
            min={0}
            max={100000}
            value={[filters.price.min, filters.price.max]}
            onChange={handlePriceChange}
            tipFormatter={(value) => `${value} грн`}
          />
        </div>

        <div className="filter radio-group">
          <p>&#11137; Сортувати за ім'ям</p>
          <label className="radio-label">
            <input
              type="radio"
              name="sortBy"
              checked={filters.sortBy === 'name-asc'}
              onChange={() => setFilters({ ...filters, sortBy: 'name-asc' })}
            />
            A - Я
          </label>
          <br />
          <label className="radio-label">
            <input
              type="radio"
              name="sortBy"
              checked={filters.sortBy === 'name-desc'}
              onChange={() => setFilters({ ...filters, sortBy: 'name-desc' })}
            />
            Я - A
          </label>
          <br />
          <p>&#11137; Сортувати за ціною</p>
          <label className="radio-label">
            <input
              type="radio"
              name="sortBy"
              checked={filters.sortBy === 'price-asc'}
              onChange={() => setFilters({ ...filters, sortBy: 'price-asc' })}
            />
            За зростанням
          </label>
          <br />
          <label className="radio-label">
            <input
              type="radio"
              name="sortBy"
              checked={filters.sortBy === 'price-desc'}
              onChange={() => setFilters({ ...filters, sortBy: 'price-desc' })}
            />
            За спаданням
          </label>
          <br />
          <label className="radio-label">
            <input
              type="radio"
              name="sortBy"
              checked={filters.sortBy === 'discount'}
              onChange={() => setFilters({ ...filters, sortBy: 'discount' })}
            />
            Акційні товари
          </label>
        </div>
      </div>

      <div className="products-container">
        <div className="items-list">
          {filteredProducts.map((product) => {
            const primaryImage =
              product.productImages.find((img) => img.isPrimary)?.imageUrl || '/images/default.png';

            return (
              <div key={product.id} className="product-item">
                <Link key={product.id} to={`/Products/${product.id}`} className="item-list">
                  <img
                    src={`http://localhost:5175${primaryImage}`}
                    alt={product.name}
                    className="item-image"
                  />
                  <div className="item-name">{product.name}</div>
                  <div className="item-price">
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
          
        </div>
      </div>
    </div>
  );
};

export default ProductList;
