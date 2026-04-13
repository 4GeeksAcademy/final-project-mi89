import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import PhotoCard from "../components/PhotoCard";
import { useNavigate } from "react-router-dom";

const BACKEND = import.meta.env.VITE_BACKEND_URL;
const RESTAURANT_ID = 1;

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

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [locationStatus, setLocationStatus] = useState("pending");
  const [citySearch, setCitySearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);

  const loadPhotos = async () => {
    try {
      const response = await fetch(`${BACKEND}/photos`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.msg || "Could not fetch photos");

      setPhotos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading photos:", error);
      setPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    loadPhotos();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    if (!navigator.geolocation) {
      setLocationStatus("denied");
    } else {
      navigator.geolocation.getCurrentPosition(
        () => setLocationStatus("granted"),
        () => setLocationStatus("denied"),
      );
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredPhotos = photos
    .filter((p) => {
      if (filter === "all") return true;
      if (filter === "mostLiked") return (p.likes || 0) >= 10;
      return p.category === filter;
    })
    .sort((a, b) => (filter === "mostLiked" ? (b.likes || 0) - (a.likes || 0) : 0));

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
      {locationStatus === "granted" && (
        <div
          style={{
            background: "#0d1f0d",
            padding: "8px 16px",
            fontSize: "13px",
            color: "#4caf50",
            borderBottom: "1px solid #1a3a1a",
          }}
        >
          📍 Showing results near you
        </div>
      )}

      {locationStatus === "denied" && (
        <div
          style={{
            background: "#1a1a1a",
            padding: "10px 16px",
            borderBottom: "1px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "13px" }}>📍</span>
          <input
            type="text"
            placeholder="Search city... e.g. Tampa"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: "140px",
              background: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "7px 12px",
              color: "#fff",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <button
            style={{
              background: "#ff6b35",
              border: "none",
              borderRadius: "8px",
              padding: "7px 16px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Search
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "16px 12px" : "24px",
          gap: "24px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "20px",
              overflowX: "auto",
              flexWrap: isMobile ? "nowrap" : "wrap",
              paddingBottom: "6px",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  padding: isMobile ? "7px 14px" : "8px 18px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: isMobile ? "12px" : "13px",
                  flexShrink: 0,
                  border: filter === key ? "none" : "1px solid #333",
                  background: filter === key ? "#ff6b35" : "#1a1a1a",
                  color: "#fff",
                  fontWeight: filter === key ? "600" : "400",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {loadingPhotos && (
            <p style={{ color: "#888", textAlign: "center", padding: "40px" }}>
              Loading photos...
            </p>
          )}

          {!loadingPhotos && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr",
                gap: isMobile ? "10px" : "16px",
              }}
            >
              {filteredPhotos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} onLikeToggle={loadPhotos} />
              ))}
            </div>
          )}

          {!loadingPhotos && filteredPhotos.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#555",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
              <p style={{ fontSize: "14px" }}>
                No photos yet in this category.
                <br />
                Be the first to upload!
              </p>
            </div>
          )}
        </div>

        <div
          style={{
            width: isMobile ? "100%" : "280px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "8px" }}>📸 You're here!</div>
            <p
              style={{
                fontSize: "13px",
                color: "#aaa",
                marginBottom: "10px",
                lineHeight: "1.6",
              }}
            >
              Upload a photo of your dish and earn points you can redeem here.
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#ff6b35",
                marginBottom: "16px",
              }}
            >
              Earn +10 pts per photo · +2 pts per like
            </p>
            <button
              onClick={() => {
                const token = localStorage.getItem("jwt-token");

                if (token && token !== "undefined" && token !== "null") {
                  navigate("/restaurant/1/upload");
                } else {
                  localStorage.setItem("redirect-after-login", "/restaurant/1/upload");
                  navigate("/login");
                }
              }}
              style={{
                width: "100%",
                background: "#ff6b35",
                border: "none",
                borderRadius: "8px",
                padding: "13px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Upload my photo
            </button>
          </div>

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
                color: "#888",
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
                <span>{r.name}</span>
                <span style={{ color: "#ff6b35", fontWeight: "600" }}>{r.points} pts</span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>Weekly competition 🏆</div>
            <p style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.6" }}>
              Top snapper at Latin Grill Tampa this week wins a{" "}
              <span style={{ color: "#ff6b35", fontWeight: "600" }}>
                free churrasco dinner for 2
              </span>
              . Upload more to climb the ranks!
            </p>
            <div style={{ fontSize: "12px", color: "#ff6b35", marginTop: "10px" }}>
              Ends in: 2 days 14 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};