/* ============ Junior — prototype logic ============ */

/* ---------- TEST/DEMO rejimi ----------
   "Bugun" sifatida 2026-yil 31-avgust, soat 09:00 qabul qilinadi,
   shundan keyin vaqt real tezlikda (jonli) davom etadi.
   ESLATMA: bu vaqtinchalik test bloki, productionga chiqishdan oldin
   o'chirilishi kerak. */
const TEST_NOW_OFFSET_MS = new Date(2026, 7, 20, 9, 0, 0).getTime() - Date.now();
const _RealDate = Date;
function TestDate(...args) {
  if (args.length === 0) return new _RealDate(_RealDate.now() + TEST_NOW_OFFSET_MS);
  return new _RealDate(...args);
}
TestDate.now = () => _RealDate.now() + TEST_NOW_OFFSET_MS;
TestDate.prototype = _RealDate.prototype;
Date = TestDate;

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
const dayAt = (offsetDays, h, m = 0) => { const d = new Date(); d.setDate(d.getDate() + offsetDays); d.setHours(h, m, 0, 0); return d; };
const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
                   'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
const dayKey  = d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const isToday = d => d && dayKey(d) === dayKey(now);

const PROFILES = {};

PROFILES.demoTest = {
  name: 'Sheraliyev Abdulrauf',
  coins: 24500,
  mainCourse: 'Dasturlash kursi',
  module: 'HTML',
  idleDays: 0,
  forceSuggest: true,        // "Sizga tavsiya" vidjetini shartsiz chiqarish
  streak: 31,
  bestStreak: 31,
  monthActiveDays: 31,       // avgustni 31/31 kun bilan yakunlagan
  monthReward: 500,          // shu profil uchun oylik challenge mukofoti

  checklist: [
    { name: 'Dasturlash kursi', task: 'Amaliy ish. DOM eventlari va selectorlari', note: 'qabul qilindi',    done: true  },
    { name: 'Ingliz tili',      task: 'Unit 12. Past Simple',                     note: 'qabul qilindi',    done: true  },
    { name: 'Matematika',       task: 'Mental hisob · 12-dars',                   note: 'qabul qilindi',    done: true  },
    { name: 'Telegram Bot',     task: 'Telegram bot. Kirish darsi',               note: 'hali boshlanmagan', done: false },
  ],

  demoDay:     { at: dayAt(1, 15, 0), mentor: 'Ali G\'aybullayev', module: 'HTML', progress: 100 },
  extraLesson: { at: dayAt(1, 14, 0), mentor: 'Ali G\'aybullayev', module: 'HTML',
                 topic: 'Inline elementlari', attended: false },
  webinars: [
    { course: 'IT', at: dayAt(1, 18, 0), durationMin: 60 },
    { course: 'Grafik dizayn',     at: dayAt(1, 19, 0), durationMin: 60 },
  ],
  payment:     { date: dayAt(1, 0, 0), paid: false, windowDays: 3, reward: 100 },

  suggest: { name: 'Sun\'iy Intellekt', targetId: 'courseAI' },
  calendar: { green: 25, red: 2, gray: 3 },
};

/* 2-o'quvchi: ertaga Demo Day, 2 ta vebinar, chek-list 3/3 (claim+konfetti), to'lovga 2 kun qoldi */
PROFILES.student2 = {
  name: 'Nodira Yusupova',
  coins: 8340,
  mainCourse: 'Dasturlash kursi',
  module: 'HTML',
  idleDays: 0,
  streak: 10,
  bestStreak: 14,
  monthActiveDays: 10,
  monthReward: 100,
  checklist: [
    { name: 'Dasturlash kursi', task: 'Amaliy ish. HTML',        note: 'qabul qilindi', done: true },
    { name: 'Matematika',       task: 'Mental hisob · 10-dars',  note: 'qabul qilindi', done: true },
    { name: 'Ingliz tili',      task: 'Unit 10. Present Perfect', note: 'qabul qilindi', done: true },
  ],
  demoDay:     { at: dayAt(2, 10, 0), mentor: 'Ali G\'aybullayev', module: 'HTML', progress: 100 },
  extraLesson: null,
  webinars: [
    { course: 'IT', at: dayAt(1, 19, 0), durationMin: 60 },
    { course: 'Grafik dizayn', at: dayAt(1, 20, 0), durationMin: 60 },
  ],
  payment: { date: dayAt(2, 0, 0), paid: false, windowDays: 3, reward: 100 },
  calendar: { green: 5, red: 2, gray: 3 },
};

/* 3-o'quvchi: ertaga Qo'shimcha dars (Form elementlari), 1 ta vebinar, chek-list 1/2 */
PROFILES.student3 = {
  name: 'Jasur Tursunov',
  coins: 15200,
  mainCourse: 'Dasturlash kursi',
  module: 'HTML',
  idleDays: 0,
  streak: 15,
  bestStreak: 15,
  monthActiveDays: 15,
  monthReward: 100,
  checklist: [
    { name: 'Ingliz tili',      task: 'Unit 15. Comparatives',    note: 'qabul qilindi',     done: true  },
    { name: 'Dasturlash kursi', task: 'Amaliy ish. Formalar',     note: 'hali boshlanmagan', done: false },
  ],
  demoDay:     null,
  extraLesson: { at: dayAt(3, 9, 0), mentor: 'Ali G\'aybullayev', module: 'HTML',
                 topic: 'Form elementlari', attended: false },
  webinars: [{ course: 'IT', at: dayAt(1, 17, 0), durationMin: 60 }],
  payment: { date: dayAt(10, 0, 0), paid: false, windowDays: 3, reward: 100 },
  calendar: { green: 10, red: 2, gray: 3 },
};

/* 5-o'quvchi: faqat vebinar (Grafik dizayn), chek-list 2/3, "Matematika" tavsiya, to'lovga 3 kun qoldi */
PROFILES.student5 = {
  name: 'Bekzod Nurmatov',
  coins: 3200,
  forceSuggest: true,
  mainCourse: 'Dasturlash kursi',
  module: 'HTML',
  idleDays: 0,
  streak: 30,
  bestStreak: 30,
  monthActiveDays: 30,
  monthReward: 100,
  checklist: [
    { name: 'Ingliz tili',      task: 'Unit 20. Future Simple', note: 'qabul qilindi', done: true  },
    { name: 'Dasturlash kursi', task: 'Amaliy ish. JS asoslari', note: 'qabul qilindi', done: true  },
    { name: 'Matematika',       task: 'Mental hisob · 20-dars', note: 'hali boshlanmagan', done: false },
  ],
  demoDay: null,
  extraLesson: null,
  webinars: [{ course: 'Grafik dizayn', at: dayAt(4, 20, 0), durationMin: 60 }],
  payment: { date: dayAt(3, 0, 0), paid: false, windowDays: 3, reward: 100 },
  suggest: { name: 'Matematika', targetId: 'courseMath' },
  calendar: { green: 20, red: 5, gray: 5 },
};

/* Test panelida ko'rsatiladigan profil ro'yxati (tavsif bilan) */
const PROFILE_META = [
  { key: 'demoTest', desc: 'Bugun Demo Day, Qo\'shimcha dars, 2 ta vebinar, to\'lov bonusi, 31 kunlik strayk — barcha vidjetlar faol.' },
  { key: 'student2', desc: '2 kundan keyin Demo Day, vebinarlar bugun va ertaga, chek-list 3/3 (mukofot tayyor), to\'lovga 2 kun qoldi.' },
  { key: 'student3', desc: '3 kundan keyin Qo\'shimcha dars (Form elementlari), vebinar ertaga, chek-list 1/2.' },
  { key: 'student5', desc: '4 kundan keyin vebinar (Grafik dizayn), chek-list 2/3, "Matematika" tavsiya etiladi, to\'lovga 3 kun qoldi.' },
].map((p, i) => ({ ...p, label: `${i + 1}. ${PROFILES[p.key].name}` }));

const _profileParam = new URLSearchParams(location.search).get('profile');
const _activeProfileKey = (_profileParam && PROFILES[_profileParam]) ? _profileParam : 'demoTest';
const S = PROFILES[_activeProfileKey];

document.getElementById('heroName').textContent = S.name;
const _youRowGuruh  = BOARDS.guruh.find(p => p.you);
const _youRowBarcha = BOARDS.barcha.find(p => p.you);
if (_youRowGuruh)  _youRowGuruh.name  = S.name;
if (_youRowBarcha) _youRowBarcha.name = S.name;
renderBoard();

/* ---------- Test paneli: profil almashtirish ---------- */
(function testPanel() {
  const select = document.getElementById('profileSelect');
  const desc   = document.getElementById('profileDesc');

  select.innerHTML = PROFILE_META.map(p =>
    `<option value="${p.key}"${p.key === _activeProfileKey ? ' selected' : ''}>${p.label}</option>`).join('');

  const current = PROFILE_META.find(p => p.key === _activeProfileKey);
  desc.textContent = current ? current.desc : '—';

  select.addEventListener('change', () => {
    const url = new URL(location.href);
    url.searchParams.set('profile', select.value);
    location.href = url.toString();
  });
})();

const CHECKLIST_REWARD = 30;   // to'liq chek-list uchun
const MONTH_REWARD     = 100;  // oyni to'liq bosib o'tgani uchun

/* ---------- Strayk haftasi ---------- */
const WEEK = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
const todayNum = now.getDate();
const todayDow = now.getDay() || 7;                 // 1=Du … 7=Ya
// strayk 7 kun yoki undan uzunroq bo'lsa — haftaning hamma kuni yonadi,
// aks holda faqat shu kungacha bo'lgan kunlar yonadi
const streakActive = WEEK.map((_, i) =>
  S.streak >= 7 ? 1 : (i + 1 <= todayDow ? (S.streak > i ? 1 : 0) : 0));

document.getElementById('streakWeek').innerHTML = WEEK.map((d, i) => `
  ${i > 0 ? `<span class="week-connector ${streakActive[i - 1] && streakActive[i] ? 'on' : 'off'}"></span>` : ''}
  <div class="week-day ${streakActive[i] ? 'on' : 'off'}${i + 1 === todayDow ? ' today' : ''}">
    <span class="week-flame">🔥</span>
    <span class="week-label">${d}</span>
  </div>`).join('');

document.querySelector('#streakCard .big-num').textContent = `${S.streak} kun`;
document.querySelectorAll('#streakCard .duo-stats b')[0].textContent = `${S.streak} kun`;
document.querySelectorAll('#streakCard .duo-stats b')[1].textContent = `${S.bestStreak} kun`;

/* ---------- Strayk oylik taqvimi (katta olovga bosilganda ochiladi) ---------- */
(function streakModal() {
  const overlay   = document.getElementById('streakModalOverlay');
  const openBtn   = document.getElementById('streakFlameBtn');
  const closeBtn  = document.getElementById('streakModalClose');
  const grid      = document.getElementById('streakModalGrid');
  const dow       = document.getElementById('streakModalDow');
  const monthName = document.getElementById('streakMonthName');
  const countEl   = document.getElementById('streakModalCount');

  dow.innerHTML = WEEK.map(d => `<span>${d}</span>`).join('');

  function render() {
    const Y = now.getFullYear(), M = now.getMonth();
    const total      = new Date(Y, M + 1, 0).getDate();
    const activeDays = Math.min(S.monthActiveDays, total);
    const offset     = (new Date(Y, M, 1).getDay() + 6) % 7;   // Du=0 … Ya=6

    monthName.textContent = UZ_MONTHS[M][0].toUpperCase() + UZ_MONTHS[M].slice(1);
    countEl.textContent = `${activeDays} / ${total}`;

    let cells = '';
    for (let i = 0; i < offset; i++) cells += '<span></span>';
    for (let d = 1; d <= total; d++) {
      const on = d <= activeDays;
      cells += `<span class="streak-day-cell${on ? ' on' : ''}${d === todayNum ? ' today' : ''}">${d}</span>`;
    }
    grid.innerHTML = cells;
  }

  openBtn.addEventListener('click', () => { render(); overlay.hidden = false; });
  closeBtn.addEventListener('click', () => { overlay.hidden = true; });
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.hidden = true; });

  // hozircha faqat joriy oy bo'yicha ma'lumot bor
  document.getElementById('streakMonthPrev').disabled = true;
  document.getElementById('streakMonthNext').disabled = true;
})();

/* ---------- Oylik challenge ----------
   Har kunlik amaliy topshirilganda progress to'ladi.
   Oy to'liq bosib o'tilsa — tugma bosilganda mukofot beriladi. */
(function monthlyChallenge() {
  const total  = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const done   = Math.min(S.monthActiveDays, total);
  const left   = total - done;
  const pct    = Math.round(done / total * 100);
  const reward = S.monthReward || MONTH_REWARD;

  document.getElementById('chTotal').textContent = total;
  document.getElementById('chDone').textContent  = done;
  document.getElementById('chLeft').textContent  = `${left} kun`;
  document.getElementById('chBar').style.width   = pct + '%';
  document.getElementById('chBadge').textContent = `${done} / ${total} kun`;
  document.getElementById('chRewardTxt').textContent = `+${reward} coin`;
  document.getElementById('chRuleReward').textContent = `qo'shimcha +${reward} coin`;

  const toggle = document.getElementById('chToggle');
  const info   = document.getElementById('chInfo');
  toggle.addEventListener('click', () => {
    const open = info.hidden;
    info.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });

  if (left === 0) {                       // oy yakunlandi — mukofot tugma bosilganda
    document.getElementById('chClaim').hidden = false;
    document.getElementById('chClaimDone').textContent = `${done}/${total}`;

    const claimBtn = document.getElementById('chClaimBtn');
    claimBtn.addEventListener('click', () => {
      if (claimBtn.classList.contains('claimed')) return;
      state.coins += reward;
      syncBalances();
      launchConfetti();
      claimBtn.classList.add('claimed');
      document.getElementById('chClaimBtnTxt').textContent = `Olindi ✅ +${reward} coin`;
      toast(`🏆 G'alaba! +${reward} coin hisobingizga qo'shildi`);
    });
  }
})();

function launchConfetti() {
  const COLORS = ['#FF7A2F', '#7C66F2', '#23B457', '#4F46E5', '#E0529C', '#F2C230'];
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  document.body.appendChild(layer);
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = COLORS[i % COLORS.length];
    piece.style.setProperty('--drift', `${Math.random() * 160 - 80}px`);
    piece.style.setProperty('--rot', `${Math.random() * 540}deg`);
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    piece.style.animationDuration = `${2.2 + Math.random() * 1.2}s`;
    layer.appendChild(piece);
  }
  setTimeout(() => layer.remove(), 3800);
}

/* ---------- Vebinar ----------
   Jonli efir bo'lsa kun boshidan kun oxirigacha ko'rinadi.
   "Qo'shilish" tugmasi boshlanishiga 30 daqiqa qolganda ochiladi.
   Efir tugagach vidjet yo'qoladi. */
const WEBINAR_OPEN_MIN = 30;
const WEBINAR_CARD_IDS = [];   // arrangeWidgets shu ro'yxatdan foydalanadi

(function webinars() {
  const list = (S.webinars || []).filter(w => dayKey(w.at) >= dayKey(now));
  const container = document.getElementById('webinarList');
  const template = document.getElementById('webinarTemplate');
  const pad = n => String(n).padStart(2, '0');

  list.forEach((w, i) => {
    const id = `webinarCard${i}`;
    WEBINAR_CARD_IDS.push(id);

    const card = template.content.firstElementChild.cloneNode(true);
    card.id = id;
    container.appendChild(card);

    const endsAt = new Date(w.at.getTime() + w.durationMin * 60000);
    const join   = card.querySelector('.webinar-join');
    const timer  = card.querySelector('.webinar-timer');
    const live   = card.querySelector('.webinar-live');
    const hint   = card.querySelector('.webinar-hint');

    card.querySelector('.webinar-desc').textContent = `${w.course} bo'yicha qiziqarli mavzu — efirda bilib olasiz 🔓`;
    card.querySelector('.webinar-when').textContent = isToday(w.at)
      ? 'Bugun' : `${w.at.getDate()}-${UZ_MONTHS[w.at.getMonth()]}`;
    card.querySelector('.webinar-time').textContent = `${pad(w.at.getHours())}:${pad(w.at.getMinutes())}`;

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
      const started = left === 0;

      join.disabled = !open;
      join.classList.toggle('btn-disabled', !open);
      hint.hidden = open;

      timer.hidden = started;
      live.hidden  = !started;
      if (!started) {
        card.querySelector('.wb-days').textContent  = pad(Math.floor(left / 86400));
        card.querySelector('.wb-hours').textContent = pad(Math.floor(left % 86400 / 3600));
        card.querySelector('.wb-mins').textContent  = pad(Math.floor(left % 3600 / 60));
        card.querySelector('.wb-secs').textContent  = pad(left % 60);
      }
    }
    tick();
    setInterval(tick, 1000);
  });
})();

/* ---------- Demo Day ----------
   Faqat BOOK qilingan kuni ko'rinadi, o'tib ketgach yo'qoladi. */

(function demoDay() {
  const e = S.demoDay;
  if (!e || dayKey(e.at) < dayKey(now)) return;   // bugungi yoki kelajakdagi kun bo'lsa ko'rinadi

  const card = document.getElementById('ddCard');
  const { at, module: mod, progress, mentor } = e;
  const pad  = n => String(n).padStart(2, '0');
  const date = `${at.getDate()}-${UZ_MONTHS[at.getMonth()]}`;
  const time = `${pad(at.getHours())}:${pad(at.getMinutes())}`;

  document.getElementById('ddWhen').textContent = `${date}, ${time}`;
  document.getElementById('ddPct').textContent  = progress + '%';
  document.getElementById('ddBar').style.width  = progress + '%';
  const timer  = card.querySelector('.dd-timer');
  const note   = card.querySelector('.dd-note');
  const cancel = document.getElementById('ddCancel');

  function tick() {
    const missed = Date.now() >= at.getTime();
    card.hidden = false;
    card.dataset.missed = missed ? '1' : '0';

    if (missed) {                                // vaqti o'tdi, kirmagan
      card.classList.add('dd-missed');
      timer.hidden = true;
      note.hidden = true;
      cancel.hidden = true;
      document.getElementById('ddMsg').innerHTML =
        `⚠️ Sizda bugun soat <b>${time}</b> ga belgilangan Demo Day bor edi, kirmadingiz.
         Mentor — <b>${mentor}</b>.`;
      return;
    }

    card.classList.remove('dd-missed');
    timer.hidden = false;
    note.hidden = false;
    document.getElementById('ddMsg').innerHTML = progress >= 100
      ? `🎉 Siz <b>${mod}</b> modulini muvaffaqiyatli yakunladingiz, modul <b>100%</b> yakunlandi.
         Sizga <b>${date}</b> kuni soat <b>${time}</b> ga <b>${mentor}</b> mentor bilan Demo Day belgilangan.`
      : `<b>${mod}</b> moduli bajarilishi hozir <b>${progress}%</b>.
         Sizga <b>${date}</b> kuni soat <b>${time}</b> ga <b>${mentor}</b> mentor bilan Demo Day belgilangan.`;

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
  if (!e || dayKey(e.at) < dayKey(now)) return;

  const card = document.getElementById('elCard');
  const { at, module: mod, topic, mentor } = e;
  const pad  = n => String(n).padStart(2, '0');
  const date = `${at.getDate()}-${UZ_MONTHS[at.getMonth()]}`;
  const time = `${pad(at.getHours())}:${pad(at.getMinutes())}`;
  card.hidden = false;

  const note   = card.querySelector('.el-note');
  const timer  = card.querySelector('.dd-timer');
  const cancel = document.getElementById('elCancel');

  function tick() {
    const missed = Date.now() >= at.getTime() && !e.attended;
    card.dataset.missed = missed ? '1' : '0';
    document.getElementById('elWhen').textContent = `${date}, ${time}`;

    if (missed) {                                 // vaqti o'tdi, kirmagan
      card.classList.add('el-missed');
      timer.hidden = true;
      cancel.hidden = true;
      document.getElementById('elMsg').innerHTML =
        `⚠️ Siz bugun soat <b>${time}</b> ga belgilangan qo'shimcha darsga kirmadingiz.
         Mavzu: «${topic}», mentor — <b>${mentor}</b>.`;
      note.textContent = 'Mentorga yozib, darsni boshqa kunga ko\'chiring';
      return;
    }

    timer.hidden = false;
    cancel.hidden = false;
    document.getElementById('elMsg').innerHTML =
      `📌 Sizga <b>${mod}</b>dagi «${topic}» mavzusi bo'yicha <b>${mentor}</b> mentor bilan
       qo'shimcha dars belgilangan.<br>Dars vaqti: <b>${date}</b>, soat <b>${time}</b>.`;
    const left = Math.max(0, Math.floor((at - Date.now()) / 1000));
    document.getElementById('elDays').textContent  = pad(Math.floor(left / 86400));
    document.getElementById('elHours').textContent = pad(Math.floor(left % 86400 / 3600));
    document.getElementById('elMins').textContent  = pad(Math.floor(left % 3600 / 60));
    document.getElementById('elSecs').textContent  = pad(left % 60);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- Kunlik chek-list ----------
   Har kuni yangilanadi. Barcha kurslar bajarilsa — tugma bosilganda +30 coin. */
(function checklist() {
  const items = S.checklist;
  const done  = items.filter(i => i.done).length;
  const total = items.length;
  const left  = total - done;

  document.getElementById('clCount').textContent = `${done}/${total}`;
  document.getElementById('clBar').style.width   = Math.round(done / total * 100) + '%';

  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const hoursLeft = Math.max(0, Math.ceil((midnight - Date.now()) / 3600000));
  document.getElementById('clTimeLeft').textContent = `${hoursLeft} soat qoldi`;

  document.getElementById('clDots').innerHTML = items.map((i, idx) => `
    ${idx > 0 ? `<span class="cl-dot-line${items[idx - 1].done ? ' done' : ''}"></span>` : ''}
    <span class="cl-dot-check${i.done ? ' done' : ''}">✓</span>`).join('');
  document.getElementById('clDotsReward').textContent = `+${CHECKLIST_REWARD} coin`;

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

  if (left === 0) {                    // to'liq bajarildi — tugma bosilishini kutadi
    claim.classList.add('ready');
    title.textContent = `+${CHECKLIST_REWARD} coin olish`;
    sub.textContent   = 'Barcha darslar bajarildi — mukofotni oling';

    claim.addEventListener('click', () => {
      if (claim.classList.contains('taken')) return;
      state.coins += CHECKLIST_REWARD;
      syncBalances();
      launchConfetti();
      claim.classList.remove('ready');
      claim.classList.add('taken');
      title.textContent = `+${CHECKLIST_REWARD} coin qo'shildi`;
      sub.textContent   = 'Chek-list bajarildi — do\'konda sarflashingiz mumkin';
      toast(`🪙 Chek-list bajarildi! +${CHECKLIST_REWARD} coin`);
    });
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
  'Sun\'iy Intellekt': { hook: 'Kelajak kasbini bugundan boshlang 🤖',
    outcome: 'AI vositalaridan professional foydalanishni o\'rganasiz' },
};

(function suggestCourse() {
  if ((S.idleDays < SUGGEST_AFTER_IDLE && !S.forceSuggest) || !S.suggest) return;

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
  document.getElementById('bonusWhyText').innerHTML =
    `Shu kungacha to'lasangiz — hisobingizga <b>+${p.reward} coin</b> qo'shiladi. Muddat o'tsa, bu oygi bonus berilmaydi.`;
})();

/* ================= Vidjetlar tartibi =================
   Muhim eslatmalar: Demo Day → Qo'shimcha dars → Vebinar → To'lov.
   Kechqurun 19:00–00:00 da chek-list ularning ortidan birinchi bo'lib chiqadi,
   aks holda strayk oldinda. Kalendar doim oxirida.                          */
const EVENING_FROM_H = 20;
const EVENING_FROM_M = 30;

function arrangeWidgets() {
  const shown = id => { const el = document.getElementById(id); return el && !el.hidden; };
  const missed = id => { const el = document.getElementById(id); return el && el.dataset.missed === '1'; };
  const d = new Date();
  const evening = d.getHours() > EVENING_FROM_H ||
    (d.getHours() === EVENING_FROM_H && d.getMinutes() >= EVENING_FROM_M);

  const seq = [];

  const EVENT_TIME = { ddCard: S.demoDay?.at, elCard: S.extraLesson?.at };
  (S.webinars || []).forEach((w, i) => { EVENT_TIME[`webinarCard${i}`] = w.at; });

  const activeEvents = ['ddCard', 'elCard', ...WEBINAR_CARD_IDS]
    .filter(id => shown(id) && !missed(id))
    .sort((a, b) => EVENT_TIME[a] - EVENT_TIME[b]);
  seq.push(...activeEvents);

  if (shown('bonusCard')) seq.push('bonusCard');

  const anyEventToday = activeEvents.length > 0;
  if (anyEventToday) seq.push('mentorCard');

  ['ddCard', 'elCard']
    .filter(id => shown(id) && missed(id))
    .sort((a, b) => EVENT_TIME[a] - EVENT_TIME[b])
    .forEach(id => seq.push(id));

  seq.push(...(evening ? ['clCard', 'streakCard'] : ['streakCard', 'clCard']));

  if (!anyEventToday) seq.push('mentorCard');

  seq.push('sgCard', 'calCard');

  seq.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.style.order = i;
  });
}
arrangeWidgets();
setInterval(arrangeWidgets, 30000);   // kun/vaqt o'zgarsa tartib o'zi yangilanadi

/* ---------- Aktivlik kalendari ---------- */
const CAL_COURSES = ['Dasturlash kursi', 'Ingliz tili kursi', 'Matematika kursi'];

/* Profil bo'yicha: st: full(yashil) | rej(qizil) | view(kulrang) | none(bo'sh), c: kurs indekslari
   S.calendar = { green, red, gray } — kunlar shu tartibda 1-kundan boshlab to'ldiriladi. */
const CAL_DAYS = {};
(function buildCalDays() {
  const cfg = S.calendar || { green: 25, red: 2, gray: 3 };
  let d = 1;
  for (let i = 0; i < cfg.green; i++) CAL_DAYS[d++] = { st: 'full', c: [i % 3] };
  for (let i = 0; i < cfg.red;   i++) CAL_DAYS[d++] = { st: 'rej',  c: [i % 3] };
  for (let i = 0; i < cfg.gray;  i++) CAL_DAYS[d++] = { st: 'view', c: [i % 3] };
})();

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
