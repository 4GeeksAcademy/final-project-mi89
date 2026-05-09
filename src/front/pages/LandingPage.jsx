import React from "react";
import "../styles/landing-page.css";
import logo from "../assets/img/Platera1Transparent.png"

export const LandingPage = () => {
  return (
    <div className="container text-center">
      <img src={logo} alt="Our logo: Cartoon dinner plate who has a smiley face and holds a fork" />
      <h1 className="carter-one-regular">
        <span className="white-header">Let your </span>
        <span className="orange-header">customers</span><br />
        <span className="white-header">do your </span>
        <span className="orange-header">marketing </span>
        <span className="white-header">for you</span>
      </h1>
      <p>Let your customers be your photographers. The better the photo, the more the rewards they earn. And the more money you save! </p>
      <div className="stats">
        <div>
          <h2 className="orange-header fw-bold">60%</h2>
          <p>"Food photos can boost a restaurant's engagement by up to 60%"*</p>
        </div>
        <div>
          <h2 className="orange-header fw-bold">40%</h2>
          <p>"of restaurants attract new customers through social media promotions."*</p>
        </div>
        <div>
          <h2 className="orange-header fw-bold">30%</h2>
          <p>"Customer photos can enhance a restaurant's credibility by 30%"*</p>
        </div>
      </div>
      <span className="white-header call-to-action">Want to try it for your restaurant? <button to="/login">Sign up</button><br /></span>
      <small>*Data from: https://jobera.com/resources/restaurant-social-media-statistics/</small>
    </div>
  );
};
