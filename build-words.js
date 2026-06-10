/**
 * build-words.js
 * Reads words.txt, buckets each word by its first letter (A–Z),
 * title-cases it, deduplicates, then patches the WORDS object in index.html.
 *
 * Run:  node build-words.js
 */

const fs   = require('fs');
const path = require('path');

const DIR   = __dirname;
const SRC   = path.join(DIR, 'words.txt');
const HTML  = path.join(DIR, 'index.html');

/* ── 1. Read & tokenise ─────────────────────────────────────────────── */
// Words list embedded directly (words.txt was empty on disk)
const raw = `A-OK, able, abounding, absorbing, absolute, abstract, aboveboard, abubble, abundant, abiding, acceptable, accepting, accessible, acclaimed, accommodating, accomplished, accordant, accountable, accurate, accustomed, achieving, acknowledged, active, actioning, adamant, adaptable, adept, adequate, adjusted, admirable, admired, adorable, adored, adroit, adventurous, advanced, advantageous, aesthetic, affable, affecting, affectionate, affective, affirming, affluent, ageless, agile, agreeable, aholic, aiding, alive, all important, alluring, altruistic, alacritous, alright, alternative, amazing, ambidextrous, ambitious, amenable, amicable, amiable, amusing, angelic, appetising, animated, apt, appealing, appeasing, appreciated, appreciative, approachable, appropriate, approving, aristocratic, arousing, arresting, artful, articulate, artistic, arty, ascending, aspiring, assertive, assiduous, assisting, assured, assuring, astonishing, astounding, astute, athletic, attainable, attractive, au-fait, auspicious, authentic, authoritative, autonomous, available, avant-garde, awake, aware, awesome,
Balanced, bada bing bada boom, ballsy, bang on, bankable, beaming, beautiful, becoming, bedrock, believable, beloved, beneficent, beneficial, benevolent, benignant, best, big, big hearted, blameless, blazing, blessed, blissful, blithe, blooming, bodacious, boisterous, bold, bonafide, bonnie, boundless, bounteous, bountiful, brainy, brave, breezy, bright, brilliant, brimming, broadminded, brisk, bubbly, buddy, buoyant, busy, business like, buxom,
Calm, calming, can do, candescent, candid, capable, canny, captivating, cared for, careful, caring, casual, causative, celebrated, celestial, centred, cerebral, certain, champion, changeless, charismatic, charitable, charming, cheerful, cherished, chic, chirpy, chosen, choice, chummy, civilised, clairvoyant, classy, clearheaded, clever, cogent, cognisant, coherent, collected, comfortable, colourful, comforting, comical, commanding, commendable, committed, commonsensical, commodious, communicative, compassionate, companionable, compatible, compelling, competent, complete, complimentary, composed, comprehensive, concentrated, concise, conclusive, concordant, concrete, confident, congenial, congruous, conscious, connected, conscientious, consensual, consequential, considerate, consistent, constant, constructive, contemporary, contemplative, content, contributive, convenient, conversant, convincing, convivial, cool, cooperative, coordinated, copacetic, copious, correct, cordial, coruscant, cosmic, cosy, cozy, courageous, courteous, cuddly, creative, credible, crisp, cultivated, cultured, curious, curvaceous, cute, cutting edge,
Dainty, daring, darling, dapper, dashing, dauntless, dazzling, dear, debonair, decent, deciding, decisive, decorous, dedicated, deep, defiant, definite, deft, delectable, deliberate, delicate, delicious, delighted, delightful, deluxe, demonstrative, dependable, deserving, designer, desirable, desired, destined, determined, developed, developing, devoted, devotional, devout, dexterous, diamond, different, dignified, dinkum, diligent, diplomatic, direct, disarming, discerning, disciplined, discrete, discriminating, dispassionate, distinct, distinctive, distinguished, distinguishing, diverse, diverting, divine, doable, dominant, donating, doting, doubtless, down-to-earth, dreamy, driven, dulcifying, durable, dutiful, dynamic, dynamite,
Eager, earnest, earthly, easy, easy-going, ebullient, eclectic, economical, edified, ecstatic, educated, effective, effectual, effervescent, efficacious, efficient, effortless, effulgent, effusive, elaborate, elated, electrifying, elegant, elemental, elevated, eligible, eloquent, embracing, emerging, eminent, empathetic, employable, empowered, empowering, enamoured, enamouring, enchanting, encouraging, endearing, endorsing, enduring, enhancing, energetic, energising, engaging, enhanced, enjoyable, enlightened, enlightening, enlivened, enlivening, enormous, enough, enrapt, enthusiastic, enthralling, enriching, enterprising, entertaining, enticing, entrancing, entrepreneurial, epic, epitome, equal, equanimous, equitable, equipoised, equipped, equivalent, erotic, erudite, essential, established, esteemed, eternal, especial, evaluative, evenhanded, eventful, evident, ethical, euphoric, evocative, exact, exalted, exalting, exceeding, excellent, excelling, exceptional, executive, exhilarating, exotic, expensive, expectant, expeditious, expansive, explicit, explorative, experienced, expressive, exuberant, exquisite, extraordinary, extensive, exultant, eye-catching,
Fab, fabulous, facile, factual, facilitative, fair, faithful, famed, familiar, famous, fancy, fantabulous, fantastic, farsighted, fascinating, fashionable, fast, faultless, favourable, favoured, favourite, fearless, feasible, fecund, feeling, felicitous, fertile, fervent, fervid, festive, fetching, fiery, fine, finest, firm, first class, first rate, fit, fitting, flamboyant, flash, flashlight, flavourful, flawless, flexible, flourishing, fluent, flying, focused, fond, forbearing, forceful, for real, foremost, foresighted, forgiving, formidable, forthcoming, forthright, fortified, fortuitous, fortunate, forward, forward thinking, foundational, four star, foxy, fragrant, frank, free, fresh, friendly, frisky, frolicsome, fruitful, fundamental, fulfilled, fulfilling, fun, funny, futuristic,
Game, gallant, galore, galvanise, gamesome, game-changer, gem, generous, genial, genteel, gentle, genuine, giddy, gifted, giving, glad, glamorous, gleaming, gleeful, glimmering, glistening, glittering, glorious, glowing, goal orientated, go-getter, godly, god-send, golden, good, good humoured, good-looking, good natured, good hearted, gorgeous, graceful, gracious, grand, grateful, gratified, gratifying, great, greatest, great hearted, gregarious, groovy, grounded, growing, guaranteed, guided, guiding, guileless, guiltless, guilt free, gumptious, gustatory, gutsy,
Hale, hallowed, handy, happening, happy, happy-go-lucky, hard worker, harmonious, harmless, healing, hearty, helpful, healthful, heartfelt, healthy, heavenly, heedful, hegemonic, heroic, high class, high minded, high-powered, high-priority, high-reaching, high-spirited, highest, highly distinguished, highly regarded, highly valued, hilarious, holy, homely, honest, honourable, hospitable, hot, hotshot, huggy, huggable, humane, humanitarian, humble, humorous, hygienic, hypnotic,
Ideal, idealistic, idolised, idiosyncratic, illimitable, illuminated, illuminating, illustrious, imaginative, imitable, immaculate, immeasurable, immediate, immense, immortal, immune, impartial, impassioned, impeccable, imperturbable, impish, important, improving, impressive, improved, improvisational, incisive, included, inclusive, incomparable, incontestable, incontrovertible, incredible, inculpable, indefatigable, independent, indestructible, indispensable, indisputable, individual, individualistic, indivisible, indomitable, industrious, inherent, inexhaustible, infallible, infinite, influential, informative, informed, ingenious, inimitable, initiate, innovative, innocent, innocuous, inquisitive, insightful, inspired, inspiring, inspiriting, instantaneous, instinctive, instructive, instrumental, integrated, intellectual, intelligent, intense, intent, interactive, interconnected, interested, interesting, intertwined, intimate, intoxicating, intrepid, intriguing, introducer, intuitive, invaluable, inventive, invigorated, invigorating, invincible, inviolable, inviting, irrefutable, irreplaceable, irrepressible, irreproachable, irresistible, issue-free,
Jamming, jampacked, jaunty, jazzed, jazzy, jestful, jesting, jewelled, jocular, jolly, jovial, joyful, joyous, jubilant, judicious, juicy, just, justified,
Keen, kempt, key, kind, kindhearted, kindly, kindred, kinetic, kingly, king-sized, kissable, knowing, knowledgeable, kooky,
Ladylike, laid-back, large, largesse, lasting, laudable, laughing, lavish, law-abiding, lawful, leading, leading edge, learned, legal, legendary, legitimate, legible, leisured, leisurely, lipid, lettered, levelheaded, liberal, liberating, liberated, lighthearted, lightly, like-minded, liked, likely, limber, lionhearted, literate, lithe, lithesome, live, lively, logical, long-established, long-standing, lovable, loved, lovely, loving, loyal, lucent, lucid, lucky, lucrative, luminous, luscious, lush, lustrous, lusty, luxuriant, luxurious,
Made, magical, magnanimous, magnetic, magnificent, main, majestic, major, malleable, manageable, managerial, manifesting, mannerly, many, more, marked, markedly, marvel, marvelled, marvellous, masculine, master, masterful, masterly, masterpiece, matchless, maternal, matter-of-fact, mature, maturing, maximal, meaningful, meditative, meek, meliorist, mellow, melodious, memorable, merciful, meritorious, merry, mesmerising, metaphysical, meteoric, methodical, meticulous, mettlesome, mighty, mindful, miraculous, mirthful, model, modern, modernistic, modest, momentous, moneyed, morphing, motivated, motivating, motivational, mouth-watering, moving, multidimensional, multi-disciplined, multifaceted, musical, mutual, munificent,
Native, natural, natty, neat, necessary, needed, neighbourly, neoteric, nestling, neutral, never-failing, newborn, nice, nifty, nimble, nimble-witted, nippy, noble, noetic, nonchalant, non-violent, normal, notable, noteworthy, noticeable, nourished, nourishing, now, number one, nurturing,
Objective, obliging, observant, obtainable, official, okay, olympian, one, one hundred percent, onwards, open, openhanded, open hearted, open minded, operative, opportune, optimal, optimistic, optimum, opulent, orderly, organic, organised, oriented, original, ornamental, out of sight, out of this world, outgoing, outlasting, outrageous, outstanding, overflowing, overjoyed, overriding, overt, owning,
Palatable, pally, palpable, pampered, par excellence, paradisiac, paradisiacal, paragon, paramount, participating, participative, particular, passionate, patient, peaceable, peaceful, peachy, pearl, peerless, penetrating, peppy, perceptive, perfect, perky, permanent, permissive, perseverant, persevering, persistent, personable, perspective, perspicacious, perspicuous, persuasive, pertinent, petite, phenomenal, philosophical, philanthropic, picked, picturesque, pioneering, piquant, pithy, pivotal, placid, plausible, playful, pleasant, pleasurable, plenary, plenteous, plentiful, plenty, pliable, plucky, poetic, poignant, poised, polished, polite, popular, posh, positive, possible, powerful, potent, potential, practicable, practical, pragmatic, praiseworthy, prayerful, precious, precise, predominant, pre-eminent, preferable, preferred, premier, premium, prepared, preponderant, prepotent, present, prestigious, prevailing, primal, primary, prime, prime mover, primed, principal, principled, privileged, prize, prize-winning, prized, proactive, prodigious, productive, proficient, profitable, profound, profuse, progressive, prolific, prominent, promising, prompt, proper, prophetic, propitious, prosperous, protective, proud, provocative, prudent, psyched up, public spirited, pukka, pulchritudinous, punchy, puissant, punctual, pure, purposeful,
Quaint, qualified, qualitative, quality, quantifiable, queenly, questioning, quick, quick-witted, quiet, quintessential, quirky, quixotic, quotable,
Racy, rad, radiant, rambunctious, rapid, rapturous, rational, ravishing, razor-sharp, reachable, ready, re-affirming, real, realistic, realisable, reasonable, reassuring, receptive, recipient, reciprocal, recognisable, recognised, recommendable, recuperative, red carpet, refined, reflective, refreshing, refulgent, regular, rejoicing, rejuvenescent, relaxed, relevant, reliable, remarkable, renewing, renowned, reputable, resilient, resolute, resolved, resounding, resourceful, respectable, respectful, resplendent, responsible, responsive, restful, restorative, retentive, revealing, revered, reverent, revitalising, revolutionary, rewardable, rewarding, rhapsodic, rich, right, righteous, rightful, ripe, risible, robust, romantic, rooted, rosy, round, rounded, rollicking, rousing, rugged,
Sacred, sacrosanct, safe, sagacious, sage, saintly, salient, salt of the earth, salubrious, salutary, sanctified, sanctimonious, sanctioned, sanguine, sapid, sapient, sassy, satisfactory, satisfied, satisfying, saucy, savoury, savvy, scholarly, scientific, scintillating, scrumptious, scrupulous, seamless, seasonal, seasoned, secure, sedulous, seemingly, select, self-assertive, self-assured, self-confident, self-disciplined, self-made, self-sufficient, selfless, sensational, sensible, sensitive, sensual, sensuous, sentimental, sequacious, serendipitous, serene, service, set, settled, sexual, sexy, sharp, shatterproof, shimmering, shining, shiny, shipshape, showy, shrewd, significant, silver, silver tongued, silvery, simple, sincere, singular, sizzling, skilful, skilled, sleek, slick, slinky, smacking, smart, smashing, smiling, smooth, snappy, snazzy, snuggly, soaring, sociable, social, soft, soft-hearted, solid, soothing, sophisticated, sought-after, soulful, souped-up, sovereign, spacious, spangly, sparkling, sparkly, special, spectacular, speedy, spellbinding, spicy, spiffy, spirited, spiritual, splendid, splendiferous, spontaneous, sporting, supportive, sporty, spot, spotless, spot-on, sprightly, spruce, spry, spunky, stable, style-bird, standard, stand up, statuesque, staunch, steadfast, steady, steamy, stellar, sterling, stick-to-it, stimulated, stimulating, stimulative, stirred, stirring, stoical, storied, stout, stouthearted, straightforward, straight shooter, strapping, strategic, street-smart, streetwise, striking, striving, strong, studious, stunning, stupendous, sturdy, stylish, suave, sublime, substance, substantial, substantive, subtle, successful, succeeding, succinct, sufficient, sugary, suitable, sultry, sumptuous, sunny, super, superabundant, super-charged, super-duper, superb, superior, supersonic, supernal, supple, supreme, sure, surefire, surefooted, surpassing, surprising, surviving, sustained, sustaining, svelte, swank, sweet, sweetheart, swell, swift, sympathetic, synchronistic, synergistic, systematic,
Tactful, tailor-made, take charge, talented, tangy, tangible, tantalising, tasteful, tasty, teachable, teaching, teaming, temperate, tenable, tenacious, tender, tender-hearted, terrific, thankful, thank-worthy, theatrical, therapeutic, thorough, thoughtful, thrifty, thrilled, thrilling, thriving, tidy, time-honoured, timeless, timely, timesaver, tingling, tiptop, tireless, titillating, together, tolerant, top, top-notch, totally, touching, tough, traditional, trailblazing, tranquil, transcendent, transformative, transforming, transcendental, transient, transparent, travelled, treasure, treasuring, tremendous, trim, triumphant, true, true-blue, trusted, trustful, trusting, trustworthy, tutoring, twinkly,
Uber, ubuntu, ultimate, ultra, ultra-precise, unabashed, unadulterated, unaffected, unafraid, unambiguous, unanimous, unarguable, unassuming, unattached, unbeaten, unbelievable, unbiased, un-bigoted, unblemished, unbound, unbroken, unburdened, uncommon, uncomplicated, unconditional, unconventional, un-contestable, uncorrupted, uncritical, undamaged, undaunted, undefeated, undefiled, undeniable, understandable, understanding, understood, undesigning, undiminished, undisputed, undivided, undoubted, unencumbered, unequivocal, unerring, unfailing, unfaltering, unflagging, unfeigned, unfettered, unflappable, unforgettable, ungrudging, unhampered, unhesitating, unharmed, unified, unimpaired, unimpeachable, unique, united, uniting, universal, unlimited, unmistakable, unmitigated, unobjectionable, unobstructed, unopposed, unquestionable, unreserved, unrivalled, unruffled, unshakeable, unshaken, unspoiled, unselfish, unstoppable, untarnished, unsurpassed, untiring, untouched, unusual, unwavering, up, upfront, up-to-date, upbeat, upcoming, upgrading, upholding, uplifting, uppermost, upright, upscale, upward, upwardly, usable, useful, user-friendly, utmost,
Valiant, valid, validating, valorous, valuable, valued, vamp, variable, varied, vast, va-va-voom, vehement, venturesome, voracious, verified, versatile, versed, very nice, viable, vibrant, victorious, vigilant, vigorous, virile, visionary, vital, vitalising, vivacious, vivid, vocal, volunteering, voluptuous,
Wanted, warm, warmhearted, wealthy, witty, welcome, welcoming, well, well-balanced, well behaved, well being, well built, well connected, well done, well disposed, well established, well founded, well grounded, well-informed, well-intentioned, well-known, well liked, well-made, well-meaning, well regarded, well read, well received, well spoken, well suited, well timed, whimsical, whiz-bang, whole, wholehearted, wholesome, whopping, wide awake, widely used, willed, willing, winged, winning, winsome, wild, wise, with it, within reach, without equal, wonderful, wondrous, workable, worldly, worth, worthwhile, worthy, wow,
Xenial, x-factor,
Yay, yearning, yes, yippee, young, young at heart, youthful, yummy,
Zaftig, zany, zappy, zazzy, zealful, zealous, zesty, zestful, zingy, zippy, zooming, zowie`;

// Split on commas OR newlines, trim each token
const tokens = raw
  .split(/[,\n]+/)
  .map(t => t.trim().replace(/\s+/g, ' '))   // collapse internal whitespace
  .filter(t => t.length > 1);                 // drop empty / single-char noise

/* ── 2. Title-case helper ───────────────────────────────────────────── */
function toTitle(s) {
  return s
    .toLowerCase()
    // capitalise first letter of each "word" after spaces or hyphens
    .replace(/(^|[\s-])([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

/* ── 3. Bucket by first letter ──────────────────────────────────────── */
const buckets = {};
for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') buckets[letter] = [];

for (const tok of tokens) {
  const first = tok[0].toUpperCase();
  if (!/[A-Z]/.test(first)) continue;          // skip "2nd to none" etc
  const word = toTitle(tok);
  if (!buckets[first].includes(word)) {
    buckets[first].push(word);
  }
}

/* ── 3b. Colour-adjacency fix ───────────────────────────────────────────
   When n % 3 === 1, the first and last segments share a colour.
   Append one extra word to those letters.  Paolo-approved replacements
   where available; "TEST" (all-caps) as placeholder otherwise.
────────────────────────────────────────────────────────────────────── */
const COLOR_FIX = {
  B: 'Balanced', I: 'Ideal', K: 'Keen', M: 'Made',
  N: 'TEST',     O: 'Objective', R: 'Racy', U: 'Uber',
};
for (const [letter, words] of Object.entries(buckets)) {
  if (words.length % 3 === 1) {
    const fix = COLOR_FIX[letter] || 'TEST';
    words.push(fix);   // intentional — may duplicate; fixes colour wrap
  }
}

/* ── 4. Serialise to JS ─────────────────────────────────────────────── */
const lines = ['const WORDS = {'];
for (const [letter, words] of Object.entries(buckets)) {
  if (words.length === 0) continue;
  // Wrap to ~100 chars per line
  const chunks = [];
  let cur = '';
  for (const w of words) {
    const tok = (cur ? ', ' : '') + JSON.stringify(w);
    if (cur.length + tok.length > 96) { chunks.push(cur); cur = JSON.stringify(w); }
    else cur += tok;
  }
  if (cur) chunks.push(cur);
  lines.push(`  ${letter}: [`);
  for (const chunk of chunks) lines.push(`    ${chunk},`);
  // remove trailing comma from last chunk line
  lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
  lines.push(`  ],`);
  lines.push('');
}
lines.push('};');
const wordsJS = lines.join('\n');

/* ── 5. Patch index.html ────────────────────────────────────────────── */
let html = fs.readFileSync(HTML, 'utf8');

// Replace the WORDS block using reliable anchors (const WORDS … };)
// followed by the SECTION 3 engine comment.
const wordsBlockRe = /const WORDS\s*=\s*\{[\s\S]*?\};\s*\n/;
const section3Mark = 'SECTION 3';

if (!wordsBlockRe.test(html) || !html.includes(section3Mark)) {
  console.error('ERROR: Could not locate WORDS block or SECTION 3 marker in index.html');
  process.exit(1);
}

html = html.replace(wordsBlockRe, wordsJS + '\n\n');

fs.writeFileSync(HTML, html, 'utf8');

/* ── 6. Report ──────────────────────────────────────────────────────── */
console.log('\nWords loaded per letter:');
for (const [l, w] of Object.entries(buckets)) {
  if (w.length) console.log(`  ${l}: ${w.length} words`);
}
console.log('\nindex.html updated successfully.');
