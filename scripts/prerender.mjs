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
        I'm Tanie Lalwani, a creative developer, full stack developer, React developer, and 3D web developer building interactive websites, immersive web experiences, and modern web applications.
      </p>
      <p>
        This is the official Tanie portfolio at tanie.me, with GitHub projects, selected web builds, and creator work.
      </p>
    </section>
    <section id="about">
      <h2>Who is Tanie?</h2>
      <p>
        Tanie is Tanie Lalwani: a React developer, creative developer, 3D web developer, full stack developer, and creator. Her GitHub is taniemp3.
      </p>
      <p>
        Skills include React, TypeScript, Three.js, Node.js, frontend development, creative development, and portfolio websites.
      </p>
      <p>
        <a href="https://github.com/taniemp3" rel="me">GitHub</a>
        <a href="https://instagram.com/tanie.mp3" rel="me">Instagram</a>
        <a href="https://linkedin.com/in/tanisha-lalwani/" rel="me">LinkedIn</a>
      </p>
    </section>
    <section id="projects">
      <h2>Tanie portfolio</h2>
      <article>
        <h3>Viziona</h3>
        <p>
          Viziona is a web project by Tanie Lalwani, built with React and TypeScript.
        </p>
        <p>
          <a href="https://viziona.com">View Viziona</a>
          <a href="https://github.com/taniemp3/viziona" rel="me">Code on GitHub</a>
        </p>
      </article>
      <article>
        <h3>Creative development and 3D web work</h3>
        <p>
          Selected interactive websites, immersive web experiences, and modern frontend projects by Tanie Lalwani.
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
