"use client";

import React, { useState } from "react";
import { ClientHubProject, ClientAssetItem } from "./types";

interface AssetManagerTileProps {
  project: ClientHubProject;
  onUpdateProject: (updated: ClientHubProject) => void;
}

export default function AssetManagerTile({
  project,
  onUpdateProject,
}: AssetManagerTileProps) {
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkCategory, setLinkCategory] = useState<ClientAssetItem["category"]>("design_reference");
  const [linkNotes, setLinkNotes] = useState("");

  const activeAssets = project.assets.filter((a) => !a.is_deleted);
  const archivedAssets = project.assets.filter((a) => a.is_deleted);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAssets: ClientAssetItem[] = Array.from(files).map((f) => ({
      id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: f.name,
      url: typeof URL !== "undefined" ? URL.createObjectURL(f) : "/circular_favicon.png",
      type: "file",
      category: f.name.match(/\.(svg|png|jpg|webp)$/i)
        ? "brand_assets"
        : f.name.match(/\.(pdf|doc|docx|txt)$/i)
        ? "content_copy"
        : "general",
      size_label: `${Math.round(f.size / 1024)} KB`,
      created_at: new Date().toISOString(),
      is_deleted: false,
    }));

    onUpdateProject({
      ...project,
      assets: [...newAssets, ...project.assets],
    });
  };

  // Link Addition Handler
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    let formattedUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newLink: ClientAssetItem = {
      id: `asset-link-${Date.now()}`,
      name: linkTitle.trim() || formattedUrl,
      url: formattedUrl,
      type: "link",
      category: linkCategory,
      description: linkNotes.trim() || undefined,
      created_at: new Date().toISOString(),
      is_deleted: false,
    };

    onUpdateProject({
      ...project,
      assets: [newLink, ...project.assets],
    });

    setLinkTitle("");
    setLinkUrl("");
    setLinkNotes("");
    setIsAddingLink(false);
  };

  // Soft-Delete (Preserve in archive forever)
  const handleSoftDelete = (assetId: string) => {
    const updatedAssets = project.assets.map((a) => {
      if (a.id === assetId) {
        return {
          ...a,
          is_deleted: true,
          deleted_at: new Date().toISOString(),
        };
      }
      return a;
    });

    onUpdateProject({
      ...project,
      assets: updatedAssets,
    });
  };

  // Restore from Archive
  const handleRestore = (assetId: string) => {
    const updatedAssets = project.assets.map((a) => {
      if (a.id === assetId) {
        return {
          ...a,
          is_deleted: false,
          deleted_at: undefined,
        };
      }
      return a;
    });

    onUpdateProject({
      ...project,
      assets: updatedAssets,
    });
  };

  return (
    <div
      id="asset-manager-tile"
      className="rounded-[2.4rem] border border-sky-300/80 bg-white/90 p-6 sm:p-10 shadow-lg backdrop-blur-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-900 bg-sky-100 border border-sky-200 px-3 py-1 rounded-full">
              Asset & Reference Manager
            </span>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              🔒 Permanent Retention Enabled
            </span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-[#0a192f]">
            Drop Assets, Links & Moodboards
          </h2>
          <p className="mt-0.5 text-xs text-slate-600 max-w-2xl">
            Upload logos, brand guidelines, typography, copy docs, or paste inspiration links. All items are permanently backed up—even if deleted from your active dashboard.
          </p>
        </div>

        {/* View Switcher: Active vs Archived */}
        <div className="flex items-center gap-2 rounded-2xl bg-sky-100/70 p-1 border border-sky-200">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "active"
                ? "bg-[#0a192f] text-white shadow-xs"
                : "text-slate-700 hover:text-black"
            }`}
          >
            Active Assets ({activeAssets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("archived")}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "archived"
                ? "bg-[#0a192f] text-white shadow-xs"
                : "text-slate-700 hover:text-black"
            }`}
          >
            Archived Vault ({archivedAssets.length})
          </button>
        </div>
      </div>

      {/* Action Bar: Upload File & Add Link */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="rounded-2xl bg-[#0a192f] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition cursor-pointer flex items-center gap-2">
          <span>Upload Brand File</span>
          <span>📁</span>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          type="button"
          onClick={() => setIsAddingLink(!isAddingLink)}
          className="rounded-2xl border border-sky-300/80 bg-white px-5 py-2.5 text-xs font-bold text-sky-950 hover:bg-sky-50 shadow-xs transition cursor-pointer flex items-center gap-2"
        >
          <span>{isAddingLink ? "Cancel" : "Add Reference URL / Link"}</span>
          <span>🔗</span>
        </button>
      </div>

      {/* Form: Add Link */}
      {isAddingLink && (
        <form
          onSubmit={handleAddLink}
          className="mb-6 rounded-3xl border border-sky-200/90 bg-sky-50/70 p-5 shadow-xs space-y-3 animate-fadeIn"
        >
          <span className="text-xs font-black uppercase tracking-wider text-sky-950 block">
            Add External Reference URL or Document Link
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Link Title:
              </label>
              <input
                type="text"
                required
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="e.g. Figma Design System, Apple.com minimal style"
                className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Website URL:
              </label>
              <input
                type="text"
                required
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://figma.com/@yourfile or https://insposite.com"
                className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600">Category:</span>
              <select
                value={linkCategory}
                onChange={(e) => setLinkCategory(e.target.value as ClientAssetItem["category"])}
                className="rounded-lg border border-sky-200 bg-white px-2.5 py-1 text-xs outline-none"
              >
                <option value="design_reference">Design Reference</option>
                <option value="brand_assets">Brand Assets</option>
                <option value="content_copy">Content & Copy Docs</option>
                <option value="general">General</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#0a192f] px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition cursor-pointer"
            >
              Save Link to Vault ✓
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ACTIVE ASSETS GRID                                            */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "active" && (
        <>
          {activeAssets.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="text-3xl mb-2">📁</div>
              <h4 className="text-sm font-bold text-slate-800">Your Asset Dropzone Is Empty</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Upload your vector logos, fonts, Figma links, or competitor sites so Tanie has all context ready during sprint execution.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {activeAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-sky-200/90 bg-white/80 hover:bg-white p-4 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="rounded-lg bg-sky-100/90 px-2 py-0.5 text-[10px] font-black uppercase text-sky-900">
                        {asset.type === "link" ? "🔗 Link" : "📄 File"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(asset.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-[#0a192f] line-clamp-1 mb-1">
                      {asset.name}
                    </h4>

                    {asset.description && (
                      <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">
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
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-sky-700 hover:text-sky-950 flex items-center gap-1"
                    >
                      <span>Open / View</span>
                      <span>↗</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleSoftDelete(asset.id)}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition cursor-pointer"
                      title="Move to Archive (permanently preserved)"
                    >
                      Archive / Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ARCHIVED / AUDIT VAULT GRID (PERMANENT RETENTION)             */}
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
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-700 hover:text-black"
                    >
                      View
                    </a>

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
