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
const raw = `A-OK, able, abounding, absorbing, absolute, abstract, aboveboard, abubble, abundant, abiding, acceptable, accepting, accessible, acclaimed, accommodating, accomplished, accordant, accountable, accurate, accustomed, achieving, acknowledged, active, actioning, adamant, adaptable, adept, adequate, adjusted, admirable, admired, adorable, adored, adroit, adventurous, advanced, advantageous, aesthetic, affable, affecting, affectionate, affective, affirming, affluent, ageless, agile, agreeable, aiding, alive, alluring, altruistic, alacritous, alright, alternative, amazing, ambidextrous, ambitious, amenable, amicable, amiable, amusing, angelic, appetising, animated, apt, appealing, appeasing, appreciated, appreciative, approachable, appropriate, approving, aristocratic, arousing, arresting, artful, articulate, artistic, arty, ascending, aspiring, assertive, assiduous, assisting, assured, assuring, astonishing, astounding, astute, athletic, attainable, attractive, auspicious, authentic, authoritative, autonomous, available, avant-garde, awake, aware, awesome,
Balanced, bada bing bada boom, ballsy, bang on, bankable, beaming, beautiful, becoming, bedrock, believable, beloved, beneficent, beneficial, benevolent, benignant, best, big, big hearted, blameless, blazing, blessed, blissful, blithe, blooming, bodacious, boisterous, bold, bonafide, bonnie, boundless, bounteous, bountiful, brainy, brave, breezy, bright, brilliant, brimming, broadminded, brisk, bubbly, buddy, buoyant, busy, business like, buxom,
Calm, calming, can do, candescent, candid, capable, canny, captivating, cared for, careful, caring, casual, causative, celebrated, celestial, centred, cerebral, certain, champion, changeless, charismatic, charitable, charming, cheerful, cherished, chic, chirpy, chosen, choice, chummy, civilised, clairvoyant, classy, clearheaded, clever, cogent, cognisant, coherent, collected, comfortable, colourful, comforting, comical, commanding, commendable, committed, commonsensical, commodious, communicative, compassionate, companionable, compatible, compelling, competent, complete, complimentary, composed, comprehensive, concentrated, concise, conclusive, concordant, concrete, confident, congenial, congruous, conscious, connected, conscientious, consensual, consequential, considerate, consistent, constant, constructive, contemporary, contemplative, content, contributive, convenient, conversant, convincing, convivial, cool, cooperative, coordinated, copacetic, copious, correct, cordial, coruscant, cosmic, cosy, courageous, courteous, cuddly, creative, credible, crisp, cultivated, cultured, curious, curvaceous, cute, cutting edge,
Dainty, daring, darling, dapper, dashing, dauntless, dazzling, dear, debonair, decent, deciding, decisive, decorous, dedicated, deep, defiant, definite, deft, delectable, deliberate, delicate, delicious, delighted, delightful, deluxe, demonstrative, dependable, deserving, designer, desirable, desired, destined, determined, developed, developing, devoted, devotional, devout, dexterous, diamond, different, dignified, dinkum, diligent, diplomatic, direct, disarming, discerning, disciplined, discrete, discriminating, dispassionate, distinct, distinctive, distinguished, distinguishing, diverse, diverting, divine, doable, dominant, donating, doting, doubtless, down-to-earth, dreamy, driven, durable, dutiful, dynamic, dynamite,
Eager, earnest, earthly, easy, easy-going, ebullient, eclectic, economical, edified, ecstatic, educated, effective, effectual, effervescent, efficacious, efficient, effortless, effulgent, effusive, elaborate, elated, electrifying, elegant, elemental, elevated, eligible, eloquent, embracing, emerging, eminent, empathetic, employable, empowered, empowering, enamoured, enchanting, encouraging, endearing, endorsing, enduring, enhancing, energetic, energising, engaging, enhanced, enjoyable, enlightened, enlightening, enlivened, enlivening, enormous, enough, enrapt, enthusiastic, enthralling, enriching, enterprising, entertaining, enticing, entrancing, entrepreneurial, epic, epitome, equal, equanimous, equitable, equipoised, equipped, equivalent, erotic, erudite, essential, established, esteemed, eternal, especial, evaluative, evenhanded, eventful, evident, ethical, euphoric, evocative, exact, exalted, exalting, exceeding, excellent, excelling, exceptional, executive, exhilarating, exotic, expensive, expectant, expeditious, expansive, explicit, explorative, experienced, expressive, exuberant, exquisite, extraordinary, extensive, exultant, eye-catching,
Fab, fabulous, facile, factual, facilitative, fair, faithful, famed, familiar, famous, fancy, fantabulous, fantastic, farsighted, fascinating, fashionable, fast, faultless, favourable, favoured, favourite, fearless, feasible, fecund, feeling, felicitous, fertile, fervent, fervid, festive, fetching, fiery, fine, finest, firm, first class, first rate, fit, fitting, flamboyant, flash, flavourful, flawless, flexible, flourishing, fluent, flying, focused, fond, forbearing, forceful, for real, foremost, foresighted, forgiving, formidable, forthcoming, forthright, fortified, fortuitous, fortunate, forward, forward thinking, foundational, four star, foxy, fragrant, frank, free, fresh, friendly, frisky, frolicsome, fruitful, fundamental, fulfilled, fulfilling, fun, funny, futuristic,
Game, gallant, galore, galvanise, gamesome, game-changer, gem, generous, genial, genteel, gentle, genuine, giddy, gifted, giving, glad, glamorous, gleaming, gleeful, glimmering, glistening, glittering, glorious, glowing, goal orientated, go-getter, godly, golden, good, good humoured, good natured, good hearted, gorgeous, graceful, gracious, grand, grateful, gratified, gratifying, great, greatest, great hearted, gregarious, groovy, grounded, growing, guaranteed, guided, guiding, guileless, guiltless, guilt free, gumptious, gutsy,
Hale, hallowed, handy, happening, happy, happy-go-lucky, hard worker, harmonious, harmless, healing, hearty, helpful, healthful, heartfelt, healthy, heavenly, heedful, heroic, high class, high minded, high-powered, high-spirited, highest, highly regarded, highly valued, hilarious, holy, homely, honest, honourable, hospitable, hot, hotshot, huggy, huggable, humane, humanitarian, humble, humorous, hygienic, hypnotic,
Ideal, idealistic, idolised, idiosyncratic, illimitable, illuminated, illuminating, illustrious, imaginative, immaculate, immeasurable, immediate, immense, immortal, immune, impartial, impassioned, impeccable, imperturbable, impish, important, improving, impressive, improvisational, incisive, included, inclusive, incomparable, incontestable, incontrovertible, incredible, indefatigable, independent, indestructible, indispensable, indisputable, individual, individualistic, indivisible, indomitable, industrious, inherent, inexhaustible, infallible, infinite, influential, informative, informed, ingenious, inimitable, innovative, innocent, innocuous, inquisitive, insightful, inspired, inspiring, instantaneous, instinctive, instructive, instrumental, integrated, intellectual, intelligent, intense, intent, interactive, interconnected, interested, interesting, intertwined, intimate, intoxicating, intrepid, intriguing, intuitive, invaluable, inventive, invigorated, invigorating, invincible, inviolable, inviting, irrefutable, irreplaceable, irrepressible, irreproachable, irresistible,
Jamming, jampacked, jaunty, jazzed, jazzy, jestful, jesting, jewelled, jocular, jolly, jovial, joyful, joyous, jubilant, judicious, juicy, just, justified,
Keen, kempt, key, kind, kindhearted, kindly, kindred, kinetic, kingly, kissable, knowing, knowledgeable, kooky,
Ladylike, laid-back, large, largesse, lasting, laudable, laughing, lavish, law-abiding, lawful, leading, leading edge, learned, legal, legendary, legitimate, legible, leisured, leisurely, lettered, levelheaded, liberal, liberating, liberated, lighthearted, like-minded, liked, likely, limber, lionhearted, literate, lithe, lithesome, lively, logical, long-established, long-standing, lovable, loved, lovely, loving, loyal, lucent, lucid, lucky, lucrative, luminous, luscious, lush, lustrous, lusty, luxuriant, luxurious,
Made, magical, magnanimous, magnetic, magnificent, main, majestic, major, malleable, manageable, manifesting, mannerly, marked, marvel, marvellous, masculine, master, masterful, masterly, masterpiece, matchless, maternal, matter-of-fact, mature, maturing, maximal, meaningful, meditative, meek, meliorist, mellow, melodious, memorable, merciful, meritorious, merry, mesmerising, metaphysical, meteoric, methodical, meticulous, mettlesome, mighty, mindful, miraculous, mirthful, model, modern, modernistic, modest, momentous, moneyed, morphing, motivated, motivating, motivational, mouth-watering, moving, multidimensional, multi-disciplined, multifaceted, musical, mutual, munificent,
Native, natural, natty, neat, necessary, needed, neighbourly, neoteric, nestling, neutral, newborn, nice, nifty, nimble, nimble-witted, nippy, noble, noetic, nonchalant, non-violent, normal, notable, noteworthy, noticeable, nourished, nourishing, number one, nurturing,
Objective, obliging, observant, obtainable, open, openhanded, open hearted, open minded, operative, opportune, optimal, optimistic, optimum, opulent, orderly, organic, organised, oriented, original, ornamental, outgoing, outlasting, outrageous, outstanding, overflowing, overjoyed, overt, owning,
Palatable, pally, palpable, pampered, par excellence, paragon, paramount, participating, participative, passionate, patient, peaceable, peaceful, peachy, peerless, penetrating, peppy, perceptive, perfect, perky, permanent, permissive, perseverant, persevering, persistent, personable, perspicacious, perspicuous, persuasive, pertinent, petite, phenomenal, philosophical, philanthropic, picturesque, pioneering, piquant, pithy, pivotal, placid, plausible, playful, pleasant, pleasurable, plenteous, plentiful, plenty, pliable, plucky, poetic, poignant, poised, polished, polite, popular, posh, positive, possible, powerful, potent, potential, practicable, practical, pragmatic, praiseworthy, prayerful, precious, precise, predominant, pre-eminent, preferable, preferred, premier, premium, prepared, present, prestigious, prevailing, primal, primary, prime, primed, principal, principled, privileged, prized, proactive, prodigious, productive, proficient, profitable, profound, profuse, progressive, prolific, prominent, promising, prompt, proper, prophetic, propitious, prosperous, protective, proud, provocative, prudent, purposeful,
Quaint, qualified, qualitative, quality, quantifiable, queenly, questioning, quick, quick-witted, quiet, quintessential, quirky, quixotic, quotable,
Radiant, rambunctious, rapid, rapturous, rational, ravishing, razor-sharp, reachable, ready, real, realistic, reasonable, reassuring, receptive, reciprocal, recognisable, recognised, recommendable, recuperative, refined, reflective, refreshing, refulgent, rejoicing, relaxed, relevant, reliable, remarkable, renewing, renowned, reputable, resilient, resolute, resolved, resounding, resourceful, respectable, respectful, resplendent, responsible, responsive, restful, restorative, revered, reverent, revitalising, revolutionary, rewarding, rhapsodic, rich, righteous, rightful, ripe, robust, romantic, rooted, rosy, rounded, rollicking, rousing, rugged,
Sacred, sacrosanct, safe, sagacious, sage, saintly, salient, salubrious, salutary, sanctified, sanctioned, sanguine, sapient, sassy, satisfactory, satisfied, satisfying, saucy, savoury, savvy, scholarly, scientific, scintillating, scrumptious, scrupulous, seamless, seasoned, secure, select, self-assertive, self-assured, self-confident, self-disciplined, self-made, self-sufficient, selfless, sensational, sensible, sensitive, sensual, sensuous, sentimental, serendipitous, serene, settled, sexy, sharp, shatterproof, shimmering, shining, shiny, significant, silver tongued, sincere, singular, sizzling, skilful, skilled, sleek, slick, slinky, smart, smashing, smiling, smooth, snappy, snazzy, snuggly, soaring, sociable, soft, soft-hearted, solid, soothing, sophisticated, sought-after, soulful, sovereign, spacious, sparkling, sparkly, special, spectacular, speedy, spellbinding, spicy, spirited, spiritual, splendid, spontaneous, sporting, sporty, spotless, spot-on, sprightly, spruce, spry, spunky, stable, statuesque, staunch, steadfast, steady, stellar, sterling, stimulating, stirring, stout, stouthearted, straightforward, strapping, strategic, street-smart, striking, striving, strong, studious, stunning, stupendous, sturdy, stylish, suave, sublime, substantial, subtle, successful, succinct, sufficient, suitable, sultry, sumptuous, sunny, superabundant, superb, superior, supple, supportive, supreme, surefooted, surpassing, surprising, sustaining, svelte, sweet, swift, sympathetic, synchronistic, synergistic, systematic,
Tactful, tailor-made, talented, tangible, tasteful, tasty, teachable, temperate, tenacious, tender, tender-hearted, terrific, thankful, therapeutic, thorough, thoughtful, thrifty, thrilling, thriving, tidy, timeless, timely, tireless, tolerant, top-notch, touching, tough, trailblazing, tranquil, transcendent, transformative, transparent, treasure, tremendous, triumphant, true, trusted, trustworthy, twinkly,
Uber, ultimate, ultra, unabashed, unadulterated, unafraid, unambiguous, unassuming, unbeaten, unbelievable, unbiased, unblemished, unbroken, uncommon, uncomplicated, unconditional, unconventional, undaunted, undefeated, undeniable, understanding, undiminished, undisputed, undivided, undoubted, unerring, unfailing, unfaltering, unflappable, unforgettable, unified, unique, united, universal, unlimited, unmistakable, unrivalled, unruffled, unshakeable, unstoppable, unsurpassed, untiring, unusual, unwavering, upbeat, uplifting, upright, useful, utmost,
Valiant, valid, validating, valorous, valuable, valued, vehement, venturesome, verified, versatile, vibrant, victorious, vigilant, vigorous, virile, visionary, vital, vitalising, vivacious, vivid, vocal, volunteering, voluptuous,
Wanted, warm, warmhearted, wealthy, welcome, welcoming, well-balanced, wholehearted, wholesome, wide awake, willing, winning, winsome, wise, wonderful, wondrous, workable, worldly, worthwhile, worthy,
Xenial,
Yearning, yes, young, young at heart, youthful, yummy,
Zany, zealous, zesty, zestful, zippy`;

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
