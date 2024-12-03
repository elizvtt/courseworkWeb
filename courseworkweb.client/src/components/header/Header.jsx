// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Header.css';

// function Header() {
//   const [isOverlayOpen, setIsOverlayOpen] = useState(false);

//   const toggleOverlay = () => {
//     setIsOverlayOpen(!isOverlayOpen);
//   };

//   const closeOverlay = () => {
//     setIsOverlayOpen(false);
//   };

//   return (
//     <header>
//       <nav className="navbar navbar-expand-sm navbar-light bg-white navbar-custom mb-3">
//         <div className="container-fluid">
//           <li className="nav-item">
//           <button className="menu-button" onClick={toggleOverlay}>
//             <img src="/menu.svg" alt="Menu" className="menu-icon" />
//           </button>
//           </li>
//           <Link className="navbar-brand" to="/">Magaz</Link>
//           <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div className="navbar-collapse collapse d-flex justify-content-between align-items-center w-100">
//             <div className="search-container">
//               <div className="input-group">
//                 <input type="text" className="form-control search-input" placeholder="Search" />
//                 <span className="input-group-text">
//                   <img src="/loupe.svg" alt="Loupe" className="search-icon" />
//                 </span>
//               </div>
//             </div>
//             <ul className="navbar-nav d-flex align-items-center">
//               <li className="nav-item">
//                 <Link className="nav-link text-dark" to="#">Sign up</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link text-dark" to="/api/Clients">Clients</Link>
//               </li>
//               <li className="nav-item">
//                 <Link className="nav-link text-dark" to="/cart">
//                   <img src="/cart.svg" alt="Cart" className="cart-icon" />
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
      
//       <div className={`overlay ${isOverlayOpen ? 'open' : ''}`}>
//         <div className="overlay-content">
//           <Link to="#" onClick={closeOverlay}>Категорії</Link>
//           <Link to="#" onClick={closeOverlay}>Товари</Link>
//           <Link to="/api/Clients" onClick={closeOverlay}>Клієнти</Link>
//           <Link to="#" onClick={closeOverlay}>Бонуси</Link>
//         </div>
//       </div>

//       <div className={`blur-background ${isOverlayOpen ? 'active' : ''}`} onClick={toggleOverlay}></div>
//     </header>
//   );
// }

// export default Header;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';

function Header() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-sm navbar-light bg-white navbar-custom mb-3">
        <div className="container-fluid">
          <li className="nav-item">
          <button className="menu-button" onClick={toggleOverlay}>
            <img src="/menu.svg" alt="Menu" className="menu-icon" />
          </button>
          </li>
          <Link className="navbar-brand" to="/">Magaz</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse collapse d-flex justify-content-between align-items-center w-100">
            <div className="search-container">
              <div className='search-wrapper'>
                <input type="text" className="form-control search-input" placeholder="Search" />
                <img src="/loupe.svg" alt="Search" className="search-icon" />
              </div>
            </div>
            <ul className="navbar-nav d-flex align-items-center">
              <li className="nav-item">
                <Link className="nav-link text-dark" to="#">Sign up</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/api/Clients">Clients</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/cart">
                  <img src="/cart.svg" alt="Cart" className="cart-icon" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <div className={`overlay ${isOverlayOpen ? 'open' : ''}`}>
        <div className="overlay-content">
          <Link to="#" onClick={closeOverlay}>Категорії</Link>
          <Link to="#" onClick={closeOverlay}>Товари</Link>
          <Link to="/api/Clients" onClick={closeOverlay}>Клієнти</Link>
          <Link to="#" onClick={closeOverlay}>Бонуси</Link>
        </div>
      </div>

      <div className={`blur-background ${isOverlayOpen ? 'active' : ''}`} onClick={toggleOverlay}></div>
    </header>
  );
}

export default Header;
