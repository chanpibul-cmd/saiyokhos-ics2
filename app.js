/**
 * Application logic for Flood Situation Report Infographic
 * Compatible with GitHub Pages and Google Apps Script (GAS)
 */

const SHEET_ID = "1-oqfYnCyY2djg9WbASAfH21nX8r39R6j-z0UUs-vd4g";
const SHEET_NAME = "data";

const THAI_MONTHS = [
  "", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// 38 column keys matching schema
const COLUMN_KEYS = [
  "date", "time", "water_level", "villages", "households", "people", "routes_cut",
  "trend", "hosp_affected", "staff_total", "staff_affected", "staff_absent",
  "beds_total", "beds_current", "beds_available", "patients_affected", "ambulance_ready",
  "ems_status", "referral_status", "dest_hospital", "bedridden", "oxygen",
  "dialysis", "chronic_med", "urgent_evac", "medicine", "food_water",
  "electricity", "tap_water", "internet", "generator", "fuel",
  "support_1", "support_2", "support_3", "hosp_status", "reporter_name", "reporter_pos"
];

let sheetHeaders = [];

function getExcelColLetter(idx) {
  let letter = "";
  idx += 1;
  while (idx > 0) {
    const mod = (idx - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    idx = Math.floor((idx - mod) / 26);
  }
  return letter;
}

let rawSheetRows = [];
let parsedRecords = [];
let currentRecord = null;
let templateImage = null;
let preloadedAssets = {};

// -------------------------------------------------------------
// Utilities: Thai Date & Time formatting
// -------------------------------------------------------------
function formatThaiDate(dateStr) {
  if (!dateStr) return "";
  const parts = String(dateStr).trim().split(/[/.-]/);
  if (parts.length === 3) {
    let day, month, year;
    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
    if (year < 2400) year += 543;
    if (month >= 1 && month <= 12) {
      return `${day} ${THAI_MONTHS[month]} ${year}`;
    }
  }
  return dateStr;
}

function formatThaiTime(timeStr) {
  if (!timeStr) return "";
  const m = String(timeStr).trim().match(/^(\d{1,2})[:.](\d{2})/);
  if (m) {
    const hh = parseInt(m[1], 10);
    const mm = m[2];
    return `${hh < 10 ? '0' + hh : hh}.${mm}`;
  }
  return timeStr;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// -------------------------------------------------------------
// Preload Assets & Template
// -------------------------------------------------------------
async function initAssets() {
  // Load base template 000.png with cache buster
  templateImage = new Image();
  if (window.location.protocol.startsWith("http")) {
    templateImage.crossOrigin = "anonymous";
  }
  const templatePromise = new Promise((resolve) => {
    templateImage.onload = () => resolve();
    templateImage.onerror = () => {
      console.warn("Could not load 000.png locally, trying fallback...");
      resolve();
    };
  });
  templateImage.src = "000.png?v=" + new Date().getTime();

  // Preload small badge assets
  const assetPromises = [];
  if (typeof ASSETS !== "undefined") {
    for (const [key, src] of Object.entries(ASSETS)) {
      const img = new Image();
      const p = new Promise((resolve) => {
        img.onload = () => {
          preloadedAssets[key] = img;
          resolve();
        };
        img.onerror = () => resolve();
      });
      img.src = src;
      assetPromises.push(p);
    }
  }

  // Ensure Prompt font is loaded
  let fontPromise = Promise.resolve();
  if (document.fonts) {
    fontPromise = Promise.all([
      document.fonts.load("bold 23px Prompt"),
      document.fonts.load("bold 38px Prompt"),
      document.fonts.load("bold 28px Prompt"),
      document.fonts.load("500 16px Prompt"),
      document.fonts.load("14px Prompt")
    ]);
  }

  await Promise.all([templatePromise, ...assetPromises, fontPromise]);
}

// -------------------------------------------------------------
// Data Fetching: JSONP or Fetch fallback
// -------------------------------------------------------------
function loadSheetData() {
  showToast("กำลังดึงข้อมูลจาก Google Sheets...");

  // If inside Google Apps Script Web App environment
  if (typeof google !== "undefined" && google.script && google.script.run) {
    google.script.run
      .withSuccessHandler((res) => {
        if (res && res.data) {
          processRawRows(res.data);
          showToast("โหลดข้อมูลสำเร็จ (GAS)");
        }
      })
      .withFailureHandler((err) => {
        console.error("GAS error:", err);
        fallbackLocalFetch();
      })
      .getSheetData();
    return;
  }

  // Standard Web / GitHub Pages: JSONP bypasses CORS
  const callbackName = "handleSheetData_" + Math.floor(Math.random() * 100000);
  window[callbackName] = function (response) {
    try {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);

      if (response && response.table) {
        const rows = [];
        // Header
        const headers = response.table.cols.map((c) => (c ? c.label : ""));
        rows.push(headers);

        // Data rows
        response.table.rows.forEach((r) => {
          const row = r.c.map((cell) => {
            if (!cell || cell.v === null || cell.v === undefined) return "";
            // If date cell
            if (cell.f) return cell.f;
            return String(cell.v);
          });
          if (row.some((val) => val.trim())) {
            rows.push(row);
          }
        });

        processRawRows(rows);
        showToast("ดึงข้อมูลจาก Google Sheets สำเร็จ");
      } else {
        fallbackLocalFetch();
      }
    } catch (e) {
      console.error(e);
      fallbackLocalFetch();
    }
  };

  const script = document.createElement("script");
  script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=responseHandler:${callbackName}&sheet=${SHEET_NAME}`;
  script.onerror = () => {
    delete window[callbackName];
    fallbackLocalFetch();
  };
  document.body.appendChild(script);
}

function fallbackLocalFetch() {
  fetch("sheet_data.json")
    .then((res) => res.json())
    .then((rows) => {
      processRawRows(rows);
      showToast("ใช้ข้อมูลสำรองล่าสุด (sheet_data.json)");
    })
    .catch((err) => {
      console.error("Failed to load sheet data:", err);
      showToast("ไม่สามารถดึงข้อมูลได้ โปรดตรวจสอบการเชื่อมต่อ");
    });
}

const SECTION_DEFS = [
  { title: "⏱️ 1. ข้อมูลทั่วไป", range: [0, 1] },
  { title: "🌊 2. สถานการณ์พื้นที่", range: [2, 7] },
  { title: "🏥 3. สถานการณ์โรงพยาบาล", range: [8, 15] },
  { title: "🚑 4. ระบบการแพทย์ฉุกเฉิน (EMS)", range: [16, 19] },
  { title: "🧓 5. กลุ่มเปราะบางในพื้นที่", range: [20, 24] },
  { title: "💊 6. ยา / เวชภัณฑ์ / สาธารณูปโภค", range: [25, 31] },
  { title: "🤝 7. สิ่งที่ต้องการสนับสนุนจากจังหวัด", range: [32, 34] },
  { title: "👤 8. สถานะและผู้รายงาน", range: [35, 37] }
];

function processRawRows(rows) {
  if (!rows || rows.length < 2) return;
  rawSheetRows = rows;
  sheetHeaders = rows[0].map((h) => (h !== undefined && h !== null ? String(h).trim() : ""));
  parsedRecords = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r || !r[0] || !r[0].trim()) continue;

    const rec = { _rowIndex: i, _cols: [] };
    for (let c = 0; c < r.length; c++) {
      const val = r[c] !== undefined ? String(r[c]).trim() : "";
      rec._cols[c] = val;
      if (COLUMN_KEYS[c]) rec[COLUMN_KEYS[c]] = val;
      if (sheetHeaders[c]) rec[sheetHeaders[c]] = val;
    }
    // Alias common renames
    if (rec._cols[15] !== undefined) rec.patients_affected = rec._cols[15];
    if (rec._cols[8] !== undefined) rec.hosp_affected = rec._cols[8];

    parsedRecords.push(rec);
  }

  populateDateSelector();
  buildDynamicForm(sheetHeaders, currentRecord);
}

function populateDateSelector() {
  const select = document.getElementById("dateSelect");
  if (!select) return;
  select.innerHTML = "";

  parsedRecords.forEach((rec, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    const thaiDate = formatThaiDate(rec.date || rec._cols?.[0]);
    const timeVal = formatThaiTime(rec.time || rec._cols?.[1]) || "09.00";
    opt.textContent = `${thaiDate || rec.date || "แถวที่ " + (idx + 1)} (เวลา ${timeVal} น.)`;
    select.appendChild(opt);
  });

  if (parsedRecords.length > 0) {
    select.value = "0";
    selectRecord(0);
  }
}

function selectRecord(index) {
  if (parsedRecords[index]) {
    currentRecord = { ...parsedRecords[index], _cols: [...(parsedRecords[index]._cols || [])] };
    updateFormFields(currentRecord);
    renderReport();
  }
}

// -------------------------------------------------------------
// Dynamic Form Generation by Google Sheet Columns
// -------------------------------------------------------------
function buildDynamicForm(headers, rec) {
  const container = document.getElementById("dynamicFormBody");
  if (!container) return;

  const headerTitle = document.getElementById("formHeaderTitle");
  if (headerTitle) {
    headerTitle.textContent = `📝 ตรวจสอบและแก้ไขข้อมูล (${headers.length} รายการ)`;
  }
  const countBadge = document.getElementById("formColCountBadge");
  if (countBadge) {
    countBadge.textContent = `${headers.length} คอลัมน์`;
  }

  container.innerHTML = "";

  const sections = [...SECTION_DEFS];
  if (headers.length > 38) {
    sections.push({ title: "➕ 9. ข้อมูลเพิ่มเติม (ตาม Sheet)", range: [38, headers.length - 1] });
  }

  sections.forEach((sec) => {
    const secDiv = document.createElement("div");
    secDiv.className = "form-section";

    const titleDiv = document.createElement("div");
    titleDiv.className = "section-title";
    titleDiv.textContent = sec.title;
    secDiv.appendChild(titleDiv);

    const gridDiv = document.createElement("div");
    gridDiv.className = "form-grid";

    for (let c = sec.range[0]; c <= Math.min(sec.range[1], headers.length - 1); c++) {
      const colName = headers[c] || (COLUMN_KEYS[c] || `คอลัมน์ ${c + 1}`);
      const colLetter = getExcelColLetter(c);
      const val = rec ? (rec._cols?.[c] || (COLUMN_KEYS[c] ? rec[COLUMN_KEYS[c]] : "") || "") : "";

      const groupDiv = document.createElement("div");
      groupDiv.className = "input-group";
      if (colName.includes("สนับสนุน") || colName.includes("สถานะ") || colName.includes("เร่งด่วน")) {
        groupDiv.classList.add("form-grid-full");
      }

      const label = document.createElement("label");
      label.style.display = "flex";
      label.style.alignItems = "center";
      label.style.gap = "0.35rem";
      label.innerHTML = `<span class="col-badge">[${colLetter}]</span> ${c + 1}. ${colName}`;

      const input = document.createElement("input");
      input.type = "text";
      input.id = `col_field_${c}`;
      input.setAttribute("data-col", c);
      input.className = "input-control";
      input.value = val;

      input.addEventListener("input", (e) => {
        const colIdx = parseInt(e.target.getAttribute("data-col"), 10);
        const newVal = e.target.value;
        if (!currentRecord) currentRecord = { _cols: [] };
        if (!currentRecord._cols) currentRecord._cols = [];
        currentRecord._cols[colIdx] = newVal;
        if (COLUMN_KEYS[colIdx]) currentRecord[COLUMN_KEYS[colIdx]] = newVal;
        if (headers[colIdx]) currentRecord[headers[colIdx]] = newVal;
        if (colIdx === 15) currentRecord.patients_affected = newVal;
        if (colIdx === 8) currentRecord.hosp_affected = newVal;
        debounceRender();
      });

      groupDiv.appendChild(label);
      groupDiv.appendChild(input);
      gridDiv.appendChild(groupDiv);
    }

    secDiv.appendChild(gridDiv);
    container.appendChild(secDiv);
  });

  // Attach search filter
  const searchInput = document.getElementById("formSearchInput");
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = "true";
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll("#dynamicFormBody .form-section").forEach((sec) => {
        let hasVisible = false;
        sec.querySelectorAll(".input-group").forEach((grp) => {
          const text = grp.textContent.toLowerCase();
          const match = text.includes(q);
          grp.style.display = match ? "block" : "none";
          if (match) hasVisible = true;
        });
        sec.style.display = hasVisible ? "block" : "none";
      });
    });
  }
}

function updateFormFields(rec) {
  if (!sheetHeaders || sheetHeaders.length === 0) return;
  for (let c = 0; c < sheetHeaders.length; c++) {
    const el = document.getElementById(`col_field_${c}`);
    if (el) {
      el.value = rec._cols?.[c] || (COLUMN_KEYS[c] ? rec[COLUMN_KEYS[c]] : "") || "";
    }
  }
}

function bindFormEvents() {
  const dateSelect = document.getElementById("dateSelect");
  if (dateSelect) {
    dateSelect.addEventListener("change", (e) => {
      selectRecord(parseInt(e.target.value, 10));
    });
  }

  const btnRefresh = document.getElementById("btnRefresh");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => loadSheetData());
  }

  const btnPrint = document.getElementById("btnPrint");
  if (btnPrint) {
    btnPrint.addEventListener("click", () => window.print());
  }

  const btnDownload = document.getElementById("btnDownload");
  if (btnDownload) {
    btnDownload.addEventListener("click", () => downloadInfographic());
  }
}

let renderTimer = null;
function debounceRender() {
  if (renderTimer) clearTimeout(renderTimer);
  renderTimer = setTimeout(() => {
    renderReport();
  }, 100);
}

// -------------------------------------------------------------
// Canvas Infographic Rendering
// -------------------------------------------------------------
function renderReport() {
  const canvas = document.getElementById("reportCanvas");
  if (!canvas || !templateImage || !currentRecord) return;

  const ctx = canvas.getContext("2d");
  const rec = currentRecord;
  const layout = (typeof getLayoutConfig === "function") ? getLayoutConfig() : (typeof DEFAULT_LAYOUT !== "undefined" ? DEFAULT_LAYOUT : null);

  // Clear & Draw template background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (templateImage && templateImage.complete && templateImage.naturalWidth > 0) {
    ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const NAVY = "#002d62";
  const RED = "#e51c24";
  const DARK_TEAL = "#004b6e";

  function drawCentered(xCenter, y, text, font, fill) {
    if (!text) return;
    ctx.font = font;
    ctx.fillStyle = fill;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(String(text), xCenter, y);
  }

  function drawRightAligned(xRight, y, text, font, fill) {
    if (!text) return;
    ctx.font = font;
    ctx.fillStyle = fill;
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(String(text), xRight, y);
  }

  function drawLeftAligned(xLeft, y, text, font, fill) {
    if (!text) return;
    ctx.font = font;
    ctx.fillStyle = fill;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(String(text), xLeft, y);
  }

  function drawItem(id, defaultVal, defaultX, defaultY, defaultFont, defaultFill, defaultAlign = "left") {
    const cfg = layout ? layout[id] : null;
    if (cfg && cfg.visible === false) return;

    const val = (defaultVal !== undefined && defaultVal !== null && defaultVal !== "") ? defaultVal : "";
    if (!val) return;

    const x = (cfg && cfg.x !== undefined) ? cfg.x : defaultX;
    const y = (cfg && cfg.y !== undefined) ? cfg.y : defaultY;
    const align = (cfg && cfg.align) ? cfg.align : defaultAlign;
    const fill = (cfg && cfg.color) ? cfg.color : defaultFill;
    const font = (cfg && cfg.fontSize) ? `${cfg.fontWeight || "bold"} ${cfg.fontSize}px ${cfg.fontFamily || "Prompt"}` : defaultFont;

    if (align === "center") {
      drawCentered(x, y, val, font, fill);
    } else if (align === "right") {
      drawRightAligned(x, y, val, font, fill);
    } else {
      drawLeftAligned(x, y, val, font, fill);
    }
  }

  // -------------------------------------------------------------
  // 1. Header: Date & Time
  // -------------------------------------------------------------
  const dateFormatted = formatThaiDate(rec.date);
  const timeFormatted = formatThaiTime(rec.time);
  if (dateFormatted) {
    drawItem("date", dateFormatted, 338, 210, "bold 23px Prompt", NAVY, "left");
  }
  if (timeFormatted) {
    drawItem("time", timeFormatted, 658, 210, "bold 23px Prompt", NAVY, "left");
  }

  // -------------------------------------------------------------
  // 2. Box 1: สถานการณ์พื้นที่ (Area Situation)
  // -------------------------------------------------------------
  drawItem("water_level", rec.water_level, 374, 338, "bold 38px Prompt", RED, "center");
  drawItem("villages", rec.villages, 374, 390, "bold 38px Prompt", RED, "center");
  drawItem("households", rec.households, 374, 444, "bold 38px Prompt", RED, "center");
  drawItem("people", rec.people, 374, 499, "bold 38px Prompt", RED, "center");
  drawItem("routes_cut", rec.routes_cut, 374, 556, "bold 38px Prompt", RED, "center");

  // Trend Pill & Checkboxes
  const trendCfg = layout ? layout.trend : null;
  if (!trendCfg || trendCfg.visible !== false) {
    const tx = trendCfg?.x !== undefined ? trendCfg.x : 248;
    const ty = trendCfg?.y !== undefined ? trendCfg.y : 618;
    if (rec.trend === "เพิ่มขึ้น" && preloadedAssets["pill_trend"]) {
      ctx.drawImage(preloadedAssets["pill_trend"], tx, ty);
    } else if (rec.trend) {
      drawDynamicPill(ctx, tx, ty, rec.trend, rec.trend.includes("เพิ่ม") ? "red" : "green");
    }
  }

  const chkCfg = layout ? layout.checkboxes : null;
  if (!chkCfg || chkCfg.visible !== false) {
    const cx = chkCfg?.x !== undefined ? chkCfg.x : 245;
    const cy = chkCfg?.y !== undefined ? chkCfg.y : 660;
    if (preloadedAssets["checkboxes"]) {
      ctx.drawImage(preloadedAssets["checkboxes"], cx, cy);
    }
  }

  // -------------------------------------------------------------
  // 3. Box 2: สถานการณ์โรงพยาบาล (Hospital Situation)
  // -------------------------------------------------------------
  const hospCfg = layout ? layout.hosp_affected : null;
  if (!hospCfg || hospCfg.visible !== false) {
    const hx = hospCfg?.x !== undefined ? hospCfg.x : 745;
    const hy = hospCfg?.y !== undefined ? hospCfg.y : 332;
    if (rec.hosp_affected !== undefined && rec.hosp_affected !== null && rec.hosp_affected !== "") {
      let v = String(rec.hosp_affected).trim();
      const isRed = v === "ได้รับ" || v === "1" || (v.includes("ได้") && !v.includes("ไม่"));
      drawDynamicPill(ctx, hx, hy, v, isRed ? "red" : "green");
    }
  }

  drawItem("staff_total", rec.staff_total, 920, 398, "bold 28px Prompt", DARK_TEAL, "right");
  drawItem("staff_affected", rec.staff_affected, 920, 438, "bold 28px Prompt", DARK_TEAL, "right");
  drawItem("staff_absent", rec.staff_absent, 920, 480, "bold 28px Prompt", DARK_TEAL, "right");

  // Beds & Patients Affected
  const bedItems = [
    { key: "beds_total", val: rec.beds_total, y: 526 },
    { key: "beds_current", val: rec.beds_current, y: 567 },
    { key: "beds_available", val: rec.beds_available, y: 608 },
    { key: "patients_affected", val: rec.patients_affected || rec.er_ready, y: 649 }
  ];

  bedItems.forEach((item) => {
    if (item.val !== undefined && item.val !== null && item.val !== "") {
      let v = String(item.val).trim();
      if (v.endsWith(".0")) v = v.substring(0, v.length - 2);
      const isNum = /^\d+$/.test(v);
      const cfg = layout ? layout[item.key] : null;
      const defAlign = isNum ? "right" : "center";
      const defX = isNum ? 920 : 898;
      const defY = isNum ? item.y : item.y + 4;
      const defFont = isNum ? "bold 28px Prompt" : "bold 20px Prompt";
      drawItem(item.key, v, defX, defY, defFont, DARK_TEAL, defAlign);
    }
  });

  // -------------------------------------------------------------
  // 4. Box 3: ระบบการแพทย์ฉุกเฉิน (EMS)
  // -------------------------------------------------------------
  if (rec.ambulance_ready) {
    const isNum = /^\d+$/.test(rec.ambulance_ready);
    drawItem("ambulance_ready", rec.ambulance_ready, 422, isNum ? 788 : 792, isNum ? "bold 28px Prompt" : "bold 20px Prompt", DARK_TEAL, "center");
  }

  const emsCfg = layout ? layout.ems_status : null;
  if (!emsCfg || emsCfg.visible !== false) {
    const emsX = emsCfg?.x !== undefined ? emsCfg.x : 360;
    const emsY = emsCfg?.y !== undefined ? emsCfg.y : 835;
    if (["ปกติ", "พร้อม"].includes(rec.ems_status) && preloadedAssets["ems"]) {
      ctx.drawImage(preloadedAssets["ems"], emsX, emsY);
    } else if (rec.ems_status) {
      drawDynamicPill(ctx, emsX, emsY, rec.ems_status, "green");
    }
  }

  const refCfg = layout ? layout.referral_status : null;
  if (!refCfg || refCfg.visible !== false) {
    const refX = refCfg?.x !== undefined ? refCfg.x : 360;
    const refY = refCfg?.y !== undefined ? refCfg.y : 895;
    if (["ปกติ", "พร้อม"].includes(rec.referral_status) && preloadedAssets["ref"]) {
      ctx.drawImage(preloadedAssets["ref"], refX, refY);
    } else if (rec.referral_status) {
      drawDynamicPill(ctx, refX, refY, rec.referral_status, "green");
    }
  }

  // Coordinated hospital
  const destCfg = layout ? layout.dest_hospital : null;
  if (!destCfg || destCfg.visible !== false) {
    const destHosp = rec.dest_hospital ? rec.dest_hospital.trim() : "รอระบุ";
    const dx = destCfg?.x !== undefined ? destCfg.x : 422;
    const dy = destCfg?.y !== undefined ? destCfg.y : 960;
    if ((!rec.dest_hospital || destHosp === "รอระบุ") && preloadedAssets["dest_hosp"]) {
      ctx.drawImage(preloadedAssets["dest_hosp"], dx - 42, dy - 5);
    } else {
      drawItem("dest_hospital", destHosp, dx, dy, "bold 20px Prompt", NAVY, "center");
    }
  }

  // -------------------------------------------------------------
  // 5. Box 4: กลุ่มเปราะบางในพื้นที่ (Vulnerable Groups)
  // -------------------------------------------------------------
  drawItem("bedridden", rec.bedridden, 898, 783, "bold 32px Prompt", RED, "right");
  drawItem("oxygen", rec.oxygen, 898, 840, "bold 32px Prompt", RED, "right");
  drawItem("dialysis", rec.dialysis, 898, 897, "bold 32px Prompt", RED, "right");
  drawItem("chronic_med", rec.chronic_med, 898, 954, "bold 32px Prompt", RED, "right");
  drawItem("urgent_evac", rec.urgent_evac, 898, 1010, "bold 32px Prompt", RED, "right");

  // -------------------------------------------------------------
  // 6. Box 5: ยา / เวชภัณฑ์ / สาธารณูปโภค (Medicine & Utilities)
  // -------------------------------------------------------------
  function renderPill(id, val, defX, defY, exactAssetKey, defaultPillType = "green") {
    const cfg = layout ? layout[id] : null;
    if (cfg && cfg.visible === false) return;
    if (!val) return;
    const px = cfg?.x !== undefined ? cfg.x : defX;
    const py = cfg?.y !== undefined ? cfg.y : defY;

    if (exactAssetKey && preloadedAssets[exactAssetKey]) {
      ctx.drawImage(preloadedAssets[exactAssetKey], px, py);
    } else {
      drawDynamicPill(ctx, px, py, val, defaultPillType);
    }
  }

  renderPill("medicine", rec.medicine, 215, 1083, rec.medicine === "เพียงพอ" ? "pill_peangphor" : null, "green");
  renderPill("food_water", rec.food_water, 215, 1148, rec.food_water === "เพียงพอ" ? "pill_peangphor" : null, "green");
  renderPill("electricity", rec.electricity, 215, 1190, rec.electricity === "ปกติ" ? "pill_pokati" : null, "green");
  renderPill("tap_water", rec.tap_water, 215, 1233, rec.tap_water === "ปกติ" ? "pill_pokati" : null, "green");
  renderPill("internet", rec.internet, 215, 1283, rec.internet === "ปกติ" ? "pill_pokati" : null, "green");
  renderPill("generator", rec.generator, 218, 1324, ["ปกติ", "พร้อม"].includes(rec.generator) ? "pill_prom" : null, "green");

  // Fuel
  const fuelCfg = layout ? layout.fuel : null;
  if (!fuelCfg || fuelCfg.visible !== false) {
    const fx = fuelCfg?.x !== undefined ? fuelCfg.x : 218;
    const fy = fuelCfg?.y !== undefined ? fuelCfg.y : 1363;
    if (rec.fuel === "200" && preloadedAssets["pill_fuel"]) {
      ctx.drawImage(preloadedAssets["pill_fuel"], fx, fy);
    } else if (rec.fuel) {
      const fuelText = /^\d+$/.test(rec.fuel) ? `${rec.fuel} ลิตร` : rec.fuel;
      drawDynamicPill(ctx, fx, fy, fuelText, "blue");
    }
  }

  // -------------------------------------------------------------
  // 7. Box 6: สิ่งที่ต้องการสนับสนุนจากจังหวัด (Provincial Support)
  // -------------------------------------------------------------
  function renderSupportItem(text, cfgKey, defaultY, defaultIconKey) {
    const cfg = layout ? layout[cfgKey] : null;
    if (cfg && cfg.visible === false) return;
    if (!text || !text.trim()) return;
    const cleanText = text.trim();

    let iconImg = null;
    if (/lepto|ตรวจ|ชุดตรวจ/i.test(cleanText)) {
      iconImg = preloadedAssets["icon_support_1"];
    } else if (/น้ำ|ประปา/i.test(cleanText)) {
      iconImg = preloadedAssets["icon_support_2"];
    } else if (/ผู้ป่วย|ติดเตียง|อพยพ/i.test(cleanText)) {
      iconImg = preloadedAssets["icon_support_3"];
    } else if (defaultIconKey && preloadedAssets[defaultIconKey]) {
      iconImg = preloadedAssets[defaultIconKey];
    }

    const xBase = cfg?.x !== undefined ? cfg.x : 580;
    const yTop = cfg?.y !== undefined ? cfg.y : defaultY;
    const fontSize = cfg?.fontSize || 16;
    const color = cfg?.color || NAVY;

    let xText = xBase;
    if (iconImg) {
      ctx.drawImage(iconImg, xBase - 5, yTop + 2);
      xText = xBase - 5 + iconImg.width + 10;
    }

    const maxW = 935 - xText;
    const lines = wrapThaiCanvasText(ctx, cleanText, maxW, `bold ${fontSize}px Prompt`);
    if (lines.length === 0) return;

    ctx.fillStyle = color;
    let currY = yTop;
    lines.forEach((line, idx) => {
      ctx.font = idx === 0 ? `bold ${fontSize}px Prompt` : "14px Prompt";
      ctx.textBaseline = "top";
      ctx.textAlign = cfg?.align || "left";
      ctx.fillText(line, xText, currY);
      currY += 21;
    });
  }

  renderSupportItem(rec.support_1, "support_1", 1146, "icon_support_1");
  renderSupportItem(rec.support_2, "support_2", 1220, "icon_support_2");
  renderSupportItem(rec.support_3, "support_3", 1298, "icon_support_3");

  // -------------------------------------------------------------
  // 8. Footer: Hospital Status & Reporter
  // -------------------------------------------------------------
  const statusCfg = layout ? layout.hosp_status : null;
  if (!statusCfg || statusCfg.visible !== false) {
    const sx = statusCfg?.x !== undefined ? statusCfg.x : 225;
    const sy = statusCfg?.y !== undefined ? statusCfg.y : 1418;
    const statusStr = (rec.hosp_status || "").trim();
    if (statusStr) {
      if (statusStr.includes("กระทบ") || /yellow/i.test(statusStr)) {
        if (preloadedAssets["pill_status_yellow"]) {
          ctx.drawImage(preloadedAssets["pill_status_yellow"], sx, sy);
        }
      } else if (statusStr.includes("เร่งด่วน") || statusStr.includes("งด") || /red/i.test(statusStr)) {
        if (preloadedAssets["pill_status_red"]) {
          ctx.drawImage(preloadedAssets["pill_status_red"], sx, sy);
        }
      } else if (statusStr.includes("ปกติ") || /green/i.test(statusStr)) {
        if (preloadedAssets["pill_status_green"]) {
          ctx.drawImage(preloadedAssets["pill_status_green"], sx, sy);
        } else if (preloadedAssets["pill_status"]) {
          ctx.drawImage(preloadedAssets["pill_status"], sx, sy);
        }
      }
    }
  }

  const reporterName = rec.reporter_name || "รพ.ไทรโยค";
  drawItem("reporter_name", reporterName, 864, 1410, "500 15px Prompt", NAVY, "left");

  const repPosCfg = layout ? layout.reporter_pos : null;
  if (!repPosCfg || repPosCfg.visible !== false) {
    const px = repPosCfg?.x !== undefined ? repPosCfg.x : 864;
    const py = repPosCfg?.y !== undefined ? repPosCfg.y : 1435;
    const pCol = repPosCfg?.color || NAVY;
    if (rec.reporter_pos) {
      drawFittedText(ctx, px, py, 105, rec.reporter_pos, "Prompt", repPosCfg?.fontSize || 13, 8, pCol);
    }
  }

  if (timeFormatted) {
    drawItem("footer_time", `${timeFormatted} น.`, 854, 1461, "500 15px Prompt", NAVY, "left");
  }

  // -------------------------------------------------------------
  // 9. Custom Texts (ข้อความอิสระที่เพิ่มเองจากหน้า Admin)
  // -------------------------------------------------------------
  if (layout && Array.isArray(layout.custom_texts)) {
    layout.custom_texts.forEach((item) => {
      if (item && item.visible !== false && item.text) {
        ctx.save();
        ctx.font = `${item.fontWeight || "bold"} ${item.fontSize || 20}px ${item.fontFamily || "Prompt"}, sans-serif`;
        ctx.fillStyle = item.color || NAVY;
        ctx.textAlign = item.align || "left";
        ctx.textBaseline = "top";
        ctx.fillText(String(item.text), item.x, item.y);
        ctx.restore();
      }
    });
  }
}

// -------------------------------------------------------------
// Canvas Drawing Helpers
// -------------------------------------------------------------
function drawDynamicPill(ctx, x, y, text, type = "green") {
  ctx.save();
  ctx.font = "bold 20px Prompt";
  const tw = ctx.measureText(text).width;
  const h = 34;
  const w = tw + 50;

  let bg = "#009944";
  if (type === "red") bg = "#e51c24";
  if (type === "blue") bg = "#0066b2";

  // Rounded rectangle
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fill();

  // Circle icon
  ctx.fillStyle = "#ffffff";
  const cx = x + 17;
  const cy = y + h / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 11, 0, Math.PI * 2);
  ctx.fill();

  // Checkmark or X
  ctx.strokeStyle = bg;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  if (type === "green") {
    ctx.moveTo(cx - 5, cy);
    ctx.lineTo(cx - 1, cy + 4);
    ctx.lineTo(cx + 5, cy - 4);
  } else if (type === "red") {
    ctx.moveTo(cx - 4, cy - 4);
    ctx.lineTo(cx + 4, cy + 4);
    ctx.moveTo(cx - 4, cy + 4);
    ctx.lineTo(cx + 4, cy - 4);
  }
  ctx.stroke();

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(text, x + 35, cy);
  ctx.restore();
}

function wrapThaiCanvasText(ctx, text, maxW, font) {
  ctx.save();
  ctx.font = font;
  const paragraphs = text.split('\n');
  const lines = [];

  let segmenter = null;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      segmenter = new Intl.Segmenter('th', { granularity: 'word' });
    } catch (e) {}
  }

  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;

    if (segmenter) {
      const words = Array.from(segmenter.segment(trimmed)).map(s => s.segment);
      let curr = "";
      for (const w of words) {
        const test = curr + w;
        if (ctx.measureText(test).width <= maxW) {
          curr = test;
        } else {
          if (ctx.measureText(w).width <= maxW) {
            if (curr.trim()) lines.push(curr.trim());
            curr = w.trimStart();
          } else {
            for (const ch of w) {
              const testCh = curr + ch;
              if (ctx.measureText(testCh).width <= maxW) {
                curr = testCh;
              } else {
                if (curr.trim()) lines.push(curr.trim());
                curr = ch;
              }
            }
          }
        }
      }
      if (curr.trim()) lines.push(curr.trim());
    } else {
      const words = trimmed.split(' ');
      let curr = "";
      for (const w of words) {
        const test = curr ? curr + " " + w : w;
        if (ctx.measureText(test).width <= maxW) {
          curr = test;
        } else {
          if (ctx.measureText(w).width <= maxW) {
            if (curr) lines.push(curr);
            curr = w;
          } else {
            for (const ch of w) {
              const testCh = curr + ch;
              if (ctx.measureText(testCh).width <= maxW) {
                curr = testCh;
              } else {
                if (curr) lines.push(curr);
                curr = ch;
              }
            }
          }
        }
      }
      if (curr) lines.push(curr);
    }
  }
  ctx.restore();
  return lines;
}

function drawFittedText(ctx, xLeft, y, maxW, text, fontFamily, baseSize = 13, minSize = 8, fill = "#002d62") {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  for (let sz = baseSize; sz >= minSize; sz--) {
    ctx.font = `${sz}px ${fontFamily}`;
    const tw = ctx.measureText(text).width;
    if (tw <= maxW || sz === minSize) {
      ctx.fillText(text, xLeft, y);
      ctx.restore();
      return;
    }
  }
  ctx.restore();
}

function downloadInfographic() {
  const canvas = document.getElementById("reportCanvas");
  if (!canvas || !currentRecord) return;

  const dateStr = currentRecord.date ? currentRecord.date.replace(/[/.-]/g, "_") : "report";
  const link = document.createElement("a");
  link.download = `water_report_${dateStr}.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("ดาวน์โหลดรูปภาพเรียบร้อยแล้ว");
}

// -------------------------------------------------------------
// App Initialization
// -------------------------------------------------------------
window.addEventListener("DOMContentLoaded", async () => {
  bindFormEvents();
  await initAssets();
  loadSheetData();
});
