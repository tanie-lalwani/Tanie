import { supabase } from "./supabaseClient"
import type { Project } from "../components/ProjectsCarousel"

/**
 * Extracts a Vimeo video ID and optional privacy hash from any Vimeo URL
 */
export function getVimeoEmbedUrl(url: string): string | null {
  if (!url) return null

  const cleanUrl = url.trim()

  // If it's already an embed URL, return it as-is or append autoplay params
  if (cleanUrl.includes("player.vimeo.com/video/")) {
    const hasParams = cleanUrl.includes("?")
    return `${cleanUrl}${hasParams ? "&" : "?"}autoplay=1&loop=1&muted=1`
  }

  // Matches vimeo.com/123456789 or vimeo.com/123456789/abc123xyz (private links)
  const matches = cleanUrl.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/)
  if (matches) {
    const videoId = matches[1]
    const hash = matches[2]
    return `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&muted=1${hash ? `&h=${hash}` : ""}`
  }

  return null
}

/**
 * Load custom projects from Supabase
 */
export async function loadCustomProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Failed to load projects from Supabase:", error)
      return []
    }
    return data || []
  } catch (error) {
    console.error("Error loading projects:", error)
    return []
  }
}

/**
 * Save/Sync all projects to Supabase (bulk import/reset)
 */
export async function saveCustomProjects(projects: Project[]): Promise<void> {
  try {
    // Delete all projects first (only allowed for authenticated users)
    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .neq("title", "") // matches all rows basically

    if (deleteError) {
      console.error("Failed to clear projects for sync:", deleteError)
      throw deleteError
    }

    if (projects.length === 0) return

    // Format projects to make sure we don't pass invalid string IDs to UUID column
    const formatted = projects.map(p => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(p.id || "")
      const { id, ...rest } = p
      return isUuid ? p : rest
    })

    const { error: insertError } = await supabase
      .from("projects")
      .insert(formatted)

    if (insertError) {
      console.error("Failed to bulk insert projects:", insertError)
      throw insertError
    }
  } catch (error) {
    console.error("Error saving projects:", error)
    throw error
  }
}

/**
 * Add a new custom project
 */
export async function addCustomProject(project: Omit<Project, "id"> & { id?: string }): Promise<Project[]> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(project.id || "")
    const dataToInsert = isUuid ? project : { ...project, id: undefined }

    const { error } = await supabase
      .from("projects")
      .insert([dataToInsert])

    if (error) {
      console.error("Failed to add project to Supabase:", error)
      throw error
    }
    return loadCustomProjects()
  } catch (error) {
    console.error("Error adding project:", error)
    throw error
  }
}

/**
 * Update an existing custom project
 */
export async function updateCustomProject(updatedProject: Project): Promise<Project[]> {
  try {
    const { id, ...rest } = updatedProject
    if (!id) {
      throw new Error("Project ID is required for update.")
    }

    const { error } = await supabase
      .from("projects")
      .update(rest)
      .eq("id", id)

    if (error) {
      console.error("Failed to update project in Supabase:", error)
      throw error
    }
    return loadCustomProjects()
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

/**
 * Delete a custom project by ID
 */
export async function deleteCustomProject(id: string): Promise<Project[]> {
  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Failed to delete project from Supabase:", error)
      throw error
    }
    return loadCustomProjects()
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

