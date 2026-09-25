"use client";

import React, { useState, useRef } from "react";
import { ClientHubProject, ClientAssetItem } from "./types";

interface AssetManagerTileProps {
  project: ClientHubProject;
  onUpdateProject: (updated: ClientHubProject) => void;
}

type SubmissionType = "file" | "link" | "text_note";
type FileFormatCategory = "all" | "images" | "documents" | "design" | "video";

const FILE_FORMAT_PRESETS: Record<FileFormatCategory, { label: string; accept: string; extensions: string }> = {
  all: {
    label: "Any File Format",
    accept: "*/*",
    extensions: "PNG, JPG, SVG, PDF, DOCX, ZIP, FIG, MP4, etc.",
  },
  images: {
    label: "Images & Vectors",
    accept: "image/*,.svg,.ai,.psd,.webp",
    extensions: ".png, .jpg, .svg, .webp, .ai, .psd",
  },
  documents: {
    label: "Documents & Copy",
    accept: ".pdf,.doc,.docx,.txt,.csv,.xlsx,.md",
    extensions: ".pdf, .doc, .docx, .txt, .xlsx",
  },
  design: {
    label: "Design & Archives",
    accept: ".fig,.sketch,.xd,.zip,.rar,.tar.gz",
    extensions: ".fig, .zip, .sketch, .rar",
  },
  video: {
    label: "Video & Media",
    accept: "video/*,audio/*,.mp4,.mov,.mp3",
    extensions: ".mp4, .mov, .mp3, .wav",
  },
};

const CATEGORIES: Array<{ id: ClientAssetItem["category"]; label: string; icon: string }> = [
  { id: "logo", label: "Logo & Brand Vector", icon: "🎨" },
  { id: "brand_assets", label: "Brand Guidelines / Fonts", icon: "✨" },
  { id: "content_copy", label: "Copywriting & Docs", icon: "📄" },
  { id: "images_media", label: "Images & Media", icon: "🖼️" },
  { id: "design_reference", label: "Design Reference & Moodboard", icon: "💡" },
  { id: "general", label: "General Project Asset", icon: "📁" },
];

export default function AssetManagerTile({
  project,
  onUpdateProject,
}: AssetManagerTileProps) {
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [submissionType, setSubmissionType] = useState<SubmissionType>("file");
  const [formatCategory, setFormatCategory] = useState<FileFormatCategory>("all");
  
  // Form fields
  const [selectedCategory, setSelectedCategory] = useState<ClientAssetItem["category"]>("logo");
  const [customTitle, setCustomTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [textSnippet, setTextSnippet] = useState("");
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeAssets = project.assets.filter((a) => !a.is_deleted);
  const archivedAssets = project.assets.filter((a) => a.is_deleted);

  const filteredActiveAssets = activeAssets.filter((a) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "files") return a.type === "file";
    if (filterCategory === "links") return a.type === "link";
    return a.category === filterCategory;
  });

  // Handle stage file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setStagedFiles((prev) => [...prev, ...filesArray]);
    if (filesArray.length === 1 && !customTitle) {
      setCustomTitle(filesArray[0].name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files) return;
    const filesArray = Array.from(e.dataTransfer.files);
    setStagedFiles((prev) => [...prev, ...filesArray]);
    if (filesArray.length === 1 && !customTitle) {
      setCustomTitle(filesArray[0].name.replace(/\.[^/.]+$/, ""));
    }
  };

  const removeStagedFile = (idx: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit asset to project
  const handleSubmitAsset = (e: React.FormEvent) => {
    e.preventDefault();

    const newAssets: ClientAssetItem[] = [];
    const timestamp = new Date().toISOString();

    if (submissionType === "file") {
      if (stagedFiles.length === 0) {
        alert("Please select at least one file to upload.");
        return;
      }

      stagedFiles.forEach((f, index) => {
        const title = stagedFiles.length === 1 && customTitle.trim() ? customTitle.trim() : f.name;
        newAssets.push({
          id: `asset-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
          name: title,
          url: typeof URL !== "undefined" ? URL.createObjectURL(f) : "/circular_favicon.png",
          type: "file",
          category: selectedCategory,
          description: description.trim() || undefined,
          size_label: `${Math.round(f.size / 1024)} KB`,
          created_at: timestamp,
          is_deleted: false,
        });
      });
    } else if (submissionType === "link") {
      if (!linkUrl.trim()) {
        alert("Please enter a valid URL.");
        return;
      }
      let formattedUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      newAssets.push({
        id: `asset-link-${Date.now()}`,
        name: customTitle.trim() || formattedUrl,
        url: formattedUrl,
        type: "link",
        category: selectedCategory,
        description: description.trim() || undefined,
        created_at: timestamp,
        is_deleted: false,
      });
    } else if (submissionType === "text_note") {
      if (!textSnippet.trim()) {
        alert("Please enter the copy or notes snippet.");
        return;
      }

      newAssets.push({
        id: `asset-note-${Date.now()}`,
        name: customTitle.trim() || "Brand Copy & Notes",
        url: "#",
        type: "link",
        category: selectedCategory,
        description: textSnippet.trim(),
        created_at: timestamp,
        is_deleted: false,
      });
    }

    onUpdateProject({
      ...project,
      assets: [...newAssets, ...project.assets],
    });

    // Reset Form
    setStagedFiles([]);
    setCustomTitle("");
    setDescription("");
    setLinkUrl("");
    setTextSnippet("");
    setIsUploaderOpen(false);
  };

  // Soft-Delete & Restore
  const handleSoftDelete = (assetId: string) => {
    const updatedAssets = project.assets.map((a) => {
      if (a.id === assetId) {
        return { ...a, is_deleted: true, deleted_at: new Date().toISOString() };
      }
      return a;
    });
    onUpdateProject({ ...project, assets: updatedAssets });
  };

  const handleRestore = (assetId: string) => {
    const updatedAssets = project.assets.map((a) => {
      if (a.id === assetId) {
        return { ...a, is_deleted: false, deleted_at: undefined };
      }
      return a;
    });
    onUpdateProject({ ...project, assets: updatedAssets });
  };

  const getFormatBadge = (asset: ClientAssetItem) => {
    if (asset.type === "link") {
      if (asset.url.includes("figma.com")) return <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md text-[10px]">FIGMA</span>;
      if (asset.url.includes("drive.google.com")) return <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">G-DRIVE</span>;
      if (asset.url.includes("dropbox.com")) return <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md text-[10px]">DROPBOX</span>;
      if (asset.url === "#") return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md text-[10px]">NOTE / COPY</span>;
      return <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-md text-[10px]">LINK</span>;
    }
    const ext = asset.name.split(".").pop()?.toUpperCase() || "FILE";
    return <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-[10px]">{ext}</span>;
  };

  return (
    <div
      id="asset-manager-tile"
      className="rounded-[2.4rem] border border-sky-300/80 bg-white/90 p-6 sm:p-10 shadow-lg backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0a192f]">
            Drop Assets, Links & Moodboards
          </h2>
          <p className="mt-1 text-xs text-slate-600 max-w-2xl">
            Upload files in any format, attach Figma or Google Drive links, or paste brand copywriting.
          </p>
        </div>

        {/* View Switcher: Active vs Archived */}
        <div className="flex items-center gap-2 rounded-2xl bg-sky-100/70 p-1 border border-sky-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "active" ? "bg-[#0a192f] text-white shadow-xs" : "text-slate-700 hover:text-black"
            }`}
          >
            Active Assets ({activeAssets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("archived")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "archived" ? "bg-[#0a192f] text-white shadow-xs" : "text-slate-700 hover:text-black"
            }`}
          >
            Archived ({archivedAssets.length})
          </button>
        </div>
      </div>

      {/* Main Upload Trigger Button */}
      {activeTab === "active" && (
        <div className="mb-6">
          {!isUploaderOpen ? (
            <button
              type="button"
              onClick={() => setIsUploaderOpen(true)}
              className="w-full sm:w-auto rounded-2xl bg-[#0a192f] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-slate-800 transition cursor-pointer flex items-center justify-center gap-2.5"
            >
              <span>+ Add Asset / Upload Files</span>
              <span>📁</span>
            </button>
          ) : (
            /* ------------------------------------------------------------- */
            /* GOOGLE FORM STYLE ASSET UPLOADER MODAL / CARD                 */
            /* ------------------------------------------------------------- */
            <form
              onSubmit={handleSubmitAsset}
              className="rounded-3xl border-2 border-sky-300 bg-gradient-to-b from-sky-50/90 to-white p-6 sm:p-8 shadow-xl animate-fadeIn space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-sky-200">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0a192f] flex items-center gap-2">
                    <span>📤</span>
                    <span>Submit Project Asset or Reference</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose submission type, format, and category like a structured form.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploaderOpen(false)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* 1. Choose Submission Type */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-sky-950 mb-2">
                  1. What would you like to provide?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "file", label: "Upload File(s)", icon: "📁", desc: "Images, vectors, documents, zip" },
                    { id: "link", label: "Web Link / URL", icon: "🔗", desc: "Figma, Google Drive, Dribbble" },
                    { id: "text_note", label: "Copy / Notes", icon: "📝", desc: "Brand copy, color hex codes" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSubmissionType(item.id as SubmissionType)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        submissionType === item.id
                          ? "border-[#0a192f] bg-[#0a192f] text-white shadow-sm"
                          : "border-sky-200 bg-white hover:bg-sky-50 text-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.icon}</span>
                        <span className="text-xs font-bold">{item.label}</span>
                      </div>
                      <span className={`text-[10px] mt-1 ${submissionType === item.id ? "text-sky-200" : "text-slate-500"}`}>
                        {item.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. File Upload or Link Inputs */}
              {submissionType === "file" && (
                <div className="space-y-4">
                  {/* Format Selector */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-sky-950 mb-1.5">
                      Filter Target Format:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(FILE_FORMAT_PRESETS) as FileFormatCategory[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormatCategory(key)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer border ${
                            formatCategory === key
                              ? "bg-sky-900 border-sky-900 text-white"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {FILE_FORMAT_PRESETS[key].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition cursor-pointer ${
                      isDragging
                        ? "border-sky-500 bg-sky-100/70 scale-[1.01]"
                        : "border-sky-300 bg-white/80 hover:bg-white hover:border-sky-400"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={FILE_FORMAT_PRESETS[formatCategory].accept}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-900 border border-sky-200 flex items-center justify-center text-xl mx-auto mb-3 font-bold">
                      ☁️
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag and drop files here, or <span className="text-sky-700 underline">Browse Computer</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supported: {FILE_FORMAT_PRESETS[formatCategory].extensions}
                    </p>
                  </div>

                  {/* Staged files preview */}
                  {stagedFiles.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700">Selected Files ({stagedFiles.length}):</span>
                      <div className="max-h-40 overflow-y-auto space-y-1.5">
                        {stagedFiles.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-xl bg-white border border-sky-200 p-2.5 text-xs shadow-2xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-base">📄</span>
                              <span className="font-semibold text-slate-800 truncate">{f.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({Math.round(f.size / 1024)} KB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeStagedFile(i); }}
                              className="text-rose-500 hover:text-rose-700 text-xs font-bold px-2 py-0.5 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {submissionType === "link" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Resource URL:
                    </label>
                    <input
                      type="text"
                      required
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://figma.com/file/... or https://drive.google.com/..."
                      className="w-full rounded-xl border border-sky-300 bg-white p-3 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              )}

              {submissionType === "text_note" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Copy, Colors or Instructions:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={textSnippet}
                    onChange={(e) => setTextSnippet(e.target.value)}
                    placeholder="e.g. Primary Color: #0A192F, Secondary: #0284C7. Tagline: 'Engineering Luxury Digital Products'..."
                    className="w-full rounded-xl border border-sky-300 bg-white p-3 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}

              {/* 3. Category Selection (Google Form Radio Style) */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-sky-950 mb-2">
                  2. Select Purpose / Category:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold border text-left transition cursor-pointer ${
                        selectedCategory === cat.id
                          ? "border-sky-600 bg-sky-100/80 text-sky-950 ring-2 ring-sky-500/20"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Title & Optional Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Custom Title / Label (Optional):
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Master Logo Dark Vector"
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notes for Tanie (Optional):
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Use on homepage hero, 2x resolution"
                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-sky-200">
                <button
                  type="button"
                  onClick={() => setIsUploaderOpen(false)}
                  className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0a192f] px-7 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-slate-800 transition cursor-pointer"
                >
                  Upload to Project Hub ✓
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* FILTER PILLS                                                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "active" && activeAssets.length > 0 && (
        <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-slate-500 mr-1 shrink-0">Filter:</span>
          {[
            { id: "all", label: `All (${activeAssets.length})` },
            { id: "files", label: "Files" },
            { id: "links", label: "Links" },
            { id: "logo", label: "Logos" },
            { id: "design_reference", label: "Moodboards" },
            { id: "content_copy", label: "Copy & Docs" },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setFilterCategory(pill.id)}
              className={`rounded-xl px-3 py-1 text-xs font-bold transition shrink-0 cursor-pointer ${
                filterCategory === pill.id
                  ? "bg-[#0a192f] text-white shadow-2xs"
                  : "bg-sky-50 hover:bg-sky-100 text-slate-700"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE ASSETS GRID                                            */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "active" && (
        <>
          {activeAssets.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-sky-200 bg-sky-50/50 p-10 text-center">
              <div className="text-4xl mb-3">📁</div>
              <h4 className="text-sm font-bold text-slate-800">Your Asset Dropzone Is Ready</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Click "+ Add Asset / Upload Files" to upload your logos, brand fonts, Figma boards, or copy documents.
              </p>
              <button
                type="button"
                onClick={() => setIsUploaderOpen(true)}
                className="rounded-xl bg-[#0a192f] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition cursor-pointer"
              >
                Upload First Asset 🚀
              </button>
            </div>
          ) : filteredActiveAssets.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
              No assets found for the selected filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredActiveAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-sky-200/90 bg-white/90 hover:bg-white p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      {getFormatBadge(asset)}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(asset.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-[#0a192f] line-clamp-1 mb-1">
                      {asset.name}
                    </h4>

                    {asset.description && (
                      <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                        {asset.description}
                      </p>
                    )}

                    {asset.size_label && (
                      <span className="text-[10px] text-slate-400 font-mono block mb-2">
                        Size: {asset.size_label}
                      </span>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {asset.url !== "#" ? (
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-sky-700 hover:text-sky-950 flex items-center gap-1 !no-underline hover:!underline"
                      >
                        <span>{asset.type === "file" ? "Download / View" : "Open Link"}</span>
                        <span>↗</span>
                      </a>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-500">Note archived</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleSoftDelete(asset.id)}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition cursor-pointer"
                      title="Move to Archive"
                    >
                      Archive ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ARCHIVED / AUDIT VAULT GRID                                   */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "archived" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 text-xs flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-sky-950">Permanent Retention Vault:</span>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Every deleted asset is safeguarded here for legal compliance and project auditing. Nothing is permanently destroyed.
              </p>
            </div>
          </div>

          {archivedAssets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-500">
              No archived assets found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {archivedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-2xs opacity-80 hover:opacity-100 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-lg bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        Archived
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Deleted: {new Date(asset.deleted_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                      {asset.name}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    {asset.url !== "#" ? (
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-700 hover:text-black"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">Archived Note</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRestore(asset.id)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition cursor-pointer"
                    >
                      Restore to Active ↺
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
