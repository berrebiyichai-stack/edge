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

function themes(liste) {
  return [...new Set(liste.map(x => x.theme || x.module))];
}

/* ---------- Navigation ---------- */

let pile = [];

function aller(vue, params = {}, empiler = true) {
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
}

function sur(selecteur, evt, fn) {
  $vue.querySelectorAll(selecteur).forEach(el => el.addEventListener(evt, fn));
}

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
    </div>
    ${corps}`);

  sur('[data-seg]', 'click', e => { segmentApprendre = e.currentTarget.dataset.seg; VUES.apprendre(); });
  sur('[data-theme]', 'click', e => { themeFiches = e.currentTarget.dataset.theme || null; VUES.apprendre(); });
  sur('[data-lecon]', 'click', e => aller('lecon', { id: e.currentTarget.dataset.lecon }));
  sur('[data-fiche]', 'click', e => aller('fiche', { id: e.currentTarget.dataset.fiche }));
};

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
let partie = null;

VUES.quiz = () => {
  partie = null;
  const ts = themes(QUIZ);
  const nbErreurs = Object.keys(etat.quiz.erreurs).length;
  const hist = etat.quiz.historique.slice(-5).reverse();
  rendre('Quiz', `
    <div class="chips">
      <button class="chip ${!themeQuiz ? 'actif' : ''}" data-theme="">Tout</button>
      ${nbErreurs ? `<button class="chip ${themeQuiz === '__erreurs' ? 'actif' : ''}" data-theme="__erreurs">Mes erreurs (${nbErreurs})</button>` : ''}
      ${ts.map(t => `<button class="chip ${themeQuiz === t ? 'actif' : ''}" data-theme="${esc(t)}">${esc(t)}</button>`).join('')}
    </div>
    <div class="carte mise-en-avant">
      <p class="surtitre">${themeQuiz === '__erreurs' ? 'Revoir mes erreurs' : esc(themeQuiz || 'Tous les thèmes')}</p>
      <h2>${Math.min(QUESTIONS_PAR_QUIZ, poolQuiz().length)} questions</h2>
      <p class="muted petit">QCM et mises en situation. Chaque réponse est expliquée. Les questions ratées vont dans "Mes erreurs".</p>
      <button class="btn principal plein" id="lancer" ${poolQuiz().length ? '' : 'disabled'}>Lancer le quiz</button>
    </div>
    ${hist.length ? `<p class="section-titre">Derniers résultats</p>
    ${hist.map(h => `<div class="carte liste-item" style="padding:12px 16px">
      <span class="grow">${esc(h.theme)}<br><span class="muted petit">${new Date(h.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></span>
      <span class="badge ${h.score / h.total >= .8 ? 'vert' : h.score / h.total >= .5 ? 'or' : 'rouge'}">${h.score}/${h.total}</span>
    </div>`).join('')}` : ''}`);

  sur('[data-theme]', 'click', e => { themeQuiz = e.currentTarget.dataset.theme || null; VUES.quiz(); });
  sur('#lancer', 'click', () => {
    const qs = melanger(poolQuiz()).slice(0, QUESTIONS_PAR_QUIZ).map(q => {
      const ordre = melanger(q.choix.map((_, k) => k));
      return { ...q, ordre };
    });
    partie = { qs, i: 0, score: 0, repondu: false };
    aller('question');
  });
};

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
    <h2 style="font-size:19px;line-height:1.4;margin:0 0 16px">${q.q}</h2>
    ${q.ordre.map(k => `<button class="choix" data-k="${k}">${q.choix[k]}</button>`).join('')}
    <div id="expl"></div>`);

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
    document.getElementById('suite').scrollIntoView({ behavior: 'smooth', block: 'end' });
    sur('#suite', 'click', () => { partie.i++; VUES.question(); });
  });
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
