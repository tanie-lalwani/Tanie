import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import SEOHead from "../components/SEOHead"
import { supabase } from "../lib/supabaseClient"
import {
  loadCustomProjects,
  addCustomProject,
  updateCustomProject,
  deleteCustomProject,
  saveCustomProjects
} from "../lib/projectStorage"
import type { Project } from "../components/ProjectsCarousel"

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [emailInput, setEmailInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Projects state
  const [projects, setProjects] = useState<Project[]>([])
  
  // Form states
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [techStackInput, setTechStackInput] = useState("")
  const [site, setSite] = useState("")
  const [code, setCode] = useState("")
  const [previewVideo, setPreviewVideo] = useState("")
  const [detailVideo, setDetailVideo] = useState("")
  
  // JSON Import/Export states
  const [jsonText, setJsonText] = useState("")
  const [jsonMessage, setJsonMessage] = useState({ text: "", type: "info" })
  const [copyStatus, setCopyStatus] = useState("Copy JSON")

  useEffect(() => {
    // Check if session authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
      setIsInitializing(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      setIsInitializing(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true)
      loadCustomProjects()
        .then((loaded) => {
          setProjects(loaded)
          setJsonText(JSON.stringify(loaded, null, 2))
        })
        .finally(() => setIsLoading(false))
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError("")
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput,
      })
      if (error) {
        setAuthError(error.message)
      }
    } catch (err: any) {
      setAuthError(err.message || "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error("Sign out error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !site.trim()) {
      alert("Title, Description, and Site Link are required.")
      return
    }

    setIsLoading(true)
    try {
      const projectData = {
        title: title.trim(),
        description: description.trim(),
        techStack: techStackInput.split(",").map(t => t.trim()).filter(Boolean),
        site: site.trim(),
        code: code.trim() || undefined,
        previewVideo: previewVideo.trim() || undefined,
        detailVideo: detailVideo.trim() || undefined,
      }

      let updatedList: Project[] = []
      if (editingId) {
        updatedList = await updateCustomProject({ ...projectData, id: editingId })
        setEditingId(null)
      } else {
        updatedList = await addCustomProject(projectData)
      }

      setProjects(updatedList)
      setJsonText(JSON.stringify(updatedList, null, 2))
      resetForm()
    } catch (err: any) {
      alert(`Failed to save project: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setTitle("")
    setDescription("")
    setTechStackInput("")
    setSite("")
    setCode("")
    setPreviewVideo("")
    setDetailVideo("")
  }

  const handleEdit = (project: Project) => {
    setEditingId(project.id || null)
    setTitle(project.title)
    setDescription(project.description)
    setTechStackInput(project.techStack.join(", "))
    setSite(project.site)
    setCode(project.code || "")
    setPreviewVideo(project.previewVideo || "")
    setDetailVideo(project.detailVideo || "")
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setIsLoading(true)
      try {
        const updatedList = await deleteCustomProject(id)
        setProjects(updatedList)
        setJsonText(JSON.stringify(updatedList, null, 2))
        if (editingId === id) {
          resetForm()
        }
      } catch (err: any) {
        alert(`Failed to delete project: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonText)
      setCopyStatus("Copied!")
      setTimeout(() => setCopyStatus("Copy JSON"), 2000)
    } catch {
      alert("Failed to copy JSON. Please copy manually.")
    }
  }

  const handleImportJson = async () => {
    try {
      const parsed = JSON.parse(jsonText)
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of projects.")
      }
      
      // Validate structure roughly
      for (const item of parsed) {
        if (typeof item.title !== "string" || typeof item.description !== "string" || typeof item.site !== "string") {
          throw new Error("Each project must have a title, description, and site link.")
        }
      }

      setIsLoading(true)

      const formatted = parsed.map((item) => ({
        id: item.id || undefined,
        title: item.title,
        description: item.description,
        techStack: Array.isArray(item.techStack) ? item.techStack : [],
        site: item.site,
        code: item.code || undefined,
        previewVideo: item.previewVideo || undefined,
        detailVideo: item.detailVideo || undefined,
        previewFit: item.previewFit || undefined,
        details: Array.isArray(item.details) ? item.details : undefined
      }))

      await saveCustomProjects(formatted)
      const updatedList = await loadCustomProjects()
      setProjects(updatedList)
      setJsonText(JSON.stringify(updatedList, null, 2))
      setJsonMessage({ text: "Projects imported successfully!", type: "success" })
      setTimeout(() => setJsonMessage({ text: "", type: "info" }), 3000)
    } catch (err: any) {
      setJsonMessage({ text: `Import failed: ${err.message}`, type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-[#020817] px-4">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-sky-500/20 border-t-sky-500 mx-auto" />
          <p className="text-xs text-sky-200/50 uppercase tracking-widest">Checking Authentication Session...</p>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-[#020817] px-4">
        <SEOHead
          title="Admin Login | Tanie Lalwani Portfolio"
          description="Admin access gate to upload projects."
          canonicalUrl="https://tanie.me/admin"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(125, 211, 252, 0.08), transparent 45%), linear-gradient(180deg, rgba(8, 31, 49, 0.4) 0%, rgba(2, 8, 23, 0.9) 100%)",
          }}
          aria-hidden="true"
          />
        
        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/8 bg-slate-950/42 p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold tracking-normal text-white" style={{ fontFamily: "var(--font-display)" }}>
              Admin Panel
            </h1>
            <p className="text-xs text-sky-200/50 mt-2 tracking-[0.16em] uppercase">
              Tanie Lalwani Portfolio
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-100/60 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition focus:border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400/50"
                required
                autoFocus
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-100/60 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition focus:border-sky-400/50 focus:outline-none focus:ring-1 focus:ring-sky-400/50"
                required
              />
            </div>
            
            {authError && (
              <p className="text-xs font-medium text-rose-400/90">{authError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-full border border-sky-300/22 bg-sky-200/10 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100 hover:bg-sky-200/18 hover:text-white transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="mt-6 border-t border-white/7 pt-4 text-center">
            <Link to="/" className="text-xs text-slate-400/70 hover:text-slate-200 transition">
              ← Return to Portfolio
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-[#020817] text-slate-200 pb-16">
      <SEOHead
        title="Admin Dashboard | Tanie Lalwani Portfolio"
        description="Admin panel to upload, modify, and export projects dynamically."
        canonicalUrl="https://tanie.me/admin"
      />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 10% 20%, rgba(125, 211, 252, 0.04), transparent 35%), radial-gradient(circle at 90% 80%, rgba(186, 230, 253, 0.03), transparent 45%)",
        }}
        aria-hidden="true"
      />

      <header className="relative z-10 border-b border-white/7 bg-slate-950/42 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
              Dashboard
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-sky-200/44 mt-0.5">
              Project Upload & Editing Form {isLoading && "• Synced Updates Processing..."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-1.5 text-xs font-semibold tracking-wider uppercase border border-white/10 bg-white/5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="px-4 py-1.5 text-xs font-semibold tracking-wider uppercase border border-rose-500/18 bg-rose-500/8 rounded-full text-rose-300 hover:text-white hover:bg-rose-500/18 transition cursor-pointer disabled:opacity-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={`relative z-10 max-w-6xl mx-auto px-4 mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] transition-opacity duration-200 ${isLoading ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
        {/* Form Column */}
        <section className="flex flex-col gap-6">
          <div className="rounded-xl border border-white/8 bg-slate-950/24 p-6 backdrop-blur-lg">
            <h2 className="text-xl font-medium text-white mb-4 flex items-center justify-between" style={{ fontFamily: "var(--font-display)" }}>
              <span>{editingId ? "Edit Project" : "Upload New Project"}</span>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs uppercase font-semibold text-slate-400 hover:text-white tracking-widest"
                >
                  Cancel Edit
                </button>
              )}
            </h2>

            <form onSubmit={handleSaveProject} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-100/50 uppercase tracking-widest">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. My Awesome Web App"
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-sky-400/40 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-100/50 uppercase tracking-widest">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="e.g. React, TypeScript, Three.js"
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-sky-400/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-slate-100/50 uppercase tracking-widest">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a brief summary of the project..."
                  rows={3}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-sky-400/40 focus:outline-none resize-y"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-100/50 uppercase tracking-widest">
                    Live Site Link *
                  </label>
                  <input
                    type="url"
                    value={site}
                    onChange={(e) => setSite(e.target.value)}
                    placeholder="https://mysite.com"
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-sky-400/40 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-100/50 uppercase tracking-widest">
                    Code Link (GitHub/Gitlab)
                  </label>
                  <input
                    type="url"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-sky-400/40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-100/50 uppercase tracking-widest">
                    Card Cover Video URL / Path
                  </label>
                  <input
                    type="text"
                    value={previewVideo}
                    onChange={(e) => setPreviewVideo(e.target.value)}
                    placeholder="/project-preview.mp4 or URL"
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-sky-400/40 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold text-slate-100/50 uppercase tracking-widest">
                    Overlay Full Video / Vimeo Link
                  </label>
                  <input
                    type="text"
                    value={detailVideo}
                    onChange={(e) => setDetailVideo(e.target.value)}
                    placeholder="https://vimeo.com/... or MP4 URL"
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:border-sky-400/40 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-full border border-sky-300/22 bg-sky-200/10 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-100 hover:bg-sky-200/18 hover:text-white transition duration-200 cursor-pointer"
              >
                {editingId ? "Save Project Changes" : "Publish Project"}
              </button>
            </form>
          </div>

          {/* List of Custom Projects */}
          <div className="rounded-xl border border-white/8 bg-slate-950/24 p-6 backdrop-blur-lg">
            <h2 className="text-xl font-medium text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Active Uploaded Projects ({projects.length})
            </h2>

            {projects.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                No custom projects uploaded yet. They will appear here once added.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/6 rounded-lg bg-white/2 p-4"
                  >
                    <div className="max-w-[80%]">
                      <h3 className="text-sm font-semibold text-white">{project.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.techStack?.map((tech) => (
                          <span key={tech} className="text-[9px] font-medium uppercase tracking-wider bg-white/8 text-slate-300 px-1.5 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <button
                        onClick={() => handleEdit(project)}
                        className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/10 text-sky-200 rounded hover:bg-white/10 hover:text-white transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id || "")}
                        className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-rose-950/40 border border-rose-500/18 text-rose-300 rounded hover:bg-rose-900/60 hover:text-white transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sync/JSON Column */}
        <section className="flex flex-col gap-6">
          <div className="rounded-xl border border-white/8 bg-slate-950/24 p-6 backdrop-blur-lg h-full flex flex-col">
            <h2 className="text-xl font-medium text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Import / Export config
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              To make your uploaded projects permanent (across all browsers and deployment builds), export this JSON code and paste it into the English translation list `projects` inside <span className="font-mono text-slate-300">src/context/LanguageContext.tsx</span>.
            </p>

            <div className="flex-1 flex flex-col gap-3 min-h-[300px]">
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="flex-grow w-full font-mono text-xs rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-slate-300 focus:outline-none focus:border-sky-400/40 resize-none h-[280px]"
              />
              
              {jsonMessage.text && (
                <p className={`text-xs font-medium ${
                  jsonMessage.type === "success" ? "text-emerald-400" : jsonMessage.type === "error" ? "text-rose-400" : "text-sky-300"
                }`}>
                  {jsonMessage.text}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  onClick={handleCopyJson}
                  className="rounded-full border border-sky-300/22 bg-sky-200/10 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-sky-100 hover:bg-sky-200/18 hover:text-white transition cursor-pointer"
                >
                  {copyStatus}
                </button>
                <button
                  onClick={handleImportJson}
                  className="rounded-full border border-white/8 bg-white/5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  Import JSON
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

