import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useCart } from '../CartContext';
import Slider from 'rc-slider';
import './productslist.css';
import 'rc-slider/assets/index.css';
import 'react-toastify/dist/ReactToastify.css';


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedBrandFromUrl = queryParams.get('brand');

  const categoryId = queryParams.get('categoryId');
  const subcategoryId = queryParams.get('subcategoryId');

  const [filters, setFilters] = useState({
    price: { min: 0, max: 100000 },
    name: '',
    sortBy: 'name-asc',
    selectedBrands: selectedBrandFromUrl ? [selectedBrandFromUrl] : [],
    selectedAttributes: {},
  });

  const [availableBrands, setAvailableBrands] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [productAttributes, setProductAttributes] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const notify = () => toast.success("Товар додано у кошик!");

  const { user} = useUser(); 
  const { addToCart } = useCart();
  // const { categoryId } = useParams();

  useEffect(() => {
    fetch('http://localhost:5175/api/Products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        
        const brands = Array.from(new Set(data.map((product) => product.brand))).sort();
        setAvailableBrands(brands);

        const allAttributes = Array.from(new Set(data.flatMap((product) => product.productAttributes.map((prodAttr) => prodAttr.attribute.name)))).sort();
        setAttributes(allAttributes);

        const allProductAttributes = data.flatMap((product) =>
          product.productAttributes.map((prodAttr) => ({
            attributeName: prodAttr.attribute.name,
            value: prodAttr.value
          }))
        );
        setProductAttributes(allProductAttributes);
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

  const handleButtonClick = (productId) => {
    handleAddToCart(productId);
    notify();
  };

  const handleAttributeChange = (attributeName, value) => {
    setFilters((prevFilters) => {
      const newSelectedAttributes = { ...prevFilters.selectedAttributes };

      if (newSelectedAttributes[attributeName]) {
        if (newSelectedAttributes[attributeName].includes(value)) {
          newSelectedAttributes[attributeName] = newSelectedAttributes[attributeName].filter((v) => v !== value);
        } else {
          newSelectedAttributes[attributeName].push(value);
        }
      } else {
        newSelectedAttributes[attributeName] = [value];
      }

      return {
        ...prevFilters,
        selectedAttributes: newSelectedAttributes
      };
    });
  };

  // применение фильтра
  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };
    // Обработчик изменения фильтра
  const handleBrandChange = (e, brand) => {
    const updatedBrands = e.target.checked
      ? [...filters.selectedBrands, brand]
      : filters.selectedBrands.filter((b) => b !== brand);
    setFilters({ ...filters, selectedBrands: updatedBrands });
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
  console.log('categoryId ', categoryId)
    console.log('subcategoryId ', subcategoryId)
  
  // функція фільтрації
  const filteredProducts = products
    .filter((product) => {
      // Проверяем подкатегорию
      if (subcategoryId) {
        return product.categoryId === parseInt(subcategoryId, 10);
      }

      // Проверяем категорию и родительскую категорию
      if (categoryId) {
        return product.category.id === parseInt(categoryId, 10) ||
              product.category.parentId === parseInt(categoryId, 10);
      }

      return true; // Если нет фильтрации по категориям
    })

    .filter((product) => {
      return (
        product.price >= appliedFilters.price.min &&
        product.price <= appliedFilters.price.max &&
        product.name.toLowerCase().includes(appliedFilters.name.toLowerCase()) &&
        (appliedFilters.selectedBrands.length === 0 || appliedFilters.selectedBrands.includes(product.brand)) &&
        Object.keys(appliedFilters.selectedAttributes).every((attributeName) => {
          const selectedValues = appliedFilters.selectedAttributes[attributeName];
          return selectedValues.length === 0 || selectedValues.some((value) =>
            product.productAttributes.some((prodAttr) => prodAttr.attribute.name === attributeName && prodAttr.value === value)
          );
        })
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
                  onChange={(e) => handleBrandChange(e, brand)}
                />
                {brand}
              </label>
            ))}
          </div>
          <h4>Характеристика</h4>
          <div className="features-filter">
            {attributes.map((attributeName) => {
              const values = Array.from(
                new Set(productAttributes.filter((attr) => attr.attributeName === attributeName).map((attr) => attr.value))
              );

              return (
                <div key={attributeName} className="filter-attribute">
                  <p>{attributeName}</p>
                  {values.map((value) => (
                    <label key={value} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={filters.selectedAttributes[attributeName]?.includes(value)}
                        onChange={() => handleAttributeChange(attributeName, value)}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              );
            })}
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
                  <button className="buy-button" onClick={() => handleButtonClick(product.id)}>
                    <img src="/bag.svg" alt="bag" className="bag-icon" />
                  </button>
                </div>
              );
            })}      
          </div>
        </div>
      </div>
      <ToastContainer autoClose={3000} position="top-center"/>
    </div>
  );
};

export default ProductList;
