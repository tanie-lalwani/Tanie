import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const distIndexPath = join(process.cwd(), "dist", "index.html")

const html = readFileSync(distIndexPath, "utf8")

const prerenderedApp = String.raw`
<div id="root">
  <main data-prerendered="true">
    <section id="home">
      <h1>I'm Tanie!</h1>
      <p>
        I'm Tanie, a creative developer and full-stack web developer making interactive websites, 3D/immersive web experiences, and modern web applications.
      </p>
    </section>
    <section id="about">
      <h2>About Tanie</h2>
      <p>
        Tanie Lalwani is a creative developer and builder focused on interactive web experiences, thoughtful interfaces, and modern digital products. Working across frontend and full-stack development, she enjoys turning ideas into experiences that feel intuitive, immersive, and genuinely enjoyable to use.
      </p>
      <p>
        Skills include React, TypeScript, Three.js, Node.js, full-stack development, UI engineering, and creative development.
      </p>
      <p>
        <a href="https://github.com/taniemp3" rel="me">GitHub</a>
        <a href="https://instagram.com/tanie.mp3" rel="me">Instagram</a>
        <a href="https://linkedin.com/in/tanie-lalwani/" rel="me">LinkedIn</a>
      </p>
    </section>
    <section id="projects">
      <h2>Built so far.</h2>
      <article>
        <h3>Viziona</h3>
        <p>
          A focused web project shaped around clear interaction, clean interface decisions, and practical product execution.
        </p>
        <p>
          <a href="https://viziona.com">View Viziona</a>
          <a href="https://github.com/taniemp3/viziona" rel="me">Code on GitHub</a>
        </p>
      </article>
      <article>
        <h3>Creative development and 3D web work</h3>
        <p>
          Selected interactive websites, immersive web experiences, and modern frontend projects.
        </p>
      </article>
    </section>
    <section id="contact">
      <h2>Contact Tanie Lalwani</h2>
      <p>Open to creative, portfolio, and business web projects.</p>
      <p><a href="mailto:contact@tanie.me">contact@tanie.me</a></p>
    </section>
  </main>
</div>`

const nextHtml = html.replace('<div id="root"></div>', prerenderedApp.trim())

if (nextHtml === html) {
  throw new Error("Could not find empty root element in dist/index.html")
}

writeFileSync(distIndexPath, nextHtml)
console.log("Prerendered crawlable HTML into dist/index.html")
