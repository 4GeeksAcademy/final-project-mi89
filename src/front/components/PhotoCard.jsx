import { useState } from "react";

const PhotoCard = ({ photo }) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(photo.likes);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
        // TODO: llamar API cuando esté lista
    };

    return (
        <div style={{ background: "#212121", borderRadius: "12px", overflow: "hidden", border: "1px solid #2a2a2a" }}>
            {/* Imagen */}
            <div style={{ position: "relative", aspectRatio: "1", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {photo.image
                    ? <img src={photo.image} alt={photo.dish} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: "48px" }}>🍽️</span>
                }
                {photo.isHot && (
                    <div style={{ position: "absolute", top: "10px", right: "10px", background: "#ff6b35", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: "600", color: "#fff" }}>
                        🔥 HOT
                    </div>
                )}
            </div>
            {/* Info */}
            <div style={{ padding: "12px" }}>
                <div style={{ fontWeight: "600", fontSize: "14px", marginBottom: "4px" }}>{photo.dish}</div>
                <div style={{ fontSize: "11px", color: "#888", marginBottom: "10px" }}>
                    {photo.username} · {photo.restaurant} · {photo.timeAgo}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                        onClick={handleLike}
                        style={{ background: "none", border: "none", cursor: "pointer", color: liked ? "#e53935" : "#888", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                        {liked ? "❤️" : "🤍"} {likes} likes
                    </button>
                    <span style={{ color: "#4caf50", fontSize: "12px", fontWeight: "600" }}>+{photo.points} pts</span>
                </div>
            </div>
        </div>
    );
};

export default PhotoCard;