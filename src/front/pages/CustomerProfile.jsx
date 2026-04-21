import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RestaurantCard } from "../components/RestaurantCard";

const REWARDS = [
  { name: "Free yuca fries", points: 50 },
  { name: "10% off your bill", points: 100 },
  { name: "Free dessert", points: 150 },
  { name: "Free churrasco combo", points: 200 },
];

const restaurantRewards = [
  {
    id: 1,
    restaurantName: "Chipotle",
    points: 50,
    expiration: "5-12-26",
    image: "https://www.eatthis.com/wp-content/uploads/sites/4/2022/06/chipotle-burrito-bowls-tacos.jpg?quality=82&strip=1&w=800",
    cardBg: "#0f0f0f",
    textColor: "#fff",
  },
  {
    id: 2,
    restaurantName: "Chick-Fil-A",
    points: 50,
    expiration: "5-12-26",
    image: "https://www.thedailymeal.com/img/gallery/what-chick-fil-a-was-first-called/l-intro-1664327200.jpg",
    cardBg: "#ffffff",
    textColor: "#000000",
  },
  {
    id: 3,
    restaurantName: "Latin Grill",
    points: 80,
    expiration: "5-20-26",
    image: "https://tse2.mm.bing.net/th/id/OIP.pZ6huuILAsMRCV0TbEsUlwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
    cardBg: "#ffffff",
    textColor: "#000000",
  },
  {
    id: 4,
    restaurantName: "All you can eat sushi",
    points: 50,
    expiration: "5-12-26",
    image: "https://media.istockphoto.com/id/1257433964/photo/sushi.jpg?s=612x612&w=0&k=20&c=9wed3Ja7iQqTDZi_eg9NIgF-vY3DdFQL5WMtJ5QNBZY=",
    cardBg: "#ffffff",
    textColor: "#000000",
  },
];

export const CustomerProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
  });

  const [rewardCards, setRewardCards] = useState(restaurantRewards);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
        color: "#fff",
        minHeight: "100vh",
        paddingTop: "80px",
      }}
    >
      {/* HEADER SECTION */}
      <div
        style={{
          background: "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
          padding: "40px 20px",
          marginBottom: "40px",
          boxShadow: "0 10px 40px rgba(255, 107, 53, 0.2)",
        }}
      >
        <div className="container text-center">
          <h1 style={{ fontSize: "42px", fontWeight: "700", marginBottom: "10px" }}>
            Customer Profile
          </h1>
          <p style={{ fontSize: "16px", opacity: "0.95" }}>
            Manage your rewards and restaurant preferences
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container-fluid px-4">
        <div className="row g-4">
          {/* First Column - Profile Info */}
          <div className="col-lg-3 col-md-4">
            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "16px",
                padding: "25px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Profile Picture */}
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
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "40px",
                      fontWeight: "700",
                      marginBottom: "12px",
                      boxShadow: "0 8px 24px rgba(255, 107, 53, 0.3)",
                    }}
                  >
                    👤
                  </div>
                  <label
                    htmlFor="profilePicture"
                    style={{
                      color: "#ff6b35",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#ff8c5a")}
                    onMouseLeave={(e) => (e.target.style.color = "#ff6b35")}
                  >
                    ✏️ Edit picture
                  </label>
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>

                {/* Form Fields */}
                <div>
                  <label
                    htmlFor="name"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#ff6b35",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    style={{
                      background: "#0f0f0f",
                      border: "1px solid #333",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#ff6b35",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Username
                  </label>
                  <div className="input-group">
                    <div
                      className="input-group-text"
                      style={{
                        background: "#0f0f0f",
                        border: "1px solid #333",
                        color: "#ff6b35",
                      }}
                    >
                      @
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Username"
                      style={{
                        background: "#0f0f0f",
                        border: "1px solid #333",
                        color: "#fff",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#ff6b35",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Bio
                  </label>
                  <textarea
                    className="form-control"
                    id="bio"
                    rows="3"
                    placeholder="Write your bio"
                    style={{
                      background: "#0f0f0f",
                      border: "1px solid #333",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="link1"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#ff6b35",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Link 1
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="link1"
                    placeholder="https://example.com"
                    style={{
                      background: "#0f0f0f",
                      border: "1px solid #333",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="link2"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#ff6b35",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Link 2
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="link2"
                    placeholder="https://example.com"
                    style={{
                      background: "#0f0f0f",
                      border: "1px solid #333",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn"
                  style={{
                    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
                    color: "#fff",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px",
                    marginTop: "10px",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                >
                  💾 Save Changes
                </button>
              </form>
            </div>
          </div>

          {/* Second Column - Points & Rewards */}
          <div className="col-lg-6 col-md-8">
            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "16px",
                padding: "25px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ color: "#ff6b35", marginBottom: "20px", fontWeight: "700" }}>
                🎯 Points & Wallet
              </h3>

              <div className="mb-3">
                <Link
                  to="/appetizers"
                  style={{
                    display: "inline-block",
                    padding: "10px 24px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontSize: "14px",
                    border: "2px solid #ff6b35",
                    background: "transparent",
                    color: "#ff6b35",
                    fontWeight: "600",
                    textDecoration: "none",
                    transition: "all 0.3s",
                    marginRight: "10px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#ff6b35";
                    e.target.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#ff6b35";
                  }}
                >
                  🍽️ All Restaurants
                </Link>
              </div>

              <button
                type="button"
                className="btn"
                style={{
                  background: "linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)",
                  color: "#fff",
                  fontWeight: "600",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  marginBottom: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  const updatedCards = rewardCards.map((card) =>
                    card.restaurantName === "Chipotle"
                      ? { ...card, points: card.points + 20 }
                      : card
                  );
                  setRewardCards(updatedCards);
                }}
              >
                📱 Test QR Scan (+20 Chipotle Points)
              </button>

              <div
                style={{
                  display: "flex",
                  overflowX: "auto",
                  gap: "15px",
                  paddingBottom: "10px",
                }}
              >
                {rewardCards.map((card) => (
                  <div key={card.id} style={{ minWidth: "250px" }}>
                    <RestaurantCard
                      image={card.image}
                      restaurantName={card.restaurantName}
                      points={card.points}
                      description={`Point Expiration: (${card.expiration})`}
                      buttonText="Claim Deal"
                      cardBg={card.cardBg}
                      textColor={card.textColor}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Third Column - Rewards System */}
          <div className="col-lg-3 col-md-12">
            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "16px",
                padding: "25px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ color: "#ff6b35", marginBottom: "20px", fontWeight: "700" }}>
                🏆 Reward System
              </h3>

              <div
                style={{
                  background: "#0f0f0f",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#ff6b35",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "12px",
                  }}
                >
                  Available Rewards
                </div>

                {REWARDS.map((r) => (
                  <div
                    key={r.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid #2a2a2a",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ color: "#fff" }}>{r.name}</span>
                    <span
                      style={{
                        color: "#ff6b35",
                        fontWeight: "700",
                        background: "#2a2a2a",
                        padding: "2px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      {r.points} pts
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "#151515",
                  border: "2px solid #ff6b35",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontWeight: "700",
                    marginBottom: "10px",
                    color: "#ff6b35",
                    fontSize: "15px",
                  }}
                >
                  🏆 Weekly Competition
                </div>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#ddd",
                    lineHeight: "1.6",
                    marginBottom: "10px",
                  }}
                >
                  Top snapper at Latin Grill Tampa this week wins a{" "}
                  <span style={{ color: "#ff6b35", fontWeight: "700" }}>
                    free churrasco dinner for 2
                  </span>
                  !
                </p>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#ff6b35",
                    fontWeight: "600",
                  }}
                >
                  ⏰ Ends in: 2 days 14 hours
                </div>
              </div>

              <Link to="/restaurant/1/upload">
                <button
                  type="button"
                  className="btn w-100"
                  style={{
                    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
                    color: "#fff",
                    fontWeight: "600",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px",
                    marginTop: "15px",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
                >
                  📸 Upload Photo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};