import React from "react";

export const RestaurantCard = ({
  image,
  restaurantName,
  points,
  description,
  buttonText,
  cardBg = "#0f0f0f",
  textColor = "#fff",
    imageHeight = "180px",  // ← ADD THIS with default value
}) => {
  return (
    <div
      className="card border mx-1 rounded border-warning"
      style={{ minWidth: "30%", background: "#0f0f0f", height: "400px", display: "flex", flexDirection: "column" }}
    >
      <img 
        src={image} 
        className="card-img-top" 
        alt={restaurantName}
        style={{ height: imageHeight, objectFit: "cover", width: "100%" }}
        
      />

      <div
        className="card-body rounded"
        style={{ background: cardBg, color: textColor, flex: 1, display: "flex", flexDirection: "column" }}
      >
        <div className="row align-items-center">
          <h6 className="col-5" style={{ color: textColor }}>
            {restaurantName}
          </h6>

          <h5
            className="col-7"
            style={{
              fontSize: "12px",
              color: "#ff6b35",
              marginTop: "10px",
            }}
          >
            (Total = {points} pts)
          </h5>
        </div>

        <div
          className="progress"
          role="progressbar"
          aria-label="Restaurant points progress"
          aria-valuenow={25}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div className="progress-bar" style={{ width: "25%" }}>
            25%
          </div>
        </div>

        <p className="card-text" style={{ color: textColor }}>
          {description}
        </p>

        <a href="#" className="btn btn-primary mt-auto">
          {buttonText}
        </a>
      </div>
    </div>
  );
};