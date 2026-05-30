const prerenderedApp = String.raw`
<div id="root">
  <main data-prerendered="true">

    <section id="home">
      <h1>Tanie Lalwani</h1>

      <p>
        Creative Developer & Full-Stack Web Developer.
      </p>

      <p>
        I create interactive websites, 3D web experiences, and modern responsive web applications with React, TypeScript, and careful frontend engineering.
      </p>
    </section>

    <section id="about">
      <h2>About Tanie:</h2>

      <p>Hi, I’m Tanie Lalwani, a creative and full-stack developer based in India.</p>

      <p>I build interactive websites, 3D web experiences, and responsive web applications that feel intentional, polished, and easy to use.</p>

      <p>Over the last few years, that has turned into work across landing pages, web apps, and interactive experiences with founders, creators, startups, and personal brands.</p>

      <p>Outside tech, I make music, create content, experiment with visuals, business products, fashion, and the occasional hobby I only try once.</p>

      <p>
        <a href="/qna">
          View QnA
        </a>
      </p>

      <p>
        React · TypeScript · Next.js · Framer Motion · GSAP · Three.js · Frontend Development · Interactive Web Experiences · UI Design · Creative Development
      </p>
    </section>

    <section id="open-to">
      <h2>Open to:</h2>

      <span>Open to:</span>

      <h3 class="sr-only">Open to web development services</h3>

      <ul class="sr-only">
        <li>Portfolio Websites</li>
        <li>Landing Pages</li>
        <li>Web Apps</li>
        <li>Game Prototyping</li>
        <li>Interactive Experiences</li>
        <li>Frontend Interfaces</li>
        <li>Creative Web Projects</li>
      </ul>

      <span>Portfolio Websites</span>
    </section>

    <section id="projects">
      <h2>Work & Testimonials:</h2>

      <div>
        <a href="https://tanie.me/projects" target="_blank" rel="noopener noreferrer">
          All Projects
        </a>
      </div>

      <article>
        <h3>Viziona</h3>

        <p>
          A responsive web application shaped around clear interaction, UI/UX design, and practical product execution.
        </p>

        <a href="https://viziona.com">
          View Viziona
        </a>
      </article>

      <article>
        <h3>Checkout Performance Overhaul — FinchPay</h3>

        <p>
          A frontend performance optimization pass for faster checkout flows, clearer states, and smoother feedback.
        </p>
      </article>

      <article>
        <h3>Marketing Site Rebuild — Leafline</h3>

        <p>
          A modern frontend rebuild with tighter content structure, responsive layouts, and a calmer visual system.
        </p>
      </article>

      <section aria-label="Project details" class="sr-only">
        <article>
          <h3>Viziona</h3>
          <p>A responsive web application shaped around clear interaction, UI/UX design, and practical product execution.</p>
          <p>Viziona was built as a polished product surface with a strong focus on responsive layout, clear visual hierarchy, and smooth interaction states. The work balances brand presence with practical usability, keeping the interface easy to scan while still feeling distinctive.</p>
          <p>The project highlights frontend execution across structure, motion, spacing, and cross-device behavior. Each section is shaped to guide the user naturally from first impression to action, with careful attention to readable content, reliable components, and a modern React and TypeScript workflow.</p>
          <a href="https://viziona.com">View</a>
          <a href="https://github.com/tanie-lalwani/viziona">Code</a>
        </article>
        <article>
          <h3>Checkout Performance Overhaul - FinchPay</h3>
          <p>A frontend performance optimization pass for faster checkout flows, clearer states, and smoother feedback.</p>
          <p>Checkout Performance Overhaul - FinchPay is a frontend performance optimization pass focused on faster checkout flows, clearer states, smoother feedback, and a better checkout experience. Its stack includes React, TypeScript, and performance work.</p>
        </article>
        <article>
          <h3>Marketing Site Rebuild - Leafline</h3>
          <p>A modern frontend rebuild with tighter content structure, responsive layouts, and a calmer visual system.</p>
          <p>Marketing Site Rebuild - Leafline is a modern frontend rebuild with tighter content structure, responsive layouts, and a calmer visual system. Its stack includes React, TypeScript, and web development.</p>
        </article>
      </section>
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
    <section aria-labelledby="qna-title">
      <h1 id="qna-title">Interview Tanie</h1>

      <p>Quick interview-style questions and answers about Tanie Lalwani, her work, projects, creative development, frontend engineering, React, TypeScript, and interactive web experiences.</p>

      <article>
        <h2>Tell me about yourself.</h2>
        <p>
          I am Tanie Lalwani, a creative developer focused on React, TypeScript, UI design, full-stack experiments, and interactive web experiences. I got into tech through curiosity: building, redesigning, fixing details, and learning how interfaces can feel memorable instead of just functional.
        </p>
      </article>

      <article>
        <h2>Walk me through a project you are proud of.</h2>
        <p>
          A project I am proud of is Viziona, because it reflects how I think about product work: responsive layouts, clear interaction, visual hierarchy, and practical execution. I care about making the interface feel polished, readable, and easy to move through.
        </p>
      </article>

      <article>
        <h2>How do you handle bugs in production?</h2>
        <p>
          When I handle bugs in production, I start by reproducing the issue, checking the user impact, reading logs or browser errors, and narrowing the cause before changing code. I prefer small fixes, clear testing, and documenting what broke so the same issue is less likely to return.
        </p>
      </article>

      <article>
        <h2>Describe a time you disagreed with a teammate.</h2>
        <p>
          When I disagree with a teammate, I try to move the conversation toward the user, the constraints, and the evidence. I explain my reasoning, listen for what I missed, and look for the option that protects the product instead of trying to win the argument.
        </p>
      </article>

      <article>
        <h2>How do you optimize frontend performance?</h2>
        <p>
          For frontend performance, I look at bundle size, unnecessary renders, image weight, layout shifts, and slow interactions. I use lazy loading, memoization where it actually helps, cleaner component boundaries, and practical measurement instead of guessing.
        </p>
      </article>

      <article>
        <h2>Why do you want this role?</h2>
        <p>
          I want roles where I can combine engineering, design sensitivity, communication, and product thinking. I like work that lets me build useful things, explain technology clearly, collaborate with people, and create digital experiences that feel intentional.
        </p>
      </article>

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

const homeTitle = 'Tanie Lalwani | About, Projects & Contact';
const qnaTitle = 'About Tanie Lalwani | Interview QnA';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist/index.html');
const qnaHtmlPath = path.resolve(__dirname, '../dist/qna.html');
const qnaDistPath = path.resolve(__dirname, '../dist/qna/index.html');

try {
  let html = fs.readFileSync(distPath, 'utf8');

  html = html.replace('<title>Tanie Lalwani | About, Projects & Contact</title>', `<title>${homeTitle}</title>`);

  // Replace the empty root div with our prerendered content
  html = html.replace('<div id="root"></div>', prerenderedApp);

  fs.writeFileSync(distPath, html);
  fs.mkdirSync(path.dirname(qnaDistPath), { recursive: true });
  const qnaHtml = html
    .replace(`<title>${homeTitle}</title>`, `<title>${qnaTitle}</title>`)
    .replace(prerenderedApp, prerenderedQna)
    .replace('href="https://tanie.me/"', 'href="https://tanie.me/qna"');
  fs.writeFileSync(qnaHtmlPath, qnaHtml);
  fs.writeFileSync(qnaDistPath, qnaHtml);
  console.log('✅ Successfully injected prerendered HTML into dist/index.html');
} catch (err) {
  console.error('❌ Failed to prerender:', err);
}
