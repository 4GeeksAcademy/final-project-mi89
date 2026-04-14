import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RestaurantCard } from "../components/RestaurantCard";

const OWNER_REWARDS = [
  { name: "Free appetizer coupon", points: 50, used: 12 },
  { name: "10% discount voucher", points: 100, used: 28 },
  { name: "Free entree coupon", points: 150, used: 8 },
  { name: "Complimentary dessert", points: 200, used: 5 },
];

const customerReviews = [
  {
    id: 1,
    customerName: "Maria G.",
    rating: 5,
    review: "Amazing food and great service!",
    date: "2 days ago",
    avatar: "M",
  },
  {
    id: 2,
    customerName: "John D.",
    rating: 4,
    review: "Good food, a bit pricey.",
    date: "1 week ago",
    avatar: "J",
  },
  {
    id: 3,
    customerName: "Alex R.",
    rating: 5,
    review: "Best churrasco in town!",
    date: "2 weeks ago",
    avatar: "A",
  },
  {
    id: 4,
    customerName: "Sofia L.",
    rating: 4,
    review: "Love the ambiance and food!",
    date: "3 weeks ago",
    avatar: "S",
  },
];

export const OwnerProfile = () => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    location: "",
    cuisine: "",
    phone: "",
  });

  const [rewards, setRewards] = useState(OWNER_REWARDS);
  const [reviews, setReviews] = useState(customerReviews);

  return (
    <div style={{ background: "#0f0f0f", color: "#fff" }}>
      <div
        className="text-center pt-4 my-5"
        style={{ background: "#0f0f0f", color: "#fff" }}
      >
        <h2 className="my-3">Restaurant Owner Dashboard</h2>

        <div className="row container-fluid">
          {/* First Column - Restaurant Info */}
          <div className="col-3 p-3">
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
                    borderRadius: "12px",
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
                  🍽️
                </div>

                <label
                  htmlFor="restaurantLogo"
                  style={{
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Edit logo
                </label>
                <input
                  id="restaurantLogo"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>

              <div>
                <label
                  htmlFor="restaurantName"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Restaurant Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="restaurantName"
                  placeholder="Your Restaurant"
                  value={formData.restaurantName}
                  onChange={(e) =>
                    setFormData({ ...formData, restaurantName: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="cuisine"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Cuisine Type
                </label>
                <select
                  className="form-control"
                  id="cuisine"
                  value={formData.cuisine}
                  onChange={(e) =>
                    setFormData({ ...formData, cuisine: e.target.value })
                  }
                >
                  <option value="">Select cuisine</option>
                  <option value="Latin">Latin</option>
                  <option value="Italian">Italian</option>
                  <option value="Asian">Asian</option>
                  <option value="American">American</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  style={{ display: "block", marginBottom: "6px", color: "#fff" }}
                >
                  Website
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="website"
                  placeholder="https://yourrestaurant.com"
                />
              </div>

              <div style={{ marginTop: "8px" }}>
                <button type="submit" className="btn btn-primary w-100">
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Second Column - Menu/Photos & Analytics */}
          <div className="col-6 p-3" style={{ background: "#0f0f0f" }}>
            <div className="text-secondary my-2 p-3">
              <h4>📊 Performance Analytics</h4>
            </div>

            <div className="row">
              <div className="col-6">
                <div
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ color: "#ff6b35", fontSize: "12px", fontWeight: "600" }}>
                    Total Points Distributed
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: "700", color: "#fff" }}>
                    2,450
                  </div>
                  <div style={{ color: "#888", fontSize: "12px" }}>This month</div>
                </div>
              </div>

              <div className="col-6">
                <div
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ color: "#ff6b35", fontSize: "12px", fontWeight: "600" }}>
                    Active Customers
                  </div>
                  <div style={{ fontSize: "28px", fontWeight: "700", color: "#fff" }}>
                    128
                  </div>
                  <div style={{ color: "#888", fontSize: "12px" }}>+12 this week</div>
                </div>
              </div>
            </div>

            <div className="text-secondary my-3 p-3">
              <h4>🍽️ Menu Items</h4>
            </div>

            <div className="col-auto my-2">
              <button type="button" className="btn btn-success">
                <h5>+ Add Menu Item</h5>
              </button>
              <button type="button" className="btn btn-info ms-2">
                <h5>📸 Upload Photo</h5>
              </button>
            </div>

            <div className="text-dark my-2 p-3 d-flex overflow-x-scroll flex-nowrap">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "15px",
                    minWidth: "150px",
                    marginRight: "10px",
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  <div style={{ fontSize: "40px", marginBottom: "8px" }}>🍴</div>
                  <div style={{ fontSize: "12px", fontWeight: "600" }}>
                    Menu Item {item}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
                    45 views
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Third Column - Rewards & Reviews */}
          <div
            className="col-3 p-3"
            style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}
          >
            <div className="bg-light text-dark my-2 p-3">
              <h4>🎁 Your Rewards</h4>
            </div>

            <div className="bg-light text-dark my-2 p-3">
              <div
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "12px",
                  padding: "20px",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {rewards.map((r) => (
                  <div
                    key={r.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid #2a2a2a",
                      fontSize: "13px",
                    }}
                  >
                    <div>
                      <div style={{ color: "#fff", fontWeight: "600" }}>
                        {r.name}
                      </div>
                      <div style={{ color: "#888", fontSize: "11px" }}>
                        {r.used} redeemed
                      </div>
                    </div>
                    <span style={{ color: "#ff6b35", fontWeight: "600" }}>
                      {r.points} pts
                    </span>
                  </div>
                ))}
              </div>

              <button className="btn btn-success w-100 mt-3">
                + Add New Reward
              </button>
            </div>

            <div className="bg-light text-dark my-2 p-3">
              <h4>⭐ Customer Reviews</h4>
            </div>

            <div
              style={{
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "12px",
                padding: "15px",
                maxHeight: "350px",
                overflowY: "auto",
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    marginBottom: "15px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid #2a2a2a",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <div
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        background: "#ff6b35",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "10px",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {review.avatar}
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>
                        {review.customerName}
                      </div>
                      <div style={{ color: "#888", fontSize: "11px" }}>
                        {review.date}
                      </div>
                    </div>
                  </div>
                  <div style={{ color: "#ff6b35", fontSize: "13px", marginBottom: "6px" }}>
                    {"⭐".repeat(review.rating)}
                  </div>
                  <div style={{ color: "#ccc", fontSize: "12px", lineHeight: "1.4" }}>
                    {review.review}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};