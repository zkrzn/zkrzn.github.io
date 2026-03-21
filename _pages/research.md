---
title: "Research &amp; Publications"
description: "Research topics in artificial intelligence, immersive technologies, and federated learning — plus all scientific publications by Zakaria Izouaouen, importable from ORCID."
icon: "fa-solid fa-microscope"
layout: single
permalink: /research/
orcid_id: ""
---

My research focuses on the intersection of **Artificial Intelligence** and **Immersive Technologies**, with a particular emphasis on creating intelligent systems that enhance human experiences in virtual and augmented environments.

---

## <i class="fa-solid fa-brain" aria-hidden="true"></i> Artificial Intelligence

- **Machine Learning & Deep Learning** — Neural networks, predictive modeling, and pattern recognition for complex data analysis
- **Multi-Agent Systems (MAS)** — Distributed AI architectures for collaborative problem-solving and autonomous decision-making
- **Intelligent Decision Systems** — AI-driven frameworks for real-time adaptive responses
- **Federated Learning** — Privacy-preserving machine learning across distributed environments

---

## <i class="fa-solid fa-vr-cardboard" aria-hidden="true"></i> Immersive Technologies

- **Virtual Reality (VR)** — Fully immersive digital environments for training, simulation, and education
- **Augmented Reality (AR)** — Overlaying digital information on the physical world for enhanced interactions
- **Mixed Reality (MR)** — Blending physical and digital worlds for seamless experiences
- **Metaverse Applications** — Building intelligent agents for next-generation virtual worlds

---

## <i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Secure &amp; Intelligent Systems

- **System Modeling** — Designing robust architectures for data-intensive applications
- **Data Security & Privacy** — Implementing privacy-preserving techniques in AI systems
- **Intelligent Processing Pipelines** — Scalable and efficient data processing workflows

---

## <i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> Education &amp; Industry Applications

- **AI for Education** — Intelligent tutoring systems and adaptive learning platforms
- **Simulation-Based Learning** — VR/AR training environments for practical skill development
- **Industrial Intelligent Systems** — Applying AI and immersive tech to manufacturing, healthcare, and beyond

---

## <i class="fa-solid fa-chart-line" aria-hidden="true"></i> Research Methodology

I employ a combination of:
- Systematic literature reviews following PRISMA guidelines
- Mixed-methods research (quantitative analysis + qualitative interviews)
- Experimental prototyping and user studies
- Comparative analysis of frameworks and architectures

---

## <i class="fa-solid fa-file-lines" aria-hidden="true"></i> Publications

<p class="lead">Selected publications. Use filters to find papers by year or type. Data is pulled from ORCID when available, with a curated fallback list.</p>

<div id="publications-section"
  data-orcid="{{ page.orcid_id | default: site.author.orcid }}"
  data-google-scholar="https://scholar.google.com/citations?user=dsJzeEcAAAAJ&hl=fr"
  data-researchgate="https://www.researchgate.net/profile/Zakaria-Izouaouen">

  <div class="pub-controls" role="search" aria-label="Filter publications">
    <input type="search" id="pub-search" class="pub-search"
      placeholder="Search by title or author…" aria-label="Search publications">
    <select id="pub-year-filter" class="pub-filter" aria-label="Filter by year">
      <option value="">All years</option>
    </select>
    <select id="pub-type-filter" class="pub-filter" aria-label="Filter by type">
      <option value="">All types</option>
    </select>
    <select id="pub-sort" class="pub-filter" aria-label="Sort publications">
      <option value="year-desc">Most recent</option>
      <option value="year-asc">Oldest first</option>
      <option value="alpha">Alphabetical</option>
    </select>
  </div>

  <div id="pub-status" class="pub-status" aria-live="polite"></div>
  <div id="pub-list" class="pub-list" role="list" aria-label="Publications list"></div>

  <div class="pub-export" id="pub-export" style="display:none">
    <span class="pub-export-label">Export:</span>
    <button id="export-bibtex" class="pub-export-btn">
      <i class="fa-solid fa-file-code" aria-hidden="true"></i> BibTeX
    </button>
    <button id="export-json" class="pub-export-btn">
      <i class="fa-solid fa-file-export" aria-hidden="true"></i> JSON
    </button>
  </div>

  <div class="pub-profiles">
    Also see:
    <a href="https://scholar.google.com/citations?user=dsJzeEcAAAAJ&hl=fr" target="_blank" rel="noopener noreferrer">
      <i class="fa-solid fa-chart-line" aria-hidden="true"></i> Google Scholar
    </a>
    ·
    <a href="https://www.researchgate.net/profile/Zakaria-Izouaouen" target="_blank" rel="noopener noreferrer">
      <i class="fa-solid fa-microscope" aria-hidden="true"></i> ResearchGate
    </a>
    ·
    <a href="https://www.semanticscholar.org/author/2379223972" target="_blank" rel="noopener noreferrer">
      <i class="fa-solid fa-book-open" aria-hidden="true"></i> Semantic Scholar
    </a>
  </div>
</div>

<script src="{{ '/assets/js/orcid-publications.js' | relative_url }}" defer></script>
