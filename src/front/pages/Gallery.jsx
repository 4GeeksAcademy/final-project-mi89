import { useEffect, useState } from "react"
import PhotoUploader from "../components/PhotoUploader"

export function Gallery() {
    const [photos, setPhotos] = useState([])
    const [filter, setFilter] = useState("all")
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // 1. Función para cargar las fotos
    const fetchPhotos = async () => {
        const url = filter === "all"
            ? `${backendUrl}/api/photos`
            : `${backendUrl}/api/photos?mode=${filter}`

        try {
            const res = await fetch(url)
            const data = await res.json()
            setPhotos(data)
        } catch (error) {
            console.error("Error fetching photos:", error)
        }
    }

    // 2. NUEVA: Función para eliminar una foto
    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta foto? 🗑️")) return;

        try {
            const res = await fetch(`${backendUrl}/api/photo/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                // Opción optimista: filtramos el estado para que desaparezca al instante
                setPhotos(photos.filter(photo => photo.id !== id));
            } else {
                const errorData = await res.json();
                alert("Error: " + errorData.error);
            }
        } catch (error) {
            console.error("Error deleting photo:", error);
            alert("No se pudo conectar con el servidor.");
        }
    }

    useEffect(() => { fetchPhotos() }, [filter])

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
            <PhotoUploader onUpload={fetchPhotos} />

            {/* Filtros */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "30px 0" }}>
                {["all", "usuario", "dueno"].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: "8px 20px",
                            borderRadius: "20px",
                            border: "1px solid #C8602A",
                            background: filter === f ? "#C8602A" : "transparent",
                            color: filter === f ? "white" : "#C8602A",
                            cursor: "pointer",
                            transition: "0.3s"
                        }}
                    >
                        {f === "all" ? "Todas" : f === "usuario" ? "Clientes" : "Restaurante"}
                    </button>
                ))}
            </div>

            {/* Grid de Fotos */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
                {photos.map(photo => (
                    <div key={photo.id} style={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", position: "relative" }}>
                        <img
                            src={`${backendUrl}${photo.url}`}
                            style={{ width: "100%", height: "250px", objectFit: "cover" }}
                        />
                        <div style={{ padding: "15px", background: "white" }}>
                            <strong style={{ color: "#C8602A" }}>{photo.category || "Cliente"}</strong>
                            <p style={{ margin: "5px 0 10px", fontSize: "0.9rem", color: "#666" }}>{photo.caption}</p>

                            {/* BOTÓN DE ELIMINAR */}
                            <button
                                onClick={() => handleDelete(photo.id)}
                                style={{
                                    width: "100%",
                                    padding: "6px",
                                    borderRadius: "8px",
                                    border: "1px solid #ff4d4d",
                                    background: "transparent",
                                    color: "#ff4d4d",
                                    cursor: "pointer",
                                    fontSize: "0.8rem",
                                    fontWeight: "bold"
                                }}
                                onMouseOver={(e) => { e.target.style.background = "#ff4d4d"; e.target.style.color = "white" }}
                                onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#ff4d4d" }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}