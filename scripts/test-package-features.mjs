import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read .env file
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isOpaqueSupabaseKey(value) {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey) {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, k) => headers.set(k, value));
    }
    if (isOpaqueSupabaseKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

const supabase = createClient(url, key, {
  global: {
    fetch: createSupabaseFetch(key),
  },
});

async function verifyTables() {
  console.log("=== CHECKING SEPARATE PACKAGE FEATURE TABLES IN SUPABASE ===");
  const featureTables = [
    { table: "package_landing_sprint_features", pkg: "luxury-landing-sprint" },
    { table: "package_bofu_marketing_features", pkg: "growth-marketing-campaigns" },
    { table: "package_3d_experience_features", pkg: "interactive-3d-experience" },
    { table: "package_fullstack_backend_features", pkg: "fullstack-web-app" },
    { table: "package_all_features_view", pkg: "ALL (Unified View)" }
  ];

  for (const item of featureTables) {
    try {
      const { data, error, status } = await supabase
        .from(item.table)
        .select("*")
        .limit(3);

      if (error) {
        console.log(`[Status ${status}] Table '${item.table}' (${item.pkg}): ${error.message}`);
      } else {
        console.log(`[Status ${status} OK] Table '${item.table}' (${item.pkg}): ${data?.length || 0} row(s) returned`);
      }
    } catch (e) {
      console.log(`Table '${item.table}' threw:`, e.message);
    }
  }
}

verifyTables();
