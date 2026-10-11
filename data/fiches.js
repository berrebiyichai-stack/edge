/* Fiches de référence, à relire rapidement. Et règles affichées à tour de rôle sur l'accueil. */
window.FICHES = [
{
  id: 'f-glossaire', theme: 'ICT/SMC', titre: 'Glossaire ICT / SMC',
  contenu: `
<table>
<tr><td><strong>BOS</strong></td><td>Break of Structure : cassure du dernier swing dans le sens de la tendance.</td></tr>
<tr><td><strong>CHoCH</strong></td><td>Change of Character : première cassure contre la tendance (SMC).</td></tr>
<tr><td><strong>MSS</strong></td><td>Market Structure Shift : équivalent ICT du CHoCH, avec displacement.</td></tr>
<tr><td><strong>BSL / SSL</strong></td><td>Buy-side / sell-side liquidity : stops au-dessus des hauts / sous les bas.</td></tr>
<tr><td><strong>EQH / EQL</strong></td><td>Equal highs / lows : sommets ou creux au même niveau.</td></tr>
<tr><td><strong>PDH / PDL</strong></td><td>Previous day high / low.</td></tr>
<tr><td><strong>FVG</strong></td><td>Fair Value Gap : gap entre la mèche 1 et la mèche 3 d'un motif de 3 bougies.</td></tr>
<tr><td><strong>IFVG</strong></td><td>Inversion FVG : FVG cassé qui sert dans l'autre sens.</td></tr>
<tr><td><strong>CE</strong></td><td>Consequent encroachment : 50% d'un FVG.</td></tr>
<tr><td><strong>OB</strong></td><td>Order Block : dernière bougie opposée avant un displacement qui casse la structure.</td></tr>
<tr><td><strong>MT</strong></td><td>Mean threshold : 50% du corps d'un OB.</td></tr>
<tr><td><strong>BPR</strong></td><td>Balanced price range : chevauchement d'un FVG haussier et d'un FVG baissier.</td></tr>
<tr><td><strong>OTE</strong></td><td>Optimal Trade Entry : retracement 62 à 79%.</td></tr>
<tr><td><strong>DOL</strong></td><td>Draw on liquidity : la liquidité vers laquelle le prix se dirige.</td></tr>
<tr><td><strong>ERL / IRL</strong></td><td>External / internal range liquidity.</td></tr>
<tr><td><strong>PD array</strong></td><td>Outil de premium/discount : OB, FVG, breaker, etc.</td></tr>
<tr><td><strong>SMT</strong></td><td>Divergence entre deux actifs corrélés sur une prise de liquidité.</td></tr>
<tr><td><strong>AMD / PO3</strong></td><td>Accumulation, manipulation, distribution (Power of 3).</td></tr>
<tr><td><strong>HTF / LTF</strong></td><td>Higher / lower timeframe.</td></tr>
<tr><td><strong>Inducement</strong></td><td>Petit swing qui piège les entrées précoces avant la vraie zone.</td></tr>
</table>`
},
{
  id: 'f-checklist-ob5', theme: 'ICT/SMC', titre: 'Checklist OB 5★ avant d\'entrer',
  contenu: `
<p><strong>Contexte</strong></p>
<ul>
<li>☐ Biais H1 clair (dernier BOS) ?</li>
<li>☐ DOL identifié ?</li>
<li>☐ Pas de news rouge dans les 15 prochaines minutes ?</li>
<li>☐ Je suis dans une killzone ?</li>
</ul>
<p><strong>La grille</strong></p>
<ul>
<li>☐ ★ Imbalance : FVG laissé par le displacement</li>
<li>☐ ★ Tendance : dans le sens du BOS H1</li>
<li>☐ ★ Equilibrium : discount pour un achat, premium pour une vente</li>
<li>☐ ★ Mitigation : OB jamais retouché</li>
<li>☐ ★ Liquidité : sweep avant la création de l'OB</li>
</ul>
<p><strong>Exécution</strong></p>
<ul>
<li>☐ Signal d'entrée 15 min conforme à mon plan</li>
<li>☐ Stop derrière l'invalidation + marge spread</li>
<li>☐ Taille calculée pour risquer 1% maximum</li>
<li>☐ RR jusqu'au TP1 d'au moins 1,5</li>
<li>☐ Je ne suis ni en revenge, ni en FOMO</li>
</ul>
<div class="encadre"><p>Note le score dans la colonne Setup du journal : "OB 3★", "OB 4★", "OB 5★".</p></div>`
},
{
  id: 'f-fib', theme: 'ICT/SMC', titre: 'Niveaux de Fibonacci ICT',
  contenu: `
<table><tr><th>Niveau</th><th>Usage</th></tr>
<tr><td>1</td><td>Origine du swing, invalidation</td></tr>
<tr><td>0,79</td><td>Fin de l'OTE</td></tr>
<tr><td>0,705</td><td>Sweet spot OTE</td></tr>
<tr><td>0,62</td><td>Début de l'OTE</td></tr>
<tr><td>0,5</td><td>Equilibrium</td></tr>
<tr><td>0</td><td>Fin du swing</td></tr>
<tr><td>−0,27</td><td>Première cible d'extension</td></tr>
<tr><td>−0,62</td><td>Deuxième cible d'extension</td></tr>
<tr><td>−1</td><td>Projection symétrique</td></tr></table>
<p><strong>Achat :</strong> tracer du swing low (1) au swing high (0). <strong>Vente :</strong> du swing high (1) au swing low (0).</p>`
},
{
  id: 'f-modeles', theme: 'ICT/SMC', titre: 'Les modèles d\'entrée en un coup d\'œil',
  contenu: `
<p><strong>Modèle classique ICT</strong></p>
<ol><li>Sweep d'une liquidité (EQL, PDL, bas asiatique)</li><li>MSS avec displacement dans l'autre sens</li><li>Retour dans le FVG ou l'OB créé par le displacement</li><li>Cible : liquidité opposée</li></ol>
<p><strong>Silver Bullet</strong></p>
<ol><li>Fenêtre d'une heure (10h, 17h ou 21h heure locale)</li><li>Displacement vers le DOL qui crée un FVG</li><li>Entrée au retour dans le FVG</li></ol>
<p><strong>Breaker</strong></p>
<ol><li>Haut, puis sweep d'un bas antérieur</li><li>Cassure du haut</li><li>Entrée au retour sur la dernière bougie haussière avant la chute</li></ol>
<p><strong>OB 5★ (ton modèle)</strong></p>
<ol><li>Zone H1 notée sur 5</li><li>CHoCH 15 min dans le sens H1 à l'intérieur de la zone</li><li>Entrée sur l'OB/FVG 15 min de confirmation</li></ol>`
},
{
  id: 'f-horaires', theme: 'Temps', titre: 'Horaires clés en heure locale',
  contenu: `
<p class="muted petit">Heure locale = UTC+3 l'été, UTC+2 l'hiver : 7h de décalage avec New York en général, 6h pendant la semaine où les changements d'heure ne sont pas synchronisés (fin octobre / début novembre).</p>
<table><tr><th>Moment</th><th>Heure locale</th></tr>
<tr><td>Ouverture minuit NY</td><td>07:00</td></tr>
<tr><td>Killzone Asie</td><td>03:00 - 07:00</td></tr>
<tr><td>Killzone Londres</td><td>09:00 - 12:00</td></tr>
<tr><td>Silver Bullet Londres</td><td>10:00 - 11:00</td></tr>
<tr><td>News US (CPI, NFP…)</td><td>15:30</td></tr>
<tr><td>Ouverture Wall Street</td><td>16:30</td></tr>
<tr><td>Killzone New York AM</td><td>14:00 - 17:00</td></tr>
<tr><td>Silver Bullet NY AM</td><td>17:00 - 18:00</td></tr>
<tr><td>London close</td><td>17:00 - 19:00</td></tr>
<tr><td>FOMC (communiqué)</td><td>21:00</td></tr>
<tr><td>Silver Bullet NY PM</td><td>21:00 - 22:00</td></tr></table>`
},
{
  id: 'f-news', theme: 'Temps', titre: 'Protocole news',
  contenu: `
<ul>
<li><strong>Le matin</strong> : vérifier le calendrier (USD, impact élevé).</li>
<li><strong>15 min avant</strong> une news rouge : pas de nouvelle entrée.</li>
<li><strong>Position ouverte</strong> : décision prise à l'avance (fermer, ou garder avec stop fixe). Pas d'improvisation.</li>
<li><strong>Pendant</strong> : ne rien faire. Spread élargi, slippage, mèches dans les deux sens.</li>
<li><strong>Après</strong> : attendre la clôture de la première bougie 15 min. Le premier mouvement est souvent un sweep.</li>
<li><strong>Jours de FOMC</strong> : le marché est souvent calme avant 21:00 puis violent. Beaucoup de traders ne tradent pas l'après-midi.</li>
</ul>`
},
{
  id: 'f-formules', theme: 'Risque', titre: 'Formules de risque',
  contenu: `
<pre><code>Taille = Risque $ / (Distance stop × Valeur du point)
Espérance (R) = WR × Gain moyen − (1 − WR) × Perte moyenne
WR minimum = 1 / (1 + RR)
Gain pour récupérer = Perte / (1 − Perte)
Profit factor = Somme des gains / Somme des pertes</code></pre>
<table><tr><th>Perte</th><th>Pour revenir</th></tr>
<tr><td>−10%</td><td>+11,1%</td></tr><tr><td>−20%</td><td>+25%</td></tr><tr><td>−30%</td><td>+42,9%</td></tr><tr><td>−50%</td><td>+100%</td></tr></table>
<table><tr><th>RR</th><th>WR mini</th></tr>
<tr><td>0,5</td><td>66,7%</td></tr><tr><td>1</td><td>50%</td></tr><tr><td>1,5</td><td>40%</td></tr><tr><td>2</td><td>33,3%</td></tr><tr><td>3</td><td>25%</td></tr></table>`
},
{
  id: 'f-contrats', theme: 'Risque', titre: 'Spécifications des contrats',
  contenu: `
<table><tr><th></th><th>XAUUSD</th><th>BTCUSD (CFD courant)</th></tr>
<tr><td>1 lot</td><td>100 onces</td><td>1 BTC</td></tr>
<tr><td>1 $ de mouvement, 1 lot</td><td>100 $</td><td>1 $</td></tr>
<tr><td>1 $ de mouvement, 0,01 lot</td><td>1 $</td><td>0,01 $</td></tr>
<tr><td>Lot minimum habituel</td><td>0,01</td><td>0,01</td></tr></table>
<div class="encadre attention"><p>Ces valeurs varient selon les brokers, surtout pour le BTC. Vérifie toujours la fiche du contrat chez ton broker avant ton premier trade réel.</p></div>
<p><strong>Compte 500 $, risque 1% = 5 $ :</strong> stop maximum sur l'or avec 0,01 lot = 5 $ de mouvement.</p>`
},
{
  id: 'f-regles-risque', theme: 'Risque', titre: 'Mes règles de risque',
  contenu: `
<ol>
<li>Maximum <strong>1%</strong> du compte par trade (0,5% pendant les 30 premiers trades réels).</li>
<li>Maximum <strong>3 trades</strong> par jour.</li>
<li>Perte max journalière : <strong>3R</strong>. Atteinte = fin de journée.</li>
<li>Perte max hebdomadaire : <strong>6R</strong>. Atteinte = pause et revue.</li>
<li>2 pertes d'affilée = <strong>pause de 30 minutes</strong>.</li>
<li>Stop posé dès l'entrée, <strong>jamais élargi</strong>.</li>
<li>Pas de trade sans note de setup et sans plan écrit.</li>
</ol>
<p class="muted petit">Ces valeurs sont des propositions. Adapte-les, puis ne les change plus pendant au moins un mois.</p>`
},
{
  id: 'f-routine', theme: 'Process', titre: 'Routine de séance',
  contenu: `
<p><strong>Avant</strong></p>
<ol><li>Calendrier économique</li><li>Analyse H1 BTC et or : biais, range, DOL, zones</li><li>Alertes posées</li><li>Plan écrit : "Si X, je cherche Y, invalidation Z"</li><li>État personnel OK ?</li></ol>
<p><strong>Pendant</strong></p>
<ol><li>J'exécute ou j'attends, je n'analyse plus</li><li>Checklist OB 5★ avant chaque entrée</li></ol>
<p><strong>Après</strong></p>
<ol><li>Journal rempli</li><li>Colonnes Setup et Notes remplies</li><li>Plan respecté ? Oui / non</li><li>Captures d'écran</li></ol>`
},
{
  id: 'f-erreurs', theme: 'Process', titre: 'Erreurs et antidotes',
  contenu: `
<table><tr><th>Erreur</th><th>Antidote</th></tr>
<tr><td>Revenge trading</td><td>Pause de 30 min après 2 pertes</td></tr>
<tr><td>FOMO</td><td>Prix sorti de la zone = trade annulé</td></tr>
<tr><td>Stop élargi</td><td>Stop posé à l'entrée, intouchable</td></tr>
<tr><td>Gains coupés trop tôt</td><td>TP et partiels décidés avant l'entrée</td></tr>
<tr><td>Overtrading</td><td>3 trades max, uniquement en killzone</td></tr>
<tr><td>Changer de méthode</td><td>Juger sur 50 trades minimum</td></tr>
<tr><td>Trader fatigué</td><td>Pas de séance après une journée épuisante</td></tr></table>`
},
{
  id: 'f-pine-syntaxe', theme: 'Pine Script', titre: 'Aide-mémoire syntaxe Pine v6',
  contenu: `
<pre><code>//@version=6
indicator("Nom", overlay = true)

// Variables
x = 10              // déclaration
x := 20             // réassignation
var float y = na    // mémoire entre bougies
varip int n = 0     // mémoire aussi entre ticks

// Types : int, float, bool, string, color,
// line, box, label, table, array&lt;T&gt;, map&lt;K,V&gt;

// Conditions
if close &gt; open
    label.new(bar_index, high, "Haussière")
else if close &lt; open
    label.new(bar_index, low, "Baissière")

r = close &gt; open ? 1 : -1   // ternaire

// Boucles
somme = 0.0
for i = 0 to 9
    somme += close[i]
for i = 9 to 0       // à l'envers
    somme -= close[i]

// Fonction
moyenne(a, b) =&gt;
    (a + b) / 2</code></pre>
<p class="petit muted">L'indentation (4 espaces ou une tabulation) définit les blocs, comme en Python.</p>`
},
{
  id: 'f-pine-ta', theme: 'Pine Script', titre: 'Fonctions utiles pour ICT',
  contenu: `
<table>
<tr><td><code>ta.pivothigh(high, g, d)</code></td><td>Swing high confirmé d bougies après</td></tr>
<tr><td><code>ta.pivotlow(low, g, d)</code></td><td>Swing low</td></tr>
<tr><td><code>ta.highest(high, n)</code></td><td>Plus haut sur n bougies</td></tr>
<tr><td><code>ta.lowest(low, n)</code></td><td>Plus bas sur n bougies</td></tr>
<tr><td><code>ta.atr(14)</code></td><td>Volatilité moyenne, pour filtrer le displacement</td></tr>
<tr><td><code>ta.crossover(a, b)</code></td><td>a passe au-dessus de b</td></tr>
<tr><td><code>ta.barssince(cond)</code></td><td>Bougies depuis la dernière fois que cond était vraie</td></tr>
<tr><td><code>ta.valuewhen(cond, src, 0)</code></td><td>Valeur de src la dernière fois que cond était vraie</td></tr>
<tr><td><code>math.abs(close - open)</code></td><td>Taille du corps</td></tr>
<tr><td><code>request.security()</code></td><td>Données d'un autre timeframe ou symbole</td></tr>
<tr><td><code>time("15", "0200-0500", "America/New_York")</code></td><td>Non na si la bougie est dans la plage horaire</td></tr>
</table>
<p class="petit muted">Pour une killzone : <code>inKz = not na(time(timeframe.period, "0700-1000", "America/New_York"))</code></p>`
},
{
  id: 'f-pine-dessins', theme: 'Pine Script', titre: 'Dessins et limites',
  contenu: `
<table><tr><th>Objet</th><th>Créer</th><th>Limite par défaut / max</th></tr>
<tr><td>Boîte</td><td><code>box.new(g, haut, d, bas)</code></td><td>50 / 500</td></tr>
<tr><td>Ligne</td><td><code>line.new(x1, y1, x2, y2)</code></td><td>50 / 500</td></tr>
<tr><td>Label</td><td><code>label.new(x, y, "texte")</code></td><td>50 / 500</td></tr>
<tr><td>Tableau</td><td><code>table.new(position.top_right, cols, rows)</code></td><td>quelques-uns</td></tr></table>
<p>Augmenter la limite : <code>indicator("…", max_boxes_count = 500, max_lines_count = 500, max_labels_count = 500)</code></p>
<p>Modifier un objet : <code>b.set_right(bar_index)</code>, <code>b.set_bgcolor(c)</code>. Supprimer : <code>b.delete()</code>.</p>
<p>Un tableau (<code>table</code>) se dessine en général seulement sur la dernière bougie : <code>if barstate.islast</code>.</p>`
},
{
  id: 'f-pine-pieges', theme: 'Pine Script', titre: 'Pièges Pine à éviter',
  contenu: `
<ul>
<li><strong>Fonctions ta.* dans un if</strong> : elles doivent tourner à chaque bougie. Calcule-les en dehors.</li>
<li><strong>Nombre utilisé comme booléen</strong> : interdit en v6. <code>if not na(pivot)</code>, pas <code>if pivot</code>.</li>
<li><strong>Tester na avec ==</strong> : utiliser <code>na(x)</code>.</li>
<li><strong>Oublier var</strong> sur un tableau ou un compteur : il repart à zéro à chaque bougie.</li>
<li><strong>Repaint</strong> : signal sur bougie non clôturée. Utiliser <code>barstate.isconfirmed</code>.</li>
<li><strong>request.security sans [1]</strong> avec lookahead_on : regarde dans le futur en historique.</li>
<li><strong>Décalage des pivots</strong> : <code>ta.pivothigh(high, 3, 3)</code> renvoie le pivot de la bougie <code>[3]</code>.</li>
<li><strong>Trop d'objets</strong> : au-delà de la limite, les plus anciens disparaissent sans prévenir.</li>
<li><strong>Supprimer dans une boucle</strong> : parcourir le tableau à l'envers.</li>
</ul>`
},
{
  id: 'f-macro', theme: 'Macro', titre: 'Ce qui fait bouger l\'or et le BTC',
  contenu: `
<table><tr><th>Facteur</th><th>Or</th><th>BTC</th></tr>
<tr><td>Taux Fed attendus en baisse</td><td>↑</td><td>↑</td></tr>
<tr><td>Taux réels en hausse</td><td>↓</td><td>↓ (souvent)</td></tr>
<tr><td>Dollar (DXY) fort</td><td>↓ (en général)</td><td>↓ (en général)</td></tr>
<tr><td>Crise / peur</td><td>↑ refuge</td><td>Variable, souvent ↓ au début</td></tr>
<tr><td>Nasdaq en hausse (risk-on)</td><td>Neutre</td><td>↑ (corrélation variable)</td></tr>
<tr><td>Achats banques centrales</td><td>↑</td><td>–</td></tr>
<tr><td>Entrées ETF spot</td><td>↑ (ETF or)</td><td>↑</td></tr>
<tr><td>Funding très positif</td><td>–</td><td>Risque de flush ↓</td></tr></table>
<p class="petit muted">Tendances générales, pas des règles. Les corrélations changent : vérifie-les sur le chart.</p>`
},
];

window.REGLES = [
  'Le trade n\'existe que si le prix vient dans ta zone. Sinon, il n\'y a rien à faire.',
  'Juge une méthode sur 50 trades, pas sur 3.',
  'Un trade perdant qui respecte le plan est un bon trade.',
  'Pas de liquidité prise, pas de mouvement propre.',
  'Le 15 minutes ne contredit jamais le H1.',
  'Achète en discount, vends en premium.',
  'Le stop ne s\'élargit jamais.',
  'Deux pertes d\'affilée : pause de 30 minutes.',
  'Hors killzone, les faux signaux se multiplient.',
  'Pas d\'entrée dans les 15 minutes avant une news rouge.',
  'Ce qui compte, c\'est l\'espérance en R, pas le win rate seul.',
  'Le plan s\'écrit avant la séance, pas pendant.',
  'Si tu dois réfléchir longtemps pour voir le setup, ce n\'est pas un setup.',
  'Une mèche au-delà d\'un niveau n\'est pas une cassure. Attends la clôture.',
  'Le paper trading ne vaut que si tu risques le même pourcentage qu\'en réel.',
  'Un OB sans displacement ni BOS n\'est qu\'une bougie.',
  'Le marché sera encore là demain. Ton capital, pas forcément.',
  'Note ton setup avant d\'entrer, jamais après.',
  'Une seule variable change à la fois quand tu testes.',
  'Fatigué ou énervé : taille réduite ou pas de trading.',
];
