import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read .env file manually
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

console.log("=== SUPABASE CONNECTION TEST ===");
console.log("URL:", url);
console.log("Key type:", key?.startsWith("sb_publishable_") ? "Modern Publishable Key (opaque)" : key ? "Legacy JWT Key" : "Missing");

if (!url || !key) {
  console.error("❌ Missing URL or Key");
  process.exit(1);
}

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

async function runTests() {
  console.log("\n1. Testing Supabase Health / REST Connection...");
  try {
    const healthRes = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key }
    });
    console.log(`📡 PostgREST OpenAPI spec endpoint status: ${healthRes.status} ${healthRes.statusText}`);
  } catch (err) {
    console.error("❌ REST ping failed:", err.message);
  }

  console.log("\n2. Testing Database Tables & RLS Query Status...");
  const tables = [
    "packages",
    "bookings",
    "profiles",
    "projects",
    "contracts",
    "project_assets"
  ];

  for (const table of tables) {
    try {
      const { data, error, status, statusText } = await supabase
        .from(table)
        .select("*")
        .limit(3);

      if (error) {
        console.log(`⚠️ Table '${table}': Status ${status} (${error.code || 'Error'}) -> ${error.message} (Hint: ${error.hint || 'none'})`);
      } else {
        console.log(`✅ Table '${table}': Status ${status} (${statusText || 'OK'}) -> Found ${data?.length || 0} row(s)`);
        if (data && data.length > 0) {
          console.log(`   Sample preview:`, JSON.stringify(data[0]).slice(0, 100) + "...");
        }
      }
    } catch (err) {
      console.error(`❌ Table '${table}' query threw:`, err.message);
    }
  }

  console.log("\n3. Testing Storage Buckets...");
  try {
    const { data: buckets, error: bError } = await supabase.storage.listBuckets();
    if (bError) {
      console.log(`⚠️ Storage buckets: ${bError.message}`);
    } else {
      console.log(`✅ Storage buckets (${buckets?.length || 0}):`, buckets?.map(b => b.name).join(", ") || "None");
    }
  } catch (err) {
    console.error("❌ Storage check threw:", err.message);
  }

  console.log("\n4. Testing Direct REST Table Check...");
  for (const table of tables) {
    try {
      const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
        headers: {
          apikey: key,
          "Content-Type": "application/json"
        }
      });
      const text = await res.text();
      console.log(`- REST '${table}': ${res.status} ${res.statusText} -> ${text.slice(0, 100)}`);
    } catch (e) {
      console.log(`- REST '${table}' error:`, e.message);
    }
  }

  console.log("\n=== TEST COMPLETED ===");
}

runTests();
