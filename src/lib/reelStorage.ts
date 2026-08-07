import { supabase } from "./supabaseClient"

export interface Reel {
  id?: string
  created_at?: string
  videoUrl: string
  videoAlt?: string
  order?: number
  
  caption: string
  caption_es?: string
  caption_fr?: string
  caption_hi?: string
  caption_ja?: string
  caption_ur?: string
  caption_zh?: string

  transcript: string
  transcript_es?: string
  transcript_fr?: string
  transcript_hi?: string
  transcript_ja?: string
  transcript_ur?: string
  transcript_zh?: string

  question: string
  question_es?: string
  question_fr?: string
  question_hi?: string
  question_ja?: string
  question_ur?: string
  question_zh?: string
}

/**
 * Load all reels from Supabase
 */
export async function loadReels(): Promise<Reel[]> {
  try {
    const { data, error } = await supabase
      .from("reels")
      .select("*")
      .order("order", { ascending: true })
      .order("created_at", { ascending: true })

    if (error) {
      if (error.code === "42703" || error.message.includes("order")) {
        const fallback = await supabase
          .from("reels")
          .select("*")
          .order("created_at", { ascending: true })
        if (fallback.error) {
          console.error("Failed fallback reels load:", fallback.error)
          return []
        }
        return fallback.data || []
      }
      console.error("Failed to load reels from Supabase:", error)
      return []
    }
    return data || []
  } catch (error) {
    console.error("Error loading reels:", error)
    return []
  }
}

/**
 * Add a new reel
 */
export async function addReel(reel: Omit<Reel, "id"> & { id?: string }): Promise<Reel[]> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reel.id || "")
    const dataToInsert = isUuid ? reel : { ...reel, id: undefined }

    const { error } = await supabase
      .from("reels")
      .insert([dataToInsert])

    if (error) {
      if ((error.code === "PGRST204" || error.message.includes("order")) && "order" in dataToInsert) {
        const { order, ...rest } = dataToInsert
        const retry = await supabase.from("reels").insert([rest])
        if (retry.error) {
          console.error("Retry add reel failed:", retry.error)
          throw retry.error
        }
      } else {
        console.error("Failed to add reel to Supabase:", error)
        throw error
      }
    }
    return loadReels()
  } catch (error) {
    console.error("Error adding reel:", error)
    throw error
  }
}

/**
 * Update an existing reel
 */
export async function updateReel(updatedReel: Reel): Promise<Reel[]> {
  try {
    const { id, ...rest } = updatedReel
    if (!id) {
      throw new Error("Reel ID is required for update.")
    }

    const { error } = await supabase
      .from("reels")
      .update(rest)
      .eq("id", id)

    if (error) {
      if ((error.code === "PGRST204" || error.message.includes("order")) && "order" in rest) {
        const { order, ...retryRest } = rest
        const retry = await supabase.from("reels").update(retryRest).eq("id", id)
        if (retry.error) {
          console.error("Retry update reel failed:", retry.error)
          throw retry.error
        }
      } else {
        console.error("Failed to update reel in Supabase:", error)
        throw error
      }
    }
    return loadReels()
  } catch (error) {
    console.error("Error updating reel:", error)
    throw error
  }
}

/**
 * Delete a reel by ID
 */
export async function deleteReel(id: string): Promise<Reel[]> {
  try {
    const { error } = await supabase
      .from("reels")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Failed to delete reel from Supabase:", error)
      throw error
    }
    return loadReels()
  } catch (error) {
    console.error("Error deleting reel:", error)
    throw error
  }
}
