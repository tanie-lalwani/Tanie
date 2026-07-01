const data = {
  host: "tanie.me",
  key: "60819618108e413da5dc129be54eb8f3",
  keyLocation: "https://tanie.me/60819618108e413da5dc129be54eb8f3.txt",
  urlList: [
    "https://tanie.me/",
    "https://tanie.me/qna"
  ]
};

async function submitIndexNow() {
  console.log("\n[IndexNow] --- Method 1: Submitting bulk JSON request (POST) ---");
  try {
    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      console.log("[IndexNow] POST Success! Bulk URLs registered.");
    } else {
      console.log(`[IndexNow] POST returned status ${response.status}`);
    }
  } catch (err) {
    console.error("[IndexNow] POST Error:", err.message);
  }

  console.log("\n[IndexNow] --- Method 2: Submitting individual GET requests (URL Parameters) ---");
  for (const url of data.urlList) {
    const encodedUrl = encodeURIComponent(url);
    const encodedKeyLocation = encodeURIComponent(data.keyLocation);
    const getRequestUrl = `https://www.bing.com/indexnow?url=${encodedUrl}&key=${data.key}&keyLocation=${encodedKeyLocation}`;
    
    console.log(`\n[IndexNow] URL: ${url}`);
    console.log(`[IndexNow] Request Link: ${getRequestUrl}`);
    
    try {
      const response = await fetch(getRequestUrl);
      if (response.ok) {
        console.log(`[IndexNow] GET Success for ${url}!`);
      } else {
        console.log(`[IndexNow] GET returned status ${response.status}`);
      }
    } catch (err) {
      console.error(`[IndexNow] GET Error for ${url}:`, err.message);
    }
  }
}

submitIndexNow();

