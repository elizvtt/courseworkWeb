// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useUser } from '../UserContext';
// import { useCart } from '../CartContext';
// import Slider from 'rc-slider';
// import './productslist.css';
// import 'rc-slider/assets/index.css';


// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [filters, setFilters] = useState({
//     price: { min: 0, max: 100000 },
//     name: '',
//     sortBy: 'name-asc',
//   });

//   const { user} = useUser(); 
//   const { addToCart } = useCart();

//   useEffect(() => {
//     fetch('http://localhost:5175/api/Products')
//       .then((response) => response.json())
//       .then((data) => setProducts(data))
//       .catch((error) => console.error('Error fetching products:', error));
    
//   }, []);

//   const handlePriceChange = (values) => {
//     setFilters({ ...filters, price: { min: values[0], max: values[1] } });
//   };
  
//   // додавання в корзину
//   const handleAddToCart = (productId) => {
//     if (!user || !user.id) {
//       console.error("User is not logged in or user ID is missing.");
//       return;
//     }
//     addToCart(user.id, productId);
//   };
  
//   // функція фільтрації
//   const filteredProducts = products
//     .filter((product) => {
//       return (
//         product.price >= filters.price.min &&
//         product.price <= filters.price.max &&
//         product.name.toLowerCase().includes(filters.name.toLowerCase())
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
//           return (b.discountPrice || b.price) - (a.discountPrice || a.price) ;
//         default:
//           return 0;
//       }
//     });

//   return (
//     <div className="product-list">
//       <div className="product-list-container">
//         <div className="filters-container">
//           <h3>Фільтр</h3>
//           <div className="filter">
//             <label>Вартість</label>
//             <div className="price-range">
//               <input
//                 type="number"
//                 value={filters.price.min}
//                 onChange={(e) => setFilters({ ...filters, price: { ...filters.price, min: e.target.value } })}
//               />
//               <span> - </span>
//               <input
//                 type="number"
//                 value={filters.price.max}
//                 onChange={(e) => setFilters({ ...filters, price: { ...filters.price, max: e.target.value } })}
//               />
//             </div>
//           </div>

//           <div className="filter">
//             <Slider
//               range
//               min={0}
//               max={100000}
//               value={[filters.price.min, filters.price.max]}
//               onChange={handlePriceChange}
//               tipFormatter={(value) => `${value} грн`}
//             />
//           </div>

//           <div className="filter radio-group">
//             <p>&#11137; Сортувати за ім'ям</p>
//             <label className="radio-label">
//               <input
//                 type="radio"
//                 name="sortBy"
//                 checked={filters.sortBy === 'name-asc'}
//                 onChange={() => setFilters({ ...filters, sortBy: 'name-asc' })}
//               />
//               A - Я
//             </label>
//             <br />
//             <label className="radio-label">
//               <input
//                 type="radio"
//                 name="sortBy"
//                 checked={filters.sortBy === 'name-desc'}
//                 onChange={() => setFilters({ ...filters, sortBy: 'name-desc' })}
//               />
//               Я - A
//             </label>
//             <br />
//             <p>&#11137; Сортувати за ціною</p>
//             <label className="radio-label">
//               <input
//                 type="radio"
//                 name="sortBy"
//                 checked={filters.sortBy === 'price-asc'}
//                 onChange={() => setFilters({ ...filters, sortBy: 'price-asc' })}
//               />
//               За зростанням
//             </label>
//             <br />
//             <label className="radio-label">
//               <input
//                 type="radio"
//                 name="sortBy"
//                 checked={filters.sortBy === 'price-desc'}
//                 onChange={() => setFilters({ ...filters, sortBy: 'price-desc' })}
//               />
//               За спаданням
//             </label>
//             <br />
//             <label className="radio-label">
//               <input
//                 type="radio"
//                 name="sortBy"
//                 checked={filters.sortBy === 'discount'}
//                 onChange={() => setFilters({ ...filters, sortBy: 'discount' })}
//               />
//               Акційні товари
//             </label>
//           </div>
//         </div>

//         <div className="products-container">
//           <div className="items-list">
//             {filteredProducts.map((product) => {
//               const primaryImage =
//                 product.productImages.find((img) => img.isPrimary)?.imageUrl || '/images/default.png';

//               return (
//                 <div key={product.id} className="product-item">
//                   <Link key={product.id} to={`/Products/${product.id}`} className="item-list">
//                     <img
//                       src={`http://localhost:5175${primaryImage}`}
//                       alt={product.name}
//                       className="item-image"
//                     />
//                     <div className="item-name">{product.name}</div>
//                     <div className="item-price">
//                       {product.discountPrice ? (
//                         <>
//                           <span className="old-price">{product.price} грн</span>
//                           <span className="discount-price">{product.discountPrice} грн</span>
//                         </>
//                       ) : (
//                         `${product.price} грн`
//                       )}
//                     </div>
//                   </Link>
//                   <button className="buy-button" onClick={() => handleAddToCart(product.id)}>
//                     <img src="/bag.svg" alt="bag" className="bag-icon" />
//                   </button>
//                 </div>
//               );
//             })}
            
//           </div>
//         </div>
//       </div>
//       </div>
//   );
// };

// export default ProductList;


// фільтри по бренду 

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useCart } from '../CartContext';
import Slider from 'rc-slider';
import './productslist.css';
import 'rc-slider/assets/index.css';


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    price: { min: 0, max: 100000 },
    name: '',
    sortBy: 'name-asc',
    selectedBrands: [],
  });

  const [availableBrands, setAvailableBrands] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const { user} = useUser(); 
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:5175/api/Products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        
        const brands = Array.from(new Set(data.map((product) => product.brand))).sort();
        setAvailableBrands(brands);
      })
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
    addToCart(user.id, productId);
  };

  // применение фильтра
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  // скасування фильтра
  const handleResetFilters = () => {
    setFilters({
      price: { min: 0, max: 100000 },
      name: '',
      sortBy: 'name-asc',
      selectedBrands: [],
    });
    setAppliedFilters({
      price: { min: 0, max: 100000 },
      name: '',
      sortBy: 'name-asc',
      selectedBrands: [],
    });
  };

  
  // функція фільтрації
  const filteredProducts = products
    .filter((product) => {
      return (
        // product.price >= filters.price.min &&
        // product.price <= filters.price.max &&
        // product.name.toLowerCase().includes(filters.name.toLowerCase())
        product.price >= appliedFilters.price.min &&
        product.price <= appliedFilters.price.max &&
        product.name.toLowerCase().includes(appliedFilters.name.toLowerCase()) &&
        (appliedFilters.selectedBrands.length === 0 || appliedFilters.selectedBrands.includes(product.brand))
      );
    })
    .sort((a, b) => {
      // switch (filters.sortBy) {
      switch (appliedFilters.sortBy) {
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
          return (b.discountPrice || b.price) - (a.discountPrice || a.price) ;
        default:
          return 0;
      }
    });

  return (
    <div className="product-list">
      <div className="product-list-container">
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

           {/* Фильтр по брендам */}
          <div className="filter-brand">
            <h4>Бренд</h4>
            {availableBrands.map((brand) => (
              <label key={brand} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.selectedBrands.includes(brand)}
                  onChange={(e) => {
                    const updatedBrands = e.target.checked
                      ? [...filters.selectedBrands, brand]
                      : filters.selectedBrands.filter((b) => b !== brand);
                    setFilters({ ...filters, selectedBrands: updatedBrands });
                  }}
                />
                {brand}
              </label>
            ))}
          </div>
          {/* Кнопки */}
          <div className="filter-buttons">
            <button className="reset-button" onClick={handleResetFilters}>
              Скинути
            </button>
            <button className="apply-button" onClick={handleApplyFilters}>
              Застосувати
            </button>
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
    </div>
  );
};

export default ProductList;
