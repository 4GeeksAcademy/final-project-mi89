import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();

  function logOut() {
    dispatch({ type: "set_loggingOut", payload: true })
    // This store variable will equal true only when the user clicks Log Out from the navbar, then it will immediately become false because of the useEffect inside Login.jsx, which will then log out and navigate to the home page.
  }

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
            <button className="btn btn-success  ">Search</button>
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
            id="offcanvasNavbar" style={{ width: "300px" }}
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
                <li className="nav-item dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle w-100"
                    data-bs-toggle="dropdown"
                  >
                    Account
                  </button>

                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile: Costumer or Owner
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item " to="/login">
                        <i className="fa-solid fa-user-plus me-2 "></i>
                        {store.userToken === null ? <span>Log In or Sign Up</span> : <span onClick={logOut}>Log Out</span>}
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};