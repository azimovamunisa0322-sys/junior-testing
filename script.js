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

/* ---------- Strayk haftasi ---------- */
const WEEK = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
const now = new Date();
// Demo dunyosi: 2026-yil avgust; boshqa vaqtda ochilsa 6-avgustga qaytadi
const inDemoMonth = now.getFullYear() === 2026 && now.getMonth() === 7;
const todayNum = inDemoMonth ? now.getDate() : 6;
const todayDow = (inDemoMonth ? now.getDay() : new Date(2026, 7, 6).getDay() + 0) || 7; // 1=Du … 7=Ya
const streakActive = [1, 1, 1, 1, 1, 1, 0]; // referensdagi kabi

document.getElementById('streakWeek').innerHTML = WEEK.map((d, i) => `
  <div class="week-day ${streakActive[i] ? 'on' : 'off'}${i + 1 === todayDow ? ' today' : ''}">
    <span class="week-flame">🔥</span>
    <span class="week-label">${d}</span>
  </div>`).join('');

/* ---------- Oylik challenge ---------- */
(function monthlyChallenge() {
  const y  = inDemoMonth ? now.getFullYear() : 2026;
  const mo = inDemoMonth ? now.getMonth() : 7;      // 7 = avgust
  const total = new Date(y, mo + 1, 0).getDate();   // shu oydagi kunlar soni
  const done  = Math.min(todayNum, total);          // har kuni o'zi bittaga oshadi
  const left  = total - done;
  const pct   = Math.round(done / total * 100);

  document.getElementById('chTotal').textContent = total;
  document.getElementById('chDone').textContent  = done;
  document.getElementById('chLeft').textContent  = `${left} kun`;
  document.getElementById('chBar').style.width   = pct + '%';
  document.getElementById('chNow').textContent   = `${done} / ${total}`;
  document.querySelector('.ch-lead b').textContent = `${total} kun — bironta kunni qoldirmasdan!`;
  document.getElementById('chMsg').textContent =
    left === 0 ? 'Challenge yakunlandi — mukofot sizniki! 🎉' :
    pct >= 75  ? 'Oz qoldi, shu tempda davom eting! 🚀' :
    pct >= 40  ? 'Yarmidan oshdingiz, zo\'r ketyapsiz! 💪' :
                 'Endi boshlandi — har kuni 1 ta dars! 🔥';

  const toggle = document.getElementById('chToggle');
  const info   = document.getElementById('chInfo');
  toggle.addEventListener('click', () => {
    const open = info.hidden;
    info.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });
})();

/* ---------- Vebinar countdown ---------- */
function tickWebinar() {
  const target = new Date();
  target.setHours(18, 0, 0, 0);
  let label = 'Bugun';
  // 18:00 o'tib ketgan bo'lsa — keyingi kunning vebinariga sanaymiz
  if (Date.now() >= target.getTime()) { target.setDate(target.getDate() + 1); label = 'Ertaga'; }
  const left = Math.max(0, Math.floor((target - Date.now()) / 1000));
  const h = Math.floor(left / 3600), m = Math.floor((left % 3600) / 60), s = left % 60;
  const pad = n => String(n).padStart(2, '0');
  document.getElementById('webinarWhen').textContent = label;
  document.getElementById('webinarCountdown').textContent =
    `${pad(h)}:${pad(m)}:${pad(s)} qoldi`;
}
tickWebinar();
setInterval(tickWebinar, 1000);

/* ---------- Demo Day countdown ---------- */
// Sanani o'zgartirish uchun shu qatorni tahrirlang (oy 0 dan boshlanadi: 7 = avgust)
const DEMO_DAY = new Date(2026, 7, 10, 18, 0, 0);

function tickDemoDay() {
  const left = Math.max(0, Math.floor((DEMO_DAY - Date.now()) / 1000));
  const d = Math.floor(left / 86400);
  const h = Math.floor((left % 86400) / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const pad = n => String(n).padStart(2, '0');

  document.getElementById('ddDays').textContent = pad(d);
  document.getElementById('ddHours').textContent = pad(h);
  document.getElementById('ddMins').textContent = pad(m);
  document.getElementById('ddSecs').textContent = pad(s);

  document.getElementById('ddLeft').textContent =
    left === 0 ? 'Bugun!' :
    d > 0      ? `${d} kun qoldi` :
    h > 0      ? `${h} soat qoldi` :
    m > 0      ? `${m} daqiqa qoldi` : `${s} soniya qoldi`;
}
tickDemoDay();
setInterval(tickDemoDay, 1000);

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

/* ---------- Junior AI chat ---------- */
const chatPop = document.getElementById('chatPop');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');

document.getElementById('chatFab').addEventListener('click', () => {
  chatPop.hidden = !chatPop.hidden;
  if (!chatPop.hidden) chatInput.focus();
});
document.getElementById('chatClose').addEventListener('click', () => { chatPop.hidden = true; });

const REPLIES = [
  'Bu prototip versiyasi — tez orada haqiqiy AI yordamchi ulanadi 🤖',
  "Kurs bo'yicha savollarni mentorga ham berishingiz mumkin 📚",
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
