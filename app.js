/* Edge : appli perso d'apprentissage du trading. Aucune dépendance, tout tient dans ce fichier. */
'use strict';

const VERSION = '1.0.0';
const CLE_STOCKAGE = 'edge.v1';
const NOUVELLES_CARTES_PAR_JOUR = 15;
const INTERVALLES = [1, 3, 7, 14, 30, 60]; // jours entre deux révisions, selon la boîte
const QUESTIONS_PAR_QUIZ = 10;

/* ---------- Stockage ---------- */

function etatParDefaut() {
  return {
    lecons: {},                       // id -> date de lecture (jour)
    cartes: {},                       // id -> { boite, due }
    nouvellesDuJour: { jour: 0, n: 0 },
    quiz: { historique: [], erreurs: {} },
    activite: [],                     // jours avec au moins une action
    guidee: {},                       // id du scénario -> meilleur score
    journal: { url: '', cle: '', cache: null, maj: null },
  };
}

function charger() {
  try {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return etatParDefaut();
    return Object.assign(etatParDefaut(), JSON.parse(brut));
  } catch (e) {
    return etatParDefaut();
  }
}

let etat = charger();

function sauver() {
  try { localStorage.setItem(CLE_STOCKAGE, JSON.stringify(etat)); } catch (e) { /* stockage indisponible */ }
}

/* ---------- Utilitaires ---------- */

const $vue = document.getElementById('vue');
const $titre = document.getElementById('titre');
const $retour = document.getElementById('btn-back');

function jour(d = new Date()) {
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
}

function hash(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function melanger(t) {
  const a = t.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function pct(x) { return Math.round(x * 100) + '%'; }

function fr(x) { return x.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

function noterActivite() {
  const j = jour();
  if (!etat.activite.includes(j)) {
    etat.activite.push(j);
    etat.activite = etat.activite.slice(-400);
  }
  sauver();
}

function serie() {
  const jours = new Set(etat.activite);
  let j = jour();
  if (!jours.has(j)) j--;           // la série tient encore si on n'a rien fait aujourd'hui
  let n = 0;
  while (jours.has(j)) { n++; j--; }
  return n;
}

// Les cartes et questions n'ont pas d'id dans les données : on le dérive du texte.
const CARTES = (window.CARTES || []).map(c => ({ ...c, id: hash(c.q) }));
const QUIZ = (window.QUIZ || []).map(q => ({ ...q, id: hash(q.q) }));
const LECONS = window.LECONS || [];
const FICHES = window.FICHES || [];
const REGLES = window.REGLES || [];
const LEXIQUE = window.LEXIQUE || [];

function themes(liste) {
  return [...new Set(liste.map(x => x.theme || x.module))];
}

/* ---------- Navigation ---------- */

let pile = [];

function aller(vue, params = {}, empiler = true) {
  fermerDefinition();
  if (empiler) pile.push({ vue, params });
  $retour.hidden = pile.length <= 1;
  window.scrollTo(0, 0);
  VUES[vue](params);
}

function retour() {
  if (pile.length <= 1) return;
  pile.pop();
  const { vue, params } = pile[pile.length - 1];
  aller(vue, params, false);
}

function onglet(nom) {
  document.querySelectorAll('.tabbar button').forEach(b => b.classList.toggle('actif', b.dataset.onglet === nom));
  pile = [];
  aller(nom);
}

$retour.addEventListener('click', retour);
document.getElementById('btn-reglages').addEventListener('click', () => aller('reglages'));
document.querySelectorAll('.tabbar button').forEach(b => b.addEventListener('click', () => onglet(b.dataset.onglet)));

function rendre(titre, html) {
  $titre.textContent = titre;
  $vue.innerHTML = html;
  $vue.querySelectorAll('.graph[data-g]').forEach(el => { el.outerHTML = svgGraphique(el.dataset.g); });
}

/* ---------- Graphiques en chandeliers (données dans data/graphiques.js) ---------- */

const COULEURS_GRAPH = { vert: 'var(--green)', rouge: 'var(--red)', or: 'var(--accent)', bleu: 'var(--blue)', neutre: 'var(--muted)' };

function svgGraphique(id) {
  // id d'un graphique de data/graphiques.js, ou définition directe (analyse guidée).
  const d = typeof id === 'object' ? id : (window.GRAPHIQUES || {})[id];
  if (!d) return '';
  // coupe : n'afficher que les n premières bougies (pour demander "que fais-tu maintenant ?").
  const b = window.genererBougies(d.base ? window.GRAPHIQUES[d.base] : d).slice(0, d.coupe || undefined);
  const L = 12, G0 = 6, DROITE = 54, H = 230, HAUT = 24, BAS = 24;
  const W = G0 + b.length * L + DROITE;
  const min = Math.min(...b.map(x => x.l)), max = Math.max(...b.map(x => x.h));
  const y = p => +(HAUT + (max - p) / (max - min) * (H - HAUT - BAS)).toFixed(1);
  const xc = i => G0 + i * L + L / 2, xg = i => G0 + i * L + 1, xd = i => G0 + (i + 1) * L - 1;
  const coul = c => COULEURS_GRAPH[c] || COULEURS_GRAPH.neutre;
  const txt = (x, yy, t, c, ancre = 'start') =>
    `<text x="${x}" y="${yy}" text-anchor="${ancre}" style="fill:${c}" class="g-txt">${esc(t)}</text>`;
  const rect = (x1, p1, x2, p2, c, op = 0.16) =>
    `<rect x="${x1}" y="${Math.min(y(p1), y(p2))}" width="${x2 - x1}" height="${Math.max(1, Math.abs(y(p1) - y(p2)))}" style="fill:${c};fill-opacity:${op};stroke:${c};stroke-opacity:.55;stroke-width:.6"/>`;
  const ligne = (x1, x2, p, c, plein) =>
    `<line x1="${x1}" x2="${x2}" y1="${y(p)}" y2="${y(p)}" style="stroke:${c};stroke-width:1${plein ? '' : ';stroke-dasharray:3 2'}"/>`;
  const prixCote = (i, cote) => cote === 'h' ? b[i].h : cote === 'l' ? b[i].l : (b[i].o + b[i].c) / 2;
  const fr2 = r => String(r).replace('.', ',');
  const fond = [], dessus = [];

  for (const n of d.notes || []) {
    const c = coul(n.couleur);
    if (n.t === 'zone') {
      const k = b[n.i];
      const top = n.mode === 'corps' ? Math.max(k.o, k.c) : k.h, bot = n.mode === 'corps' ? Math.min(k.o, k.c) : k.l;
      fond.push(rect(xg(n.i), top, xd(n.a), bot, c));
      if (n.texte) dessus.push(txt(xd(n.a) - 2, y(top) - 3, n.texte, c, 'end'));
    } else if (n.t === 'fvg') {
      const avant = b[n.i - 1], apres = b[n.i + 1];
      const haussier = apres.l > avant.h;
      const top = haussier ? apres.l : avant.l, bot = haussier ? avant.h : apres.h;
      fond.push(rect(xg(n.i - 1), top, xd(n.a), bot, c, 0.2));
      if (n.ce) dessus.push(ligne(xg(n.i - 1), xd(n.a), (top + bot) / 2, c));
      if (n.texte) dessus.push(txt(xd(n.a) - 2, y(top) - 3, n.texte, c, 'end'));
    } else if (n.t === 'niveau' || n.t === 'ligne') {
      const p = n.t === 'niveau' ? prixCote(n.i, n.cote) + (n.decalage || 0) : n.prix;
      const de = n.t === 'niveau' ? xc(n.i) : xg(n.de);
      dessus.push(ligne(de, xd(n.a), p, c));
      // Ligne à prix fixe : texte dans la marge de droite. Niveau : texte centré sur la ligne,
      // la zone entre le swing et la cassure étant en général vide (dessous: true pour l'écrire sous la ligne).
      if (n.texte && n.t === 'ligne') dessus.push(txt(xd(n.a) + 3, y(p) + 3.5, n.texte, c));
      else if (n.texte) dessus.push(txt((de + xd(n.a)) / 2, n.dessous ? y(p) + 12 : y(p) - 4, n.texte, c, 'middle'));
    } else if (n.t === 'fibo') {
      const montee = b[n.vers].h > b[n.de].h;
      const s = montee ? b[n.de].l : b[n.de].h, e = montee ? b[n.vers].h : b[n.vers].l;
      const prix = r => e + r * (s - e);
      for (const z of n.zones || []) {
        fond.push(rect(xg(n.de), prix(z.de), xd(n.a), prix(z.a), coul(z.couleur), 0.13));
        dessus.push(txt(xg(n.de) + 3, (y(prix(z.de)) + y(prix(z.a))) / 2 + 3.5, z.texte, coul(z.couleur)));
      }
      for (const r of n.niveaux || []) {
        dessus.push(ligne(xg(n.de), xd(n.a), prix(r), COULEURS_GRAPH.neutre, r === 0 || r === 1));
        dessus.push(txt(xd(n.a) + 3, y(prix(r)) + 3.5, fr2(r), COULEURS_GRAPH.neutre));
      }
    } else if (n.t === 'label') {
      const yy = n.cote === 'h' ? y(b[n.i].h) - 12 : y(b[n.i].l) + 12;
      const w = 10 + n.texte.length * 6.2;
      dessus.push(`<rect x="${xc(n.i) - w / 2}" y="${yy - 7.5}" width="${w}" height="15" rx="7.5" style="fill:${c}"/>`);
      dessus.push(`<text x="${xc(n.i)}" y="${yy + 3.5}" text-anchor="middle" class="g-txt" style="fill:#0b0f14;stroke:none">${esc(n.texte)}</text>`);
    } else if (n.t === 'texte') {
      const yy = n.cote === 'h' ? y(b[n.i].h) - 6 : y(b[n.i].l) + 14;
      dessus.push(txt(xc(n.i), yy, n.texte, n.couleur ? c : COULEURS_GRAPH.neutre, 'middle'));
    }
  }

  const bougies = b.map((k, i) => {
    const c = k.c >= k.o ? 'var(--green)' : 'var(--red)';
    const top = Math.max(k.o, k.c), bot = Math.min(k.o, k.c);
    return `<line x1="${xc(i)}" x2="${xc(i)}" y1="${y(k.h)}" y2="${y(k.l)}" style="stroke:${c};stroke-width:1.2"/>` +
      `<rect x="${xc(i) - 3.6}" y="${y(top)}" width="7.2" height="${Math.max(1.2, y(bot) - y(top))}" style="fill:${c}"/>`;
  }).join('');

  return `<figure class="graphique"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(d.legende || 'Graphique en chandeliers')}">` +
    fond.join('') + bougies + dessus.join('') + `</svg>${d.legende ? `<figcaption>${d.legende}</figcaption>` : ''}</figure>`;
}

function sur(selecteur, evt, fn) {
  $vue.querySelectorAll(selecteur).forEach(el => el.addEventListener(evt, fn));
}

/* ---------- Mots du lexique cliquables ---------- */

// Mots trop courants pour être soulignés partout (ils restent dans le lexique).
const MOTS_IGNORES = new Set(['na', 'var', 'input', 'série', 'series', 'long', 'short', 'corps', 'mèche', 'tendance',
  'volume', 'range', 'indicator', 'strategy', 'contrat', 'lot', 'pivot', 'bougie', 'chandelier', 'broker', 'tick', 'marge']);

// "FVG (Fair Value Gap)" donne les alias FVG et Fair Value Gap ; "Swing high / Swing low" donne les deux.
function aliasDe(terme) {
  const m = terme.match(/^(.*?)\s*\((.*)\)\s*$/);
  const base = (m ? m[1] : terme).split('/').map(s => s.trim());
  const parens = m ? m[2].split('/').map(s => s.trim().replace(/^ou /, ''))
    .filter(s => /[A-Z]/.test(s) || !s.includes(' ')) : [];
  return [...base, ...parens].filter(a => a.length >= 2 && !MOTS_IGNORES.has(a.toLowerCase()));
}

const INDEX_TERMES = new Map();   // alias en minuscules -> { alias, i }
LEXIQUE.forEach((m, i) => aliasDe(m.terme).forEach(a => {
  if (!INDEX_TERMES.has(a.toLowerCase())) INDEX_TERMES.set(a.toLowerCase(), { alias: a, i });
}));

const REGEX_TERMES = INDEX_TERMES.size ? new RegExp(
  '(?<![\\p{L}\\p{N}])(' +
  [...INDEX_TERMES.values()].map(v => v.alias).sort((a, b) => b.length - a.length)
    .map(a => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') +
  ')s?(?![\\p{L}\\p{N}])', 'giu') : null;

// Les sigles (au moins 2 majuscules : CE, OB, FVG) doivent respecter la casse, sinon "ce" deviendrait un terme.
function estSigle(a) { return (a.match(/[A-Z]/g) || []).length >= 2; }

// Souligne la première apparition de chaque terme du lexique dans les éléments donnés.
function lierTermes(elements, dejaVus = new Set()) {
  if (!REGEX_TERMES) return;
  for (const racine of elements) {
    if (!racine) continue;
    const walker = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement.closest('code, pre, button, a, .terme, svg') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
    });
    const noeuds = [];
    while (walker.nextNode()) noeuds.push(walker.currentNode);
    for (const noeud of noeuds) {
      const texte = noeud.nodeValue;
      let dernier = 0;
      const frag = document.createDocumentFragment();
      for (const m of texte.matchAll(REGEX_TERMES)) {
        const entree = INDEX_TERMES.get(m[1].toLowerCase());
        if (!entree || dejaVus.has(entree.i)) continue;
        if (estSigle(entree.alias) && m[1] !== entree.alias) continue;
        dejaVus.add(entree.i);
        frag.append(texte.slice(dernier, m.index));
        const span = document.createElement('span');
        span.className = 'terme';
        span.dataset.mot = entree.i;
        span.textContent = m[0];
        frag.append(span);
        dernier = m.index + m[0].length;
      }
      if (dernier === 0) continue;
      frag.append(texte.slice(dernier));
      noeud.replaceWith(frag);
    }
  }
}

function fermerDefinition() {
  document.querySelector('.feuille-fond')?.remove();
}

function ouvrirDefinition(i) {
  const m = LEXIQUE[i];
  fermerDefinition();
  const fond = document.createElement('div');
  fond.className = 'feuille-fond';
  fond.innerHTML = `
    <div class="feuille" role="dialog" aria-label="${esc(m.terme)}">
      <div class="mot-tete"><h3 style="margin:0">${esc(m.terme)}</h3><span class="badge or">${esc(m.cat)}</span></div>
      <p>${esc(m.def)}</p>
      <div class="rangee">
        <button class="btn" id="def-lexique">Ouvrir le lexique</button>
        <button class="btn principal" id="def-ok">Compris</button>
      </div>
    </div>`;
  document.body.appendChild(fond);
  fond.addEventListener('click', e => { if (e.target === fond) fermerDefinition(); });
  fond.querySelector('#def-ok').addEventListener('click', fermerDefinition);
  fond.querySelector('#def-lexique').addEventListener('click', () => {
    fermerDefinition();
    segmentApprendre = 'lexique'; rechercheLexique = m.terme; catLexique = null;
    aller('apprendre');
  });
}

$vue.addEventListener('click', e => {
  const t = e.target.closest('.terme');
  if (t) { e.stopPropagation(); ouvrirDefinition(+t.dataset.mot); }
});

/* ---------- Leçons ---------- */

function leconDuJour() {
  return LECONS.find(l => !etat.lecons[l.id]) || null;
}

function avancementLecons() {
  return LECONS.filter(l => etat.lecons[l.id]).length;
}

/* ---------- Cartes (répétition espacée) ---------- */

function cartesDues(theme) {
  const j = jour();
  return CARTES.filter(c => (!theme || c.theme === theme) && etat.cartes[c.id] && etat.cartes[c.id].due <= j);
}

function nouvellesRestantes() {
  const j = jour();
  if (etat.nouvellesDuJour.jour !== j) etat.nouvellesDuJour = { jour: j, n: 0 };
  return Math.max(0, NOUVELLES_CARTES_PAR_JOUR - etat.nouvellesDuJour.n);
}

function cartesNouvelles(theme) {
  return CARTES.filter(c => (!theme || c.theme === theme) && !etat.cartes[c.id]);
}

function cartesMaitrisees() {
  return Object.values(etat.cartes).filter(s => s.boite >= 3).length;
}

/* ---------- Journal ---------- */

function num(v) {
  if (typeof v === 'number') return v;
  if (v == null || v === '') return NaN;
  const s = String(v).replace(/[\s  ]/g, '').replace(',', '.').replace(/[^\d.\-]/g, '');
  return s === '' ? NaN : parseFloat(s);
}

function statsJournal(trades) {
  const fermes = trades.filter(t => t['Issue']);
  const gains = fermes.filter(t => t['Issue'] === 'Gain').length;
  const pertes = fermes.filter(t => t['Issue'] === 'Perte').length;
  const rr = fermes.map(t => num(t['RR réalisé (R)'])).filter(x => !isNaN(x));
  const pnl = fermes.map(t => num(t['P&L ($)'])).filter(x => !isNaN(x));
  const parSetup = {};
  fermes.forEach(t => {
    const s = (t['Setup'] || '').toString().trim() || 'Non renseigné';
    parSetup[s] = parSetup[s] || { n: 0, g: 0, p: 0, r: 0 };
    parSetup[s].n++;
    if (t['Issue'] === 'Gain') parSetup[s].g++;
    if (t['Issue'] === 'Perte') parSetup[s].p++;
    const r = num(t['RR réalisé (R)']);
    if (!isNaN(r)) parSetup[s].r += r;
  });
  return {
    n: fermes.length, gains, pertes,
    wr: gains + pertes ? gains / (gains + pertes) : null,
    rrMoyen: rr.length ? rr.reduce((a, b) => a + b, 0) / rr.length : null,
    pnl: pnl.reduce((a, b) => a + b, 0),
    parSetup,
    fermes,
  };
}

async function actualiserJournal() {
  const { url, cle } = etat.journal;
  if (!url) throw new Error('Aucune adresse configurée');
  // Corps en text/plain : requête "simple", pas de pré-vérification CORS côté Apps Script.
  const rep = await fetch(url, { method: 'POST', body: JSON.stringify({ cle }) });
  const data = await rep.json();
  if (data.erreur) throw new Error(data.erreur);
  etat.journal.cache = data.trades || [];
  etat.journal.maj = Date.now();
  sauver();
}

/* ---------- Vues ---------- */

const VUES = {};

VUES.accueil = () => {
  const lecon = leconDuJour();
  const dues = cartesDues().length;
  const nouvelles = Math.min(nouvellesRestantes(), cartesNouvelles().length);
  const s = serie();
  const regle = REGLES.length ? REGLES[jour() % REGLES.length] : null;
  // Pas de 37 pour ne pas tomber sur des mots voisins (et de la même catégorie) deux jours de suite.
  const motDuJour = LEXIQUE.length ? LEXIQUE[(jour() * 37) % LEXIQUE.length] : null;
  const hist = etat.quiz.historique;
  const moyQuiz = hist.length ? hist.slice(-10).reduce((a, h) => a + h.score / h.total, 0) / Math.min(10, hist.length) : null;
  const sj = etat.journal.cache ? statsJournal(etat.journal.cache) : null;
  const heure = new Date().getHours();
  const salut = heure < 5 ? 'Bonne nuit' : heure < 18 ? 'Bonjour' : 'Bonsoir';

  rendre('Edge', `
    <p class="muted" style="margin:4px 4px 14px">${salut}. ${s ? `Série en cours : <strong style="color:var(--accent)">${s} jour${s > 1 ? 's' : ''}</strong>.` : 'Une petite session aujourd\'hui ?'}</p>

    ${lecon ? `
    <button class="carte cliquable mise-en-avant" id="go-lecon">
      <p class="surtitre">Leçon du jour · ${esc(lecon.module)}</p>
      <h2>${esc(lecon.titre)}</h2>
      <p class="muted petit" style="margin:0">${esc(lecon.resume)} · ${lecon.duree} min</p>
    </button>` : `
    <div class="carte mise-en-avant"><p class="surtitre">Leçons</p><h2>Programme terminé 🎯</h2><p class="muted petit" style="margin:0">Tu as lu toutes les leçons. Relis-les dans l'onglet Apprendre, ou demande à Jarvis d'en ajouter.</p></div>`}

    <div class="rangee" style="margin-bottom:12px">
      <button class="carte cliquable" id="go-cartes" style="margin:0">
        <p class="surtitre">Cartes</p>
        <h3>${dues + nouvelles ? `${dues + nouvelles} à faire` : 'À jour ✓'}</h3>
        <p class="muted petit" style="margin:0">${dues} révision${dues > 1 ? 's' : ''}, ${nouvelles} nouvelle${nouvelles > 1 ? 's' : ''}</p>
      </button>
      <button class="carte cliquable" id="go-quiz" style="margin:0">
        <p class="surtitre">Quiz</p>
        <h3>${QUESTIONS_PAR_QUIZ} questions</h3>
        <p class="muted petit" style="margin:0">${moyQuiz != null ? `Moyenne récente ${pct(moyQuiz)}` : 'Teste-toi'}</p>
      </button>
    </div>

    ${motDuJour ? `<button class="carte cliquable" id="go-lexique"><p class="surtitre">Mot du jour · ${esc(motDuJour.cat)}</p><h3>${esc(motDuJour.terme)}</h3><p class="muted petit" style="margin:0">${esc(motDuJour.def)}</p></button>` : ''}

    ${regle ? `<div class="carte"><p class="surtitre">Règle du jour</p><p style="margin:0">${esc(regle)}</p></div>` : ''}

    <p class="section-titre">Progression</p>
    <div class="stats">
      <div class="stat"><div class="valeur">${avancementLecons()}<span class="muted petit">/${LECONS.length}</span></div><div class="label">Leçons lues</div></div>
      <div class="stat"><div class="valeur">${cartesMaitrisees()}<span class="muted petit">/${CARTES.length}</span></div><div class="label">Cartes maîtrisées</div></div>
      <div class="stat"><div class="valeur">${sj && sj.wr != null ? pct(sj.wr) : '–'}</div><div class="label">Win rate journal</div></div>
    </div>
    ${sj && sj.wr != null ? `
    <div class="carte">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span class="petit muted">Win rate vers l'objectif de 75%</span><span class="petit">${pct(sj.wr)}</span></div>
      <div class="barre"><div style="width:${Math.min(100, sj.wr / 0.75 * 100)}%"></div></div>
    </div>` : ''}
  `);

  sur('#go-lecon', 'click', () => aller('lecon', { id: lecon.id }));
  sur('#go-cartes', 'click', () => onglet('cartes'));
  sur('#go-lexique', 'click', () => { segmentApprendre = 'lexique'; rechercheLexique = ''; catLexique = null; onglet('apprendre'); });
  sur('#go-quiz', 'click', () => onglet('quiz'));
};

let segmentApprendre = 'lecons';
let themeFiches = null;

VUES.apprendre = () => {
  let corps = '';
  if (segmentApprendre === 'lecons') {
    const modules = themes(LECONS);
    corps = modules.map(m => {
      const ls = LECONS.filter(l => l.module === m);
      const lues = ls.filter(l => etat.lecons[l.id]).length;
      return `
        <p class="section-titre" style="display:flex;justify-content:space-between"><span>${esc(m)}</span><span>${lues}/${ls.length}</span></p>
        ${ls.map(l => `
          <button class="carte cliquable liste-item" data-lecon="${l.id}">
            <span class="coche ${etat.lecons[l.id] ? 'ok' : ''}"></span>
            <span class="grow"><strong style="display:block">${esc(l.titre)}</strong><span class="muted petit">${l.duree} min · ${esc(l.resume)}</span></span>
          </button>`).join('')}`;
    }).join('');
  } else if (segmentApprendre === 'lexique') {
    const cats = [...new Set(LEXIQUE.map(m => m.cat))];
    corps = `
      <input type="search" id="lex-recherche" placeholder="Chercher un mot (FVG, spread…)" value="${esc(rechercheLexique)}" autocomplete="off" autocapitalize="off" style="margin-bottom:12px">
      <div class="chips">
        <button class="chip ${!catLexique ? 'actif' : ''}" data-cat="">Tout (${LEXIQUE.length})</button>
        ${cats.map(c => `<button class="chip ${catLexique === c ? 'actif' : ''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}
      </div>
      <div id="lex-liste"></div>`;
  } else {
    const ts = themes(FICHES);
    const liste = FICHES.filter(f => !themeFiches || f.theme === themeFiches);
    corps = `
      <div class="chips">
        <button class="chip ${!themeFiches ? 'actif' : ''}" data-theme="">Toutes</button>
        ${ts.map(t => `<button class="chip ${themeFiches === t ? 'actif' : ''}" data-theme="${esc(t)}">${esc(t)}</button>`).join('')}
      </div>
      ${liste.map(f => `
        <button class="carte cliquable" data-fiche="${f.id}">
          <span class="badge or">${esc(f.theme)}</span>
          <h3 style="margin-top:8px">${esc(f.titre)}</h3>
        </button>`).join('')}`;
  }

  rendre('Apprendre', `
    <div class="segment">
      <button data-seg="lecons" class="${segmentApprendre === 'lecons' ? 'actif' : ''}">Leçons</button>
      <button data-seg="fiches" class="${segmentApprendre === 'fiches' ? 'actif' : ''}">Fiches</button>
      <button data-seg="lexique" class="${segmentApprendre === 'lexique' ? 'actif' : ''}">Lexique</button>
    </div>
    ${corps}`);

  if (segmentApprendre === 'lexique') {
    afficherLexique();
    // On ne re-rend que la liste pour garder le focus (et le clavier) dans le champ de recherche.
    sur('#lex-recherche', 'input', e => { rechercheLexique = e.target.value; afficherLexique(); });
    sur('[data-cat]', 'click', e => { catLexique = e.currentTarget.dataset.cat || null; VUES.apprendre(); });
  }

  sur('[data-seg]', 'click', e => { segmentApprendre = e.currentTarget.dataset.seg; VUES.apprendre(); });
  sur('[data-theme]', 'click', e => { themeFiches = e.currentTarget.dataset.theme || null; VUES.apprendre(); });
  sur('[data-lecon]', 'click', e => aller('lecon', { id: e.currentTarget.dataset.lecon }));
  sur('[data-fiche]', 'click', e => aller('fiche', { id: e.currentTarget.dataset.fiche }));
};

let rechercheLexique = '';
let catLexique = null;

function sansAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function afficherLexique() {
  const q = sansAccents(rechercheLexique.trim());
  const mots = LEXIQUE
    .filter(m => (!catLexique || m.cat === catLexique) && (!q || sansAccents(m.terme + ' ' + m.def).includes(q)))
    // Les mots dont le terme correspond passent avant ceux qui ne correspondent que par la définition.
    .sort((a, b) => (q ? sansAccents(b.terme).includes(q) - sansAccents(a.terme).includes(q) : 0)
      || a.terme.localeCompare(b.terme, 'fr', { sensitivity: 'base' }));
  let lettre = '';
  const html = mots.map(m => {
    const l = q ? '' : (sansAccents(m.terme)[0].match(/[a-z]/) ? sansAccents(m.terme)[0].toUpperCase() : '#');
    const entete = l && l !== lettre ? `<p class="section-titre">${(lettre = l)}</p>` : '';
    return `${entete}<div class="carte mot"><div class="mot-tete"><strong>${esc(m.terme)}</strong><span class="badge">${esc(m.cat)}</span></div><p>${esc(m.def)}</p></div>`;
  }).join('');
  const liste = document.getElementById('lex-liste');
  if (liste) liste.innerHTML = html || `<div class="vide">Aucun mot trouvé pour "${esc(rechercheLexique)}".<br>Demande à Jarvis de l'ajouter au lexique.</div>`;
}

VUES.lecon = ({ id }) => {
  const i = LECONS.findIndex(l => l.id === id);
  const l = LECONS[i];
  const lue = !!etat.lecons[id];
  const suivante = LECONS[i + 1];
  rendre(l.module, `
    <p class="surtitre">Leçon ${i + 1}/${LECONS.length} · ${l.duree} min</p>
    <h2 style="font-size:24px;line-height:1.2;margin:0 0 16px">${esc(l.titre)}</h2>
    <div class="prose">${l.contenu}</div>
    ${l.retenir && l.retenir.length ? `
    <div class="encadre astuce"><p style="margin-bottom:6px"><strong>À retenir</strong></p><ul>${l.retenir.map(r => `<li>${r}</li>`).join('')}</ul></div>` : ''}
    ${l.exercice ? `<div class="encadre"><p style="margin-bottom:6px"><strong>Exercice sur ton chart</strong></p><p>${l.exercice}</p></div>` : ''}
    <div style="margin-top:20px">
      ${lue
        ? `<button class="btn plein" id="non-lue">Marquer comme non lue</button>`
        : `<button class="btn principal plein" id="lue">J'ai compris, leçon terminée</button>`}
      ${suivante ? `<button class="btn plein" id="suivante" style="margin-top:10px">Leçon suivante : ${esc(suivante.titre)}</button>` : ''}
    </div>`);

  lierTermes($vue.querySelectorAll('.prose, .encadre'));

  sur('#lue', 'click', () => {
    etat.lecons[id] = jour();
    noterActivite();
    toast('Leçon terminée ✓');
    suivante ? aller('lecon', { id: suivante.id }) : retour();
  });
  sur('#non-lue', 'click', () => { delete etat.lecons[id]; sauver(); VUES.lecon({ id }); });
  sur('#suivante', 'click', () => aller('lecon', { id: suivante.id }));
};

VUES.fiche = ({ id }) => {
  const f = FICHES.find(x => x.id === id);
  rendre(f.theme, `
    <span class="badge or">${esc(f.theme)}</span>
    <h2 style="font-size:24px;line-height:1.2;margin:10px 0 16px">${esc(f.titre)}</h2>
    <div class="prose">${f.contenu}</div>`);
  lierTermes($vue.querySelectorAll('.prose'));
};

let themeCartes = null;
let session = null;

VUES.cartes = () => {
  session = null;
  const ts = themes(CARTES);
  const dues = cartesDues(themeCartes).length;
  const nouvelles = Math.min(nouvellesRestantes(), cartesNouvelles(themeCartes).length);
  const total = dues + nouvelles;

  rendre('Cartes', `
    <div class="chips">
      <button class="chip ${!themeCartes ? 'actif' : ''}" data-theme="">Tout</button>
      ${ts.map(t => `<button class="chip ${themeCartes === t ? 'actif' : ''}" data-theme="${esc(t)}">${esc(t)}</button>`).join('')}
    </div>
    <div class="carte mise-en-avant">
      <p class="surtitre">Session du jour</p>
      <h2>${total ? `${total} carte${total > 1 ? 's' : ''}` : 'Rien à réviser ✓'}</h2>
      <p class="muted petit">${dues} révision${dues > 1 ? 's' : ''} prévue${dues > 1 ? 's' : ''} et ${nouvelles} nouvelle${nouvelles > 1 ? 's' : ''}. L'appli te repose plus souvent les cartes que tu rates.</p>
      <button class="btn principal plein" id="demarrer" ${total ? '' : 'disabled'}>Commencer</button>
    </div>
    <p class="section-titre">Par thème</p>
    ${ts.map(t => {
      const cs = CARTES.filter(c => c.theme === t);
      const m = cs.filter(c => etat.cartes[c.id] && etat.cartes[c.id].boite >= 3).length;
      const vues = cs.filter(c => etat.cartes[c.id]).length;
      return `<div class="carte">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><strong>${esc(t)}</strong><span class="muted petit">${vues}/${cs.length} vues · ${m} maîtrisées</span></div>
        <div class="barre"><div style="width:${cs.length ? m / cs.length * 100 : 0}%"></div></div>
      </div>`;
    }).join('')}
    <p class="muted petit" style="margin:8px 4px">Une carte est "maîtrisée" quand tu l'as réussie au moins 3 fois d'affilée à intervalles croissants.</p>`);

  sur('[data-theme]', 'click', e => { themeCartes = e.currentTarget.dataset.theme || null; VUES.cartes(); });
  sur('#demarrer', 'click', () => {
    const file = melanger(cartesDues(themeCartes)).concat(melanger(cartesNouvelles(themeCartes)).slice(0, nouvellesRestantes()));
    session = { file, i: 0, ratees: new Set(), faites: 0, reussies: 0 };
    aller('carte');
  });
};

VUES.carte = () => {
  if (!session || session.i >= session.file.length) return VUES.finCartes();
  const c = session.file[session.i];
  const restantes = session.file.length - session.i;
  rendre('Cartes', `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <span class="badge or">${esc(c.theme)}</span><span class="muted petit">${restantes} restante${restantes > 1 ? 's' : ''}</span>
    </div>
    <div class="carte flash" id="flash">
      <div class="question">${c.q}</div>
      <div class="reponse" id="rep" hidden>${c.r}</div>
    </div>
    <div id="actions">
      <button class="btn principal plein" id="voir">Voir la réponse</button>
    </div>`);
  lierTermes([document.getElementById('flash')]);

  sur('#voir', 'click', () => {
    document.getElementById('rep').hidden = false;
    document.getElementById('actions').innerHTML = `
      <div class="rangee">
        <button class="btn rate" id="rate">Je ne savais pas</button>
        <button class="btn bien" id="su">Je savais</button>
      </div>`;
    sur('#rate', 'click', () => repondreCarte(c, false));
    sur('#su', 'click', () => repondreCarte(c, true));
  });
};

function repondreCarte(c, ok) {
  const j = jour();
  const nouvelle = !etat.cartes[c.id];
  if (nouvelle) etat.nouvellesDuJour.n++;
  const s = etat.cartes[c.id] || { boite: 0, due: j };
  if (ok) {
    if (session.ratees.has(c.id)) s.boite = 0;
    s.due = j + INTERVALLES[s.boite];
    s.boite = Math.min(s.boite + 1, INTERVALLES.length - 1);
    session.reussies++;
  } else {
    s.boite = 0;
    s.due = j;
    session.ratees.add(c.id);
    session.file.push(c);              // on la revoit en fin de session
  }
  etat.cartes[c.id] = s;
  session.faites++;
  session.i++;
  noterActivite();
  VUES.carte();
}

VUES.finCartes = () => {
  const s = session || { faites: 0, ratees: new Set() };
  rendre('Cartes', `
    <div class="carte mise-en-avant" style="text-align:center;padding:30px 16px">
      <p class="surtitre">Session terminée</p>
      <h2 style="font-size:28px">${s.faites} réponse${s.faites > 1 ? 's' : ''}</h2>
      <p class="muted">${s.ratees.size ? `${s.ratees.size} carte${s.ratees.size > 1 ? 's' : ''} à retravailler, elles reviendront demain.` : 'Aucune erreur, propre.'}</p>
      <button class="btn principal plein" id="fin">Retour</button>
    </div>`);
  sur('#fin', 'click', () => onglet('cartes'));
};

let themeQuiz = null;
let tailleQuiz = QUESTIONS_PAR_QUIZ;
let partie = null;

let segmentQuiz = 'quiz';

function segmentQuizHtml() {
  return `<div class="segment">
      <button data-segq="quiz" class="${segmentQuiz === 'quiz' ? 'actif' : ''}">Quiz</button>
      <button data-segq="guidee" class="${segmentQuiz === 'guidee' ? 'actif' : ''}">Analyse guidée</button>
    </div>`;
}

VUES.quiz = () => {
  partie = null;
  if (segmentQuiz === 'guidee') return VUES.guideeListe();
  const ts = themes(QUIZ);
  const nbErreurs = Object.keys(etat.quiz.erreurs).length;
  const hist = etat.quiz.historique.slice(-5).reverse();
  rendre('Quiz', `
    ${segmentQuizHtml()}
    <div class="chips">
      <button class="chip ${!themeQuiz ? 'actif' : ''}" data-theme="">Tout</button>
      ${nbErreurs ? `<button class="chip ${themeQuiz === '__erreurs' ? 'actif' : ''}" data-theme="__erreurs">Mes erreurs (${nbErreurs})</button>` : ''}
      ${ts.map(t => `<button class="chip ${themeQuiz === t ? 'actif' : ''}" data-theme="${esc(t)}">${esc(t)}</button>`).join('')}
    </div>
    <div class="carte mise-en-avant">
      <p class="surtitre">${themeQuiz === '__erreurs' ? 'Revoir mes erreurs' : esc(themeQuiz || 'Tous les thèmes')} · ${poolQuiz().length} en stock</p>
      <h2>${Math.min(tailleQuiz, poolQuiz().length)} questions</h2>
      <div class="segment" style="margin:10px 0">
        ${[10, 20, 40].map(n => `<button data-taille="${n}" class="${tailleQuiz === n ? 'actif' : ''}">${n}</button>`).join('')}
      </div>
      <p class="muted petit">QCM et mises en situation. Chaque réponse est expliquée. Les questions ratées vont dans "Mes erreurs".</p>
      <button class="btn principal plein" id="lancer" ${poolQuiz().length ? '' : 'disabled'}>Lancer le quiz</button>
    </div>
    ${hist.length ? `<p class="section-titre">Derniers résultats</p>
    ${hist.map(h => `<div class="carte liste-item" style="padding:12px 16px">
      <span class="grow">${esc(h.theme)}<br><span class="muted petit">${new Date(h.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></span>
      <span class="badge ${h.score / h.total >= .8 ? 'vert' : h.score / h.total >= .5 ? 'or' : 'rouge'}">${h.score}/${h.total}</span>
    </div>`).join('')}` : ''}`);

  sur('[data-segq]', 'click', e => { segmentQuiz = e.currentTarget.dataset.segq; VUES.quiz(); });
  sur('[data-theme]', 'click', e => { themeQuiz = e.currentTarget.dataset.theme || null; VUES.quiz(); });
  sur('[data-taille]', 'click', e => { tailleQuiz = +e.currentTarget.dataset.taille; VUES.quiz(); });
  sur('#lancer', 'click', () => {
    const qs = melanger(poolQuiz()).slice(0, tailleQuiz).map(q => {
      const ordre = ordreChoix(q);
      return { ...q, ordre };
    });
    partie = { qs, i: 0, score: 0, repondu: false };
    aller('question');
  });
};

// Les réponses qui renvoient à des repères du graphique (A, B, C...) restent dans l'ordre alphabétique.
function ordreChoix(q) {
  const lettre = k => (q.choix[k].match(/^([A-D])(,|$)/) || [])[1];
  const indices = q.choix.map((_, k) => k);
  if (indices.filter(lettre).length < 2) return melanger(indices);
  return [...indices.filter(lettre).sort((x, y) => lettre(x).localeCompare(lettre(y))), ...indices.filter(k => !lettre(k))];
}

function poolQuiz() {
  if (themeQuiz === '__erreurs') return QUIZ.filter(q => etat.quiz.erreurs[q.id]);
  return QUIZ.filter(q => !themeQuiz || q.theme === themeQuiz);
}

VUES.question = () => {
  if (!partie || partie.i >= partie.qs.length) return VUES.finQuiz();
  const q = partie.qs[partie.i];
  rendre('Quiz', `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span class="badge or">${esc(q.theme)}</span><span class="muted petit">${partie.i + 1}/${partie.qs.length} · score ${partie.score}</span>
    </div>
    <div class="barre" style="margin-bottom:16px"><div style="width:${partie.i / partie.qs.length * 100}%"></div></div>
    ${q.graph ? `<div class="graph" data-g="${esc(q.graph)}"></div>` : ''}
    <h2 style="font-size:19px;line-height:1.4;margin:0 0 16px">${q.q}</h2>
    ${q.ordre.map(k => `<button class="choix" data-k="${k}">${q.choix[k]}</button>`).join('')}
    <div id="expl"></div>`);
  const termesVus = new Set();
  lierTermes([$vue.querySelector('h2')], termesVus);

  sur('.choix', 'click', e => {
    const k = +e.currentTarget.dataset.k;
    const bon = k === q.bonne;
    $vue.querySelectorAll('.choix').forEach(b => {
      b.disabled = true;
      if (+b.dataset.k === q.bonne) b.classList.add('bon');
    });
    if (!bon) e.currentTarget.classList.add('faux');
    if (bon) { partie.score++; delete etat.quiz.erreurs[q.id]; } else etat.quiz.erreurs[q.id] = 1;
    sauver();
    const dernier = partie.i + 1 >= partie.qs.length;
    document.getElementById('expl').innerHTML = `
      <div class="encadre ${bon ? 'astuce' : 'attention'}"><p><strong>${bon ? 'Exact.' : 'Pas tout à fait.'}</strong> ${q.expl}</p></div>
      <button class="btn principal plein" id="suite">${dernier ? 'Voir le résultat' : 'Question suivante'}</button>`;
    lierTermes([document.querySelector('#expl .encadre')], termesVus);
    document.getElementById('suite').scrollIntoView({ behavior: 'smooth', block: 'end' });
    sur('#suite', 'click', () => { partie.i++; VUES.question(); });
  });
};

/* ---------- Analyse guidée ---------- */

const SCENARIOS = window.SCENARIOS || [];
let partieG = null;

VUES.guideeListe = () => {
  partieG = null;
  rendre('Quiz', `
    ${segmentQuizHtml()}
    <p class="muted petit" style="margin:0 4px 14px">Un graphique se dévoile bougie par bougie, comme en replay. À chaque étape, tu prends une décision : biais, zone, entrée, stop, cible.</p>
    ${SCENARIOS.map(s => {
      const best = etat.guidee[s.id];
      return `<button class="carte cliquable" data-scenario="${s.id}">
        <div class="mot-tete"><span class="surtitre" style="margin:0">${esc(s.niveau)} · ${s.etapes.length} étapes</span>
          ${best != null ? `<span class="badge ${best === s.etapes.length ? 'vert' : 'or'}">${best}/${s.etapes.length}</span>` : '<span class="badge">Nouveau</span>'}</div>
        <h3 style="margin-top:6px">${esc(s.titre)}</h3>
        <p class="muted petit" style="margin:0">${esc(s.resume)}</p>
      </button>`;
    }).join('')}`);
  sur('[data-segq]', 'click', e => { segmentQuiz = e.currentTarget.dataset.segq; VUES.quiz(); });
  sur('[data-scenario]', 'click', e => {
    partieG = { s: SCENARIOS.find(x => x.id === e.currentTarget.dataset.scenario), i: 0, score: 0 };
    aller('guidee');
  });
};

VUES.guidee = () => {
  if (!partieG) return VUES.guideeListe();
  const { s, i } = partieG;
  if (i >= s.etapes.length) return VUES.guideeFin();
  const e = s.etapes[i];
  const ordre = ordreChoix(e);
  rendre(s.titre, `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span class="badge or">Étape ${i + 1}/${s.etapes.length}</span><span class="muted petit">score ${partieG.score}</span>
    </div>
    <div class="barre" style="margin-bottom:14px"><div style="width:${i / s.etapes.length * 100}%"></div></div>
    ${i === 0 ? `<div class="encadre" id="contexte"><p>${esc(s.contexte)}</p></div>` : ''}
    ${svgGraphique({ base: s.graph, coupe: e.coupe, notes: e.notes || [] })}
    <h2 style="font-size:19px;line-height:1.4;margin:0 0 16px">${e.q}</h2>
    ${ordre.map(k => `<button class="choix" data-k="${k}">${e.choix[k]}</button>`).join('')}
    <div id="expl"></div>`);
  window.scrollTo(0, 0);
  const vus = new Set();
  lierTermes([$vue.querySelector('#contexte'), $vue.querySelector('h2')], vus);

  sur('.choix', 'click', ev => {
    const k = +ev.currentTarget.dataset.k;
    const bon = k === e.bonne;
    $vue.querySelectorAll('.choix').forEach(b => {
      b.disabled = true;
      if (+b.dataset.k === e.bonne) b.classList.add('bon');
    });
    if (!bon) ev.currentTarget.classList.add('faux');
    if (bon) partieG.score++;
    const dernier = i + 1 >= s.etapes.length;
    document.getElementById('expl').innerHTML = `
      <div class="encadre ${bon ? 'astuce' : 'attention'}"><p><strong>${bon ? 'Bien vu.' : 'Pas tout à fait.'}</strong> ${e.expl}</p></div>
      <button class="btn principal plein" id="suite">${dernier ? 'Voir la fin du graphique' : 'Bougies suivantes ▸'}</button>`;
    lierTermes([document.querySelector('#expl .encadre')], vus);
    document.getElementById('suite').scrollIntoView({ behavior: 'smooth', block: 'end' });
    sur('#suite', 'click', () => { partieG.i++; VUES.guidee(); });
  });
};

VUES.guideeFin = () => {
  const { s, score } = partieG;
  const n = s.etapes.length;
  etat.guidee[s.id] = Math.max(etat.guidee[s.id] ?? 0, score);
  noterActivite();
  const f = s.final || {};
  const badge = { gain: ['vert', 'Trade gagnant'], perte: ['rouge', 'Trade perdant'], neutre: ['', 'Lecture de structure'] }[f.resultat || 'neutre'];
  rendre(s.titre, `
    <span class="badge ${badge[0]}">${badge[1]}</span>
    ${svgGraphique({ base: s.graph, notes: f.notes || (window.GRAPHIQUES[s.graph].notes || []) })}
    <div class="encadre"><p>${esc(f.texte || '')}</p></div>
    <div class="carte mise-en-avant" style="text-align:center">
      <p class="surtitre">Tes décisions</p>
      <h2 style="font-size:34px;margin:4px 0">${score}/${n}</h2>
      <p class="muted petit">${score === n ? 'Lecture parfaite.' : score >= n - 1 ? 'Très bonne lecture, une seule erreur.' : 'Rejoue le scénario : chaque étape a son explication.'}</p>
      <div class="rangee" style="margin-top:12px">
        <button class="btn" id="liste">Scénarios</button>
        <button class="btn principal" id="rejouer">Rejouer</button>
      </div>
    </div>`);
  window.scrollTo(0, 0);
  lierTermes([$vue.querySelector('.encadre')]);
  sur('#liste', 'click', () => { segmentQuiz = 'guidee'; onglet('quiz'); });
  sur('#rejouer', 'click', () => { partieG = { s, i: 0, score: 0 }; VUES.guidee(); });
};

VUES.finQuiz = () => {
  const total = partie.qs.length;
  const ratio = partie.score / total;
  etat.quiz.historique.push({ date: Date.now(), theme: themeQuiz === '__erreurs' ? 'Mes erreurs' : (themeQuiz || 'Tous les thèmes'), score: partie.score, total });
  etat.quiz.historique = etat.quiz.historique.slice(-100);
  noterActivite();
  rendre('Quiz', `
    <div class="carte mise-en-avant" style="text-align:center;padding:30px 16px">
      <p class="surtitre">Résultat</p>
      <h2 style="font-size:40px;margin:6px 0">${partie.score}/${total}</h2>
      <p class="muted">${ratio >= .9 ? 'Excellent. Tu maîtrises.' : ratio >= .7 ? 'Solide, quelques points à revoir.' : ratio >= .5 ? 'Correct, mais repasse sur les fiches concernées.' : 'À retravailler. Relis les leçons du thème puis refais le quiz.'}</p>
      <div class="rangee" style="margin-top:12px">
        <button class="btn" id="menu">Menu</button>
        <button class="btn principal" id="rejouer">Rejouer</button>
      </div>
    </div>`);
  partie = null;
  sur('#menu', 'click', () => onglet('quiz'));
  sur('#rejouer', 'click', () => { onglet('quiz'); $vue.querySelector('#lancer').click(); });
};

VUES.journal = () => {
  const { url, cache, maj } = etat.journal;
  if (!url) {
    rendre('Journal', `
      <div class="vide">
        <p style="font-size:40px;margin:0">📈</p>
        <h2 style="color:var(--text)">Relie ton journal de trading</h2>
        <p>L'onglet Journal affiche ton win rate, ton RR et tes derniers trades à partir de ton Google Sheet. Il faut d'abord installer le petit script Google (voir le README), puis coller son adresse ici.</p>
        <button class="btn principal" id="config">Configurer</button>
      </div>`);
    sur('#config', 'click', () => aller('reglages'));
    return;
  }

  const s = cache ? statsJournal(cache) : null;
  const setups = s ? Object.entries(s.parSetup).sort((a, b) => b[1].n - a[1].n) : [];
  rendre('Journal', `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <span class="muted petit">${maj ? 'Mis à jour ' + new Date(maj).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Jamais synchronisé'}</span>
      <button class="btn" id="actualiser" style="min-height:38px">Actualiser</button>
    </div>
    ${!s ? '<div class="vide">Appuie sur Actualiser pour charger tes trades.</div>' : `
    <div class="stats">
      <div class="stat"><div class="valeur">${s.n}</div><div class="label">Trades</div></div>
      <div class="stat"><div class="valeur ${s.wr != null && s.wr >= .75 ? 'vert' : ''}">${s.wr != null ? pct(s.wr) : '–'}</div><div class="label">Win rate (hors BE)</div></div>
      <div class="stat"><div class="valeur ${s.rrMoyen > 0 ? 'vert' : s.rrMoyen < 0 ? 'rouge' : ''}">${s.rrMoyen != null ? fr(s.rrMoyen) + 'R' : '–'}</div><div class="label">Espérance / trade</div></div>
    </div>
    <div class="carte">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span class="petit muted">Objectif win rate 75%</span><span class="petit">${s.wr != null ? pct(s.wr) : '–'}</span></div>
      <div class="barre"><div style="width:${s.wr != null ? Math.min(100, s.wr / .75 * 100) : 0}%"></div></div>
      <p class="petit muted" style="margin:10px 0 0">P&L cumulé : <strong class="${s.pnl >= 0 ? 'vert' : 'rouge'}">${s.pnl >= 0 ? '+' : ''}${fr(s.pnl)} $</strong> · ${s.gains} gain${s.gains > 1 ? "s" : ""}, ${s.pertes} perte${s.pertes > 1 ? "s" : ""}</p>
    </div>
    ${s.n < 30 ? `<div class="encadre"><p>Avec ${s.n} trade${s.n > 1 ? 's' : ''}, les stats ne veulent encore rien dire. Il faut au moins 30 à 50 trades sur le même setup pour juger un edge.</p></div>` : ''}
    <p class="section-titre">Par setup</p>
    <div class="carte">
      ${setups.map(([nom, v]) => `<div class="trade">
        <span><strong>${esc(nom)}</strong><br><span class="muted petit">${v.n} trade${v.n > 1 ? 's' : ''} · ${v.g + v.p ? pct(v.g / (v.g + v.p)) : '–'} WR</span></span>
        <span class="pnl ${v.r >= 0 ? 'vert' : 'rouge'}">${v.r >= 0 ? '+' : ''}${fr(v.r)}R</span>
      </div>`).join('')}
    </div>
    <p class="section-titre">Derniers trades</p>
    <div class="carte">
      ${s.fermes.slice(-20).reverse().map(t => {
        const r = num(t['RR réalisé (R)']);
        const cls = t['Issue'] === 'Gain' ? 'vert' : t['Issue'] === 'Perte' ? 'rouge' : '';
        return `<div class="trade">
          <span><strong>${esc(t['Actif'])}</strong> <span class="badge">${esc(t['Sens'])}</span><br><span class="muted petit">${esc(t['Sortie'] || t['Entrée'])}${t['Setup'] ? ' · ' + esc(t['Setup']) : ''}</span></span>
          <span class="pnl ${cls}">${isNaN(r) ? '–' : (r >= 0 ? '+' : '') + fr(r) + 'R'}<br><span class="petit muted">${esc(t['Issue'])}</span></span>
        </div>`;
      }).join('')}
    </div>`}`);

  sur('#actualiser', 'click', async e => {
    const b = e.currentTarget;
    b.disabled = true; b.textContent = 'Chargement…';
    try { await actualiserJournal(); VUES.journal(); toast('Journal à jour'); }
    catch (err) { b.disabled = false; b.textContent = 'Actualiser'; toast('Erreur : ' + err.message); }
  });
};

VUES.reglages = () => {
  rendre('Réglages', `
    <p class="section-titre">Journal de trading (Google Sheet)</p>
    <div class="carte">
      <label class="champ"><span>Adresse du script Google (se termine par /exec)</span>
        <input type="url" id="url" value="${esc(etat.journal.url)}" placeholder="https://script.google.com/macros/s/…/exec" autocomplete="off" autocapitalize="off"></label>
      <label class="champ"><span>Clé secrète (celle que tu as mise dans le script)</span>
        <input type="password" id="cle" value="${esc(etat.journal.cle)}" autocomplete="off" autocapitalize="off"></label>
      <div class="rangee">
        <button class="btn" id="tester">Tester</button>
        <button class="btn principal" id="enregistrer">Enregistrer</button>
      </div>
      <p class="muted petit" style="margin:10px 0 0">Ces infos restent uniquement sur ce téléphone.</p>
    </div>

    <p class="section-titre">Sauvegarde de ta progression</p>
    <div class="carte">
      <p class="muted petit" style="margin-top:0">Ta progression est stockée sur cet appareil. Exporte-la de temps en temps pour ne rien perdre.</p>
      <div class="rangee">
        <button class="btn" id="exporter">Exporter</button>
        <button class="btn" id="importer">Importer</button>
      </div>
      <input type="file" id="fichier" accept="application/json,.json" hidden>
    </div>

    <p class="section-titre">Zone sensible</p>
    <div class="carte">
      <button class="btn plein" id="reset" style="color:var(--red)">Remettre la progression à zéro</button>
    </div>
    <p class="muted petit" style="text-align:center">Edge v${VERSION} · ${LECONS.length} leçons · ${FICHES.length} fiches · ${CARTES.length} cartes · ${QUIZ.length} questions</p>`);

  const lire = () => {
    etat.journal.url = document.getElementById('url').value.trim();
    etat.journal.cle = document.getElementById('cle').value.trim();
  };
  sur('#enregistrer', 'click', () => { lire(); sauver(); toast('Enregistré'); });
  sur('#tester', 'click', async () => {
    lire(); sauver();
    try { await actualiserJournal(); toast(`Connexion OK, ${etat.journal.cache.length} lignes lues`); }
    catch (err) { toast('Échec : ' + err.message); }
  });
  sur('#exporter', 'click', () => {
    const copie = { ...etat, journal: { ...etat.journal, cle: '', cache: null } };
    const blob = new Blob([JSON.stringify(copie)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `edge-progression-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  sur('#importer', 'click', () => document.getElementById('fichier').click());
  sur('#fichier', 'change', async e => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      const journal = etat.journal;
      etat = Object.assign(etatParDefaut(), data, { journal });
      sauver();
      toast('Progression importée');
    } catch (err) { toast('Fichier invalide'); }
  });
  sur('#reset', 'click', () => {
    if (!confirm('Effacer toute ta progression (leçons, cartes, quiz) ? Les réglages du journal sont conservés.')) return;
    const journal = etat.journal;
    etat = Object.assign(etatParDefaut(), { journal });
    sauver();
    toast('Progression remise à zéro');
  });
};

/* ---------- Démarrage ---------- */

onglet('accueil');

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
