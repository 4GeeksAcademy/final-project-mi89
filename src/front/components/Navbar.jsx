import { Link } from "react-router-dom";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store } = useGlobalReducer();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">

        <Link className="navbar-brand" to="/">
          YummyEats
        </Link>

        <div className="d-flex align-items-center gap-2 ms-auto">
          {/* SEARCH */}
          <form className="d-flex mt-2 mb-2 ">
            <input
              className="form-control me-2 gap-2 "
              type="search"
              placeholder="Search"
              style={{ width: "350px" }}
            />
            <button type="button" className="btn btn-success">Search</button>
          </form>

          {/* TOGGLER */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* OFFCANVAS MENU */}
          <div
            className="offcanvas offcanvas-end text-bg-dark "
            id="offcanvasNavbar"
            style={{ width: "300px" }}
          >
            <div className="offcanvas-header  ">
              <h5 className="offcanvas-title">Menu</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
              ></button>
            </div>

            <div className="offcanvas-body  ">

              {/* LEFT SIDE LINKS */}
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <Link className="nav-link active" to="/feed">
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/link">
                    Feed-Link
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/link">
                    Settings
                  </Link>
                </li>

                {/* ACCOUNT DROPDOWN - FIXED */}
                <li className="nav-item my-2 me-3">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => setShowAccountMenu(!showAccountMenu)}
                    style={{
                      textAlign: "left",
                      backgroundColor: "#6c757d",
                      border: "none"
                    }}
                  >
                    Account ▼
                  </button>
                </li>

                {/* DROPDOWN MENU - Shows/Hides based on state */}
                {showAccountMenu && (
                  <ul
                    className="list-unstyled ms-3 mt-3"
                    style={{
                      backgroundColor: "#495057",
                      borderRadius: "5px",
                      padding: "10px 5px"
                    }}
                  >
                    
                    <li>
                      <Link
                        className="nav-link"
                        to="/profile"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        👤 My Profile
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="nav-link"
                        to="/login"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <i className="fa-solid fa-user-plus me-2 "></i>
                        {store.userToken === null ? "Log In or Sign Up" : "Log Out"}
                      </Link>
                    </li>
                  
                  </ul>
                )}

            </ul>
          </div>
        </div>
      </div>

    </div>
    </nav >
  );
};