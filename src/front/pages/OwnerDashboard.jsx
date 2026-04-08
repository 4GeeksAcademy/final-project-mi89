import { useState, useEffect } from "react";
import Qrcode from "../components/Qrcode";

const BACKEND = "";
const RESTAURANT_ID = 1; // TODO: replace with store.restaurantId once auth is ready

export default function OwnerDashboard() {
  const [photos,  setPhotos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("photos"); // "photos" | "qr"

  // ── Fetch restaurant photos ──────────────────────────────────────────────
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND}/api/restaurant/${RESTAURANT_ID}/photos`);
      const data = await res.json();
      setPhotos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading restaurant photos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPhotos(); }, []);

  // ── Download helper ──────────────────────────────────────────────────────
  const downloadPhoto = async (url, name) => {
    try {
      const res  = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href     = URL.createObjectURL(blob);
      link.download = `${name.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  const totalLikes = photos.reduce((a, p) => a + (p.likes || 0), 0);

  return (
    <div style={{
      minHeight:   "100vh",
      background:  "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
      color:       "#fff",
      fontFamily:  "'Segoe UI', sans-serif",
    }}>

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <div style={{
        background:   "linear-gradient(135deg, #1a0a00, #2d1200)",
        borderBottom: "2px solid #ff6b00",
        padding:      "24px 32px",
        display:      "flex",
        alignItems:   "center",
        justifyContent: "space-between",
        flexWrap:     "wrap",
        gap:          12,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, color: "#ff6b00" }}>
            🍽️ Owner Dashboard
          </h1>
          <p style={{ margin: "4px 0 0", color: "#aaa", fontSize: 14 }}>
            Latin Grill Tampa · Restaurant #{RESTAURANT_ID}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "Total Photos", value: photos.length, icon: "📸" },
            { label: "Total Likes",  value: totalLikes,    icon: "❤️" },
            { label: "Hot Dishes",   value: photos.filter(p => p.isHot).length, icon: "🔥" },
          ].map(s => (
            <div key={s.label} style={{
              background:   "#2a1a00",
              border:       "1px solid #ff6b00",
              borderRadius: 10,
              padding:      "10px 18px",
              textAlign:    "center",
            }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#ff6b00" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TABS ──────────────────────────────────────────────────── */}
      <div style={{
        display:      "flex",
        gap:          0,
        borderBottom: "1px solid #333",
        background:   "#111",
        padding:      "0 32px",
      }}>
        {[
          { key: "photos", label: "📸 Customer Photos" },
          { key: "qr",     label: "📱 QR Code"         },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background:   "none",
              border:       "none",
              borderBottom: tab === t.key ? "3px solid #ff6b00" : "3px solid transparent",
              color:        tab === t.key ? "#ff6b00" : "#888",
              fontWeight:   tab === t.key ? 700 : 400,
              fontSize:     14,
              padding:      "14px 20px",
              cursor:       "pointer",
              transition:   "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── PHOTOS TAB ──────────────────────────────────────────── */}
        {tab === "photos" && (
          <>
            <div style={{
              display:       "flex",
              justifyContent: "space-between",
              alignItems:    "center",
              marginBottom:  20,
            }}>
              <h2 style={{ margin: 0, color: "#fff", fontSize: 18 }}>
                Customer Snapshots
                <span style={{ color: "#888", fontWeight: 400, fontSize: 14, marginLeft: 8 }}>
                  ({photos.length} photos)
                </span>
              </h2>
              <button
                onClick={fetchPhotos}
                style={{
                  background:   "#222",
                  border:       "1px solid #444",
                  borderRadius: 8,
                  color:        "#aaa",
                  padding:      "7px 14px",
                  cursor:       "pointer",
                  fontSize:     13,
                }}
              >
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
                <div style={{ fontSize: 40 }}>🍽️</div>
                <p>Loading photos...</p>
              </div>
            ) : photos.length === 0 ? (
              <div style={{
                textAlign:    "center",
                padding:      60,
                border:       "2px dashed #333",
                borderRadius: 16,
                color:        "#666",
              }}>
                <div style={{ fontSize: 48 }}>📷</div>
                <h3 style={{ color: "#888" }}>No photos yet</h3>
                <p style={{ fontSize: 14 }}>
                  Share your QR code with customers so they can start snapping!
                </p>
                <button
                  onClick={() => setTab("qr")}
                  style={{
                    marginTop:    12,
                    background:   "#ff6b00",
                    color:        "#fff",
                    border:       "none",
                    borderRadius: 10,
                    padding:      "10px 22px",
                    cursor:       "pointer",
                    fontWeight:   700,
                  }}
                >
                  Show QR Code
                </button>
              </div>
            ) : (
              <div style={{
                display:             "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap:                 20,
              }}>
                {photos.map(photo => {
                  const dishName = photo.dish || photo.dish_name || "Dish";
                  const imgSrc   = photo.image || photo.cloudinary_url || "";
                  return (
                    <div
                      key={photo.id}
                      style={{
                        background:   "#1a1a1a",
                        borderRadius: 14,
                        overflow:     "hidden",
                        border:       "1px solid #2a2a2a",
                      }}
                    >
                      {/* Photo */}
                      <div style={{ position: "relative", paddingTop: "65%" }}>
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={dishName}
                            style={{
                              position:  "absolute",
                              inset:     0,
                              width:     "100%",
                              height:    "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div style={{
                            position:       "absolute",
                            inset:          0,
                            display:        "flex",
                            alignItems:     "center",
                            justifyContent: "center",
                            fontSize:       40,
                            background:     "#111",
                          }}>
                            🍽️
                          </div>
                        )}

                        {/* HOT badge */}
                        {photo.isHot && (
                          <div style={{
                            position:     "absolute",
                            top:          8,
                            right:        8,
                            background:   "#ff4444",
                            color:        "#fff",
                            fontSize:     "10px",
                            fontWeight:   700,
                            padding:      "3px 8px",
                            borderRadius: 10,
                          }}>
                            🔥 HOT
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ padding: "14px" }}>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                          {dishName}
                        </div>
                        <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>
                          {photo.username || "@guest"} · {photo.category || ""}
                        </div>
                        <div style={{ display: "flex", gap: 12, fontSize: 13, color: "#888", marginBottom: 14 }}>
                          <span>❤️ {photo.likes || 0} likes</span>
                          <span>✨ {photo.points || 10} pts</span>
                        </div>

                        {/* Download button */}
                        {imgSrc && (
                          <button
                            onClick={() => downloadPhoto(imgSrc, dishName)}
                            style={{
                              width:        "100%",
                              background:   "linear-gradient(135deg, #ff6b00, #ff8c00)",
                              color:        "#fff",
                              border:       "none",
                              borderRadius: 8,
                              padding:      "9px 0",
                              fontWeight:   700,
                              fontSize:     13,
                              cursor:       "pointer",
                            }}
                          >
                            ⬇️ Download Photo
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── QR TAB ──────────────────────────────────────────────── */}
        {tab === "qr" && (
          <div style={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            padding:        "40px 20px",
          }}>
            <h2 style={{ marginBottom: 8, color: "#fff" }}>📱 Your Restaurant QR Code</h2>
            <p style={{ color: "#aaa", marginBottom: 32, textAlign: "center", maxWidth: 400, fontSize: 14 }}>
              Print this and put it on every table. Customers scan it to upload food photos and earn points at your restaurant.
            </p>

            <div style={{
              background:   "#fff",
              borderRadius: 20,
              padding:      32,
              boxShadow:    "0 8px 40px rgba(255,107,0,0.3)",
            }}>
              <Qrcode restaurantId={RESTAURANT_ID} />
            </div>

            <p style={{ color: "#888", marginTop: 20, fontSize: 12 }}>
              Links to: {window.location.origin}/restaurant/{RESTAURANT_ID}/upload
            </p>

            <button
              onClick={() => window.print()}
              style={{
                marginTop:    20,
                background:   "#ff6b00",
                color:        "#fff",
                border:       "none",
                borderRadius: 12,
                padding:      "12px 28px",
                fontWeight:   700,
                fontSize:     15,
                cursor:       "pointer",
              }}
            >
              🖨️ Print QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
