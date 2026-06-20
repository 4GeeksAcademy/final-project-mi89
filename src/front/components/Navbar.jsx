import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/img/Platera1.png"
export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();

  function logOut() {
    dispatch({ type: "set_loggingOut", payload: true })
    // This store variable will equal true only when the user clicks Log Out from the navbar, then it will immediately become false because of the useEffect inside Login.jsx, which will then log out and navigate to the home page.
  }
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const [userType, setUserType] = useState("");
  const navigate = useNavigate()
  const handleProfileClick = () => {

    // alert()
    // console.log(userType)
    console.log("userType value:", userType);

    if (userType === "Customer") {

      navigate("/customer-profile")

    } else if (userType === "Owner") {
      navigate("/owner-profile")
    }

  }

  // const profileRoute =
  //   userType === "customer"
  //     ? navigate("/customer-profile") 
  //     : navigate("/owner-profile")

  const getUser = async () => {
    const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/user", {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("jwt-token") },
    })

    const data = await resp.json()
    const userType = data.user_type;
    setUserType(userType)
    console.log("This is the user: ", data);


    console.log("data.id is:", data.id);



    return data;
  }

  useEffect(() => {
    getUser()

  }, [localStorage.getItem("jwt-token")]);

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">


        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Platera" style={{ height: "70px", width: "auto" }} />
        </Link>


        <div className="d-flex align-items-center gap-2 ms-auto">
          {/* SEARCH */}
          {/* <form className="d-flex mt-2 mb-2 ">
            <input
              className="form-control me-2 gap-2 "
              type="search"
              placeholder="Search"
              style={{ width: "350px" }}
            />
            <button type="button" className="btn btn-success">Search</button>
          </form> */}

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
                  <Link className="nav-link active" to="/">
                    Home
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link disabled" to="/link">
                    Photo Feed
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link disabled" to="/link">
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
                      <button
                        className="nav-link"
                        onClick={handleProfileClick}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        👤 My Profile
                      </button>
                    </li>

                    <li>
                      <Link
                        className="nav-link"
                        to="/login"
                        onClick={() => setShowAccountMenu(false)}
                      >
                        <i className="fa-solid fa-user-plus me-2 "></i>
                        {store.userToken === null ? <span>Log In or Sign Up</span> : <span onClick={logOut}>Log Out</span>}
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