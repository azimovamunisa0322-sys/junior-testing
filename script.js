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

/* ---------- Vebinar countdown ---------- */
function tickWebinar() {
  const target = new Date();
  target.setHours(18, 0, 0, 0);
  let label = 'Bugun';
  if (Date.now() > target.getTime()) { target.setDate(target.getDate() + 1); label = 'Ertaga'; }
  const diffMin = Math.max(1, Math.round((target - Date.now()) / 60000));
  const h = Math.floor(diffMin / 60), m = diffMin % 60;
  document.getElementById('webinarWhen').textContent = label;
  document.getElementById('webinarCountdown').textContent =
    h > 0 ? `${h} soat ${m} daqiqadan keyin` : `${m} daqiqadan keyin`;
}
tickWebinar();
setInterval(tickWebinar, 30000);

/* ---------- Aktivlik kalendari ---------- */
(function renderCalendar() {
  const DAYS = 31;                                  // avgust 2026
  const offset = (new Date(2026, 7, 1).getDay() + 6) % 7; // Du=0 … Ya=6 (1-avgust — Shanba)
  const level = d => {
    const r = (d * 2654435761) % 10;                // deterministik "tasodifiylik"
    if (r < 2) return 0;
    return 1 + (r % 3);
  };
  let cells = '';
  for (let i = 0; i < offset; i++) cells += '<span class="cal-cell empty"></span>';
  for (let d = 1; d <= DAYS; d++) {
    if (d === todayNum) { cells += `<span class="cal-cell today" title="Bugun, ${d}-avgust"></span>`; continue; }
    const cls = d < todayNum ? (level(d) ? `a${level(d)}` : '') : '';
    cells += `<span class="cal-cell ${cls}" title="${d}-avgust"></span>`;
  }
  document.getElementById('calGrid').innerHTML = cells;
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
