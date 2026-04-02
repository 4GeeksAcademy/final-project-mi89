import { useState, useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import PhotoCard from "../components/PhotoCard";

// Mock data — reemplazar con fetch al API cuando el backend esté listo
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
    type: "food",
    image: "https://picsum.photos/seed/churrasco1/400/400",
  },
  {
    id: 2,
    dish: "Tostones con mojo",
    restaurant: "Latin Grill Tampa",
    username: "@carlos_r",
    likes: 12,
    points: 8,
    timeAgo: "8 min ago",
    isHot: false,
    type: "food",
    image: "https://picsum.photos/seed/tostones1/400/400",
  },
  {
    id: 3,
    dish: "Ropa vieja",
    restaurant: "Latin Grill Tampa",
    username: "@sofia_m",
    likes: 9,
    points: 6,
    timeAgo: "15 min ago",
    isHot: false,
    type: "food",
    image: "https://picsum.photos/seed/ropav1/400/400",
  },
  {
    id: 4,
    dish: "Mojito",
    restaurant: "Latin Grill Tampa",
    username: "@pedro_l",
    likes: 7,
    points: 4,
    timeAgo: "22 min ago",
    isHot: false,
    type: "drink",
    image: "https://picsum.photos/seed/mojito1/400/400",
  },
  {
    id: 5,
    dish: "Coquito",
    restaurant: "Latin Grill Tampa",
    username: "@juan_k",
    likes: 18,
    points: 12,
    timeAgo: "30 min ago",
    isHot: true,
    type: "drink",
    image: "https://picsum.photos/seed/coquito1/400/400",
  },
  {
    id: 6,
    dish: "Arroz con pollo",
    restaurant: "Latin Grill Tampa",
    username: "@ana_p",
    likes: 5,
    points: 3,
    timeAgo: "45 min ago",
    isHot: false,
    type: "food",
    image: "https://picsum.photos/seed/arroz1/400/400",
  },
];

const REWARDS = [
  { name: "Free yuca fries", points: 50 },
  { name: "10% off your bill", points: 100 },
  { name: "Free dessert", points: 150 },
  { name: "Free churrasco combo", points: 200 },
];

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  // ── tu lógica original del backend ──
  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl)
        throw new Error("VITE_BACKEND_URL is not defined in .env file");
      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();
      if (response.ok) dispatch({ type: "set_hello", payload: data.message });
      return data;
    } catch (error) {
      if (error.message)
        throw new Error(`Could not fetch the message from the backend.`);
    }
  };

  // ── nuevo: location + filtros ──
  const [locationStatus, setLocationStatus] = useState("pending");
  const [citySearch, setCitySearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadMessage();

    // Pedir ubicación al montar
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => setLocationStatus("granted"),
      () => setLocationStatus("denied"),
    );
  }, []);

  const filteredPhotos = MOCK_PHOTOS.filter((p) => {
    if (filter === "drinks") return p.type === "drink";
    if (filter === "mostLiked") return p.likes >= 10;
    return true;
  }).sort((a, b) => (filter === "mostLiked" ? b.likes - a.likes : 0));

  const filters = [
    { key: "all", label: "🍽️ All dishes" },
    { key: "drinks", label: "🍹 Drinks" },
    { key: "mostLiked", label: "🔥 Most liked" },
  ];

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff" }}>
      {/* Location bar */}
      {locationStatus === "granted" && (
        <div
          style={{
            background: "#0d1f0d",
            padding: "8px 24px",
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
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          <span style={{ fontSize: "13px" }}>📍 Search by city:</span>
          <input
            type="text"
            placeholder="e.g. Miami, NYC..."
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            style={{
              background: "#2a2a2a",
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "6px 12px",
              color: "#fff",
              width: "200px",
              outline: "none",
            }}
          />
          <button
            style={{
              background: "#ff6b35",
              border: "none",
              borderRadius: "8px",
              padding: "6px 16px",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Search
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
          gap: "24px",
        }}
      >
        {/* Feed principal */}
        <div style={{ flex: 1 }}>
          {/* Filtros */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "13px",
                  border: filter === key ? "none" : "1px solid #333",
                  background: filter === key ? "#ff6b35" : "#1a1a1a",
                  color: "#fff",
                  fontWeight: filter === key ? "600" : "400",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Grid de fotos */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {filteredPhotos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div
          style={{
            width: "280px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Upload CTA */}
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "22px", marginBottom: "8px" }}>
              📸 You're here!
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "#aaa",
                marginBottom: "10px",
                lineHeight: "1.5",
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
              style={{
                width: "100%",
                background: "#ff6b35",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Upload my photo
            </button>
          </div>

          {/* Rewards */}
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
                  padding: "8px 0",
                  borderBottom: "1px solid #2a2a2a",
                  fontSize: "13px",
                }}
              >
                <span>{r.name}</span>
                <span style={{ color: "#ff6b35", fontWeight: "600" }}>
                  {r.points} pts
                </span>
              </div>
            ))}
          </div>

          {/* Weekly competition */}
          <div
            style={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>
              Weekly competition 🏆
            </div>
            <p style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.5" }}>
              Top snapper at Latin Grill Tampa this week wins a{" "}
              <span style={{ color: "#ff6b35", fontWeight: "600" }}>
                free churrasco dinner for 2
              </span>
              . Upload more to climb the ranks!
            </p>
            <div
              style={{ fontSize: "12px", color: "#ff6b35", marginTop: "10px" }}
            >
              Ends in: 2 days 14 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
