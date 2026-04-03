import { useState, useRef, useCallback, useEffect } from "react"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream:   #FAF7F2;
    --charcoal:#1C1917;
    --warm:    #C8602A;
    --warm-lt: #F5E6DC;
    --gold:    #D4A847;
    --muted:   #78716C;
    --border:  #E5DDD5;
    --white:   #FFFFFF;
    --success: #3D7A5A;
    --danger:  #B94040;
    --radius:  14px;
    --shadow:  0 4px 24px rgba(28,25,23,.10);
  }

  .pu-wrap {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    padding: 2rem 1rem;
    display: flex;
    justify-content: center;
  }

  .pu-card {
    background: var(--white);
    border-radius: 24px;
    box-shadow: var(--shadow);
    width: 100%;
    max-width: 540px;
    overflow: hidden;
  }

  .pu-header {
    background: var(--charcoal);
    padding: 2rem;
    position: relative;
  }

  .pu-logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--gold); }
  .pu-subtitle { font-size: .8rem; color: rgba(255,255,255,.45); text-transform: uppercase; margin-top: 5px; }

  .pu-mode { display: flex; gap: .5rem; margin-top: 1.25rem; }
  .pu-mode-btn { flex: 1; padding: .6rem; border: 1.5px solid rgba(255,255,255,.15); border-radius: 10px; background: transparent; color: rgba(255,255,255,.5); cursor: pointer; transition: all .2s; }
  .pu-mode-btn.active { background: var(--warm); border-color: var(--warm); color: var(--white); }

  .pu-body { padding: 1.75rem 2rem 2rem; }
  .pu-label { font-size: .75rem; font-weight: 500; color: var(--muted); text-transform: uppercase; margin-bottom: .6rem; display: block; }

  .pu-drop { border: 2px dashed var(--border); border-radius: var(--radius); padding: 2.5rem 1.5rem; text-align: center; cursor: pointer; background: var(--cream); transition: all .25s; outline: none; }
  .pu-drop:hover { border-color: var(--warm); background: var(--warm-lt); }

  .pu-previews { display: grid; grid-template-columns: repeat(3, 1fr); gap: .6rem; margin-top: 1.25rem; }
  .pu-preview-item { position: relative; border-radius: 10px; overflow: hidden; aspect-ratio: 1; }
  .pu-preview-item img { width: 100%; height: 100%; object-fit: cover; }
  .pu-preview-progress { position: absolute; bottom: 0; left: 0; height: 4px; background: var(--warm); transition: width .3s; }

  .pu-chips { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.25rem; }
  .pu-chip { padding: .4rem .9rem; border: 1px solid var(--border); border-radius: 99px; font-size: .75rem; cursor: pointer; background: transparent; color: var(--muted); }
  .pu-chip.selected { background: var(--charcoal); color: var(--white); border-color: var(--charcoal); }

  .pu-caption { margin-top: 1.25rem; }
  .pu-caption textarea { width: 100%; border: 1.5px solid var(--border); border-radius: 10px; padding: .75rem; font-family: inherit; resize: none; outline: none; background: var(--cream); }

  .pu-actions { display: flex; gap: .75rem; margin-top: 1.5rem; }
  .pu-btn-submit { flex: 1; padding: .75rem; background: var(--warm); border: none; border-radius: 10px; color: white; font-weight: 500; cursor: pointer; }
  .pu-btn-submit:disabled { background: var(--border); cursor: not-allowed; }

  .pu-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: var(--charcoal); color: white; padding: .75rem 1.5rem; border-radius: 99px; z-index: 999; }
`

const OWNER_CATEGORIES = ["Entradas", "Platos fuertes", "Postres", "Bebidas", "Ambiente", "Fachada"]

export default function PhotoUploader({ onUpload }) {
    const [mode, setMode] = useState("usuario")
    const [files, setFiles] = useState([])
    const [category, setCategory] = useState("")
    const [caption, setCaption] = useState("")
    const [uploading, setUploading] = useState(false)
    const [toast, setToast] = useState(null)
    const inputRef = useRef(null)

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

    const processFiles = (rawFiles) => {
        const previews = Array.from(rawFiles).map(f => ({
            file: f,
            preview: URL.createObjectURL(f),
            progress: 0,
            id: Math.random().toString(36).slice(2)
        }))
        setFiles(prev => [...prev, ...previews])
    }

    const handleSubmit = async () => {
        if (files.length === 0) return
        setUploading(true)

        const formData = new FormData()
        files.forEach(f => formData.append("fotos", f.file))
        formData.append("modo", mode)
        if (mode === "dueno" && category) formData.append("categoria", category)
        if (mode === "usuario" && caption) formData.append("caption", caption)

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, {
                method: "POST",
                body: formData,
            })
            if (!res.ok) throw new Error("Error")

            showToast("¡Publicado con éxito!")
            setFiles([])
            setCaption("")
            setCategory("")
            if (onUpload) onUpload()
        } catch (err) {
            showToast("Error al subir")
        } finally {
            setUploading(false)
        }
    }

    return (
        <>
            <style>{styles}</style>
            <div className="pu-wrap">
                <div className="pu-card">
                    <div className="pu-header">
                        <div className="pu-logo">La Mesa</div>
                        <div className="pu-subtitle">Subir Contenido</div>
                        <div className="pu-mode">
                            <button className={`pu-mode-btn ${mode === "usuario" ? "active" : ""}`} onClick={() => setMode("usuario")}>Soy cliente</button>
                            <button className={`pu-mode-btn ${mode === "dueno" ? "active" : ""}`} onClick={() => setMode("dueno")}>Soy dueño</button>
                        </div>
                    </div>
                    <div className="pu-body">
                        <div className="pu-drop" onClick={() => inputRef.current.click()}>
                            <input ref={inputRef} type="file" multiple onChange={(e) => processFiles(e.target.files)} style={{ display: "none" }} />
                            <div className="pu-drop-title">Haz clic para subir fotos</div>
                        </div>

                        {files.length > 0 && (
                            <div className="pu-previews">
                                {files.map(f => (
                                    <div key={f.id} className="pu-preview-item">
                                        <img src={f.preview} alt="preview" />
                                        {uploading && <div className="pu-preview-progress" style={{ width: '100%' }} />}
                                    </div>
                                ))}
                            </div>
                        )}

                        {mode === "dueno" && (
                            <div className="pu-chips">
                                {OWNER_CATEGORIES.map(cat => (
                                    <button key={cat} className={`pu-chip ${category === cat ? "selected" : ""}`} onClick={() => setCategory(cat)}>{cat}</button>
                                ))}
                            </div>
                        )}

                        {mode === "usuario" && (
                            <div className="pu-caption">
                                <textarea placeholder="Escribe un comentario..." value={caption} onChange={e => setCaption(e.target.value)} />
                            </div>
                        )}

                        <div className="pu-actions">
                            <button className="pu-btn-submit" onClick={handleSubmit} disabled={uploading || files.length === 0}>
                                {uploading ? "Subiendo..." : "Publicar ahora"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {toast && <div className="pu-toast">{toast}</div>}
        </>
    )
}