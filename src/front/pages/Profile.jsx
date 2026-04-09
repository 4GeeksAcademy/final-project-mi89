import React from "react";
import car from "../assets/img/rigo-baby.jpg"; // make sure this path is correct
import { Link } from "react-router-dom";
import { RestaurantCard } from "../components/RestaurantCard";

const MOCK_PHOTOS = [
  {
    id: 1,
    dish: "Churrasco",
    restaurant: "Latin Grill Tampa",
    username: "@maria_g",
    likes: 24,
    points: 10,
    timeAgo: "2 min ago",
    isHot: true,
    category: "entree",
    image: "https://picsum.photos/seed/churrasco1/400/400",
  },
];




const REWARDS = [
  { name: "Free yuca fries", points: 50 },
  { name: "10% off your bill", points: 100 },
  { name: "Free dessert", points: 150 },
  { name: "Free churrasco combo", points: 200 },
];


const filters = [
  { key: "all", label: "🍽️ All" },
  { key: "app", label: "🥗 Appetizer" },
  { key: "entree", label: "🥩 Entrée" },
  { key: "dessert", label: "🍮 Dessert" },
  { key: "cocktail", label: "🍹 Cocktail" },
  { key: "mocktail", label: "🧃 Mocktail" },
  { key: "mostLiked", label: "🔥 Most liked" },
];


const scrollRowRight = (rowId) => {
  const row = document.getElementById(rowId);
  if (row) {
    row.scrollBy({ left: 300, behavior: "smooth" });
  }
};


export const Profile = () => {
  return (


    <div style={{ background: "#0f0f0f", color: "#fff" }}>
      <div className="text-center pt-4 my-5" style={{ background: "#0f0f0f", color: "#fff" }}>
        <h2>Customer Profile</h2>

        <div className="row container-fluid">

          {/* First Column */}
          <div className="col-3 p-3 border border-warning">

            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    background: "#d9d9d9",
                    color: "#222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  AA
                </div>

                <label
                  htmlFor="profilePicture"
                  style={{
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Edit picture
                </label>
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="username"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Username
                </label>
                <div className="input-group">
                  <div className="input-group-text">@</div>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Bio
                </label>
                <textarea
                  className="form-control"
                  id="bio"
                  rows="3"
                  placeholder="Write your bio"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="rewards"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Rewards
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="rewards"
                  placeholder="Your rewards"
                />
              </div>

              <div>
                <label
                  htmlFor="link1"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Link
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="link1"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="link2"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Link
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="link2"
                  placeholder="https://example.com"
                />
              </div>

              <div style={{ marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary w-100">
                  Save
                </button>
              </div>
            </form>

          
          </div>



          {/* Second Column */}
          <div className="col-6 p-3 border border-warning  "
            style={{ background: "#0f0f0f" }} >
            <div className=" text-secondary my-2 p-3 border border-warning ">
              <h4>Points and Wallet</h4>
            </div>

            <div className="col-2">

              <Link className="border border-warning "
                to="/appetizers"
                style={{
                  display: "inline-block",
                  padding: "8px 18px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "13px",
                  flexShrink: 0,
                  border: "1px solid #333",
                  background: "#1a1a1a",
                  color: "#fff",
                  fontWeight: "400",
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                }}
              >
                <h4>🍽️ All</h4>
              </Link>
            </div>

            <div className="text-dark my-2 p-3 d-flex overflow-x-scroll flex-nowrap border border-warning">
              <RestaurantCard
                image="https://picsum.photos/id/227/247/200"
                restaurantName="Chipotle"
                points={50}
                description="Some quick example text."
                buttonText="Claim Deal"
                cardBg="#0f0f0f"
                textColor="#fff"
              />

              <RestaurantCard
                image="https://picsum.photos/id/227/247/200"
                restaurantName="Chick-Fil-A"
                points={50}
                description="Some quick example text."
                buttonText="Claim Deal"
                cardBg="#ffffff"
                textColor="#000000"
              />

              <RestaurantCard
                image="https://picsum.photos/id/227/247/200"
                restaurantName="Latin Grill"
                points={80}
                description="Earn more points with every visit."
                buttonText="Claim Deal"
                cardBg="#ffffff"
                textColor="#000000"
              />

              <RestaurantCard
                image="https://picsum.photos/id/227/247/200"
                restaurantName="Chipotle"
                points={50}
                description="Some quick example text."
                buttonText="Claim Deal"
                cardBg="#0f0f0f"
                textColor="#fff"
              />

              <RestaurantCard
                image="https://picsum.photos/id/227/247/200"
                restaurantName="Chick-Fil-A"
                points={50}
                description="Some quick example text."
                buttonText="Claim Deal"
                cardBg="#ffffff"
                textColor="#000000"
              />

              <RestaurantCard
                image="https://picsum.photos/id/227/247/200"
                restaurantName="Latin Grill"
                points={80}
                description="Earn more points with every visit."
                buttonText="Claim Deal"
                cardBg="#ffffff"
                textColor="#000000"
              />






            </div>

          </div>

          {/* Third Column */}
          <div className="col-3 p-3 border border-warning "
            style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }} >
            <div className="bg-light text-dark my-2 p-3">
              <h4>Point System</h4>
            </div>

            <div className="bg-light text-dark my-2 p-3">

              {/* Rewards Section */}
              <div
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#ff6b35", // 🔥 changed color here
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "14px",
                  }}
                >
                  🏆 Available Rewards
                </div>

                {REWARDS.map((r) => (
                  <div
                    key={r.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "9px 0",
                      borderBottom: "1px solid #2a2a2a",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ color: "#fff" }}>{r.name}</span> {/* optional improvement */}
                    <span style={{ color: "#ff6b35", fontWeight: "600" }}>
                      {r.points} pts
                    </span>
                  </div>
                ))}
              </div>

              {/* Weekly competition */}
              <div
                style={{
                  background: "#151515",
                  border: "1px solid #ffffff",
                  borderRadius: "12px",
                  padding: "20px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: "#ff6b35", // 🔥 changed from green to match theme
                  }}
                >
                  Weekly competition 🏆
                </div>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#c4b8b8", // 🔥 fixed (was too light before)
                    lineHeight: "1.6",
                  }}
                >
                  Top snapper at Latin Grill Tampa this week wins a{" "}
                  <span style={{ color: "#ff6b35", fontWeight: "600" }}>
                    free churrasco dinner for 2
                  </span>
                  . Upload more to climb the ranks!
                </p>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#ff6b35",
                    marginTop: "10px",
                  }}
                >
                  Ends in: 2 days 14 hours
                </div>
              </div>

            </div>



            <div className="col-auto my-5">
              <button type="Upload Photo"
                className="btn btn-warning ">
                <h5>Upload Photo</h5>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>

  );
};





