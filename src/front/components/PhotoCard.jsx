import { useState } from "react";

const BACKEND = "";

export default function PhotoCard({ photo, onLikeToggle }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(photo.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingCom, setLoadingCom] = useState(false);
  const [imgError, setImgError] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("tablesnap_user") || "null");

  const handleLike = async () => {
    if (!currentUser?.id) {
      alert("Please log in as a customer to like photos.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND}/api/photo/${photo.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: currentUser.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Like failed");
      }

      setLiked(data.liked);
      setLikeCount(data.total_likes);

      if (onLikeToggle) onLikeToggle();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const openComments = async () => {
    setShowComments(true);
    setLoadingCom(true);
    try {
      const res = await fetch(`${BACKEND}/api/photo/${photo.id}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Comments error:", err);
    } finally {
      setLoadingCom(false);
    }
  };

  const postComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`${BACKEND}/api/photo/${photo.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newComment,
          customer_id: currentUser?.id || null
        }),
      });

      const data = await res.json();
      setComments(prev => [data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Post comment error:", err);
    }
  };

  const dishName = photo.dish || photo.dish_name || "Mystery Dish";
  const username = photo.username || "@guest";
  const timeAgo = photo.timeAgo || photo.time_ago || "";
  const imgSrc = photo.image || photo.cloudinary_url || "";

  return (
    <>
      <div style={{
        background: "#1a1a1a",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #2a2a2a",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,107,53,0.2)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div style={{ position: "relative", paddingTop: "75%", background: "#111" }}>
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={dishName}
              onError={() => setImgError(true)}
              style={{
                position: "absolute",
                top: 0, left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              background: "linear-gradient(135deg, #1a1a1a, #2a1a0a)",
            }}>
              🍽️
            </div>
          )}

          {(photo.isHot || likeCount >= 10) && (
            <div style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "#ff4444",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "10px",
            }}>
              🔥 HOT
            </div>
          )}
        </div>

        <div style={{ padding: "12px" }}>
          <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px", color: "#fff" }}>
            {dishName}
          </div>
          <div style={{ fontSize: "11px", color: "#888", marginBottom: "10px" }}>
            {username} {timeAgo && `· ${timeAgo}`}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={handleLike}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                color: liked ? "#ff4444" : "#888",
                cursor: "pointer",
                fontSize: "13px",
                padding: 0,
                transition: "color 0.15s",
              }}
            >
              <span style={{ fontSize: "16px" }}>{liked ? "❤️" : "🤍"}</span>
              <span style={{ fontWeight: liked ? 700 : 400 }}>{likeCount}</span>
            </button>

            <button
              onClick={openComments}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                color: "#888",
                cursor: "pointer",
                fontSize: "13px",
                padding: 0,
              }}
            >
              <span style={{ fontSize: "16px" }}>💬</span>
              <span>Comment</span>
            </button>

            <span style={{ marginLeft: "auto", color: "#ff6b35", fontWeight: 700, fontSize: "12px" }}>
              ❤️ {likeCount} likes
            </span>
          </div>
        </div>
      </div>

      {showComments && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setShowComments(false); }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div style={{
            background: "#1a1a1a",
            borderRadius: "20px 20px 0 0",
            width: "100%",
            maxWidth: "600px",
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: "#fff", fontSize: 16 }}>
                💬 Comments · <span style={{ color: "#ff6b35" }}>{dishName}</span>
              </h3>
              <button
                onClick={() => setShowComments(false)}
                style={{ background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer" }}
              >✕</button>
            </div>

            {imgSrc && !imgError && (
              <img
                src={imgSrc}
                alt={dishName}
                style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 10, marginBottom: 14 }}
              />
            )}

            <div style={{ flex: 1, overflowY: "auto", marginBottom: 12 }}>
              {loadingCom ? (
                <p style={{ color: "#888", textAlign: "center" }}>Loading...</p>
              ) : comments.length === 0 ? (
                <p style={{ color: "#666", textAlign: "center", fontSize: 13 }}>
                  No comments yet. Be the first!
                </p>
              ) : (
                comments.map((c, i) => (
                  <div key={i} style={{
                    background: "#242424",
                    borderRadius: 10,
                    padding: "10px 12px",
                    marginBottom: 8,
                  }}>
                    <div style={{ fontWeight: 700, color: "#ff6b35", fontSize: 12, marginBottom: 4 }}>
                      {c.username || "@guest"}
                    </div>
                    <div style={{ color: "#ddd", fontSize: 13 }}>{c.text}</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") postComment(); }}
                style={{
                  flex: 1,
                  background: "#2a2a2a",
                  border: "1px solid #444",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                onClick={postComment}
                style={{
                  background: "#ff6b35",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 18px",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}