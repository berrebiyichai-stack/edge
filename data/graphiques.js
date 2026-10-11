/* Graphiques en chandeliers dessinés par l'appli (prix fictifs, pédagogiques).

   Chaque graphique :
     debut : prix d'ouverture de la première bougie
     p     : une entrée par bougie. Un nombre = la clôture (l'ouverture est la clôture précédente, mèches automatiques).
             [clôture, mèche haute, mèche basse] pour régler les mèches. [o, h, l, c] pour une bougie entièrement manuelle.
     base  : réutiliser les bougies d'un autre graphique (pour le quiz)
     notes : annotations, dessinées dans l'ordre
       { t: 'zone',   i, a, mode: 'corps'|'complet', couleur, texte }   zone d'une bougie i prolongée jusqu'à a
       { t: 'fvg',    i, a, couleur, texte, ce }                        FVG dont la bougie du milieu est i
       { t: 'niveau', i, cote: 'h'|'l'|'m', a, couleur, texte }         ligne au plus haut / plus bas / milieu du corps de i
       { t: 'ligne',  prix, de, a, couleur, texte }                     ligne à un prix fixe
       { t: 'fibo',   de, vers, niveaux, zones, a }                     retracement entre le swing de 'de' et celui de 'vers'
       { t: 'label',  i, cote: 'h'|'l', texte, couleur }                pastille (A, B, C) au-dessus ou en dessous de i
       { t: 'texte',  i, cote: 'h'|'l', texte, couleur }                petit texte au-dessus ou en dessous de i
     couleur : 'vert' | 'rouge' | 'or' | 'bleu' | 'neutre'
*/

// Mèches pseudo-aléatoires mais fixes, pour éviter des plus hauts parfaitement égaux partout.
window.genererBougies = function (def) {
  const m = def.meche ?? 0.3;
  let prec = def.debut;
  return def.p.map((x, i) => {
    const mh = m * (0.55 + 0.45 * ((i * 7) % 5) / 4);
    const mb = m * (0.55 + 0.45 * ((i * 3 + 2) % 5) / 4);
    let o, h, l, c;
    if (Array.isArray(x) && x.length === 4) [o, h, l, c] = x;
    else {
      c = Array.isArray(x) ? x[0] : x;
      o = prec;
      h = Math.max(o, c) + (Array.isArray(x) && x[1] != null ? x[1] : mh);
      l = Math.min(o, c) - (Array.isArray(x) && x[2] != null ? x[2] : mb);
    }
    prec = c;
    return { o, h, l, c };
  });
};

window.GRAPHIQUES = {
  /* ---------- Graphiques des leçons ---------- */
  structure: {
    debut: 100,
    p: [101, 102.5, 104, 103, 101.8, 102.6, 104.5, 106, 107.5, 106.6, 105.2, 104.2, 105.5, 107.2, 109, 110.2,
        109.4, 108, 107.1, [108.3, null, 0.1], 109.8, 111.2, 112.4, 111.6, 110, 108.5, 106.5, 105.8],
    notes: [
      { t: 'niveau', i: 8, cote: 'h', a: 14, couleur: 'vert', texte: 'BOS' },
      { t: 'niveau', i: 18, cote: 'l', a: 26, couleur: 'rouge', texte: 'CHoCH' },
      { t: 'texte', i: 8, cote: 'h', texte: 'HH' },
      { t: 'texte', i: 11, cote: 'l', texte: 'HL' },
      { t: 'texte', i: 22, cote: 'h', texte: 'HH' },
      { t: 'texte', i: 18, cote: 'l', texte: 'HL' },
    ],
    legende: 'Tendance haussière (HH / HL). La clôture au-dessus du sommet donne un BOS. Plus tard, la clôture sous le dernier HL donne un CHoCH.',
  },

  liquidite: {
    debut: 110,
    p: [109.2, 108, 107, 106.2, [107.2, null, 0.1], 108.3, 107.6, 106.9, 106.2, [107, null, 0.1], 108, 108.6, 107.8, 106.6,
        [106.6, 107.0, 105.2, 106.9], 108.6, 110, 111, 110.4, 111.8],
    notes: [
      { t: 'niveau', i: 3, cote: 'l', a: 14, couleur: 'rouge', texte: 'Equal lows (SSL)' },
      { t: 'label', i: 14, cote: 'l', texte: 'Sweep', couleur: 'or' },
    ],
    legende: 'Deux creux au même niveau concentrent les stops. Le prix passe dessous, déclenche les stops, puis repart fortement à la hausse.',
  },

  fvg: {
    debut: 100,
    p: [100.4, 99.8, 100.3, 100.0, 100.6, [103.2, 0.3, 0.1], 104.0, [104.6, 0.3, 0.7], 105.2, 104.6, 103.6, 102.4,
        [102.3, 0.2, 0.45], 103.5, 105, 106.2, 107],
    notes: [
      { t: 'fvg', i: 5, a: 16, couleur: 'vert', texte: 'FVG', ce: true },
      { t: 'texte', i: 12, cote: 'l', texte: 'Retour au CE' },
    ],
    legende: 'La grosse bougie haussière laisse un gap entre la mèche de la bougie d\'avant et celle d\'après. Le prix revient au milieu du FVG (CE), puis repart.',
  },

  ob: {
    debut: 100,
    p: [101, 102.2, 103, 102.4, 101.6, 101.0, [100.4, 0.2, 0.3], 102.6, 104.4, 105.2, 104.8, 103.6, 102.2, 101.3,
        [101.9, 0.3, 0.2], 103.2, 104.8, 106, 107],
    notes: [
      { t: 'zone', i: 6, a: 18, mode: 'complet', couleur: 'vert', texte: 'OB' },
      { t: 'niveau', i: 2, cote: 'h', a: 8, couleur: 'vert', texte: 'BOS' },
      { t: 'fvg', i: 7, a: 9, couleur: 'bleu' },
    ],
    legende: 'L\'OB haussier est la dernière bougie baissière avant le displacement qui casse le sommet (BOS) en laissant un FVG. Le prix revient dans l\'OB avant de repartir.',
  },

  premium: {
    debut: 100,
    p: [99.2, 98.6, [99.8, null, 0.1], 101.2, 102.6, 103.4, 104.6, 105.8, 106.6, [106, 0.1, null], 105.2, 104.4, 103.6, 102.9, 102.2,
        [102.0, 0.2, 0.3], 103.2, 104.5, 105.6],
    notes: [
      { t: 'fibo', de: 1, vers: 8, a: 18, niveaux: [0, 0.5, 1],
        zones: [{ de: 0, a: 0.5, couleur: 'rouge', texte: 'Premium' }, { de: 0.5, a: 1, couleur: 'vert', texte: 'Discount' }] },
    ],
    legende: 'Du creux au sommet du dernier swing : au-dessus de 50% c\'est le premium (on cherche à vendre), en dessous le discount (on cherche à acheter).',
  },

  ote: {
    debut: 100,
    p: [99.2, 98.8, [100, null, 0.1], 101.5, 103, 104.4, 105.6, 106.6, 107, [106.2, 0.1, null], 105, 103.8, 102.6, [101.6, 0.2, 0.35],
        102.8, 104.5, 106, 107.5],
    notes: [
      { t: 'fibo', de: 1, vers: 8, a: 17, niveaux: [0, 0.5, 0.62, 0.705, 0.79, 1],
        zones: [{ de: 0.62, a: 0.79, couleur: 'or', texte: 'OTE' }] },
    ],
    legende: 'Le retracement vient dans la zone OTE (62 à 79%), près du sweet spot 70,5%, puis la hausse reprend.',
  },

  breaker: {
    debut: 104,
    p: [104.8, 105.6, 106.2, 105.4, 104.4, 103.6, 103, [103.8, null, 0.1], 104.6, 105.2, 104.4, 103.4, [102.4, 0.2, 0.4],
        103.6, 105, 106, 106.6, 105.8, [105.0, 0.2, 0.25], 106.2, 107.4, 108],
    notes: [
      { t: 'zone', i: 9, a: 21, mode: 'corps', couleur: 'vert', texte: 'Breaker' },
      { t: 'niveau', i: 6, cote: 'l', a: 12, couleur: 'rouge' },
      { t: 'label', i: 12, cote: 'l', texte: 'Sweep', couleur: 'or' },
      { t: 'niveau', i: 9, cote: 'h', a: 15, couleur: 'vert', texte: 'BOS' },
    ],
    legende: 'Le prix prend le creux précédent (sweep) puis casse le sommet. La dernière bougie haussière avant la chute devient un breaker : zone d\'achat au retour.',
  },

  ob5: {
    debut: 106,
    p: [105.4, 104.6, 105.3, 106.2, 105.6, 104.9, 104.4, 105.1, 104.8, 104.4, [103.7, 0.2, 0.45], 105.6, 107,
        107.6, [107.2, 0.1, null], 106.2, 105.2, 104.6, 105.4, 106.6, 107.8, 108.6],
    notes: [
      { t: 'zone', i: 10, a: 21, mode: 'complet', couleur: 'vert', texte: 'OB 5★' },
      { t: 'niveau', i: 6, cote: 'l', a: 10, couleur: 'rouge' },
      { t: 'label', i: 10, cote: 'l', texte: '1', couleur: 'or' },
      { t: 'fvg', i: 11, a: 13, couleur: 'bleu' },
      { t: 'label', i: 11, cote: 'h', texte: '2', couleur: 'or' },
      { t: 'niveau', i: 3, cote: 'h', a: 12, couleur: 'vert' },
      { t: 'label', i: 12, cote: 'h', texte: '3', couleur: 'or' },
      { t: 'label', i: 17, cote: 'l', texte: '4', couleur: 'or' },
    ],
    legende: '1 : sweep des equal lows (liquidité). 2 : displacement avec FVG (imbalance). 3 : BOS (tendance). 4 : premier retour dans l\'OB (fresh), situé en discount du nouveau range.',
  },

  amd: {
    debut: 100,
    p: [100.4, 99.8, 100.3, 99.7, 100.2, 100.5, 99.9, 100.1, 99.2, [98.6, 0.2, 0.4], 99.8, 101, 102.2, 103.1,
        102.6, 103.8, 104.9, 105.4, 106.2],
    notes: [
      { t: 'ligne', prix: 100, de: 0, a: 18, couleur: 'or', texte: 'Ouverture' },
      { t: 'texte', i: 3, cote: 'h', texte: 'Accumulation' },
      { t: 'texte', i: 9, cote: 'l', texte: 'Manipulation' },
      { t: 'texte', i: 15, cote: 'h', texte: 'Distribution' },
    ],
    legende: 'Une journée haussière typique : range autour de l\'ouverture, faux départ sous l\'ouverture (Judas swing), puis la vraie hausse.',
  },

  /* ---------- Graphiques du quiz ---------- */
  'q-fvg': {
    base: 'fvg',
    notes: [
      { t: 'zone', i: 2, a: 3, mode: 'complet', couleur: 'neutre', texte: 'A' },
      { t: 'fvg', i: 5, a: 6, couleur: 'neutre', texte: 'B' },
      { t: 'zone', i: 9, a: 10, mode: 'corps', couleur: 'neutre', texte: 'C' },
    ],
  },
  'q-sweep': {
    base: 'liquidite',
    notes: [
      { t: 'niveau', i: 3, cote: 'l', a: 14, couleur: 'neutre' },
      { t: 'label', i: 14, cote: 'l', texte: 'A', couleur: 'or' },
    ],
  },
  'q-bos': {
    base: 'structure',
    notes: [
      { t: 'niveau', i: 8, cote: 'h', a: 14, couleur: 'neutre' },
      { t: 'label', i: 14, cote: 'h', texte: 'A', couleur: 'or' },
    ],
  },
  'q-choch': {
    base: 'structure',
    notes: [
      { t: 'niveau', i: 18, cote: 'l', a: 26, couleur: 'neutre' },
      { t: 'label', i: 26, cote: 'l', texte: 'A', couleur: 'or' },
    ],
  },
  'q-premium': {
    base: 'premium',
    notes: [
      { t: 'fibo', de: 1, vers: 8, a: 18, niveaux: [0, 0.5, 1] },
      { t: 'label', i: 10, cote: 'h', texte: 'A', couleur: 'or' },
    ],
  },
  'q-ob': {
    base: 'ob',
    notes: [
      { t: 'label', i: 4, cote: 'l', texte: 'A', couleur: 'or' },
      { t: 'label', i: 6, cote: 'l', texte: 'B', couleur: 'or' },
      { t: 'label', i: 11, cote: 'h', texte: 'C', couleur: 'or' },
    ],
  },
  'q-stop': {
    base: 'ob5',
    notes: [
      { t: 'zone', i: 10, a: 21, mode: 'complet', couleur: 'vert', texte: 'OB' },
      { t: 'label', i: 17, cote: 'h', texte: 'Entrée', couleur: 'or' },
      { t: 'niveau', i: 10, cote: 'm', a: 21, couleur: 'neutre', texte: 'A' },
      { t: 'niveau', i: 10, cote: 'l', a: 21, couleur: 'neutre', texte: 'B' },
      { t: 'niveau', i: 15, cote: 'm', a: 21, couleur: 'neutre', texte: 'C' },
    ],
  },
  'q-cible': {
    base: 'ob5',
    notes: [
      { t: 'zone', i: 10, a: 21, mode: 'complet', couleur: 'vert', texte: 'OB' },
      { t: 'niveau', i: 13, cote: 'h', a: 21, couleur: 'neutre', texte: 'A' },
      { t: 'niveau', i: 16, cote: 'm', a: 21, couleur: 'neutre', texte: 'B' },
      { t: 'niveau', i: 6, cote: 'l', a: 21, couleur: 'neutre', texte: 'C' },
    ],
  },
  'q-ote': {
    base: 'ote',
    notes: [
      { t: 'fibo', de: 1, vers: 8, a: 17, niveaux: [0, 1],
        zones: [{ de: 0.18, a: 0.36, couleur: 'neutre', texte: 'A' }, { de: 0.62, a: 0.79, couleur: 'neutre', texte: 'B' },
                { de: 0.88, a: 1, couleur: 'neutre', texte: 'C' }] },
    ],
  },
  baisse: {
    debut: 110,
    p: [109.2, 108.4, 107.2, 108, 108.8, 107.6, 106.2, 105.4, 106.4, 107.2, 106, 104.6, 103.6, 104.5, 105.3, 104.2, 102.8, 102],
    notes: [],
  },
  'q-mitigation': {
    debut: 100,
    p: [101, 102.2, 103, 102.4, 101.6, 101.0, [100.4, 0.2, 0.3], 102.6, 104.4, 105.2, 104.8, 103.6, 102.2, 101.3,
        [101.9, 0.3, 0.2], 103.2, 104.8, 106, 105.2, 104, 102.6, [101.2, 0.2, 0.3], 102],
    notes: [
      { t: 'zone', i: 6, a: 22, mode: 'complet', couleur: 'vert', texte: 'OB' },
      { t: 'label', i: 13, cote: 'l', texte: 'A', couleur: 'or' },
      { t: 'label', i: 21, cote: 'l', texte: 'B', couleur: 'or' },
    ],
  },
  'q-ifvg': {
    debut: 100,
    p: [100.5, 100.2, [102.8, 0.2, 0.1], 104, 104.6, 104.1, 103.2, 101.6, 100.4, 100, 100.8, [101.4, 0.45, 0.2], 100.6, 99.4, 98.6],
    notes: [
      { t: 'fvg', i: 2, a: 14, couleur: 'neutre' },
      { t: 'label', i: 11, cote: 'h', texte: 'A', couleur: 'or' },
    ],
  },
  'q-displacement': {
    debut: 100,
    p: [100.3, 100.1, 100.6, 100.4, 100.9, 100.7, 101.2, 101, 101.4, 101.1, 100.8, [103, 0.2, 0.1], [105.2, 0.2, 0.2], 106.2, 105.9],
    meche: 0.25,
    notes: [
      { t: 'label', i: 5, cote: 'h', texte: 'A', couleur: 'or' },
      { t: 'label', i: 12, cote: 'h', texte: 'B', couleur: 'or' },
    ],
  },
};
