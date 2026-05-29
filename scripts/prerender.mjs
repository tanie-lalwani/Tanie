const prerenderedApp = String.raw`
<div id="root">
  <main data-prerendered="true">

    <section id="home">
      <h1>Tanie Lalwani</h1>

      <p>
        Creative Developer & Full-Stack Web Developer.
      </p>

      <p>
        Building interactive websites, immersive web experiences, and modern web applications using React, TypeScript, Three.js, and Next.js.
      </p>
    </section>

    <section id="about">
      <h2>About Tanie</h2>

      <p>Hey there!</p>

      <p>Before you scroll, maybe a better question:</p>

      <p><strong>What are you looking for?</strong></p>

      <p>Someone to build something? A curious developer figuring things out? Interactive experiments, product thinking, frontend ideas, or just a portfolio with too many tiny details?</p>

      <p>I’ve been coding for around two years and spending most of that time building, experimenting, and trying to understand what makes something feel genuinely enjoyable to use. Either way — welcome :)</p>

      <ul>
        <li>React</li>
        <li>TypeScript</li>
        <li>Three.js</li>
        <li>Next.js</li>
        <li>Creative Development</li>
        <li>Frontend Engineering</li>
        <li>Full-Stack Development</li>
      </ul>

      <p>
        <a href="https://www.google.com/search?q=Tanie+Lalwani">
          Know more about Tanie Lalwani
        </a>
      </p>
    </section>

    <section id="projects">
      <h2>Built so far</h2>

      <article>
        <h3>Viziona</h3>

        <p>
          A modern web project focused on interface clarity, practical user experience, and thoughtful implementation.
        </p>

        <p>
          Technologies: React, TypeScript, UI Engineering.
        </p>

        <a href="https://viziona.com">
          View Viziona
        </a>
      </article>

      <article>
        <h3>Checkout Performance Overhaul — FinchPay</h3>

        <p>
          A frontend-focused performance pass aimed at improving checkout speed, usability, and interaction flow.
        </p>
      </article>

      <article>
        <h3>Marketing Site Rebuild — Leafline</h3>

        <p>
          A responsive marketing site rebuild focused on clearer structure, calmer visuals, and improved readability.
        </p>
      </article>
    </section>

    <section id="contact">
      <h2>Let’s build something</h2>

      <p>
        Open to creative, portfolio, and business web projects.
      </p>

      <p>
        <a href="mailto:tanielalwani@gmail.com">
          tanielalwani@gmail.com
        </a>
      </p>
    </section>

    <section id="links">
      <h2>Links</h2>

      <ul>
        <li>
          <a href="https://github.com/tanie-lalwani" rel="me">
            GitHub
          </a>
        </li>

        <li>
          <a href="https://instagram.com/tanie.mp3" rel="me">
            Instagram
          </a>
        </li>

        <li>
          <a href="https://linkedin.com/in/tanie-lalwani/" rel="me">
            LinkedIn
          </a>
        </li>
      </ul>
    </section>

  </main>
</div>
`;

const prerenderedQna = String.raw`
<div id="root">
  <main data-prerendered="true">
    <section>
      <h1>Interview Tanie</h1>

      <p>
        Quick interview-style questions and answers about Tanie Lalwani, her work, projects, creative development, frontend engineering, React, TypeScript, and interactive web experiences.
      </p>

      <ul>
        <li>Who is Tanie Lalwani?</li>
        <li>What kind of projects does Tanie build?</li>
        <li>What technologies does Tanie use?</li>
        <li>How can I contact Tanie?</li>
      </ul>

      <p>
        <a href="/">Back to portfolio</a>
      </p>
    </section>
  </main>
</div>
`;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist/index.html');
const qnaHtmlPath = path.resolve(__dirname, '../dist/qna.html');
const qnaDistPath = path.resolve(__dirname, '../dist/qna/index.html');

try {
  let html = fs.readFileSync(distPath, 'utf8');

  // Replace the empty root div with our prerendered content
  html = html.replace('<div id="root"></div>', prerenderedApp);

  fs.writeFileSync(distPath, html);
  fs.mkdirSync(path.dirname(qnaDistPath), { recursive: true });
  const qnaHtml = html
    .replace(prerenderedApp, prerenderedQna)
    .replace('href="https://tanie.me/"', 'href="https://tanie.me/qna"');
  fs.writeFileSync(qnaHtmlPath, qnaHtml);
  fs.writeFileSync(qnaDistPath, qnaHtml);
  console.log('✅ Successfully injected prerendered HTML into dist/index.html');
} catch (err) {
  console.error('❌ Failed to prerender:', err);
}
