/**
 * orcid-publications.js
 * Fetches works from the ORCID public API, normalises them into a common
 * schema, renders an interactive publications list with search / filter / sort,
 * and provides BibTeX + JSON export.  Falls back to a hand-curated list when
 * the ORCID ID is absent or the API is unreachable.
 */
(function () {
  'use strict';

  /* ── Fallback / manual publications ──────────────────────────────────── */
  var FALLBACK_PUBS = [
    {
      id: 'izouaouen2025vr-mental-health',
      title: 'Virtual Reality in Mental Health Care: A Scoping Review of Applications, Efficacy',
      authors: ['Zakaria Izouaouen', 'Nassim Kharmoum', 'Soumia Ziti'],
      year: 2025,
      type: 'book-chapter',
      venue: 'HealthTech "Global Summit of Digital Health": Volume 1',
      publisher: 'Springer Nature',
      doi: '10.1007/978-3-032-01967-7_26',
      url: 'https://doi.org/10.1007/978-3-032-01967-7_26',
      abstract: 'A comprehensive scoping review exploring VR applications in mental healthcare. Examines VR exposure therapy for anxiety disorders, PTSD, phobias, and depression. Discusses how VR achieves positive therapeutic effects through controlled exposure exercises, coping skills training, and emotion regulation techniques.',
      keywords: ['VR', 'mental health', 'scoping review', 'therapy', 'immersive technologies']
    },
    {
      id: 'izouaouen2025federated-immersive',
      title: 'Federated Intelligence in Immersive Technologies: Systematic Review of Privacy, Agents and Metaverse',
      authors: ['Zakaria Izouaouen', 'N. Kharmoum', 'Soumia Ziti'],
      year: 2025,
      type: 'conference-paper',
      venue: 'OPTIMA 2025 (IEEE ICOA)',
      doi: '10.1109/ICOA66896.2025.11236955',
      url: 'https://doi.org/10.1109/ICOA66896.2025.11236955',
      abstract: 'A systematic review analysing 170 peer-reviewed articles on Multi-Agent Systems in VR/AR/MR environments. Presents a novel classification framework for MAS-immersive technology integration, highlighting privacy-preserving federated approaches and metaverse applications.',
      keywords: ['federated learning', 'multi-agent systems', 'VR', 'AR', 'metaverse', 'privacy']
    },
    {
      id: 'izouaouen2025education-immersive',
      title: 'Education Enhanced: Impact of Immersive Technologies on Teaching and Learning Outcomes',
      authors: ['Zakaria Izouaouen', 'N. Kharmoum', 'Soumia Ziti'],
      year: 2025,
      type: 'conference-paper',
      venue: 'IEEE International Conference on Circuits and Systems for Communications (ICCSC) 2025',
      doi: '10.1109/ICCSC66714.2025.11135372',
      url: 'https://doi.org/10.1109/ICCSC66714.2025.11135372',
      abstract: 'Explores the transformative impact of VR, AR, and MR on education using a mixed-methods approach. Demonstrates significant enhancements in student engagement, knowledge retention, and critical thinking skills.',
      keywords: ['VR', 'AR', 'MR', 'education', 'immersive learning', 'teaching outcomes']
    }
  ];

  /* ── Cache helpers ────────────────────────────────────────────────────── */
  var CACHE_KEY = 'orcid-pubs-cache';
  var CACHE_TTL = 24 * 60 * 60 * 1000; // 24 h

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts > CACHE_TTL) return null;
      return parsed.data;
    } catch (e) {
      return null;
    }
  }

  function writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data }));
    } catch (e) {}
  }

  /* ── ORCID normalisation ──────────────────────────────────────────────── */
  function normaliseOrcidWork(work) {
    var summary = work['work-summary'] && work['work-summary'][0];
    if (!summary) return null;

    var titleVal = summary.title && summary.title.title && summary.title.title.value;
    if (!titleVal) return null;

    var year = null;
    if (summary['publication-date'] && summary['publication-date'].year) {
      year = parseInt(summary['publication-date'].year.value, 10) || null;
    }

    var doi = null;
    var url = null;
    var extIds = summary['external-ids'] && summary['external-ids']['external-id'];
    if (extIds) {
      extIds.forEach(function (eid) {
        if (eid['external-id-type'] === 'doi') {
          doi = eid['external-id-value'];
          url = 'https://doi.org/' + doi;
        } else if (!url && eid['external-id-url'] && eid['external-id-url'].value) {
          url = eid['external-id-url'].value;
        }
      });
    }

    var rawType = summary.type || '';
    var type = mapOrcidType(rawType);

    var contributors = work.contributors && work.contributors.contributor;
    var authors = [];
    if (contributors) {
      contributors.forEach(function (c) {
        if (c['credit-name'] && c['credit-name'].value) {
          authors.push(c['credit-name'].value);
        }
      });
    }
    if (!authors.length) {
      // Fall back to site owner name when contributors are not listed in the
      // ORCID summary (common for privately configured entries).
      authors = ['Zakaria Izouaouen'];
    }

    var venue = (summary['journal-title'] && summary['journal-title'].value) || '';

    return {
      id: 'orcid-' + (summary['put-code'] || Math.random()),
      title: titleVal,
      authors: authors,
      year: year,
      type: type,
      venue: venue,
      doi: doi,
      url: url,
      abstract: '',
      keywords: []
    };
  }

  function mapOrcidType(raw) {
    var t = (raw || '').toLowerCase();
    if (t === 'book-chapter' || t === 'book_chapter') return 'book-chapter';
    if (t === 'journal-article' || t === 'journal_article') return 'journal-article';
    if (t.indexOf('conference') !== -1) return 'conference-paper';
    if (t === 'dissertation' || t === 'thesis') return 'thesis';
    if (t === 'preprint') return 'preprint';
    return 'other';
  }

  function typeLabel(type) {
    var map = {
      'book-chapter': 'Book Chapter',
      'journal-article': 'Journal Article',
      'conference-paper': 'Conference Paper',
      'thesis': 'Thesis / Dissertation',
      'preprint': 'Preprint',
      'other': 'Other'
    };
    return map[type] || type;
  }

  /* ── ORCID fetch ──────────────────────────────────────────────────────── */
  function fetchOrcid(orcidId, callback) {
    var cached = readCache();
    if (cached) { callback(null, cached); return; }

    var url = 'https://pub.orcid.org/v3.0/' + orcidId + '/works';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.timeout = 8000;
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var json = JSON.parse(xhr.responseText);
          var groups = (json.group) || [];
          var pubs = [];
          groups.forEach(function (g) {
            var normalised = normaliseOrcidWork(g);
            if (normalised) pubs.push(normalised);
          });
          writeCache(pubs);
          callback(null, pubs);
        } catch (e) {
          callback(e, null);
        }
      } else {
        callback(new Error('HTTP ' + xhr.status), null);
      }
    };
    xhr.onerror = function () { callback(new Error('Network error'), null); };
    xhr.ontimeout = function () { callback(new Error('Timeout'), null); };
    xhr.send();
  }

  /* ── State ────────────────────────────────────────────────────────────── */
  var allPubs = [];
  var filteredPubs = [];

  /* ── DOM helpers ──────────────────────────────────────────────────────── */
  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setStatus(msg) {
    var el = document.getElementById('pub-status');
    if (el) el.textContent = msg;
  }

  /* ── Render ───────────────────────────────────────────────────────────── */
  function renderPub(pub) {
    var authorsStr = pub.authors.join(', ');
    var yearStr = pub.year ? String(pub.year) : 'n.d.';
    var badgeClass = 'pub-badge pub-badge--' + pub.type;
    var doiLink = pub.url
      ? '<a class="pub-doi" href="' + esc(pub.url) + '" target="_blank" rel="noopener noreferrer" aria-label="View publication DOI">'
        + '<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> '
        + (pub.doi ? esc(pub.doi) : 'View publication')
        + '</a>'
      : '';

    return '<div class="pub-card" role="listitem" data-id="' + esc(pub.id) + '">'
      + '<div class="pub-card-header">'
      + '<span class="' + badgeClass + '">' + esc(typeLabel(pub.type)) + '</span>'
      + '<span class="pub-year">' + esc(yearStr) + '</span>'
      + '</div>'
      + '<h3 class="pub-title">' + esc(pub.title) + '</h3>'
      + '<p class="pub-authors">' + esc(authorsStr) + '</p>'
      + (pub.venue ? '<p class="pub-venue"><i class="fa-solid fa-building-columns" aria-hidden="true"></i> ' + esc(pub.venue) + '</p>' : '')
      + (doiLink ? '<div class="pub-links">' + doiLink + '</div>' : '')
      + (pub.abstract ? '<details class="pub-abstract"><summary>Abstract</summary><p>' + esc(pub.abstract) + '</p></details>' : '')
      + '</div>';
  }

  function renderList(pubs) {
    var el = document.getElementById('pub-list');
    if (!el) return;
    if (!pubs.length) {
      el.innerHTML = '<p class="pub-empty">No publications match your search.</p>';
      return;
    }
    el.innerHTML = pubs.map(renderPub).join('');
    var exportEl = document.getElementById('pub-export');
    if (exportEl) exportEl.style.display = '';
  }

  /* ── Filtering & sorting ──────────────────────────────────────────────── */
  function applyFilters() {
    var search = (document.getElementById('pub-search') || {}).value || '';
    var year = (document.getElementById('pub-year-filter') || {}).value || '';
    var type = (document.getElementById('pub-type-filter') || {}).value || '';
    var sort = (document.getElementById('pub-sort') || {}).value || 'year-desc';

    var q = search.trim().toLowerCase();
    filteredPubs = allPubs.filter(function (p) {
      if (q && p.title.toLowerCase().indexOf(q) === -1 && p.authors.join(' ').toLowerCase().indexOf(q) === -1) return false;
      if (year && String(p.year) !== year) return false;
      if (type && p.type !== type) return false;
      return true;
    });

    filteredPubs.sort(function (a, b) {
      if (sort === 'year-asc') return (a.year || 0) - (b.year || 0);
      if (sort === 'alpha') return a.title.localeCompare(b.title);
      return (b.year || 0) - (a.year || 0); // year-desc default
    });

    setStatus(filteredPubs.length + ' publication' + (filteredPubs.length !== 1 ? 's' : '') + ' found');
    renderList(filteredPubs);
  }

  function populateFilters(pubs) {
    var years = {};
    var types = {};
    pubs.forEach(function (p) {
      if (p.year) years[p.year] = true;
      if (p.type) types[p.type] = true;
    });

    var yearSel = document.getElementById('pub-year-filter');
    if (yearSel) {
      Object.keys(years).sort(function (a, b) { return b - a; }).forEach(function (y) {
        var opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        yearSel.appendChild(opt);
      });
    }

    var typeSel = document.getElementById('pub-type-filter');
    if (typeSel) {
      Object.keys(types).sort().forEach(function (t) {
        var opt = document.createElement('option');
        opt.value = t;
        opt.textContent = typeLabel(t);
        typeSel.appendChild(opt);
      });
    }
  }

  /* ── Export ───────────────────────────────────────────────────────────── */
  function toBibtex(pub) {
    var key = pub.id.replace(/[^a-zA-Z0-9]/g, '_');
    var entryType = pub.type === 'book-chapter' ? 'incollection'
      : pub.type === 'journal-article' ? 'article'
      : pub.type === 'thesis' ? 'phdthesis'
      : 'inproceedings';
    var lines = ['@' + entryType + '{' + key + ','];
    lines.push('  title = {' + pub.title + '},');
    lines.push('  author = {' + pub.authors.join(' and ') + '},');
    if (pub.year) lines.push('  year = {' + pub.year + '},');
    if (pub.venue) lines.push('  booktitle = {' + pub.venue + '},');
    if (pub.doi) lines.push('  doi = {' + pub.doi + '},');
    if (pub.url) lines.push('  url = {' + pub.url + '},');
    lines.push('}');
    return lines.join('\n');
  }

  function downloadFile(filename, content, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */
  function init(pubs, source) {
    allPubs = pubs;
    populateFilters(pubs);
    applyFilters();

    if (source === 'orcid') {
      setStatus(pubs.length + ' publication' + (pubs.length !== 1 ? 's' : '') + ' from ORCID');
    } else {
      setStatus(pubs.length + ' publication' + (pubs.length !== 1 ? 's' : '') + ' (curated list)');
    }

    // Event listeners for controls
    ['pub-search', 'pub-year-filter', 'pub-type-filter', 'pub-sort'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', applyFilters);
    });

    var exportBibtex = document.getElementById('export-bibtex');
    if (exportBibtex) {
      exportBibtex.addEventListener('click', function () {
        var content = filteredPubs.map(toBibtex).join('\n\n');
        downloadFile('publications.bib', content, 'text/plain');
      });
    }

    var exportJson = document.getElementById('export-json');
    if (exportJson) {
      exportJson.addEventListener('click', function () {
        downloadFile('publications.json', JSON.stringify(filteredPubs, null, 2), 'application/json');
      });
    }
  }

  function run() {
    var section = document.getElementById('publications-section');
    if (!section) return;

    var orcidId = (section.getAttribute('data-orcid') || '').trim();

    if (orcidId) {
      setStatus('Loading publications from ORCID…');
      fetchOrcid(orcidId, function (err, pubs) {
        if (err || !pubs || !pubs.length) {
          init(FALLBACK_PUBS, 'fallback');
        } else {
          init(pubs, 'orcid');
        }
      });
    } else {
      init(FALLBACK_PUBS, 'fallback');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
