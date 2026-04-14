import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

const CATEGORIES = [
  { value: "app", label: "🥗 Appetizer" },
  { value: "entree", label: "🥩 Entrée" },
  { value: "dessert", label: "🍮 Dessert" },
  { value: "cocktail", label: "🍹 Cocktail" },
  { value: "mocktail", label: "🧃 Mocktail" },
];

export default function CustomerUpload() {
  const { id: restaurantId } = useParams();
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dish, setDish] = useState("");
  const [category, setCategory] = useState("entree");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [uploadedAsGuest, setUploadedAsGuest] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");

    if (!token || token === "undefined" || token === "null") {
      localStorage.setItem(
        "redirect-after-login",
        `/restaurant/${restaurantId}/upload`
      );
      navigate("/login");
      return;
    }

    setCheckingAuth(false);
  }, [restaurantId, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) return setError("Please select a photo first.");
    if (!dish.trim()) return setError("Please enter the dish name.");

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("jwt-token");

      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("dish_name", dish.trim());
      formData.append("category", category);
      formData.append("restaurant_id", restaurantId || 1);

      const headers = {};
      if (token && token !== "undefined" && token !== "null") {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${BACKEND}/photo/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.msg || `Server error (${res.status})`);
      }

      setPointsAwarded(data.points_awarded || 0);
      setUploadedAsGuest(Boolean(data.uploaded_as_guest));
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f0f0f",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        Checking login...
      </div>
    );
  }

  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f0f0f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          padding: "24px",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>

        <h2 style={{ color: "#ff6b35", fontSize: 28, margin: "0 0 8px" }}>
          Photo Uploaded!
        </h2>

        {uploadedAsGuest ? (
          <p style={{ color: "#aaa", marginBottom: 24, maxWidth: 420 }}>
            Your photo was uploaded successfully as a{" "}
            <strong style={{ color: "#ff6b35" }}>guest</strong>.
          </p>
        ) : (
          <p style={{ color: "#aaa", marginBottom: 24 }}>
            You earned{" "}
            <strong style={{ color: "#ff6b35" }}>+{pointsAwarded} points</strong>{" "}
            for your snap!
          </p>
        )}

        {preview && (
          <img
            src={preview}
            alt="uploaded"
            style={{
              width: 200,
              height: 200,
              objectFit: "cover",
              borderRadius: 16,
              marginBottom: 24,
              border: "3px solid #ff6b35",
            }}
          />
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => {
              setSuccess(false);
              setPhoto(null);
              setPreview(null);
              setDish("");
              setCategory("entree");
              setPointsAwarded(0);
              setUploadedAsGuest(false);
            }}
            style={{
              background: "#ff6b35",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            📸 Upload Another
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            style={{
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: 12,
              padding: "12px 24px",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            🏠 Go to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "#fff",
        fontFamily: "'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#1a1a1a",
          borderRadius: 20,
          padding: "28px 24px",
          border: "1px solid #2a2a2a",
        }}
      >
        <h2 style={{ margin: "0 0 4px", color: "#ff6b35", textAlign: "center" }}>
          📸 Snap Your Dish
        </h2>

        <p
          style={{
            color: "#888",
            textAlign: "center",
            fontSize: 13,
            marginTop: 0,
            marginBottom: 24,
          }}
        >
          Upload a photo at{" "}
          <strong style={{ color: "#ff6b35" }}>Latin Grill Tampa</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: preview ? "transparent" : "#111",
              border: `2px dashed ${preview ? "#ff6b35" : "#444"}`,
              borderRadius: 14,
              padding: preview ? 0 : "32px 16px",
              cursor: "pointer",
              marginBottom: 18,
              overflow: "hidden",
              minHeight: 180,
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "100%",
                  maxHeight: 260,
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
            ) : (
              <>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                <span style={{ color: "#888", fontSize: 14 }}>
                  Tap to take / select photo
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          {preview && (
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                setPreview(null);
              }}
              style={{
                width: "100%",
                background: "none",
                border: "1px solid #444",
                borderRadius: 8,
                color: "#888",
                padding: "7px",
                cursor: "pointer",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              ✕ Remove photo
            </button>
          )}

          <div style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                color: "#aaa",
                marginBottom: 6,
              }}
            >
              Dish Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Churrasco con tostones"
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              required
              style={{
                width: "100%",
                background: "#111",
                border: "1px solid #444",
                borderRadius: 10,
                padding: "12px 14px",
                color: "#fff",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                color: "#aaa",
                marginBottom: 6,
              }}
            >
              Category
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    border: category === c.value ? "none" : "1px solid #444",
                    background: category === c.value ? "#ff6b35" : "#222",
                    color: "#fff",
                    fontWeight: category === c.value ? 700 : 400,
                    cursor: "pointer",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "#2a0000",
                border: "1px solid #ff4444",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#ff6b6b",
                marginBottom: 14,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "#555"
                : "linear-gradient(135deg, #ff6b00, #ff8c00)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px",
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px rgba(255,107,0,0.4)",
            }}
          >
            {loading ? "Uploading... ⏳" : "🚀 Upload Photo"}
          </button>
        </form>
      </div>
    </div>
  );
}