/* ============ Junior — prototype logic ============ */

const state = { coins: 5297, energy: 5297 };

const fmt = n => n.toLocaleString('ru-RU'); // 12 560 formatida

function syncBalances() {
  document.getElementById('coinChip').textContent = fmt(state.coins);
  document.getElementById('energyChip').textContent = fmt(state.energy);
  document.getElementById('shopBalance').textContent = fmt(state.coins);
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}
document.querySelectorAll('[data-toast]').forEach(btn =>
  btn.addEventListener('click', () => toast(btn.dataset.toast))
);

/* ---------- Nav: Kurslar / CoinShop ---------- */
const views = { kurslar: document.getElementById('view-kurslar'), coinshop: document.getElementById('view-coinshop') };
document.querySelectorAll('.nav-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t === tab));
    Object.entries(views).forEach(([name, el]) => { el.hidden = name !== tab.dataset.view; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ---------- Bildirishnomalar ---------- */
const bellBtn = document.getElementById('bellBtn');
const bellPanel = document.getElementById('bellPanel');
bellBtn.addEventListener('click', e => { e.stopPropagation(); bellPanel.hidden = !bellPanel.hidden; });
document.addEventListener('click', e => {
  if (!bellPanel.hidden && !bellPanel.contains(e.target)) bellPanel.hidden = true;
});

/* ---------- Kurslar karuseli ---------- */
const track = document.getElementById('courseTrack');
const step = () => track.querySelector('.course').offsetWidth + 18;
document.getElementById('prevCourse').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
document.getElementById('nextCourse').addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
track.querySelectorAll('.play-btn').forEach(btn =>
  btn.addEventListener('click', () => toast('Kurs sahifasi prototipda mavjud emas 🙂'))
);

/* ---------- Leaderboard ---------- */
const BOARDS = {
  guruh: [
    { name: 'Abdulloh N.', coins: 12560 },
    { name: 'Sardorbek', coins: 9870 },
    { name: 'Aziza K.', coins: 8400 },
    { name: 'Muhammadali', coins: 7230 },
    { name: 'Diyorbek', coins: 6540 },
    { name: 'Jasur T.', coins: 5980 },
    { name: 'Malika R.', coins: 5420 },
    { name: 'Bekzod', coins: 4870 },
    { name: 'Nilufar S.', coins: 4310 },
    { name: 'Sheraliyev Abdulrauf', coins: 3950, you: true },
  ],
  barcha: [
    { name: 'Otabek R.', coins: 24350 },
    { name: 'Kamola S.', coins: 21870 },
    { name: 'Abdulloh N.', coins: 12560 },
    { name: 'Javohir M.', coins: 11940 },
    { name: 'Sardorbek', coins: 9870 },
    { name: 'Aziza K.', coins: 8400 },
    { name: 'Dilshod T.', coins: 7960 },
    { name: 'Muhammadali', coins: 7230 },
    { name: 'Diyorbek', coins: 6540 },
    { name: 'Sheraliyev Abdulrauf', coins: 3950, you: true },
  ],
};

const AVA_COLORS = ['#FF7A2F', '#7C66F2', '#23B457', '#4F46E5', '#E0529C', '#0EA5B7', '#C06B2E', '#6B7280'];
const avaColor = name => AVA_COLORS[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVA_COLORS.length];
const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

let currentBoard = 'guruh';
let lbExpanded = false;

function renderBoard() {
  const data = BOARDS[currentBoard];
  const rows = lbExpanded ? data : data.slice(0, 5);
  const max = data[0].coins;
  const list = document.getElementById('lbList');
  list.innerHTML = rows.map((p, i) => `
    <li class="lb-row${p.you ? ' you' : ''}" style="animation-delay:${i * 0.04}s">
      <span class="lb-rank">${i < 3
        ? `<span class="medal medal-${i + 1}">${i + 1}</span>`
        : `<span class="rank-num">${i + 1}</span>`}</span>
      <span class="avatar" style="background:${avaColor(p.name)}">${initials(p.name)}</span>
      <span class="lb-who">
        <span class="lb-name">${p.name}${p.you ? ' (siz)' : ''}</span>
        <span class="lb-coins">${fmt(p.coins)} coin</span>
      </span>
      <span class="lb-bar"><span class="lb-bar-fill" style="width:${Math.round(p.coins / max * 100)}%"></span></span>
    </li>`).join('');
  document.getElementById('lbMore').textContent = lbExpanded ? 'Yopish' : "Barchasini ko'rish";
}

document.querySelectorAll('.seg-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b === btn));
    currentBoard = btn.dataset.board;
    renderBoard();
  });
});
document.getElementById('lbMore').addEventListener('click', () => { lbExpanded = !lbExpanded; renderBoard(); });
renderBoard();

/* ================= VIDJETLAR: ma'lumot ==================
   Namunaviy ma'lumotlar go.junior-it.uz bazasidan olingan (MCP, 08.08.2026).
   Profilni almashtirish uchun pastdagi `const S = ...` qatorini o'zgartiring. */

const now = new Date();
const todayAt = (h, m = 0) => { const d = new Date(); d.setHours(h, m, 0, 0); return d; };
const dayKey  = d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const isToday = d => d && dayKey(d) === dayKey(now);

const PROFILES = {
  /* Faol o'quvchi profili: 31 kunlik uzluksiz strayk.
     Raqamlar Junior bazasidagi haqiqiy o'quvchidan olingan (08.08.2026). */
  faol: {
    name: 'O\'quvchi A',
    coins: 24119,
    mainCourse: 'Dasturlash kursi',
    module: 'DOM eventlari va selectorlari',
    idleDays: 0,                       // asosiy kursda tanaffus yo'q
    streak: 31,                        // bir oydan beri uzluksiz
    bestStreak: 31,
    monthActiveDays: 8,                // avgustda faol kunlar (1–8)
    // bugungi chek-list: bazadagi haqiqiy topshiriqlar
    checklist: [
      { name: 'Dasturlash kursi', task: 'Amaliy ish. DOM eventlari va selectorlari', note: 'qabul qilindi',   done: true },
      { name: 'Telegram Bot',     task: 'Telegram bot. Kirish darsi',                note: 'qabul qilindi',   done: true },
      { name: 'English',          task: 'Basic conversation 1',                      note: 'hali boshlanmagan', done: false },
      { name: 'Grafik dizayn',    task: 'Kompozitsiya asoslari',                     note: 'hali boshlanmagan', done: false },
    ],
    demoDay:     { at: todayAt(18, 0), mentor: 'Ali G\'aybullayev', module: 'HTML', progress: 100 },
    extraLesson: { at: todayAt(16, 0), mentor: 'Ali G\'aybullayev', module: 'HTML',
                   topic: 'Inline elementlari', attended: false },
    webinar:     { at: todayAt(20, 0), durationMin: 60 },
    payment:     { date: new Date(2026, 7, 10), paid: false, windowDays: 3, reward: 100 },
  },

  /* Tanaffusdagi o'quvchi profili: 3 kundan beri dars qilmagan.
     Raqamlar bazadagi haqiqiy o'quvchidan olingan. */
  tanaffus: {
    name: 'O\'quvchi B',
    coins: 37622,
    mainCourse: 'Dasturlash kursi',
    module: 'DOM eventlari va selectorlari',
    idleDays: 3,                       // oxirgi faollik 3 kun oldin
    streak: 0,
    bestStreak: 24,
    monthActiveDays: 5,
    checklist: [
      { name: 'Dasturlash kursi', task: 'Amaliy ish. DOM eventlari', note: 'hali boshlanmagan', done: false },
      { name: 'English',          task: 'Unit 12. Past Simple',      note: 'hali boshlanmagan', done: false },
      { name: 'Matematika',       task: 'Mental hisob · 12-dars',    note: 'hali boshlanmagan', done: false },
      { name: 'Typing',           task: 'Yuqori qator: nazorat',     note: 'hali boshlanmagan', done: false },
    ],
    demoDay: null,
    extraLesson: null,
    webinar: null,
    payment: { date: new Date(2026, 7, 10), paid: false, windowDays: 3, reward: 100 },
    // bazada Typing eng kam bajarilgan kurs (4/36) — shuning uchun tavsiya qilinadi
    suggest: { name: 'Typing', targetId: 'courseTyping', done: 4, total: 36 },
  },
};

const S = PROFILES.faol;   // tavsiya vidjetini ko'rish uchun: PROFILES.tanaffus

const CHECKLIST_REWARD = 30;   // to'liq chek-list uchun
const MONTH_REWARD     = 100;  // oyni to'liq bosib o'tgani uchun

/* ---------- Strayk haftasi ---------- */
const WEEK = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
const todayNum = now.getDate();
const todayDow = now.getDay() || 7;                 // 1=Du … 7=Ya
// strayk uzluksiz bo'lsa — shu kungacha hamma kun yonadi
const streakActive = WEEK.map((_, i) => (i + 1 <= todayDow ? (S.streak > i ? 1 : 0) : 0));

document.getElementById('streakWeek').innerHTML = WEEK.map((d, i) => `
  <div class="week-day ${streakActive[i] ? 'on' : 'off'}${i + 1 === todayDow ? ' today' : ''}">
    <span class="week-flame">🔥</span>
    <span class="week-label">${d}</span>
  </div>`).join('');

document.querySelector('#streakCard .big-num').textContent = `${S.streak} kun`;
document.querySelectorAll('#streakCard .duo-stats b')[0].textContent = `${S.streak} kun`;
document.querySelectorAll('#streakCard .duo-stats b')[1].textContent = `${S.bestStreak} kun`;

/* ---------- Oylik challenge ----------
   Har kunlik amaliy topshirilganda progress to'ladi.
   Oy to'liq bosib o'tilsa — avtomatik +100 coin. */
(function monthlyChallenge() {
  const total = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const done  = Math.min(S.monthActiveDays, total);
  const left  = total - done;
  const pct   = Math.round(done / total * 100);

  document.getElementById('chTotal').textContent = total;
  document.getElementById('chDone').textContent  = done;
  document.getElementById('chLeft').textContent  = `${left} kun`;
  document.getElementById('chBar').style.width   = pct + '%';
  document.getElementById('chBadge').textContent = `${done} / ${total} kun`;

  if (left === 0) {                       // oy yakunlandi — mukofot avtomatik
    state.coins += MONTH_REWARD;
    syncBalances();
    toast(`🏆 Oylik challenge bajarildi! +${MONTH_REWARD} coin`);
  }

  const toggle = document.getElementById('chToggle');
  const info   = document.getElementById('chInfo');
  toggle.addEventListener('click', () => {
    const open = info.hidden;
    info.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });
})();

/* ---------- Vebinar ----------
   Jonli efir bo'lsa kun boshidan kun oxirigacha ko'rinadi.
   "Qo'shilish" tugmasi boshlanishiga 30 daqiqa qolganda ochiladi.
   Efir tugagach vidjet yo'qoladi. */
const WEBINAR_OPEN_MIN = 30;
(function webinar() {
  const w = S.webinar;
  if (!w || !isToday(w.at)) return;

  const card = document.getElementById('webinarCard');
  const join = document.getElementById('webinarJoin');
  const pad  = n => String(n).padStart(2, '0');
  const endsAt = new Date(w.at.getTime() + w.durationMin * 60000);

  document.getElementById('webinarWhen').textContent = 'Bugun';
  document.getElementById('webinarTime').textContent = `${pad(w.at.getHours())}:${pad(w.at.getMinutes())}`;

  join.addEventListener('click', () => {
    if (join.disabled) return;
    toast('Vebinar xonasiga kirilmoqda… 🎥');
  });

  function tick() {
    const t = Date.now();
    if (t >= endsAt.getTime()) {          // efir tugadi — vidjet yo'qoladi
      card.hidden = true;
      arrangeWidgets();
      return;
    }
    card.hidden = false;
    const left = Math.max(0, Math.floor((w.at - t) / 1000));
    const open = left <= WEBINAR_OPEN_MIN * 60;   // 30 daqiqa qoldi

    join.disabled = !open;
    join.classList.toggle('btn-disabled', !open);
    join.firstChild.textContent = open ? 'Vebinarga qo\'shilish ' : `Xona ${WEBINAR_OPEN_MIN} daqiqa oldin ochiladi `;

    document.getElementById('webinarCountdown').textContent = left === 0
      ? 'Efir davom etmoqda 🔴'
      : `${pad(Math.floor(left / 3600))}:${pad(Math.floor(left % 3600 / 60))}:${pad(left % 60)} qoldi`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Demo Day ----------
   Faqat BOOK qilingan kuni ko'rinadi, o'tib ketgach yo'qoladi. */
const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
                   'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];

(function demoDay() {
  const e = S.demoDay;
  if (!e || !isToday(e.at)) return;              // bugunga belgilanmagan

  const card = document.getElementById('ddCard');
  const { at, module: mod, progress, mentor } = e;
  const pad  = n => String(n).padStart(2, '0');
  const date = `${at.getDate()}-${UZ_MONTHS[at.getMonth()]}`;
  const time = `${pad(at.getHours())}:${pad(at.getMinutes())}`;

  document.getElementById('ddWhen').textContent = `${date}, ${time}`;
  document.getElementById('ddPct').textContent  = progress + '%';
  document.getElementById('ddBar').style.width  = progress + '%';
  document.getElementById('ddMsg').innerHTML = progress >= 100
    ? `🎉 Siz <b>${mod}</b> modulini muvaffaqiyatli yakunladingiz, modul <b>100%</b> yakunlandi.
       Sizga <b>${date}</b> kuni soat <b>${time}</b> ga <b>${mentor}</b> mentor bilan Demo Day belgilangan.`
    : `<b>${mod}</b> moduli bajarilishi hozir <b>${progress}%</b>.
       Sizga <b>${date}</b> kuni soat <b>${time}</b> ga <b>${mentor}</b> mentor bilan Demo Day belgilangan.`;

  function tick() {
    if (Date.now() >= at.getTime()) {            // o'tib ketdi — yo'qoladi
      card.hidden = true;
      arrangeWidgets();
      return;
    }
    card.hidden = false;
    const left = Math.max(0, Math.floor((at - Date.now()) / 1000));
    document.getElementById('ddDays').textContent  = pad(Math.floor(left / 86400));
    document.getElementById('ddHours').textContent = pad(Math.floor(left % 86400 / 3600));
    document.getElementById('ddMins').textContent  = pad(Math.floor(left % 3600 / 60));
    document.getElementById('ddSecs').textContent  = pad(left % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Qo'shimcha dars ----------
   BOOK qilingan kuni ko'rinadi. Vaqtida kirmasa — kun oxirigacha
   "kirmadingiz" holatida turadi. */
(function extraLesson() {
  const e = S.extraLesson;
  if (!e || !isToday(e.at)) return;

  const card = document.getElementById('elCard');
  const { at, module: mod, topic, mentor } = e;
  const pad  = n => String(n).padStart(2, '0');
  const date = `${at.getDate()}-${UZ_MONTHS[at.getMonth()]}`;
  const time = `${pad(at.getHours())}:${pad(at.getMinutes())}`;
  card.hidden = false;

  const note  = card.querySelector('.el-note');
  const timer = card.querySelector('.dd-timer');

  function tick() {
    const missed = Date.now() >= at.getTime() && !e.attended;
    document.getElementById('elWhen').textContent = `${date}, ${time}`;

    if (missed) {                                 // vaqti o'tdi, kirmagan
      card.classList.add('el-missed');
      timer.hidden = true;
      document.getElementById('elMsg').innerHTML =
        `⚠️ Siz bugun soat <b>${time}</b> ga belgilangan qo'shimcha darsga kirmadingiz.
         Mavzu: «${topic}», mentor — <b>${mentor}</b>.`;
      note.textContent = 'Mentorga yozib, darsni boshqa kunga ko\'chiring';
      return;
    }

    timer.hidden = false;
    document.getElementById('elMsg').innerHTML =
      `📌 Sizga <b>${mod}</b>dagi «${topic}» mavzusi bo'yicha <b>${mentor}</b> mentor bilan
       qo'shimcha dars belgilangan.<br>Dars vaqti: <b>${date}</b>, soat <b>${time}</b>.`;
    const left = Math.max(0, Math.floor((at - Date.now()) / 1000));
    document.getElementById('elHours').textContent = pad(Math.floor(left / 3600));
    document.getElementById('elMins').textContent  = pad(Math.floor(left % 3600 / 60));
    document.getElementById('elSecs').textContent  = pad(left % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Kunlik chek-list ----------
   Har kuni yangilanadi. Barcha kurslar bajarilsa — avtomatik +30 coin. */
(function checklist() {
  const items = S.checklist;
  const done  = items.filter(i => i.done).length;
  const total = items.length;
  const left  = total - done;

  document.getElementById('clCount').textContent = `${done} / ${total} bajarildi`;
  document.getElementById('clBar').style.width   = Math.round(done / total * 100) + '%';

  document.getElementById('clList').innerHTML = items.map(i => `
    <li class="cl-item${i.done ? ' done' : ''}">
      <span class="cl-mark">${i.done ? '✓' : ''}</span>
      <span class="cl-txt">
        <b class="cl-name">${i.name}</b>
        <span class="cl-task">«${i.task}» · ${i.note}</span>
      </span>
      ${i.done ? '' : '<svg class="cl-go" width="16" height="16"><use href="#i-chev-r"/></svg>'}
    </li>`).join('');

  const claim = document.getElementById('clClaim');
  const title = document.getElementById('clClaimTitle');
  const sub   = document.getElementById('clClaimSub');

  if (left === 0) {                    // to'liq bajarildi — coin avtomatik qo'shiladi
    state.coins += CHECKLIST_REWARD;
    syncBalances();
    claim.classList.add('taken');
    title.textContent = `+${CHECKLIST_REWARD} coin qo'shildi`;
    sub.textContent   = 'Chek-list bajarildi — do\'konda sarflashingiz mumkin';
    toast(`🪙 Chek-list bajarildi! +${CHECKLIST_REWARD} coin`);
  } else {
    title.textContent = `Yana ${left} ta dars`;
    sub.textContent   = `To'liq bajarsangiz +${CHECKLIST_REWARD} coin`;
  }
})();

/* ---------- Kurs tavsiyasi ----------
   Asosiy kursda 3 kun ketma-ket dars bo'lmasa chiqadi.
   3 kun ketma-ket dars qilinsa — yo'qoladi. */
const SUGGEST_AFTER_IDLE = 3;
const SUGGEST_POOL = {
  'Ingliz tili':   { hook: 'Har kuni 10 daqiqa — natija seziladi 🇬🇧', outcome: 'birinchi darsda 20 ta yangi so\'z o\'rganasiz' },
  'Grafik dizayn': { hook: 'Kod yozmasdan ijod qilishni sinab ko\'ring 🎨', outcome: 'Canva\'da o\'z birinchi posteringizni yasaysiz' },
  'Typing':        { hook: 'Klaviaturaga qaramay yozishni o\'rganing ⌨️', outcome: 'birinchi darsda tezligingizni o\'lchaysiz' },
  'Matematika':    { hook: 'Miyani mashq qildiradigan kurs 🧮', outcome: 'birinchi darsda mental hisobni sinab ko\'rasiz' },
};

(function suggestCourse() {
  if (S.idleDays < SUGGEST_AFTER_IDLE || !S.suggest) return;

  const { name, targetId } = S.suggest;
  const tone = SUGGEST_POOL[name] || SUGGEST_POOL['Grafik dizayn'];
  document.getElementById('sgCard').hidden = false;
  document.getElementById('sgName').textContent   = name + ' kursi';
  document.getElementById('sgBtnTxt').textContent = name + ' kursini ochish';
  document.getElementById('sgMsg').innerHTML =
    `<b>${tone.hook}</b>
     <b>${name}</b> — Junior'dagi eng yangi kurs.
     Hozir <b>${S.module}</b> ustida ishlayapsiz, ikkalasi birga yaxshi ishlaydi.
     Birinchi darsda ${tone.outcome}.`;

  document.getElementById('sgBtn').addEventListener('click', () => {
    const tab = document.querySelector('.nav-tab[data-view="kurslar"]');
    if (tab && !tab.classList.contains('active')) tab.click();
    const card = document.getElementById(targetId) || document.getElementById('courseDesign');
    card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    card.classList.remove('flash');
    void card.offsetWidth;
    card.classList.add('flash');
    toast(`${name} kursi ochilmoqda… 🎨`);
  });
})();

/* ---------- O'z vaqtida to'lov bonusi ----------
   To'lovga N kun qolganda chiqadi, to'langach yo'qoladi. */
(function paymentBonus() {
  const p = S.payment;
  if (!p || p.paid) return;

  const left = Math.round((dayKey(p.date) - dayKey(now)) / 86400000);
  if (left < 0 || left > p.windowDays) return;

  const pad = n => String(n).padStart(2, '0');
  document.getElementById('bonusCard').hidden = false;
  document.getElementById('bonusLeft').textContent =
    left === 0 ? 'Bugun to\'lov kuningiz' : `To'lovingizga ${left} kun qoldi`;
  document.getElementById('bonusDate').textContent =
    `${pad(p.date.getDate())}.${pad(p.date.getMonth() + 1)}.${p.date.getFullYear()}`;
})();

/* ================= Vidjetlar tartibi =================
   Muhim eslatmalar: Demo Day → Qo'shimcha dars → Vebinar → To'lov.
   Kechqurun 19:00–00:00 da chek-list ularning ortidan birinchi bo'lib chiqadi,
   aks holda strayk oldinda. Kalendar doim oxirida.                          */
const EVENING_FROM = 19;

function arrangeWidgets() {
  const shown = id => { const el = document.getElementById(id); return el && !el.hidden; };
  const evening = new Date().getHours() >= EVENING_FROM;

  const seq = [];
  ['ddCard', 'elCard', 'webinarCard', 'bonusCard'].forEach(id => { if (shown(id)) seq.push(id); });
  seq.push(...(evening ? ['clCard', 'streakCard'] : ['streakCard', 'clCard']));
  seq.push('mentorCard', 'sgCard', 'calCard');

  seq.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.style.order = i;
  });
}
arrangeWidgets();
setInterval(arrangeWidgets, 30000);   // kun/vaqt o'zgarsa tartib o'zi yangilanadi

/* ---------- Aktivlik kalendari ---------- */
const CAL_COURSES = ['Dasturlash kursi', 'Ingliz tili kursi', 'Matematika kursi'];

/* Namuna ma'lumoti. st: full | part | rej | view | none, c: kurs indekslari */
const CAL_DAYS = {
  1:  { st: 'full', c: [0, 1] },     2:  { st: 'full', c: [0] },
  3:  { st: 'part', c: [0, 2] },     4:  { st: 'full', c: [0, 1, 2] },
  5:  { st: 'view', c: [1] },        6:  { st: 'full', c: [0, 1] },
  7:  { st: 'full', c: [0, 1] },     8:  { st: 'rej',  c: [0] },
  9:  { st: 'none', c: [] },         10: { st: 'full', c: [0, 2] },
  11: { st: 'part', c: [1] },        12: { st: 'full', c: [0, 1] },
  13: { st: 'full', c: [0] },        14: { st: 'view', c: [0, 2] },
  15: { st: 'full', c: [0, 1, 2] },  16: { st: 'rej',  c: [1] },
  17: { st: 'full', c: [0] },        18: { st: 'part', c: [0, 1] },
  19: { st: 'full', c: [1, 2] },     20: { st: 'none', c: [] },
  21: { st: 'full', c: [0, 1] },     22: { st: 'full', c: [0] },
  23: { st: 'view', c: [1] },        24: { st: 'part', c: [0, 2] },
  25: { st: 'full', c: [0, 1] },     26: { st: 'rej',  c: [0, 1] },
  27: { st: 'full', c: [2] },        28: { st: 'full', c: [0, 1] },
  29: { st: 'part', c: [0] },        30: { st: 'full', c: [0, 1, 2] },
  31: { st: 'full', c: [0, 1, 2] },
};

/* har bir holatda qaysi bosqich bajarilgani */
const CAL_STEPS = {
  full: [['Dars', 'ok'],   ['Test', 'ok'], ['Amaliy vazifa', 'ok']],
  part: [['Dars', 'ok'],   ['Test', 'ok'], ['Amaliy vazifa', '']],
  rej:  [['Dars', 'ok'],   ['Test', 'ok'], ['Amaliy vazifa', 'warn']],
  view: [['Dars', 'ok'],   ['Test', ''],   ['Amaliy vazifa', '']],
};
const CAL_ICON = { ok: '✓', warn: '✕', '': '⏳' };

(function renderCalendar() {
  const Y = 2026, M = 7;                                  // avgust 2026
  const DAYS = new Date(Y, M + 1, 0).getDate();
  const offset = (new Date(Y, M, 1).getDay() + 6) % 7;    // Du=0 … Ya=6
  const DOW = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];

  const grid   = document.getElementById('calGrid');
  const detail = document.getElementById('calDetail');
  const hint   = document.getElementById('calHint');

  const joinUz = a => a.length < 2 ? (a[0] || '') : `${a.slice(0, -1).join(', ')} va ${a[a.length - 1]}`;

  let cells = '';
  for (let i = 0; i < offset; i++) cells += '<span class="cal-cell empty"></span>';
  for (let d = 1; d <= DAYS; d++) {
    const st = (CAL_DAYS[d] || {}).st || 'none';
    cells += `<button class="cal-cell st-${st}${d === todayNum ? ' today' : ''}" data-day="${d}"
                 title="${d}-avgust">${d}</button>`;
  }
  grid.innerHTML = cells;

  function buildDetail(d) {
    const info  = CAL_DAYS[d] || { st: 'none', c: [] };
    const names = info.c.map(i => CAL_COURSES[i]);
    const list  = joinUz(names);
    const when  = d === todayNum ? 'Bugun' : `${d}-avgust kuni`;

    const text =
      info.st === 'full' ? `${when} siz <b>${list}</b>dan vazifalaringizni to'liq topshirdingiz 🎉` :
      info.st === 'part' ? `${when} <b>${list}</b>dan darsni ko'rib, testni topshirdingiz. Amaliy vazifa hali yuborilmagan ⏳` :
      info.st === 'rej'  ? `${when} <b>${list}</b>dan hammasini bajardingiz, ammo amaliy vazifa tekshiruvdan o'tmadi — qayta topshirish kerak 🔁` :
      info.st === 'view' ? `${when} faqat <b>${list}</b> darsini ko'rdingiz. Test va amaliy vazifa bajarilmagan 👀` :
                           'Bu kuni hech qanday faoliyat qayd etilmagan 😴';

    const steps = CAL_STEPS[info.st] || [];
    const courses = names.map(n => `
      <div class="cal-d-course">
        <span class="cal-d-name">${n}</span>
        <div class="cal-d-steps">
          ${steps.map(([lbl, cls]) => `<span class="cal-d-step ${cls}">${CAL_ICON[cls]} ${lbl}</span>`).join('')}
        </div>
      </div>`).join('');

    return `
      <div class="cal-d-head">
        <span class="cal-d-date">${d}-avgust</span>
        <span class="cal-d-dow">${DOW[(new Date(Y, M, d).getDay() + 6) % 7]}</span>
        <button class="cal-d-close" aria-label="Yopish">✕</button>
      </div>
      <p class="cal-d-text">${text}</p>
      ${courses}`;
  }

  function closeDetail() {
    grid.querySelectorAll('.picked').forEach(c => c.classList.remove('picked'));
    detail.hidden = true;
    hint.hidden = false;
    picked = null;
  }

  let picked = null;
  grid.addEventListener('click', e => {
    const btn = e.target.closest('button.cal-cell');
    if (!btn) return;
    const d = +btn.dataset.day;
    if (picked === d) { closeDetail(); return; }
    picked = d;
    grid.querySelectorAll('.picked').forEach(c => c.classList.remove('picked'));
    btn.classList.add('picked');
    detail.innerHTML = buildDetail(d);
    detail.hidden = false;
    hint.hidden = true;
    detail.querySelector('.cal-d-close').addEventListener('click', closeDetail);
  });

  /* ranglar izohi — bosilganda ochiladi */
  const lgBtn = document.getElementById('calLegendBtn');
  const lgBox = document.getElementById('calLegend');
  lgBtn.addEventListener('click', () => {
    const open = lgBox.hidden;
    lgBox.hidden = !open;
    lgBtn.setAttribute('aria-expanded', String(open));
  });
})();

/* ---------- CoinShop ---------- */
document.querySelectorAll('.shop-item').forEach(item => {
  const price = +item.dataset.price;
  item.querySelector('.btn').addEventListener('click', () => {
    if (item.classList.contains('bought')) { toast('Bu mahsulot allaqachon sotib olingan ✅'); return; }
    if (state.coins < price) { toast('Coin yetarli emas 😅 Darslarni bajarib coin yig‘ing!'); return; }
    state.coins -= price;
    syncBalances();
    item.classList.add('bought');
    item.querySelector('.btn').textContent = 'Sotib olindi';
    toast(`✅ Sotib olindi! −${fmt(price)} coin`);
  });
});
syncBalances();

/* ---------- Junior mentor chat ---------- */
const chatPop = document.getElementById('chatPop');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');

document.getElementById('chatFab').addEventListener('click', () => {
  chatPop.hidden = !chatPop.hidden;
  if (!chatPop.hidden) chatInput.focus();
});
document.getElementById('chatClose').addEventListener('click', () => { chatPop.hidden = true; });

const REPLIES = [
  'Bu prototip versiyasi — tez orada mentor jonli javob beradi 💬',
  "Kurs bo'yicha savollarni darsda ham berishingiz mumkin 📚",
  "Bugun 18:00 da Live Webinar bor — o'tkazib yubormang! 🎥",
  "HTML modulini tugatishga 2 kun qoldi. Davom etamizmi? 💪",
];
let replyIdx = 0;

function addMsg(text, who) {
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

document.getElementById('chatForm').addEventListener('submit', e => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addMsg(text, 'me');
  chatInput.value = '';
  setTimeout(() => addMsg(REPLIES[replyIdx++ % REPLIES.length], 'bot'), 650);
});

/* ---------- Mentor yordami vidjeti — chatni ochadi ---------- */
document.getElementById('aiOpen').addEventListener('click', () => {
  chatPop.hidden = false;
  chatInput.focus();
});
