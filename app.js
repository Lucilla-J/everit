/* ════════════════════════════════════════════
   資訊部問題回報系統｜app.js
   T3：資料層、邏輯、SVG 圖表、CSV 匯出
   ════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────
   T3-1｜模擬初始資料（SEED_DATA）
   涵蓋三種狀態、多位人員、日期跨 2026/10～11
   ──────────────────────────────────────────── */
const SEED_DATA = [
  {
    id: '20261010-001',
    title: '拋轉還原無法執行',
    desc: '要做拋轉還原無法做，請問程序如何？操作步驟：進入拋轉作業 → 選取單號 → 點選還原，系統無反應。',
    sys: 'MES', sysName: 'MES 拋轉模組', dept: '生產部', reporter: '小潔', owner: '志明',
    expectDate: '2026-10-15', note: '已確認為版本升級後的相容性問題，重新設定參數後解決。',
    status: '已解決',
    createdAt: '2026-10-10 09:15', startAt: '2026-10-10 10:00', doneAt: '2026-10-11 16:30'
  },
  {
    id: '20261015-001',
    title: '拋轉狀態判斷問題',
    desc: '拋轉時要判斷狀態，是否要拋過去，或是否要用打勾選取拋轉 BBEG-25090001。狀態為 0 時是否應跳過？',
    sys: 'MES', sysName: 'MES 拋轉模組', dept: '生產部', reporter: '小潔', owner: '志明',
    expectDate: '2026-10-20', note: '狀態 0 的判斷邏輯已修改，需同步更新操作手冊。',
    status: '已解決',
    createdAt: '2026-10-15 09:30', startAt: '2026-10-15 14:00', doneAt: '2026-10-17 11:00'
  },
  {
    id: '20261020-001',
    title: '拋轉 TIPTOP 開工與報工時間重疊問題',
    desc: '拋轉到 TIPTOP，想確認開工時間和實際報工時間不同、發生重疊時是否有問題？直接按確認是否會產生異常？',
    sys: 'TIPTOP', sysName: 'TIPTOP 生產回報', dept: '資訊部', reporter: '小潔', owner: '阿偉',
    expectDate: '2026-10-25', note: '',
    status: '已解決',
    createdAt: '2026-10-20 14:00', startAt: '2026-10-20 14:30', doneAt: '2026-10-21 10:00'
  },
  {
    id: '20261025-001',
    title: 'MISC 工單數量異常（應開工 100 + 開工 500 = 600）',
    desc: '原本單據有問題刪除後重新建立，數量設為 500。在報工紀錄顯示正確為 500，但圖一出現應開工 100、開工 500，合計變成 600，數量不一致。',
    sys: 'MES', sysName: 'MES 工單管理', dept: '品保部', reporter: '阿明', owner: '志明',
    expectDate: '2026-10-30', note: '刪單後舊資料殘留問題，已修正資料清除邏輯。',
    status: '已解決',
    createdAt: '2026-10-25 16:00', startAt: '2026-10-26 09:00', doneAt: '2026-10-26 15:00'
  },
  {
    id: '20261101-001',
    title: '異常報工作業新增備註欄位需求',
    desc: '異常報工作業目前缺少備註欄位，在缺料時無法記錄缺了哪個料件。希望在異常報工作業增加一個備註欄位供人員填寫。',
    sys: 'MES', sysName: 'MES 異常報工', dept: '生產部', reporter: '小潔', owner: '',
    expectDate: '2026-11-15', note: '',
    status: '待處理',
    createdAt: '2026-11-01 11:00', startAt: '', doneAt: ''
  },
  {
    id: '20261102-001',
    title: 'TIPTOP 帳號登入異常，顯示帳號鎖定',
    desc: '部分使用者無法登入 TIPTOP，系統顯示帳號鎖定。受影響人員：生產部 3 人、品保部 1 人。錯誤代碼：ERR-AUTH-4031。',
    sys: 'TIPTOP', sysName: 'TIPTOP 登入驗證', dept: '資訊部', reporter: '大華', owner: '阿偉',
    expectDate: '2026-11-02', note: '密碼錯誤次數上限觸發鎖定，已解鎖帳號並通知使用者修改密碼。',
    status: '已解決',
    createdAt: '2026-11-02 08:30', startAt: '2026-11-02 09:00', doneAt: '2026-11-02 11:30'
  },
  {
    id: '20261103-001',
    title: 'MES 報表匯出失敗，Excel 開啟後中文亂碼',
    desc: '從 MES 匯出月報表時，Excel 開啟後中文欄位全部顯示亂碼。測試環境 Windows 11、Excel 2021。其他格式（CSV）未受影響。',
    sys: 'MES', sysName: 'MES 報表模組', dept: '資訊部', reporter: '大華', owner: '志明',
    expectDate: '2026-11-10', note: '疑似 Excel 版本的編碼預設問題，正在測試加入 BOM 標記的解法。',
    status: '處理中',
    createdAt: '2026-11-03 10:00', startAt: '2026-11-03 13:00', doneAt: ''
  },
  {
    id: '20261103-002',
    title: 'TIPTOP 採購單審核流程卡關，無法送下一關',
    desc: '採購單在第二關審核時無法送出，點擊送出按鈕後頁面無反應。已確認帳號有審核權限，Chrome / Edge 均重現。',
    sys: 'TIPTOP', sysName: 'TIPTOP 採購管理', dept: '品保部', reporter: '阿明', owner: '',
    expectDate: '2026-11-08', note: '',
    status: '待處理',
    createdAt: '2026-11-03 14:20', startAt: '', doneAt: ''
  },
  {
    id: '20261104-001',
    title: 'MES 生產排程畫面載入緩慢，超過 30 秒',
    desc: '生產排程畫面在月底結算期間載入時間超過 30 秒，甚至出現逾時錯誤。平常約 3 秒。已嘗試清除快取，問題未解決。',
    sys: 'MES', sysName: 'MES 生產排程', dept: '生產部', reporter: '小潔', owner: '志明',
    expectDate: '2026-11-07', note: '懷疑月底結算 Job 佔用大量 DB 資源，正在分析 SQL 執行計畫。',
    status: '處理中',
    createdAt: '2026-11-04 08:45', startAt: '2026-11-04 09:30', doneAt: ''
  },
  {
    id: '20261104-002',
    title: 'TIPTOP 發票開立模組無法儲存，顯示欄位驗證錯誤',
    desc: '開立發票時點擊儲存，系統顯示「欄位驗證錯誤」但未指出是哪個欄位。所有必填欄位均已填寫。財務部反映已影響出貨作業。',
    sys: 'TIPTOP', sysName: 'TIPTOP 財務發票', dept: '資訊部', reporter: '大華', owner: '阿偉',
    expectDate: '2026-11-05', note: '正在比對測試環境與正式環境的欄位驗證設定差異。',
    status: '處理中',
    createdAt: '2026-11-04 13:10', startAt: '2026-11-04 14:00', doneAt: ''
  }
];

/* ────────────────────────────────────────────
   T3-2｜localStorage 讀寫
   ──────────────────────────────────────────── */
const STORAGE_KEY = 'it-issues-v1';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* 解析失敗時使用 SEED_DATA */ }
  return SEED_DATA.map(item => Object.assign({}, item)); // 深複製避免污染常數
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  } catch (e) { /* localStorage 滿或私密模式時靜默失敗 */ }
}

/* ────────────────────────────────────────────
   全域資料狀態
   ──────────────────────────────────────────── */
let issues   = loadData();   // 全部資料
let filtered = [...issues];  // 目前篩選後的資料
let editingId = null;        // 目前正在編輯的問題 ID

/* ────────────────────────────────────────────
   T3-3｜工具函式
   ──────────────────────────────────────────── */

/** 產生問題編號：YYYYMMDD-NNN（用本地時間，避免深夜 UTC 日期偏移） */
function genId() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  const dateStr = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
  const todayIds = issues
    .map(i => i.id)
    .filter(id => id.startsWith(dateStr))
    .map(id => parseInt(id.slice(9), 10) || 0);
  const maxSeq = todayIds.length ? Math.max(...todayIds) : 0;
  return `${dateStr}-${String(maxSeq + 1).padStart(3, '0')}`;
}

/** 回傳目前時間字串：YYYY-MM-DD HH:mm */
function nowStr() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 回傳 date 輸入框所需的格式：YYYY-MM-DD */
function nowDatetimeLocal() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

/** 將 date 值（YYYY-MM-DD）轉為統一格式（YYYY-MM-DD HH:mm），時間補 00:00 */
function formatDatetimeLocal(val) {
  if (!val) return nowStr();
  return `${val} 00:00`;
}

/** 今天日期字串：YYYYMMDD（供匯出檔名用） */
function todayStr() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

/** HTML 跳脫，防止 XSS（T3-17） */
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** 狀態對應 badge class */
function badgeClass(status) {
  const map = { '待處理': 'badge-wait', '處理中': 'badge-doing', '已解決': 'badge-done' };
  return map[status] || 'badge-wait';
}

/** 產生狀態標籤 HTML */
function badge(status) {
  return `<span class="badge ${badgeClass(status)}">${escHtml(status)}</span>`;
}


/* ────────────────────────────────────────────
   T3-4｜渲染問題列表
   ──────────────────────────────────────────── */
function renderList() {
  // 依回報時間由新到舊排序
  const sorted = [...filtered].sort((a, b) =>
    (b.createdAt || '').localeCompare(a.createdAt || '')
  );

  document.getElementById('count').textContent = sorted.length;
  const tbody = document.getElementById('issue-tbody');

  if (!sorted.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="11">目前沒有符合條件的問題回報。</td></tr>';
    return;
  }

  tbody.innerHTML = sorted.map(i => `
    <tr>
      <td class="col-id">${escHtml(i.id)}</td>
      <td class="col-title">
        <a href="#" onclick="openDetail('${escHtml(i.id)}');return false;">${escHtml(i.title)}</a>
      </td>
      <td>${escHtml(i.sys)}</td>
      <td>${escHtml(i.sysName || '')}</td>
      <td>${escHtml(i.dept)}</td>
      <td>${escHtml(i.reporter)}</td>
      <td>${i.owner ? escHtml(i.owner) : '<span class="unassigned">未指派</span>'}</td>
      <td>${badge(i.status)}</td>
      <td class="col-time">${escHtml((i.createdAt || '').slice(0,10))}</td>
      <td class="col-time">${i.expectDate ? escHtml(i.expectDate) : '<span class="unassigned">—</span>'}</td>
      <td class="col-action">
        <button class="btn btn-outline btn-sm" onclick="openDetail('${escHtml(i.id)}')">詳細</button>
        <button class="btn btn-outline btn-sm" onclick="openEdit('${escHtml(i.id)}')">編輯</button>
        <button class="btn btn-danger  btn-sm" onclick="deleteIssue('${escHtml(i.id)}')">刪除</button>
      </td>
    </tr>
  `).join('');
}

/* ────────────────────────────────────────────
   T3-5｜篩選
   ──────────────────────────────────────────── */
function applyFilter() {
  const type     = document.getElementById('f-type').value;
  const dept     = document.getElementById('f-dept').value;
  const status   = document.getElementById('f-status').value;
  const reporter = document.getElementById('f-person').value.trim();
  const owner    = document.getElementById('f-owner-filter').value.trim();  // R1：獨立負責人篩選
  const from     = document.getElementById('f-date-from').value;
  const to       = document.getElementById('f-date-to').value;

  filtered = issues.filter(i => {
    if (type     && i.sys    !== type)                        return false;
    if (dept     && i.dept   !== dept)                        return false;
    if (status   && i.status !== status)                      return false;
    if (reporter && !i.reporter.includes(reporter))           return false;  // R1：只比對回報人
    if (owner    && !(i.owner || '').includes(owner))         return false;  // R1：只比對負責人
    if (from     && i.createdAt.slice(0, 10) < from)          return false;
    if (to       && i.createdAt.slice(0, 10) > to)            return false;
    return true;
  });
  renderList();
}

function clearFilter() {
  ['f-type', 'f-dept', 'f-status'].forEach(id =>
    document.getElementById(id).value = ''
  );
  ['f-person', 'f-owner-filter', 'f-date-from', 'f-date-to'].forEach(id =>  // R1：清除新增的欄位
    document.getElementById(id).value = ''
  );
  filtered = [...issues];
  renderList();
}

/* ────────────────────────────────────────────
   T3-6｜詳細彈窗
   ──────────────────────────────────────────── */
function openDetail(id) {
  const i = issues.find(x => x.id === id);
  if (!i) return;

  document.getElementById('detail-title').textContent = i.title;

  // 基本資料表格
  const rows = [
    ['編號',             i.id],
    ['系統類別',         i.sys],
    ['需求系統名稱',     i.sysName || '—'],
    ['所屬部門',         i.dept],
    ['回報人員',         i.reporter],
    ['負責人員',         i.owner || '未指派'],
    ['狀態',             ''],   // badge 另處理
    ['回報時間',         i.createdAt],
    ['需求完成時間',     i.expectDate || '—'],
    ['開始處理',         i.startAt || '-'],
    ['解決時間',         i.doneAt  || '-'],
    ['備註說明（IT）',   i.note    || '—'],
  ];

  document.getElementById('detail-fields').innerHTML = rows.map((r, idx) => `
    <tr>
      <td>${escHtml(r[0])}</td>
      <td>${idx === 6 ? badge(i.status) : escHtml(r[1])}</td>
    </tr>
  `).join('');

  document.getElementById('detail-desc').textContent = i.desc;

  // 操作按鈕：依狀態決定 + 快速指派負責人
  let btns = '';

  // 快速指派負責人（US-03 AC-3）
  btns += `<div style="display:flex;gap:6px;align-items:center;width:100%;margin-bottom:4px;">
    <input type="text" id="detail-owner-input" value="${escHtml(i.owner)}"
      placeholder="指派負責人員"
      style="flex:1;padding:5px 8px;border:1px solid #ccc;border-radius:5px;font-size:13px;font-family:inherit;">
    <button class="btn btn-outline btn-sm" onclick="updateOwner('${id}',document.getElementById('detail-owner-input').value)">更新負責人</button>
  </div>`;

  if (i.status === '待處理') {
    btns += `<button class="btn btn-primary btn-sm" onclick="updateStatus('${id}','處理中')">標記為處理中</button>`;
  }
  if (i.status === '處理中') {
    btns += `<button class="btn btn-primary btn-sm" onclick="updateStatus('${id}','已解決')">標記為已解決</button>`;
  }
  btns += `<button class="btn btn-outline btn-sm" onclick="openEdit('${id}');document.getElementById('detail-modal').close()">編輯</button>`;
  btns += `<button class="btn btn-outline btn-sm" onclick="document.getElementById('detail-modal').close()">關閉</button>`;

  document.getElementById('detail-actions').innerHTML = btns;
  document.getElementById('detail-modal').showModal();
}

/* ────────────────────────────────────────────
   T3-7｜更新狀態
   ──────────────────────────────────────────── */
function updateStatus(id, newStatus) {
  const i = issues.find(x => x.id === id);
  if (!i) return;
  const now = nowStr();

  if (newStatus === '處理中' && i.status === '待處理' && !i.startAt) {
    i.startAt = now;
  }
  if (newStatus === '已解決') {
    if (!i.startAt) i.startAt = now;
    i.doneAt = now;
  }
  i.status = newStatus;

  saveData();
  document.getElementById('detail-modal').close();
  // 重新套用篩選以同步 filtered
  filtered = filtered.map(f => f.id === id ? i : f);
  renderList();
  renderReport();
}

/* ────────────────────────────────────────────
   T3-8｜更新負責人（詳細彈窗直接呼叫）
   ──────────────────────────────────────────── */
function updateOwner(id, owner) {
  const i = issues.find(x => x.id === id);
  if (!i) return;
  i.owner = owner.trim();
  saveData();
  filtered = filtered.map(f => f.id === id ? i : f);
  renderList();
  renderReport();
  // 關閉彈窗並提示（US-03 AC-4）
  document.getElementById('detail-modal').close();
}

/* ────────────────────────────────────────────
   T3-9｜編輯彈窗
   ──────────────────────────────────────────── */
function openEdit(id) {
  const i = issues.find(x => x.id === id);
  if (!i) return;
  editingId = id;

  document.getElementById('e-title').value    = i.title;
  document.getElementById('e-reporter').value = i.reporter;
  document.getElementById('e-owner').value    = i.owner;
  document.getElementById('e-desc').value     = i.desc;
  document.getElementById('e-sys-name').value  = i.sysName    || '';
  document.getElementById('e-expect-date').value = i.expectDate || '';
  document.getElementById('e-note').value     = i.note       || '';

  // 設定下拉選單選取值
  setSelectValue('e-sys',    i.sys);
  setSelectValue('e-dept',   i.dept);
  setSelectValue('e-status', i.status);

  // 清除錯誤提示
  document.getElementById('err-e-title').textContent = '';
  document.getElementById('e-title').closest('.form-group').classList.remove('has-error');

  document.getElementById('edit-modal').showModal();
}

function setSelectValue(selectId, value) {
  const sel = document.getElementById(selectId);
  for (const opt of sel.options) {
    opt.selected = opt.value === value;
  }
}

function saveEdit() {
  const title = document.getElementById('e-title').value.trim();
  if (!title) {
    document.getElementById('err-e-title').textContent = '問題標題不可為空';
    document.getElementById('e-title').closest('.form-group').classList.add('has-error');
    return;
  }

  const i         = issues.find(x => x.id === editingId);
  const newStatus = document.getElementById('e-status').value;
  const now       = nowStr();

  // 狀態前進：補時間戳記
  if (newStatus === '處理中' && i.status === '待處理' && !i.startAt) i.startAt = now;
  if (newStatus === '已解決' && i.status !== '已解決') {
    if (!i.startAt) i.startAt = now;
    i.doneAt = now;
  }
  // 狀態後退：清除時間戳記
  if (newStatus === '待處理') { i.startAt = ''; i.doneAt = ''; }
  if (newStatus === '處理中') { i.doneAt = ''; }

  i.title      = title;
  i.sys        = document.getElementById('e-sys').value;
  i.sysName    = document.getElementById('e-sys-name').value.trim();
  i.dept       = document.getElementById('e-dept').value;
  i.reporter   = document.getElementById('e-reporter').value.trim();
  i.owner      = document.getElementById('e-owner').value.trim();
  i.status     = newStatus;
  i.expectDate = document.getElementById('e-expect-date').value;
  i.note       = document.getElementById('e-note').value.trim();
  i.desc       = document.getElementById('e-desc').value.trim();

  saveData();
  document.getElementById('edit-modal').close();
  // 同步 filtered（保持現有篩選狀態）
  filtered = filtered.map(f => f.id === editingId ? i : f);
  editingId = null;
  renderList();
  renderReport();
}

/* ────────────────────────────────────────────
   T3-10｜刪除
   ──────────────────────────────────────────── */
function deleteIssue(id) {
  const i = issues.find(x => x.id === id);
  if (!i) return;
  if (!confirm(`確定要刪除「${i.title}」？\n此操作無法復原。`)) return;

  issues   = issues.filter(x => x.id !== id);
  filtered = filtered.filter(x => x.id !== id);
  saveData();
  renderList();
  renderReport();
}

/* ────────────────────────────────────────────
   T3-11｜新增回報表單
   ──────────────────────────────────────────── */
function submitForm() {
  // 驗證必填欄位
  const fields = [
    { id: 'f-title',      errId: 'err-title',      msg: '請填寫問題標題' },
    { id: 'f-sys',        errId: 'err-sys',         msg: '請選擇系統類別' },
    { id: 'f-dep',        errId: 'err-dep',         msg: '請選擇所屬部門' },
    { id: 'f-reporter',   errId: 'err-reporter',    msg: '請填寫回報人員' },
    { id: 'f-created-at', errId: 'err-created-at',  msg: '請填寫回報日期時間' },
    { id: 'f-desc',       errId: 'err-desc',        msg: '請填寫問題說明' },
  ];

  let valid = true;
  fields.forEach(f => {
    const el  = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    const grp = el.closest('.form-group');
    if (!el.value.trim()) {
      err.textContent = f.msg;
      grp.classList.add('has-error');
      valid = false;
    } else {
      err.textContent = '';
      grp.classList.remove('has-error');
    }
  });
  if (!valid) return;

  const newIssue = {
    id:         genId(),
    title:      document.getElementById('f-title').value.trim(),
    desc:       document.getElementById('f-desc').value.trim(),
    sys:        document.getElementById('f-sys').value,
    sysName:    document.getElementById('f-sys-name').value.trim(),   // 需求系統名稱
    dept:       document.getElementById('f-dep').value,
    reporter:   document.getElementById('f-reporter').value.trim(),
    owner:      document.getElementById('f-owner').value.trim(),
    expectDate: document.getElementById('f-expect-date').value,       // 申請人需求完成時間
    note:       '',                                                    // 備註（IT 填，新增時留空）
    status:     '待處理',
    createdAt:  formatDatetimeLocal(document.getElementById('f-created-at').value),
    startAt:    '',
    doneAt:     ''
  };

  issues.unshift(newIssue);
  saveData();
  clearForm();
  filtered = [...issues];
  renderList();
  renderReport();

  // 切換回問題列表
  switchTab('list', document.getElementById('btn-list'));
}

function clearForm() {
  ['f-title', 'f-reporter', 'f-owner', 'f-desc', 'f-sys-name', 'f-expect-date'].forEach(id =>
    document.getElementById(id).value = ''
  );
  ['f-sys', 'f-dep'].forEach(id =>
    document.getElementById(id).value = ''
  );
  document.getElementById('f-created-at').value = nowDatetimeLocal();
  ['err-title', 'err-sys', 'err-dep', 'err-reporter', 'err-created-at', 'err-desc'].forEach(id =>
    document.getElementById(id).textContent = ''
  );
  document.querySelectorAll('#report-form .form-group.has-error').forEach(g =>
    g.classList.remove('has-error')
  );
}

/* ────────────────────────────────────────────
   T3-12｜統計報表
   ──────────────────────────────────────────── */
function renderReport() {
  // 依統計篩選條件過濾（US-05 AC-2）
  const reportData = getReportFiltered();

  // 摘要數字卡
  document.getElementById('s-total').textContent = reportData.length;
  document.getElementById('s-wait').textContent  = reportData.filter(i => i.status === '待處理').length;
  document.getElementById('s-doing').textContent = reportData.filter(i => i.status === '處理中').length;
  document.getElementById('s-done').textContent  = reportData.filter(i => i.status === '已解決').length;

  // 人員統計表
  const owners = [...new Set(reportData.map(i => i.owner).filter(Boolean))].sort();
  const tbody  = document.getElementById('stat-tbody');

  if (!owners.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">尚無已指派負責人的問題。</td></tr>';
  } else {
    tbody.innerHTML = owners.map(o => {
      const mine  = reportData.filter(i => i.owner === o);
      // 平均處理時間只取 reportData 範圍內的已解決資料
      const done  = mine.filter(i => i.status === '已解決').length;
      const doing = mine.filter(i => i.status === '處理中').length;
      const wait  = mine.filter(i => i.status === '待處理').length;
      const avgHr = avgHoursFromList(mine);
      return `<tr>
        <td>${escHtml(o)}</td>
        <td>${mine.length}</td>
        <td>${done}</td>
        <td>${doing}</td>
        <td>${wait}</td>
        <td>${avgHr}</td>
      </tr>`;
    }).join('');
  }

  // 繪製趨勢圖（使用篩選後資料）
  drawTrendChart(reportData);
}

/** 取得統計報表的篩選資料（US-05 AC-2） */
function getReportFiltered() {
  const month = (document.getElementById('r-month')?.value || '').trim();
  const from  = (document.getElementById('r-date-from')?.value || '').trim();
  const to    = (document.getElementById('r-date-to')?.value || '').trim();

  if (!month && !from && !to) return issues; // 無篩選條件時顯示全部

  return issues.filter(i => {
    const d = (i.createdAt || '').slice(0, 10);
    if (month && !i.createdAt.startsWith(month)) return false;
    if (from  && d < from) return false;
    if (to    && d > to)   return false;
    return true;
  });
}

function applyReportFilter() {
  renderReport();
}

function clearReportFilter() {
  const ids = ['r-month', 'r-date-from', 'r-date-to'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderReport();
}

/** 計算指定資料集的平均處理時間（小時） */
function avgHoursFromList(list) {
  const done = list.filter(i => i.status === '已解決' && i.startAt && i.doneAt);
  if (!done.length) return '-';
  const totalMs = done.reduce((sum, i) =>
    sum + (new Date(i.doneAt) - new Date(i.startAt)), 0
  );
  return (totalMs / 3600000 / done.length).toFixed(1);
}

/* ────────────────────────────────────────────
   T3-13｜SVG 折線趨勢圖
   viewBox="0 0 600 160"
   繪圖區：x 40~580, y 20~130
   ──────────────────────────────────────────── */
function drawTrendChart(data) {
  const svg = document.getElementById('trend-chart');
  if (!svg) return;

  // 統計每月件數
  const monthCount = {};
  data.forEach(i => {
    const m = (i.createdAt || '').slice(0, 7); // 'YYYY-MM'
    if (m) monthCount[m] = (monthCount[m] || 0) + 1;
  });

  const months = Object.keys(monthCount).sort();
  if (!months.length) { svg.innerHTML = ''; return; }

  const counts  = months.map(m => monthCount[m]);
  const maxVal  = Math.max(...counts, 1);

  // 座標系
  const PAD = { top: 20, bottom: 32, left: 44, right: 20 };
  const W   = 600, H = 160;
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top  - PAD.bottom;

  // 資料點座標
  const pts = months.map((m, idx) => {
    const x = PAD.left + (months.length === 1 ? chartW / 2 : idx * chartW / (months.length - 1));
    const y = PAD.top  + chartH - (counts[idx] / maxVal) * chartH;
    return { x, y, m, v: counts[idx] };
  });

  const polylinePoints = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Y 軸刻度（0 和最大值）
  const yTicks = [0, Math.ceil(maxVal / 2), maxVal];

  let svgHTML = `
    <!-- Y 軸刻度線 -->
    ${yTicks.map(v => {
      const y = (PAD.top + chartH - (v / maxVal) * chartH).toFixed(1);
      return `<line x1="${PAD.left}" y1="${y}" x2="${W - PAD.right}" y2="${y}" class="chart-axis"/>
              <text x="${PAD.left - 6}" y="${y}" class="chart-label-y" dominant-baseline="middle">${v}</text>`;
    }).join('')}

    <!-- X 軸基線 -->
    <line x1="${PAD.left}" y1="${PAD.top + chartH}" x2="${W - PAD.right}" y2="${PAD.top + chartH}" class="chart-axis" stroke="#bbb"/>

    <!-- 折線 -->
    <polyline points="${polylinePoints}" class="chart-line"/>

    <!-- 資料點與 X 軸標籤 -->
    ${pts.map(p => {
      const label = p.m.replace(/^(\d{4})-0?/, '$1/'); // 2026-10 → 2026/10
      return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" class="chart-dot">
                <title>${label}：${p.v} 件</title>
              </circle>
              <text x="${p.x.toFixed(1)}" y="${H - 4}" class="chart-label-x">${label}</text>`;
    }).join('')}
  `;

  svg.innerHTML = svgHTML;
}

/* ────────────────────────────────────────────
   T3-14｜匯出問題列表 CSV
   ──────────────────────────────────────────── */
function exportCSV() {
  const headers = ['編號','標題','系統類別','需求系統名稱','所屬部門','回報人員','負責人員','狀態','回報時間','需求完成時間','開始處理時間','解決時間','問題說明','備註說明'];
  const rows = filtered
    .slice()
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .map(i => [
      i.id, i.title, i.sys, i.sysName || '', i.dept, i.reporter, i.owner,
      i.status, i.createdAt, i.expectDate || '', i.startAt, i.doneAt, i.desc, i.note || ''
    ]);
  downloadCSV([headers, ...rows], `問題回報_${todayStr()}.csv`);
}

/* ────────────────────────────────────────────
   T3-15｜匯出人員統計 CSV
   ──────────────────────────────────────────── */
function exportStatCSV() {
  const reportData = getReportFiltered();  // R2：與畫面統計一致，套用日期篩選
  const headers = ['負責人員','總件數','已解決','處理中','待處理','平均處理時間(小時)'];
  const owners  = [...new Set(reportData.map(i => i.owner).filter(Boolean))].sort();
  const rows = owners.map(o => {
    const mine = reportData.filter(i => i.owner === o);
    return [
      o,
      mine.length,
      mine.filter(i => i.status === '已解決').length,
      mine.filter(i => i.status === '處理中').length,
      mine.filter(i => i.status === '待處理').length,
      avgHoursFromList(mine)
    ];
  });
  downloadCSV([headers, ...rows], `人員統計_${todayStr()}.csv`);
}

/** 通用 CSV 下載（BOM + UTF-8，相容 Excel） */
function downloadCSV(data, filename) {
  const BOM = '\uFEFF';
  const csv = BOM + data
    .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ────────────────────────────────────────────
   T3-16｜頁籤切換
   ──────────────────────────────────────────── */
function switchTab(name, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  // 切換到統計報表時重繪圖表（確保 SVG 有正確尺寸）
  if (name === 'report') renderReport();
}

/* ────────────────────────────────────────────
   初始化
   ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // 新增表單預填目前日期時間
  document.getElementById('f-created-at').value = nowDatetimeLocal();

  filtered = [...issues];
  renderList();
  renderReport();
});
