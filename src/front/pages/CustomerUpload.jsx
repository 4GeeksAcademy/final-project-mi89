import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CATEGORIES = [
    { key: "app",      label: "🥗 Appetizer" },
    { key: "entree",   label: "🥩 Entrée"    },
    { key: "dessert",  label: "🍮 Dessert"   },
    { key: "cocktail", label: "🍹 Cocktail"  },
    { key: "mocktail", label: "🧃 Mocktail"  },
];

const CustomerUpload = () => {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();

    const [preview, setPreview]     = useState(null);
    const [file, setFile]           = useState(null);
    const [dishName, setDishName]   = useState("");
    const [category, setCategory]   = useState("");
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess]     = useState(false);
    const [error, setError]         = useState("");

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleSubmit = async () => {
        if (!file)     return setError("Please select a photo.");
        if (!dishName) return setError("Please enter the dish name.");
        if (!category) return setError("Please select a category.");

        setError("");
        setUploading(true);

        const formData = new FormData();
        formData.append("photo",         file);
        formData.append("restaurant_id", restaurantId);
        formData.append("dish_name",     dishName);
        formData.append("category",      category);

        // TODO: descomentar cuando el backend esté listo
        // const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/photo/upload`, { method: "POST", body: formData });
        // const data = await resp.json();

        // Simulamos éxito por ahora
        setTimeout(() => {
            setUploading(false);
            setSuccess(true);
        }, 1500);
    };

    if (success) return (
        <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
            <div style={{ fontSize: "70px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ marginBottom: "8px" }}>Photo uploaded!</h2>
            <p style={{ color: "#4caf50", fontSize: "20px", marginBottom: "8px" }}>+10 points earned!</p>
            <p style={{ color: "#888", fontSize: "13px", marginBottom: "30px" }}>Keep snapping to climb the leaderboard 🏆</p>
            <button
                onClick={() => navigate("/")}
                style={{ background: "#ff6b35", border: "none", borderRadius: "10px", padding: "12px 32px", color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                See the feed
            </button>
        </div>
    );

    return (
        <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px", gap: "20px" }}>

            {/* Header */}
            <h2 style={{ marginBottom: "0" }}>📸 Latin Grill Tampa</h2>
            <p style={{ color: "#aaa", fontSize: "13px", marginTop: "4px" }}>Upload your dish · Earn +10 pts per photo · +2 pts per like</p>

            {/* Foto */}
            <label style={{ cursor: "pointer", background: preview ? "transparent" : "#1a1a1a", border: preview ? "none" : "2px dashed #444", borderRadius: "12px", width: "100%", maxWidth: "360px", height: preview ? "auto" : "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {preview
                    ? <img src={preview} alt="preview" style={{ width: "100%", maxWidth: "360px", borderRadius: "12px" }} />
                    : <div style={{ textAlign: "center", color: "#888" }}>
                        <div style={{ fontSize: "40px" }}>📷</div>
                        <p style={{ fontSize: "14px", marginTop: "8px" }}>Tap to take or choose a photo</p>
                      </div>
                }
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </label>

            {/* Nombre del plato */}
            <input
                type="text"
                placeholder="Dish name (e.g. Churrasco, Mojito...)"
                value={dishName}
                onChange={e => setDishName(e.target.value)}
                style={{ width: "100%", maxWidth: "360px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "10px", padding: "12px 16px", color: "#fff", fontSize: "15px", outline: "none" }}
            />

            {/* Categoría */}
            <div style={{ width: "100%", maxWidth: "360px" }}>
                <p style={{ fontSize: "13px", color: "#888", marginBottom: "10px" }}>Select category:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {CATEGORIES.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setCategory(key)}
                            style={{
                                padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "13px",
                                border: category === key ? "none" : "1px solid #333",
                                background: category === key ? "#ff6b35" : "#1a1a1a",
                                color: "#fff", fontWeight: category === key ? "600" : "400",
                            }}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && <p style={{ color: "#e53935", fontSize: "13px" }}>{error}</p>}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={uploading}
                style={{ width: "100%", maxWidth: "360px", background: uploading ? "#555" : "#ff6b35", border: "none", borderRadius: "10px", padding: "14px", color: "#fff", fontSize: "16px", fontWeight: "600", cursor: uploading ? "not-allowed" : "pointer" }}>
                {uploading ? "Uploading... ⏳" : "Submit & Earn Points 🚀"}
            </button>

        </div>
    );
};

export default CustomerUpload;