/* Programme de leçons, dans l'ordre de lecture conseillé.
   Pour ajouter une leçon : copier un bloc, lui donner un id unique, garder le même module pour la ranger. */
window.LECONS = [

/* ===================== MODULE 1 : FONDATIONS ICT / SMC ===================== */
{
  id: 'ict-structure', module: 'Fondations ICT/SMC', titre: 'Lire la structure de marché', duree: 6,
  resume: 'Swings, BOS, CHoCH, MSS',
  contenu: `
<p>Tout le reste de la méthode repose sur une question : <strong>qui contrôle le marché en ce moment, acheteurs ou vendeurs ?</strong> La structure y répond.</p>
<h3>Les swings</h3>
<p>Un <strong>swing high</strong> est un plus haut entouré de bougies aux plus hauts inférieurs (au minimum une de chaque côté, idéalement plus). Le <strong>swing low</strong> est l'inverse. Une tendance haussière enchaîne des plus hauts et des plus bas de plus en plus hauts (HH / HL). Une baissière, des LH / LL.</p>
<h3>BOS : la tendance continue</h3>
<p>Le <strong>Break of Structure</strong> se produit quand le prix casse le dernier swing <em>dans le sens de la tendance</em>. En tendance haussière, une clôture au-dessus du dernier HH = BOS haussier. C'est une confirmation de continuation.</p>
<h3>CHoCH / MSS : la tendance change peut-être</h3>
<p>Le <strong>Change of Character</strong> (en SMC) ou <strong>Market Structure Shift</strong> (en ICT) est la première cassure <em>contre</em> la tendance : en haussier, le prix casse le dernier HL. Le MSS version ICT exige en plus du <strong>displacement</strong> (bougies larges et décidées) et idéalement une prise de liquidité juste avant.</p>
<div class="encadre"><p><strong>Corps ou mèche ?</strong> Choisis une règle et tiens-la. La plupart des traders ICT valident une cassure sur <strong>clôture de corps</strong>, une simple mèche au-delà du niveau étant souvent juste une prise de liquidité.</p></div>
<h3>Interne vs externe</h3>
<p>La <strong>structure externe</strong> = les swings majeurs de ton timeframe d'analyse (H1 pour toi). La <strong>structure interne</strong> = les petits swings à l'intérieur d'une jambe. Un CHoCH interne en 15 min dans un pullback H1 haussier est souvent ton signal d'entrée, pas un retournement de la tendance H1.</p>`,
  retenir: ['HH/HL = haussier, LH/LL = baissier', 'BOS = continuation, CHoCH/MSS = changement potentiel', 'Valide les cassures sur clôture de corps', 'Le biais vient de H1, le timing de 15 min'],
  exercice: 'Sur BTCUSD H1, marque les 6 derniers swings et écris pour chaque cassure si c\'est un BOS ou un CHoCH.'
},
{
  id: 'ict-liquidite', module: 'Fondations ICT/SMC', titre: 'La liquidité : là où sont les stops', duree: 6,
  resume: 'BSL, SSL, equal highs/lows, sweep',
  contenu: `
<p>Le prix a besoin de contreparties pour bouger. Les gros ordres se remplissent là où il y a beaucoup d'ordres en attente : <strong>les stops des autres traders</strong>.</p>
<h3>BSL et SSL</h3>
<ul>
<li><strong>Buy-side liquidity (BSL)</strong> : au-dessus des plus hauts. Les stops des vendeurs et les ordres d'achat sur cassure.</li>
<li><strong>Sell-side liquidity (SSL)</strong> : sous les plus bas. Les stops des acheteurs et les ventes sur cassure.</li>
</ul>
<h3>Où elle s'accumule</h3>
<ul>
<li><strong>Equal highs / equal lows</strong> (EQH / EQL) : deux sommets ou creux au même niveau. Trop "propres", ce sont des aimants.</li>
<li>Les plus hauts et plus bas de la <strong>veille</strong> (PDH / PDL), de la <strong>semaine</strong>, des <strong>sessions</strong> (Asie, Londres).</li>
<li>Les <strong>lignes de tendance</strong> évidentes : tout le monde met son stop juste derrière.</li>
</ul>
<h3>Sweep vs cassure</h3>
<p>Un <strong>sweep</strong> (ou raid) : le prix dépasse le niveau, déclenche les stops, puis revient rapidement de l'autre côté. Une <strong>vraie cassure</strong> : le prix clôture au-delà et continue. La différence se voit à la réaction : rejet rapide avec displacement inverse = sweep.</p>
<div class="encadre astuce"><p>Le setup ICT classique : <strong>sweep d'une liquidité, puis MSS dans l'autre sens, puis retour sur un FVG ou un OB pour entrer</strong>. La liquidité prise est le carburant du mouvement suivant.</p></div>
<h3>Inducement</h3>
<p>En SMC, l'<strong>inducement</strong> est un petit swing interne juste avant ta zone d'intérêt. Il attire les entrées trop précoces. Tant qu'il n'est pas pris, ton OB risque de ne pas être touché proprement, ou d'être traversé.</p>`,
  retenir: ['BSL au-dessus des hauts, SSL sous les bas', 'EQH/EQL, PDH/PDL et hauts/bas de session = aimants', 'Sweep = dépassement puis rejet rapide', 'Ne place pas ton stop là où tout le monde le met'],
  exercice: 'Sur XAUUSD, trace PDH, PDL et les hauts/bas de la session asiatique. Note lesquels ont été pris pendant Londres.'
},
{
  id: 'ict-fvg', module: 'Fondations ICT/SMC', titre: 'Displacement et Fair Value Gap', duree: 6,
  resume: 'Le déséquilibre, cœur de ton critère "imbalance"',
  contenu: `
<p>Le <strong>displacement</strong> est un mouvement fort, en une ou plusieurs bougies à gros corps, qui montre l'intervention d'acteurs importants. Il laisse souvent une trace : le <strong>Fair Value Gap</strong>.</p>
<h3>Définition exacte d'un FVG</h3>
<p>Un motif de <strong>3 bougies</strong>. Pour un FVG haussier : le <strong>plus bas de la bougie 3</strong> est au-dessus du <strong>plus haut de la bougie 1</strong>. L'espace entre les deux n'a été traversé que par la bougie 2 : le marché n'y a échangé que dans un sens. FVG baissier : le plus haut de la bougie 3 est sous le plus bas de la bougie 1.</p>
<pre><code>FVG haussier : low[0] &gt; high[2]
FVG baissier : high[0] &lt; low[2]</code></pre>
<h3>Comment le prix l'utilise</h3>
<ul>
<li>Le prix revient souvent "rééquilibrer" le gap avant de repartir.</li>
<li>Le <strong>consequent encroachment (CE)</strong> = le milieu (50%) du FVG. Un FVG respecté tient souvent avant ou au CE, en clôture.</li>
<li>Une clôture de corps franche à travers tout le FVG l'invalide.</li>
</ul>
<h3>Inversion FVG (IFVG)</h3>
<p>Quand un FVG est cassé en clôture, il peut servir de support/résistance dans l'autre sens. Un FVG haussier invalidé devient une zone de vente au retest.</p>
<h3>Lien avec ton OB 5 étoiles</h3>
<p>Ton critère <strong>imbalance</strong> = le mouvement qui part de l'OB a laissé au moins un FVG. Sans FVG, il n'y a pas eu de vrai displacement, donc l'OB est moins fiable.</p>`,
  retenir: ['FVG = 3 bougies, gap entre mèche 1 et mèche 3', 'CE = 50% du FVG', 'Clôture à travers le FVG = invalidé, possible IFVG', 'Pas de FVG = pas de displacement = OB faible'],
  exercice: 'Trouve 5 FVG en 15 min sur BTC aujourd\'hui. Pour chacun, note si le prix est revenu et s\'il a tenu au CE.'
},
{
  id: 'ict-ob', module: 'Fondations ICT/SMC', titre: 'Les Order Blocks', duree: 7,
  resume: 'Définition rigoureuse, mean threshold, validation',
  contenu: `
<p>Un <strong>Order Block</strong> marque la zone où un acteur important a construit sa position juste avant un déplacement.</p>
<h3>Définition</h3>
<ul>
<li><strong>OB haussier</strong> : la <strong>dernière bougie baissière</strong> (clôture sous ouverture) avant un mouvement haussier en displacement qui casse la structure.</li>
<li><strong>OB baissier</strong> : la <strong>dernière bougie haussière</strong> avant un mouvement baissier en displacement qui casse la structure.</li>
</ul>
<p>Si plusieurs bougies de même couleur se suivent avant l'impulsion, beaucoup de traders prennent l'ensemble comme zone, ou seulement la dernière. Choisis une convention et backteste-la.</p>
<h3>Les niveaux clés</h3>
<ul>
<li><strong>Open</strong> de la bougie : premier point de contact souvent utilisé pour une entrée limite.</li>
<li><strong>Mean threshold</strong> : 50% du corps de l'OB. Un OB haussier qui clôture sous son mean threshold perd en validité.</li>
<li><strong>Plus bas / plus haut</strong> de l'OB : invalidation, zone logique du stop (avec une marge).</li>
</ul>
<h3>Un OB valide a</h3>
<ol>
<li>Un <strong>displacement</strong> qui en part, avec FVG.</li>
<li>Une <strong>cassure de structure</strong> (BOS ou MSS) causée par ce displacement.</li>
<li>Une <strong>position cohérente</strong> : haussier en discount, baissier en premium.</li>
</ol>
<div class="encadre attention"><p>Toute bougie opposée avant un mouvement n'est pas un OB. Sans cassure de structure et sans displacement, c'est juste une bougie. C'est l'erreur n°1 des débutants SMC, : la définition exacte change tout aux résultats.</p></div>`,
  retenir: ['OB haussier = dernière bougie baissière avant displacement + BOS', 'Mean threshold = 50% du corps', 'Pas de BOS, pas d\'OB', 'La définition exacte doit être backtestée'],
  exercice: 'Sur XAUUSD H1, identifie 3 OB valides et 3 "faux OB" (sans BOS). Compare les réactions.'
},
{
  id: 'ict-premium', module: 'Fondations ICT/SMC', titre: 'Premium, discount et equilibrium', duree: 5,
  resume: 'Acheter bas, vendre haut, mesurablement',
  contenu: `
<p>Les institutionnels cherchent à acheter <strong>moins cher</strong> que la valeur moyenne et à vendre plus cher. ICT formalise ça avec le <strong>dealing range</strong>.</p>
<h3>Construire le range</h3>
<p>Prends le dernier swing significatif de ton timeframe d'analyse : du swing low au swing high qui a fait le BOS (en haussier). Trace un Fibonacci de 0 à 1.</p>
<ul>
<li><strong>Equilibrium</strong> = 50%.</li>
<li><strong>Discount</strong> = sous 50%. Zone où on cherche des achats.</li>
<li><strong>Premium</strong> = au-dessus de 50%. Zone où on cherche des ventes.</li>
</ul>
<h3>Pourquoi c'est un filtre puissant</h3>
<p>Un OB haussier en premium a deux défauts : ton risque/rendement est mauvais (tu achètes près du haut) et le prix a de l'espace pour revenir chercher la valeur sous l'equilibrium. C'est exactement ton critère <strong>equilibrium</strong> dans la grille 5 étoiles.</p>
<div class="encadre"><p><strong>Piège :</strong> le range change dès qu'un nouveau swing se forme. Redessine-le après chaque BOS de ton timeframe d'analyse, et ne mélange pas le range H1 avec un range 15 min.</p></div>`,
  retenir: ['Range = swing low → swing high du dernier BOS', '50% = equilibrium', 'Achats en discount, ventes en premium', 'Redessiner après chaque nouveau BOS'],
  exercice: 'Trace le dealing range H1 actuel sur BTC. Le prix est-il en premium ou en discount ? Quel type de trade cherches-tu ?'
},
{
  id: 'ict-ote', module: 'Fondations ICT/SMC', titre: 'OTE : l\'entrée optimale', duree: 5,
  resume: 'Le retracement 62 à 79%',
  contenu: `
<p>L'<strong>Optimal Trade Entry</strong> est une zone de retracement profonde dans le range, où ICT cherche ses entrées.</p>
<h3>Les niveaux</h3>
<table><tr><th>Niveau</th><th>Rôle</th></tr>
<tr><td>0,5</td><td>Equilibrium, entrée du discount</td></tr>
<tr><td>0,62</td><td>Début de l'OTE</td></tr>
<tr><td>0,705</td><td>"Sweet spot" de l'OTE</td></tr>
<tr><td>0,79</td><td>Fin de l'OTE</td></tr>
<tr><td>1</td><td>Origine du mouvement, invalidation</td></tr></table>
<p>Pour un achat : Fibonacci du swing low (1) au swing high (0), on cherche l'entrée entre 0,62 et 0,79 de retracement.</p>
<h3>L'intérêt : la confluence</h3>
<p>L'OTE seul n'a rien de magique. Il devient intéressant quand un <strong>OB ou un FVG</strong> se trouve dans la zone 62 à 79%. Tu as alors un niveau précis, en discount profond, avec un stop proche (sous le swing low) : le RR est naturellement élevé.</p>
<h3>Cibles</h3>
<p>Extensions de Fibonacci souvent utilisées : -0,27 et -0,62 au-delà du swing high, ou plus simplement la prochaine liquidité évidente (EQH, PDH).</p>`,
  retenir: ['OTE = 62 à 79%, sweet spot 70,5%', 'OTE + OB/FVG = vraie confluence', 'Stop sous l\'origine du swing'],
  exercice: 'Sur tes 5 derniers trades, regarde où se trouvait ton entrée dans le range. Combien étaient dans l\'OTE ?'
},
{
  id: 'ict-breaker', module: 'Fondations ICT/SMC', titre: 'Breaker, mitigation et rejection blocks', duree: 6,
  resume: 'Les OB qui changent de camp',
  contenu: `
<h3>Breaker block</h3>
<p>Scénario haussier : le prix fait un plus haut, revient <strong>prendre un plus bas précédent</strong> (sweep de SSL), puis repart violemment à la hausse et casse le plus haut. La dernière bougie haussière avant la chute qui a fait le sweep devient un <strong>breaker haussier</strong>. Au retour du prix dessus, on cherche des achats.</p>
<p>Sa force : il intègre une prise de liquidité <em>et</em> un changement de structure.</p>
<h3>Mitigation block</h3>
<p>Même logique que le breaker, mais <strong>sans prise de liquidité</strong> : le prix fait un plus bas plus haut (pas de sweep), puis casse la structure. Moins puissant que le breaker.</p>
<h3>Qu'est-ce que "mitiger" ?</h3>
<p>Mitiger un OB = le prix revient dans la zone. L'idée : les acteurs qui avaient des positions perdantes à ce niveau en profitent pour en clôturer ou en ajouter. Après la <strong>première</strong> mitigation, une partie des ordres est consommée : l'OB est moins fiable aux touches suivantes. D'où ton critère <strong>mitigation</strong> : on préfère un OB jamais touché (dit "fresh").</p>
<h3>Rejection block</h3>
<p>Zone formée par les <strong>longues mèches</strong> à un extrême. On utilise le corps le plus haut (ou bas) des bougies comme niveau, et le stop au-delà des mèches.</p>`,
  retenir: ['Breaker = sweep + cassure de structure', 'Mitigation block = sans sweep', 'OB fresh > OB déjà touché', 'Rejection block = zone des mèches'],
},
{
  id: 'ict-dol', module: 'Fondations ICT/SMC', titre: 'Draw on liquidity et PD arrays', duree: 6,
  resume: 'Où va le prix, et où l\'attendre',
  contenu: `
<p>Avant de chercher une entrée, réponds à une question : <strong>vers quoi le prix se dirige-t-il ?</strong> C'est le <strong>draw on liquidity</strong> (DOL).</p>
<h3>Trouver le DOL</h3>
<ul>
<li>La liquidité la plus évidente non prise : EQH/EQL, PDH/PDL, haut/bas de la semaine.</li>
<li>Un <strong>FVG HTF non comblé</strong> (H4, Daily).</li>
<li>La direction de la structure H1/H4 : en haussier, le DOL est en général au-dessus.</li>
</ul>
<p>Le prix alterne entre deux états : aller prendre de la liquidité externe (hauts/bas du range) et revenir combler des déséquilibres internes (FVG). C'est le cycle <strong>ERL → IRL → ERL</strong> (external / internal range liquidity).</p>
<h3>Les PD arrays</h3>
<p>Ce sont les outils "Premium / Discount" où l'on attend le prix : OB, FVG, breaker, mitigation block, rejection block, liquidity void, plus haut/plus bas anciens. En discount on utilise les PD arrays haussiers, en premium les baissiers.</p>
<div class="encadre astuce"><p><strong>Ta routine en 3 lignes :</strong> 1) H1 : quel est le DOL ? 2) H1 : où est le PD array en discount/premium d'où le prix peut partir vers ce DOL ? 3) 15 min : signal d'entrée quand le prix y arrive.</p></div>`,
  retenir: ['Toujours définir le DOL avant l\'entrée', 'Cycle ERL → IRL → ERL', 'PD arrays haussiers en discount, baissiers en premium'],
  exercice: 'Avant ta prochaine session, écris le DOL de BTC et de l\'or dans ton journal, puis vérifie le soir.'
},

/* ===================== MODULE 2 : TEMPS ET SESSIONS ===================== */
{
  id: 'temps-killzones', module: 'Temps et sessions', titre: 'Les killzones en heure locale (UTC+2/+3)', duree: 6,
  resume: 'Quand trader, quand ne rien faire',
  contenu: `
<p>ICT insiste : <strong>le temps compte autant que le prix</strong>. Les mouvements propres arrivent quand les gros volumes entrent.</p>
<h3>Les killzones (heure de New York → heure locale)</h3>
<table><tr><th>Killzone</th><th>New York</th><th>Heure locale*</th></tr>
<tr><td>Asie</td><td>20:00 - 00:00</td><td>03:00 - 07:00</td></tr>
<tr><td>Londres</td><td>02:00 - 05:00</td><td>09:00 - 12:00</td></tr>
<tr><td>New York AM</td><td>07:00 - 10:00</td><td>14:00 - 17:00</td></tr>
<tr><td>London close</td><td>10:00 - 12:00</td><td>17:00 - 19:00</td></tr></table>
<p class="petit muted">* Heure locale = UTC+3 l'été, UTC+2 l'hiver, soit 7 heures de décalage avec New York en général. Attention : les États-Unis ne changent pas d'heure le même jour que l'Europe et le Moyen-Orient (fin octobre d'un côté, début novembre aux USA). Pendant cette semaine, l'écart est de 6 heures.</p>
<h3>Ce qui se passe typiquement</h3>
<ul>
<li><strong>Asie</strong> : range souvent étroit, qui crée de la liquidité des deux côtés.</li>
<li><strong>Londres</strong> : prend souvent un côté du range asiatique, fixe parfois le haut ou le bas du jour.</li>
<li><strong>New York</strong> : volume maximal, news US à 15:30 heure locale, continuation ou retournement de Londres.</li>
</ul>
<h3>Pour toi concrètement</h3>
<p>L'or est très sensible aux killzones Londres et New York. Le BTC tourne 24h/24, mais les flux US (ETF, Nasdaq) rendent la session New York la plus active. Si tu travailles la journée, la killzone NY (14:00 - 17:00) et l'heure suivante sont souvent les créneaux les plus réalistes.</p>`,
  retenir: ['Londres 09:00-12:00, NY 14:00-17:00 heure locale', 'Écart habituel 7h, 6h pendant la semaine de décalage', 'Asie = range, Londres et NY = mouvements', 'Hors killzone : plus de faux signaux'],
},
{
  id: 'temps-po3', module: 'Temps et sessions', titre: 'Power of 3 et Judas swing', duree: 5,
  resume: 'Accumulation, manipulation, distribution',
  contenu: `
<p>Le <strong>Power of 3</strong> (ou AMD) décrit la forme d'une bougie journalière vue de l'intérieur :</p>
<ol>
<li><strong>Accumulation</strong> : le prix tourne autour de l'ouverture (souvent en Asie).</li>
<li><strong>Manipulation</strong> : un faux mouvement dans le sens opposé à la vraie direction du jour, qui prend la liquidité.</li>
<li><strong>Distribution</strong> : le vrai mouvement, dans la direction du biais.</li>
</ol>
<p>Une journée haussière typique : ouverture, petite baisse sous l'ouverture (qui forme la mèche basse de la bougie daily), puis hausse vers le haut du jour. La mèche basse, c'est la manipulation.</p>
<h3>Le Judas swing</h3>
<p>C'est la phase de manipulation, souvent en début de Londres ou de New York : un mouvement rapide contre le biais, qui piège les traders de cassure, puis se retourne. Si ton biais est haussier, une baisse matinale sous le bas asiatique n'est pas un signal de vente : c'est potentiellement ton opportunité d'achat.</p>
<div class="encadre"><p><strong>Repère pratique :</strong> l'ouverture de minuit heure de New York (07:00 heure locale en général). En biais haussier, on cherche à acheter <em>sous</em> ce prix. En biais baissier, à vendre au-dessus.</p></div>`,
  retenir: ['A-M-D : accumulation, manipulation, distribution', 'Judas swing = faux départ contre le biais', 'Acheter sous l\'ouverture en biais haussier'],
},
{
  id: 'temps-silver', module: 'Temps et sessions', titre: 'Le Silver Bullet', duree: 5,
  resume: 'Un modèle simple sur une fenêtre d\'une heure',
  contenu: `
<p>Le Silver Bullet est un des modèles ICT les plus mécaniques, adapté au scalping.</p>
<h3>Les fenêtres (heure de NY → heure locale en général)</h3>
<ul>
<li>03:00 - 04:00 NY → <strong>10:00 - 11:00</strong></li>
<li>10:00 - 11:00 NY → <strong>17:00 - 18:00</strong></li>
<li>14:00 - 15:00 NY → <strong>21:00 - 22:00</strong></li>
</ul>
<h3>Les règles</h3>
<ol>
<li>Identifie le DOL (liquidité évidente à prendre).</li>
<li>Dans la fenêtre, attends un <strong>displacement</strong> vers ce DOL qui crée un <strong>FVG</strong> (en 1 à 5 min).</li>
<li>Entrée sur le retour dans le FVG.</li>
<li>Stop derrière le swing qui a créé le FVG.</li>
<li>Cible : la liquidité visée. ICT demande au minimum 10 points de potentiel sur les indices.</li>
</ol>
<p>Pour toi, la fenêtre 17:00 - 18:00 (heure locale) est probablement la plus accessible. Teste-la en paper trading sur l'or et le BTC, avec un journal séparé, avant de l'adopter.</p>`,
  retenir: ['Fenêtres : 10h, 17h et 21h heure locale', 'Displacement → FVG → retour → entrée', 'Toujours un DOL clair avant'],
},
{
  id: 'temps-actifs', module: 'Temps et sessions', titre: 'BTC vs or : deux personnalités', duree: 5,
  resume: 'Adapter ta lecture à chaque actif',
  contenu: `
<table><tr><th></th><th>XAUUSD</th><th>BTCUSD</th></tr>
<tr><td>Horaires</td><td>Fermé le week-end, pause quotidienne d'environ 1h</td><td>24h/24, 7j/7</td></tr>
<tr><td>Sessions clés</td><td>Londres, NY, chevauchement</td><td>NY surtout, Asie active aussi</td></tr>
<tr><td>News sensibles</td><td>CPI, NFP, FOMC, taux réels, géopolitique</td><td>Les mêmes + news crypto, flux ETF</td></tr>
<tr><td>Comportement</td><td>Respecte bien les niveaux, mèches violentes sur news</td><td>Cascades de liquidations, sweeps profonds</td></tr>
<tr><td>Week-end</td><td>Gap possible à l'ouverture</td><td>Liquidité faible, mouvements trompeurs</td></tr></table>
<h3>Conséquences pratiques</h3>
<ul>
<li><strong>BTC</strong> : stops un peu plus larges ou entrées plus précises, les sweeps vont souvent plus loin que prévu. Méfie-toi du week-end et des heures creuses.</li>
<li><strong>Or</strong> : évite d'avoir une position ouverte à 15:30 (heure locale) les jours de CPI ou NFP, sauf si c'est ton plan.</li>
<li><strong>Spread</strong> : sur CFD, il s'élargit hors sessions et pendant les news. En scalping, ça peut représenter une grosse part de ton risque.</li>
</ul>`,
  retenir: ['Or : Londres + NY, très sensible aux news US', 'BTC : 24/7, sweeps profonds, prudence le week-end', 'Le spread compte énormément en scalping'],
},

/* ===================== MODULE 3 : TON MODELE OB 5 ETOILES ===================== */
{
  id: 'ob5-grille', module: 'Ton modèle : OB 5 étoiles', titre: 'La grille OB 5 étoiles', duree: 7,
  resume: 'Tes 5 critères, définis sans ambiguïté',
  contenu: `
<p>Ta grille ne vaut que si chaque critère est <strong>binaire</strong> : oui ou non, sans interprétation. Voici une version rigoureuse, codable en Pine Script.</p>
<table><tr><th>★</th><th>Critère</th><th>Validé si…</th></tr>
<tr><td>1</td><td><strong>Imbalance</strong></td><td>Le displacement qui part de l'OB laisse au moins un FVG.</td></tr>
<tr><td>2</td><td><strong>Tendance</strong></td><td>L'OB est dans le sens du dernier BOS H1.</td></tr>
<tr><td>3</td><td><strong>Equilibrium</strong></td><td>OB haussier sous 50% du dealing range H1 (baissier : au-dessus).</td></tr>
<tr><td>4</td><td><strong>Mitigation</strong></td><td>L'OB n'a jamais été retouché depuis sa création (fresh).</td></tr>
<tr><td>5</td><td><strong>Liquidité</strong></td><td>Avant de créer l'OB, le prix a pris un plus bas (haussier) ou un plus haut (baissier) significatif.</td></tr></table>
<h3>Comment l'utiliser</h3>
<ul>
<li>Note chaque setup sur 5 <strong>avant</strong> d'entrer, et écris la note dans la colonne Setup du journal (ex : "OB 4★").</li>
<li>Après 30 à 50 trades, compare le win rate et l'espérance des 5★, 4★ et 3★. C'est comme ça que tu sauras quels critères comptent vraiment.</li>
</ul>
<div class="encadre attention"><p><strong>Honnêteté :</strong> la grille est une hypothèse à valider, pas une garantie. Tant qu'un backtest et un journal sur 50+ trades n'ont pas montré d'edge, considère-la comme un filtre en test.</p></div>`,
  retenir: ['Chaque critère doit être oui/non', 'Note avant d\'entrer, jamais après', 'Compare 5★ vs 4★ vs 3★ après 30+ trades'],
  exercice: 'Reprends tes 10 derniers trades et note-les a posteriori sur la grille. Est-ce que les meilleurs trades avaient plus d\'étoiles ?'
},
{
  id: 'ob5-topdown', module: 'Ton modèle : OB 5 étoiles', titre: 'Top-down : H1 pour analyser, 15 min pour exécuter', duree: 6,
  resume: 'Ta routine d\'analyse en 5 étapes',
  contenu: `
<ol>
<li><strong>H4 / Daily (2 min)</strong> : dans quel sens va le marché ? Y a-t-il un gros FVG ou une liquidité HTF proche ? C'est le contexte.</li>
<li><strong>H1 : structure</strong> : dernier BOS, biais haussier ou baissier.</li>
<li><strong>H1 : range et DOL</strong> : dealing range, equilibrium, liquidité visée.</li>
<li><strong>H1 : zone</strong> : OB ou FVG en discount (achat) ou premium (vente), noté sur la grille 5★. Pose une alerte dessus.</li>
<li><strong>15 min : exécution</strong> : quand le prix arrive dans la zone, tu attends un signal (voir la leçon suivante).</li>
</ol>
<h3>La règle d'or</h3>
<p>Le 15 min ne <strong>contredit jamais</strong> le H1. Si le H1 est haussier, un CHoCH baissier en 15 min dans ta zone d'achat n'est pas une vente : c'est le pullback que tu attends. Tu cherches un CHoCH <em>haussier</em> en 15 min pour entrer.</p>
<div class="encadre astuce"><p>Fais l'analyse H1 <strong>avant</strong> la killzone, avec les alertes posées. Pendant la killzone, tu n'analyses plus : tu exécutes ton plan ou tu ne fais rien.</p></div>`,
  retenir: ['HTF = contexte, H1 = biais et zone, 15 min = entrée', 'Le 15 min ne contredit jamais le H1', 'Analyse avant la killzone, exécution pendant'],
},
{
  id: 'ob5-entrees', module: 'Ton modèle : OB 5 étoiles', titre: 'Les 3 façons d\'entrer', duree: 6,
  resume: 'Limite, confirmation, ou FVG de confirmation',
  contenu: `
<h3>1. Entrée limite (agressive)</h3>
<p>Ordre limite posé sur l'OB (open ou mean threshold), stop sous l'OB.</p>
<ul><li>+ Meilleur prix, RR maximal, tu n'as pas besoin d'être devant l'écran.</li>
<li>− Tu prends tous les trades où l'OB casse. Win rate plus faible.</li></ul>
<h3>2. Entrée sur confirmation (CHoCH 15 min)</h3>
<p>Le prix entre dans l'OB H1. Tu attends un CHoCH haussier en 15 min, puis tu entres sur le retour dans le petit OB ou FVG 15 min qui a causé ce CHoCH. Stop sous le plus bas de la réaction.</p>
<ul><li>+ Filtre beaucoup de faux setups, win rate plus élevé.</li>
<li>− Tu rates les départs directs, il faut être devant l'écran.</li></ul>
<h3>3. FVG de confirmation</h3>
<p>Variante plus rapide : dès que le displacement 15 min crée un FVG en quittant la zone, ordre limite dans ce FVG.</p>
<div class="encadre"><p>Vu ton objectif de win rate élevé, l'entrée sur confirmation (2) est la plus cohérente. Mais ne change pas de méthode d'entrée en cours de série de tests : une seule variable à la fois.</p></div>`,
  retenir: ['Limite = meilleur RR, win rate plus bas', 'Confirmation = win rate plus haut, RR plus bas', 'Une seule méthode d\'entrée par série de test'],
},
{
  id: 'ob5-gestion', module: 'Ton modèle : OB 5 étoiles', titre: 'Stop, cibles et gestion du trade', duree: 6,
  resume: 'Où sortir, quand protéger',
  contenu: `
<h3>Le stop</h3>
<ul>
<li>Derrière le <strong>niveau qui invalide l'idée</strong> : sous l'OB (achat) ou le swing de confirmation, plus une marge pour le spread.</li>
<li>Pas sur un chiffre rond ni juste sous un equal low évident : c'est là que les sweeps vont chercher.</li>
<li>Un stop un peu plus large aide souvent. Logique : sur BTC et l'or, les sweeps dépassent souvent les zones de quelques ticks.</li>
</ul>
<h3>Les cibles</h3>
<ul>
<li><strong>TP1</strong> : la liquidité interne la plus proche (dernier swing high du pullback).</li>
<li><strong>TP2</strong> : le DOL (liquidité externe : PDH, EQH, haut du range).</li>
</ul>
<h3>Gestion</h3>
<ul>
<li><strong>Partiel</strong> à TP1 (par exemple 50%) : sécurise et augmente le win rate apparent.</li>
<li><strong>Break-even</strong> : seulement après un nouveau BOS en 15 min dans ton sens, pas après quelques points. Un BE trop tôt transforme beaucoup de gagnants en trades nuls.</li>
<li>Ne <strong>jamais</strong> élargir un stop en cours de trade.</li>
</ul>`,
  retenir: ['Stop derrière l\'invalidation + marge spread', 'TP1 = liquidité interne, TP2 = DOL', 'BE après un BOS, pas avant', 'Ne jamais élargir un stop'],
},

/* ===================== MODULE 4 : GESTION DU RISQUE ===================== */
{
  id: 'risque-taille', module: 'Gestion du risque', titre: 'Calculer la taille de position', duree: 6,
  resume: 'La seule formule à connaître par cœur',
  contenu: `
<pre><code>Taille = Montant risqué / (Distance du stop × Valeur du point)</code></pre>
<h3>Exemple or, compte de 500 $</h3>
<p>Risque 1% = <strong>5 $</strong>. Sur XAUUSD, 1 lot standard = 100 onces, donc un mouvement de 1 $ = 100 $ par lot. Stop à 3 $ de l'entrée :</p>
<pre><code>5 / (3 × 100) = 0,0167 lot → arrondi à 0,01 lot
Risque réel = 3 × 100 × 0,01 = 3 $ (0,6%)</code></pre>
<p>Arrondis toujours <strong>vers le bas</strong>.</p>
<h3>La contrainte des petits comptes</h3>
<p>Avec 500 $ et un lot minimum de 0,01, ton stop maximal sur l'or à 1% de risque est de <strong>5 $</strong> (5 / (100 × 0,01)). Au-delà, tu risques plus que 1%. Tes setups doivent donc avoir des stops serrés, ce qui colle avec le scalping en 15 min.</p>
<h3>BTC</h3>
<p>Sur la plupart des CFD BTCUSD, 1 lot = 1 BTC : un mouvement de 1 $ = 1 $ par lot. Stop de 300 $, risque 5 $ → 5 / 300 = 0,016 → 0,01 lot. <strong>Vérifie la taille de contrat chez ton broker</strong>, elle varie.</p>
<div class="encadre astuce"><p>Note la valeur du point de chaque actif dans ton journal. En paper trading, risque toujours le même pourcentage que celui prévu en réel, sinon tes stats ne t'apprennent rien sur ta future psychologie.</p></div>`,
  retenir: ['Taille = risque / (stop × valeur du point)', 'Arrondir vers le bas', 'Or : 0,01 lot = 1 $ par dollar de mouvement', 'Vérifier la taille de contrat chez le broker'],
},
{
  id: 'risque-esperance', module: 'Gestion du risque', titre: 'Win rate, RR et espérance', duree: 7,
  resume: 'Pourquoi 75% de win rate n\'est pas le vrai objectif',
  contenu: `
<p>Le chiffre qui décide si tu gagnes de l'argent, c'est l'<strong>espérance</strong> par trade, mesurée en R (1R = ton risque).</p>
<pre><code>Espérance = WR × Gain moyen − (1 − WR) × Perte moyenne</code></pre>
<h3>Le win rate minimum</h3>
<pre><code>WR minimum = 1 / (1 + RR)</code></pre>
<table><tr><th>RR moyen</th><th>WR pour être à zéro</th></tr>
<tr><td>0,5</td><td>66,7%</td></tr><tr><td>1</td><td>50%</td></tr>
<tr><td>1,5</td><td>40%</td></tr><tr><td>2</td><td>33,3%</td></tr><tr><td>3</td><td>25%</td></tr></table>
<h3>Comparer deux profils</h3>
<ul>
<li>75% de WR avec un RR de 0,5 : 0,75 × 0,5 − 0,25 × 1 = <strong>+0,125 R</strong> par trade.</li>
<li>40% de WR avec un RR de 2 : 0,4 × 2 − 0,6 × 1 = <strong>+0,2 R</strong> par trade.</li>
</ul>
<p>Le second gagne plus, avec un win rate presque deux fois plus bas.</p>
<div class="encadre attention"><p><strong>Vérité pas agréable :</strong> un win rate de 75% est atteignable, mais presque toujours au prix d'un petit RR (prises de profit rapides, BE fréquents). Garde ton objectif de 75% si tu veux, mais mesure-toi d'abord sur l'<strong>espérance en R</strong>. Calcule-la dans ton journal ("RR réalisé moyen").</p></div>`,
  retenir: ['Espérance = WR × G − (1−WR) × P', 'WR mini = 1 / (1 + RR)', 'Un haut WR avec petit RR peut perdre de l\'argent', 'Juge-toi sur l\'espérance en R'],
},
{
  id: 'risque-drawdown', module: 'Gestion du risque', titre: 'Drawdown et séries de pertes', duree: 6,
  resume: 'Les maths qui protègent ton compte',
  contenu: `
<h3>L'asymétrie des pertes</h3>
<table><tr><th>Perte</th><th>Gain nécessaire pour revenir</th></tr>
<tr><td>−10%</td><td>+11,1%</td></tr><tr><td>−20%</td><td>+25%</td></tr>
<tr><td>−30%</td><td>+42,9%</td></tr><tr><td>−50%</td><td>+100%</td></tr></table>
<h3>Les séries de pertes sont normales</h3>
<p>Avec un win rate de 50%, sur 100 trades, une série de <strong>6 à 7 pertes d'affilée</strong> est statistiquement attendue. À 60%, environ 5. Si tu risques 5% par trade, 7 pertes = environ −30%. À 1%, environ −7%. C'est toute la différence entre survivre et exploser.</p>
<h3>Règles de protection à adopter</h3>
<ul>
<li><strong>Risque par trade</strong> : 0,5 à 1%.</li>
<li><strong>Perte max par jour</strong> : 2 à 3R. Atteinte = tu fermes la plateforme.</li>
<li><strong>Perte max par semaine</strong> : 5 à 6R. Atteinte = pause et revue du journal.</li>
<li><strong>Max 2 à 3 trades par jour</strong> en scalping. Au-delà, c'est souvent de l'overtrading.</li>
</ul>`,
  retenir: ['−50% demande +100%', '6-7 pertes d\'affilée sont normales à 50% de WR', 'Max 1% par trade, 3R par jour', 'Les règles s\'écrivent avant, pas pendant'],
},
{
  id: 'risque-plan500', module: 'Gestion du risque', titre: 'Plan de passage en réel avec un petit compte', duree: 7,
  resume: 'Critères objectifs avant de mettre de l\'argent',
  contenu: `
<p>Passer en réel trop tôt est la façon la plus rapide de perdre son premier capital. Voici des <strong>critères objectifs</strong> à remplir en paper trading d'abord :</p>
<ol>
<li><strong>Au moins 50 trades</strong> avec le même setup et les mêmes règles.</li>
<li><strong>Espérance positive</strong> (RR réalisé moyen > 0,2R par exemple).</li>
<li><strong>Drawdown max</strong> inférieur à 10R sur la période.</li>
<li><strong>Respect du plan</strong> : au moins 90% des trades conformes à tes règles (à noter dans la colonne Notes).</li>
<li>Résultat positif sur au moins <strong>2 mois</strong> consécutifs.</li>
</ol>
<h3>Le passage progressif</h3>
<ul>
<li><strong>Phase 1</strong> : réel avec 0,5% de risque pendant 30 trades. Objectif : vérifier que tes résultats restent proches du paper (le stress change tout).</li>
<li><strong>Phase 2</strong> : 1% de risque si la phase 1 est conforme.</li>
<li>Si les résultats réels sont très inférieurs au paper : retour en paper, et analyse de ce qui a changé (exécution, psychologie, spread).</li>
</ul>
<div class="encadre"><p><strong>Objectif doubler le compte :</strong> doubler un compte demande +100%. Avec une espérance de 0,2R et 1% de risque, il faut environ 350 à 500 trades. C'est réaliste sur 1 à 2 ans, pas en 3 mois. Tout plan qui promet plus vite demande de risquer beaucoup plus.</p></div>`,
  retenir: ['50 trades minimum avant le réel', 'Commencer à 0,5% de risque', 'Doubler le compte = des centaines de trades', 'Paper et réel doivent donner des résultats proches'],
},
{
  id: 'risque-couts', module: 'Gestion du risque', titre: 'Spread, commissions et slippage', duree: 5,
  resume: 'Le coût caché du scalping',
  contenu: `
<p>En scalping, les coûts mangent une part énorme de l'espérance, parce que les stops sont petits.</p>
<h3>Exemple</h3>
<p>Stop de 2 $ sur l'or, spread de 0,30 $ : le spread représente déjà <strong>15% de ton risque</strong> à chaque trade. Si ton espérance brute est de 0,15R, le spread peut l'effacer entièrement.</p>
<h3>Comment le limiter</h3>
<ul>
<li>Trade pendant les sessions liquides (Londres, New York), où le spread est le plus serré.</li>
<li>Évite les minutes autour des news : le spread s'élargit et le slippage explose.</li>
<li>Préfère les ordres limites quand c'est possible : pas de slippage à l'entrée.</li>
<li>Compare les brokers sur le <strong>coût total</strong> (spread + commission), pas seulement le spread affiché.</li>
</ul>
<div class="encadre attention"><p>Le paper trading TradingView ne simule pas parfaitement le spread réel et le slippage de ton futur broker. Ajoute mentalement une marge de coûts à tes résultats paper avant de juger un setup.</p></div>`,
  retenir: ['Petit stop = coûts proportionnellement énormes', 'Trader aux heures liquides', 'Le paper sous-estime les coûts réels'],
},

/* ===================== MODULE 5 : PSYCHOLOGIE ET PROCESS ===================== */
{
  id: 'psy-erreurs', module: 'Psychologie et process', titre: 'Les 6 erreurs qui tuent les comptes', duree: 6,
  resume: 'Les reconnaître avant qu\'elles coûtent',
  contenu: `
<ol>
<li><strong>Revenge trading</strong> : reprendre un trade juste après une perte pour "se refaire". Antidote : après 2 pertes d'affilée, pause de 30 min minimum.</li>
<li><strong>FOMO</strong> : entrer parce que ça part sans toi. Antidote : si le prix a quitté ta zone, le trade n'existe plus.</li>
<li><strong>Déplacer son stop</strong> : transformer une perte de 1R en perte de 3R. Antidote : stop posé à l'entrée, jamais élargi.</li>
<li><strong>Couper les gagnants trop tôt</strong> par peur de rendre les gains. Antidote : TP posés à l'avance, partiels définis dans le plan.</li>
<li><strong>Overtrading</strong> : trader par ennui hors killzone. Antidote : maximum de trades par jour, et pas de trade sans note 5★.</li>
<li><strong>Changer de méthode après 3 pertes</strong>. Antidote : juger une méthode sur 50 trades, pas sur 3.</li>
</ol>
<div class="encadre"><p>Ajoute une colonne ou une note "Erreur" dans ton journal. Après un mois, tu verras clairement laquelle te coûte le plus. C'est souvent une seule.</p></div>`,
  retenir: ['2 pertes d\'affilée = pause', 'Prix sorti de la zone = trade annulé', 'Juger une méthode sur 50 trades'],
},
{
  id: 'psy-routine', module: 'Psychologie et process', titre: 'Ta routine avant et après la séance', duree: 5,
  resume: 'Le process bat la motivation',
  contenu: `
<h3>Avant (15 min)</h3>
<ol>
<li>Calendrier économique : y a-t-il CPI, NFP, FOMC aujourd'hui ? À quelle heure locale ?</li>
<li>Analyse H1 de BTC et de l'or : biais, range, DOL, zones.</li>
<li>Alertes posées sur les zones.</li>
<li>Écrire le plan en 3 lignes : "Si le prix vient en X, je cherche Y, invalidation Z".</li>
<li>État personnel : fatigué, énervé, pressé ? Si oui, taille réduite ou pas de trading.</li>
</ol>
<h3>Après (10 min)</h3>
<ol>
<li>Remplir le journal avec les trades de la séance.</li>
<li>Remplir la colonne Setup (note sur 5★) et Notes.</li>
<li>Une question : <strong>ai-je respecté mon plan ?</strong> Oui/non, indépendamment du résultat.</li>
<li>Capture d'écran des trades, avant/après.</li>
</ol>
<div class="encadre astuce"><p>Un trade perdant qui respecte le plan est un <strong>bon trade</strong>. Un trade gagnant hors plan est un <strong>mauvais trade</strong>. Note-toi sur le process, pas sur le P&L du jour.</p></div>`,
  retenir: ['Plan écrit avant la séance', 'Note le respect du plan, pas seulement le résultat', 'Journal rempli après chaque séance'],
},
{
  id: 'psy-stats', module: 'Psychologie et process', titre: 'Combien de trades pour savoir si ça marche ?', duree: 6,
  resume: 'La statistique contre l\'illusion',
  contenu: `
<p>Après 10 trades à 70% de gains, on a envie de croire qu'on a trouvé. Le problème : avec si peu de trades, <strong>le hasard domine</strong>.</p>
<h3>La marge d'erreur du win rate</h3>
<p>Pour un win rate mesuré autour de 50%, l'intervalle de confiance à 95% est environ :</p>
<table><tr><th>Trades</th><th>Marge d'erreur</th><th>Ton "vrai" WR est entre</th></tr>
<tr><td>20</td><td>± 22 pts</td><td>28% et 72%</td></tr>
<tr><td>50</td><td>± 14 pts</td><td>36% et 64%</td></tr>
<tr><td>100</td><td>± 10 pts</td><td>40% et 60%</td></tr>
<tr><td>400</td><td>± 5 pts</td><td>45% et 55%</td></tr></table>
<p>Avec 20 trades, un setup à 50% de WR peut facilement afficher 70%, ou 30%. Ce n'est pas un signal.</p>
<h3>Conséquences</h3>
<ul>
<li>Ne compare pas des variantes de setup sur 10 trades chacune.</li>
<li>Le <strong>backtest</strong> (replay TradingView, ou Pine strategy) permet d'accumuler 100+ trades bien plus vite que le paper en direct.</li>
<li>Méfie-toi de l'<strong>optimisation</strong> : si tu ajustes les paramètres jusqu'à ce que le backtest soit beau, tu mesures du bruit. Teste toujours sur une période que tu n'as pas utilisée pour régler.</li>
</ul>`,
  retenir: ['20 trades = marge d\'erreur de ±22 points', '100 trades minimum pour une conclusion sérieuse', 'Toujours valider sur une période non utilisée pour l\'optimisation'],
},

/* ===================== MODULE 6 : PINE SCRIPT ===================== */
{
  id: 'pine-bases', module: 'Pine Script', titre: 'Structure d\'un script Pine v6', duree: 7,
  resume: 'Le squelette de tout indicateur',
  contenu: `
<pre><code>//@version=6
indicator("Mon indicateur", overlay = true)

// Paramètres modifiables
longueur = input.int(20, "Longueur EMA", minval = 1)

// Calculs
ema = ta.ema(close, longueur)

// Affichage
plot(ema, "EMA", color = color.orange, linewidth = 2)</code></pre>
<h3>Le point clé : le script tourne bougie par bougie</h3>
<p>Ton code est exécuté <strong>une fois pour chaque bougie</strong> de l'historique, de la plus ancienne à la plus récente, puis à chaque tick sur la bougie en cours. <code>close</code> désigne la clôture de la bougie en cours d'exécution, pas de la dernière du graphique.</p>
<h3>Les types de scripts</h3>
<ul>
<li><code>indicator()</code> : affiche des informations.</li>
<li><code>strategy()</code> : simule des trades et produit un rapport de backtest.</li>
<li><code>library()</code> : fonctions réutilisables.</li>
</ul>
<h3>Les variables intégrées à connaître</h3>
<p><code>open high low close volume</code>, <code>bar_index</code> (numéro de la bougie), <code>time</code>, <code>syminfo.mintick</code> (plus petit pas de prix), <code>timeframe.period</code>.</p>`,
  retenir: ['Toujours commencer par //@version=6', 'Le script s\'exécute une fois par bougie', 'indicator, strategy ou library'],
  exercice: 'Avec Jarvis, crée un indicateur qui affiche une EMA 50 et colore le fond en vert quand le prix est au-dessus.'
},
{
  id: 'pine-series', module: 'Pine Script', titre: 'Séries, historique et var', duree: 7,
  resume: 'Les concepts qui bloquent tous les débutants',
  contenu: `
<h3>L'opérateur d'historique []</h3>
<p><code>close[1]</code> = clôture de la bougie précédente, <code>high[2]</code> = plus haut d'il y a deux bougies. C'est ce qui permet de détecter un FVG :</p>
<pre><code>fvgHaussier = low &gt; high[2]</code></pre>
<h3>var : garder une valeur d'une bougie à l'autre</h3>
<p>Sans <code>var</code>, une variable est recalculée à chaque bougie. Avec <code>var</code>, elle n'est initialisée qu'une fois et garde sa valeur :</p>
<pre><code>var float dernierHaut = na
pivot = ta.pivothigh(high, 3, 3)
if not na(pivot)
    dernierHaut := pivot</code></pre>
<p>Note l'opérateur <code>:=</code> pour <strong>réassigner</strong> une variable existante, et <code>=</code> pour la déclarer.</p>
<h3>na : pas de valeur</h3>
<p><code>na</code> signifie "pas de donnée". Teste-le avec <code>na(x)</code>, jamais avec <code>x == na</code>. En v6, une variable <code>bool</code> ne peut pas valoir na, et un nombre n'est plus converti automatiquement en booléen : écris <code>if not na(pivot)</code>, pas <code>if pivot</code>.</p>
<h3>Les pivots</h3>
<p><code>ta.pivothigh(high, 3, 3)</code> renvoie le plus haut quand il est confirmé, c'est-à-dire <strong>3 bougies après</strong>. Le pivot est donc toujours détecté en retard : c'est normal et c'est ce qui évite le repaint.</p>`,
  retenir: ['x[1] = valeur de la bougie précédente', 'var = mémoire entre les bougies', ':= pour réassigner', 'Tester na avec na(x)'],
},
{
  id: 'pine-fvg', module: 'Pine Script', titre: 'Coder un détecteur de FVG', duree: 8,
  resume: 'Ton premier critère de la grille en code',
  contenu: `
<pre><code>//@version=6
indicator("FVG simple", overlay = true, max_boxes_count = 200)

seuilAtr = input.float(0.0, "Taille mini (en ATR)", step = 0.1)
atr = ta.atr(14)

fvgHaut = low &gt; high[2] and (low - high[2]) &gt;= atr * seuilAtr
fvgBas  = high &lt; low[2] and (low[2] - high) &gt;= atr * seuilAtr

if fvgHaut
    box.new(bar_index - 2, low, bar_index + 10, high[2],
         bgcolor = color.new(color.green, 80), border_color = na)
if fvgBas
    box.new(bar_index - 2, low[2], bar_index + 10, high,
         bgcolor = color.new(color.red, 80), border_color = na)</code></pre>
<h3>Ce qu'il faut comprendre</h3>
<ul>
<li><code>box.new(gauche, haut, droite, bas)</code> : coordonnées en numéro de bougie et en prix.</li>
<li>Le filtre ATR élimine les micro-gaps sans intérêt. À 0, tout est affiché.</li>
<li><code>max_boxes_count</code> : par défaut Pine n'affiche que les 50 dernières boîtes, maximum 500.</li>
<li><code>ta.atr(14)</code> est calculé en dehors du <code>if</code> : les fonctions <code>ta.*</code> doivent tourner à chaque bougie pour être justes.</li>
</ul>
<h3>Étape suivante</h3>
<p>Stocker les FVG dans un tableau (<code>array&lt;box&gt;</code>) pour détecter quand le prix revient dedans, et supprimer ceux qui sont comblés. C'est exactement la logique du critère <strong>mitigation</strong> pour tes OB.</p>`,
  retenir: ['box.new(gauche, haut, droite, bas)', 'Calculer ta.* hors des if', 'max_boxes_count jusqu\'à 500'],
  exercice: 'Demande à Jarvis d\'ajouter : la boîte s\'arrête quand le prix revient au CE (50%) du FVG.'
},
{
  id: 'pine-dessins', module: 'Pine Script', titre: 'Tableaux, boîtes et gestion de la mémoire', duree: 7,
  resume: 'Suivre des zones dans le temps',
  contenu: `
<p>Pour gérer des zones (OB, FVG) qui vivent plusieurs bougies, on les stocke dans un <strong>array</strong>.</p>
<pre><code>var array&lt;box&gt; zones = array.new&lt;box&gt;()

if fvgHaut
    zones.push(box.new(bar_index - 2, low, bar_index, high[2],
         bgcolor = color.new(color.green, 80), border_color = na))

// À chaque bougie : prolonger ou supprimer les zones
if zones.size() &gt; 0
    for i = zones.size() - 1 to 0
        z = zones.get(i)
        if close &lt; z.get_bottom()
            z.delete()
            zones.remove(i)
        else
            z.set_right(bar_index)</code></pre>
<h3>Points importants</h3>
<ul>
<li><code>var</code> devant le tableau : sinon il est recréé vide à chaque bougie.</li>
<li>Parcourir à <strong>l'envers</strong> (de la fin vers 0) quand on supprime des éléments, pour ne pas sauter d'index.</li>
<li>Limiter la taille : si le tableau dépasse 50 éléments, supprimer le plus ancien avec <code>zones.shift().delete()</code>.</li>
</ul>
<p>Ce schéma "créer, stocker, mettre à jour, supprimer" est la colonne vertébrale de ton futur indicateur OB 5 étoiles.</p>`,
  retenir: ['var array&lt;box&gt; pour mémoriser des zones', 'Boucle à l\'envers pour supprimer', 'Toujours limiter la taille des tableaux'],
},
{
  id: 'pine-repaint', module: 'Pine Script', titre: 'Repaint, MTF et alertes', duree: 7,
  resume: 'Éviter l\'indicateur qui ment',
  contenu: `
<h3>Le repaint</h3>
<p>Un indicateur "repaint" quand ses signaux historiques ne sont pas ceux qu'il aurait affichés en temps réel. Il paraît parfait en backtest, puis déçoit en live.</p>
<p>Causes principales :</p>
<ul>
<li>Utiliser la <strong>bougie en cours</strong> (non clôturée) pour générer un signal. Solution : <code>barstate.isconfirmed</code> ou décaler d'une bougie.</li>
<li>Mal utiliser <code>request.security()</code> pour lire un autre timeframe.</li>
</ul>
<h3>Lire le H1 depuis le 15 min sans repaint</h3>
<pre><code>closeH1 = request.security(syminfo.tickerid, "60", close[1],
     lookahead = barmerge.lookahead_on)</code></pre>
<p>La combinaison <code>close[1]</code> + <code>lookahead_on</code> donne la dernière clôture H1 <strong>confirmée</strong>, identique en historique et en temps réel.</p>
<h3>Les alertes</h3>
<pre><code>if signalAchat and barstate.isconfirmed
    alert("OB 5★ haussier touché sur " + syminfo.ticker,
         alert.freq_once_per_bar_close)</code></pre>
<p>Ensuite, sur TradingView : créer une alerte sur l'indicateur, condition "Any alert() function call". Tu peux la recevoir sur ton téléphone.</p>`,
  retenir: ['Signal sur bougie confirmée = pas de repaint', 'MTF : close[1] + lookahead_on', 'alert() + "Any alert() function call"'],
},
{
  id: 'pine-ob5', module: 'Pine Script', titre: 'Architecture de ton indicateur OB 5★', duree: 8,
  resume: 'Le plan de construction, étape par étape',
  contenu: `
<p>Un gros indicateur se construit <strong>par couches</strong>, en testant chaque couche avant la suivante.</p>
<ol>
<li><strong>Structure</strong> : pivots (<code>ta.pivothigh/low</code>), dernier swing high et low, détection du BOS sur clôture. Afficher des labels "BOS" pour vérifier visuellement.</li>
<li><strong>Détection OB</strong> : au moment d'un BOS haussier, remonter les bougies pour trouver la dernière bougie baissière avant l'impulsion. Créer une boîte.</li>
<li><strong>★ Imbalance</strong> : y a-t-il un FVG entre l'OB et le BOS ?</li>
<li><strong>★ Tendance</strong> : direction du dernier BOS H1 (via <code>request.security</code>, sans repaint).</li>
<li><strong>★ Equilibrium</strong> : calculer 50% du range swing low → swing high, comparer au milieu de l'OB.</li>
<li><strong>★ Mitigation</strong> : suivre si le prix est revenu dans la boîte depuis sa création.</li>
<li><strong>★ Liquidité</strong> : le swing low qui précède l'OB a-t-il cassé un swing low antérieur ?</li>
<li><strong>Score</strong> : additionner les étoiles, afficher "OB 4★" sur la boîte, colorer selon le score, filtre "score minimum".</li>
<li><strong>Alerte</strong> quand le prix touche un OB au-dessus du score minimum.</li>
</ol>
<div class="encadre astuce"><p>Avant d'ajouter la couche suivante, vérifie la précédente sur 20 cas visuels. La plupart des bugs Pine sont des erreurs de décalage d'index ([1] au lieu de [2]) qu'on ne voit qu'en regardant le chart.</p></div>
<p>Une fois l'indicateur fiable, transforme-le en <code>strategy()</code> pour backtester chaque niveau d'étoiles séparément.</p>`,
  retenir: ['Construire par couches testées', 'Score = somme des 5 critères', 'Indicator d\'abord, strategy ensuite pour backtester'],
},

/* ===================== MODULE 7 : MACRO BTC ET OR ===================== */
{
  id: 'macro-calendrier', module: 'Macro BTC et or', titre: 'Le calendrier économique qui compte', duree: 6,
  resume: 'CPI, NFP, FOMC : quand et pourquoi',
  contenu: `
<table><tr><th>Publication</th><th>Quand</th><th>Heure locale*</th></tr>
<tr><td><strong>NFP</strong> (emploi US)</td><td>1er vendredi du mois</td><td>15:30</td></tr>
<tr><td><strong>CPI</strong> (inflation US)</td><td>Mi-mois</td><td>15:30</td></tr>
<tr><td><strong>FOMC</strong> (taux Fed)</td><td>8 fois par an</td><td>21:00, conférence 21:30</td></tr>
<tr><td>PCE (inflation préférée de la Fed)</td><td>Fin de mois</td><td>15:30</td></tr>
<tr><td>Inscriptions chômage</td><td>Chaque jeudi</td><td>15:30</td></tr></table>
<p class="petit muted">* Avec le décalage habituel de 7 heures avec New York.</p>
<h3>Pourquoi ça bouge autant</h3>
<p>Ces chiffres changent les anticipations sur les <strong>taux de la Fed</strong>. Des taux attendus plus bas = dollar plus faible et liquidité plus abondante, généralement favorable à l'or et au BTC. L'inverse les pénalise. Ce qui compte, ce n'est pas le chiffre, mais l'<strong>écart avec le consensus</strong>.</p>
<h3>Règles pratiques en scalping</h3>
<ul>
<li>Pas de nouvelle entrée dans les <strong>15 min avant</strong> une news rouge.</li>
<li>Position ouverte avant la news : soit tu la fermes, soit tu as décidé à l'avance de la garder avec stop fixé.</li>
<li>Après la news, attends que la première bougie 15 min clôture. Le premier mouvement est souvent un sweep.</li>
</ul>
<p>Source simple : le calendrier économique de TradingView ou Forex Factory, filtré sur USD et impact élevé.</p>`,
  retenir: ['NFP et CPI à 15:30, FOMC à 21:00 heure locale', 'C\'est l\'écart avec le consensus qui fait bouger', 'Pas d\'entrée 15 min avant une news rouge'],
},
{
  id: 'macro-or', module: 'Macro BTC et or', titre: 'Ce qui fait bouger l\'or', duree: 6,
  resume: 'Taux réels, dollar, banques centrales, peur',
  contenu: `
<h3>1. Les taux réels</h3>
<p>L'or ne rapporte pas d'intérêt. Quand les <strong>taux réels</strong> (taux nominal moins inflation, mesurés par le rendement des TIPS 10 ans) montent, détenir de l'or coûte plus cher en opportunité : pression baissière. Quand ils baissent, l'or est favorisé. Cette relation a été historiquement forte, mais elle s'est affaiblie depuis 2022.</p>
<h3>2. Le dollar (DXY)</h3>
<p>L'or est coté en dollars. Un dollar fort le rend plus cher pour le reste du monde : relation <strong>généralement inverse</strong>, mais pas systématique.</p>
<h3>3. Les banques centrales</h3>
<p>Depuis 2022, les banques centrales (Chine, Pologne, Turquie, Inde…) achètent de l'or à un rythme historiquement élevé, pour diversifier leurs réserves hors du dollar. C'est un soutien de fond qui explique en partie pourquoi l'or a monté malgré des taux élevés.</p>
<h3>4. La peur</h3>
<p>Crises géopolitiques, tensions bancaires, guerre : l'or joue son rôle de <strong>valeur refuge</strong>. Ces mouvements sont souvent brutaux et ne respectent pas l'analyse technique au début.</p>
<div class="encadre"><p><strong>En scalping</strong>, la macro ne te donne pas d'entrée. Elle te donne le <strong>contexte</strong> : tu peux privilégier les achats quand le fond est porteur, et réduire ta taille les jours de forte incertitude.</p></div>`,
  retenir: ['Taux réels en hausse = pression sur l\'or', 'Dollar fort = généralement or faible', 'Achats des banques centrales = soutien de fond', 'La macro donne le contexte, pas l\'entrée'],
},
{
  id: 'macro-btc', module: 'Macro BTC et or', titre: 'Ce qui fait bouger le Bitcoin', duree: 7,
  resume: 'Liquidité, ETF, halving, dérivés',
  contenu: `
<h3>1. La liquidité mondiale</h3>
<p>Le BTC est très sensible à la quantité de monnaie en circulation et aux taux. Quand les banques centrales assouplissent, il a tendance à monter. Il se comporte souvent comme un actif <strong>risk-on</strong>, corrélé (de façon variable) au Nasdaq.</p>
<h3>2. Les ETF spot</h3>
<p>Depuis janvier 2024, des ETF Bitcoin spot sont autorisés aux États-Unis. Leurs <strong>flux quotidiens</strong> (entrées / sorties) sont devenus un indicateur suivi : de fortes entrées montrent une demande institutionnelle. Ils ont aussi renforcé l'importance de la session américaine.</p>
<h3>3. Le halving</h3>
<p>Tous les 210 000 blocs (environ 4 ans), la récompense des mineurs est divisée par deux. Le dernier a eu lieu en <strong>avril 2024</strong>, le prochain est attendu vers 2028. Historiquement, les cycles haussiers ont suivi les halvings, mais avec seulement quelques cycles observés, c'est une tendance, pas une loi.</p>
<h3>4. Les dérivés</h3>
<ul>
<li><strong>Funding rate</strong> (perpétuels) : très positif = beaucoup de longs à effet de levier, risque de flush vers le bas. Très négatif = l'inverse.</li>
<li><strong>Open interest</strong> qui monte fort avec le prix : mouvement porté par le levier, fragile.</li>
<li><strong>Liquidations</strong> : les cascades créent les mèches énormes typiques du BTC. Ce sont des prises de liquidité géantes, au sens ICT.</li>
</ul>`,
  retenir: ['BTC = actif risk-on sensible à la liquidité', 'Flux ETF = demande institutionnelle', 'Halving avril 2024, prochain vers 2028', 'Funding extrême = risque de flush'],
},
{
  id: 'macro-intermarche', module: 'Macro BTC et or', titre: 'Lire les corrélations entre marchés', duree: 5,
  resume: 'DXY, Nasdaq, rendements : ton tableau de bord',
  contenu: `
<p>Garde un layout TradingView avec 4 graphiques en H1 : <strong>DXY, US10Y, NAS100, et l'actif que tu trades</strong>.</p>
<h3>Ce que tu cherches</h3>
<ul>
<li><strong>Confirmation</strong> : tu veux acheter l'or, le DXY casse une structure à la baisse. Les deux racontent la même histoire : setup renforcé.</li>
<li><strong>Divergence</strong> : tu veux acheter le BTC, mais le Nasdaq vient de faire un MSS baissier. Prudence, ou taille réduite.</li>
</ul>
<h3>La divergence SMT</h3>
<p>Concept ICT : deux actifs normalement corrélés (BTC et ETH, ou or et argent) font un mouvement différent sur une prise de liquidité. Exemple : le BTC fait un plus bas plus bas (sweep de SSL), mais l'ETH fait un plus bas plus haut. Ce désaccord signale souvent que le sweep était une manipulation et que la hausse est proche.</p>
<div class="encadre attention"><p>Les corrélations changent dans le temps. Ne prends jamais une corrélation comme une règle fixe : vérifie qu'elle tient en ce moment avant de l'utiliser.</p></div>`,
  retenir: ['Layout : DXY, US10Y, NAS100 + ton actif', 'Confirmation = setup renforcé, divergence = prudence', 'SMT : deux actifs corrélés qui ne font pas pareil sur un sweep'],
  exercice: 'Crée le layout 4 graphiques sur TradingView et observe pendant une semaine la relation DXY / or en H1.'
},
];
