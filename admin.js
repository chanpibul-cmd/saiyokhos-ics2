/**
 * Admin Visual Layout & Text Editor
 * For Flood Situation Report Infographic (1024 x 1536 px)
 */

// Realistic sample values for previewing layout in Admin
const SAMPLE_RECORD = {
  date: "28/9/2026",
  time: "9:00",
  water_level: "4",
  villages: "29",
  households: "46",
  people: "150",
  routes_cut: "8",
  trend: "เพิ่มขึ้น",
  bedridden: "28",
  bedridden_affected: "0",
  bedridden_helped: "0",
  oxygen: "0",
  oxygen_affected: "0",
  oxygen_helped: "0",
  dialysis: "0",
  dialysis_affected: "0",
  dialysis_helped: "0",
  chronic_med: "0",
  chronic_med_affected: "0",
  chronic_med_helped: "0",
  pregnant_total: "0",
  pregnant_affected: "0",
  pregnant_helped: "0",
  diabetes_total: "0",
  diabetes_affected: "0",
  diabetes_helped: "0",
  smiv_total: "0",
  smiv_affected: "0",
  smiv_helped: "0",
  shelter_total: "0",
  shelter_people: "0",
  kitchen_total: "0",
  mcatt_status: "ปกติ",
  hosp_affected: "ไม่ได้รับ",
  staff_total: "150",
  staff_affected: "0",
  staff_helped: "0",
  staff_absent: "0",
  beds_total: "58",
  beds_current: "15",
  beds_available: "43",
  patients_affected: "0",
  ambulance_ready: "4",
  ems_status: "ปกติ",
  referral_status: "ปกติ",
  dest_hospital: "รพ.พหลพลพยุหเสนา",
  medicine: "เพียงพอ",
  food_water: "เพียงพอ",
  electricity: "ปกติ",
  tap_water: "ปกติ",
  internet: "ปกติ",
  generator: "ปกติ",
  fuel: "200",
  support_1: "สนับสนุน/เตรียม Lepto Kit Test สำหรับเฝ้าระวังโรคเลปโตสไปโรซิส",
  support_2: "ประสานแผนสำรองน้ำอุปโภคบริโภค กรณีเทศบาลงดจ่ายน้ำประปา",
  support_3: "ติดตามและดูแลกลุ่มผู้ป่วยติดบ้าน/ติดเตียง 28 ราย รวมถึงแผนเข้าถึงหรืออพยพ",
  hosp_status: "ให้บริการได้ปกติ",
  reporter_name: "โรงพยาบาลไทรโยค",
  reporter_pos: "ศูนย์ EOC โรงพยาบาล",
  urgent_evac: "0"
};

// Global Admin State
let layoutConfig = null;
let selectedId = null;
let templateImage = null;
let preloadedAssets = {};
let currentZoom = "fit";
let zoomScale = 1.0;
let showBounds = true;
let showGrid = false;

// Dragging State
let isDragging = false;
let dragStartMouse = { x: 0, y: 0 };
let dragStartElemPos = { x: 0, y: 0 };

// -------------------------------------------------------------
// Toast & Notifications
// -------------------------------------------------------------
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// -------------------------------------------------------------
// Initialization
// -------------------------------------------------------------
window.addEventListener("DOMContentLoaded", async () => {
  layoutConfig = getLayoutConfig();
  if (!layoutConfig.custom_texts) {
    layoutConfig.custom_texts = [];
  }

  await initAssets();
  initTabs();
  initZoomAndStage();
  initCanvasInteraction();
  initInspectorControls();
  initTreeList();
  initBackupTab();
  updateRawJsonView();

  applyZoom();
  renderAdminCanvas();

  // Load live / cached sheet data to sync all columns
  await loadSheetDataForAdmin();
});

async function loadSheetDataForAdmin() {
  try {
    const res = await fetch("sheet_data.json");
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0) {
        const headers = rows[0];
        if (typeof syncSheetColumns === "function") {
          syncSheetColumns(headers);
        }
        if (rows.length > 1) {
          const r = rows[1];
          headers.forEach((h, idx) => {
            const val = r[idx] !== undefined && r[idx] !== null ? String(r[idx]).trim() : "";
            const key = typeof getColumnKey === "function" ? getColumnKey(h, idx) : "";
            if (key && val) {
              SAMPLE_RECORD[key] = val;
            }
          });
        }
        const badge = document.getElementById("headerColCountBadge");
        if (badge && typeof SHEET_COLUMNS_INFO !== "undefined") {
          badge.textContent = `${SHEET_COLUMNS_INFO.length}`;
        }
        populateHeaderDropdowns();
        initTreeList();
        renderAdminCanvas();
      }
    }
  } catch (e) {
    console.warn("Could not load sheet_data.json in admin:", e);
  }
}

async function initAssets() {
  templateImage = new Image();
  if (window.location.protocol.startsWith("http")) {
    templateImage.crossOrigin = "anonymous";
  }
  const templatePromise = new Promise((resolve) => {
    templateImage.onload = () => resolve();
    templateImage.onerror = () => {
      console.warn("Could not load 000.png, proceeding...");
      resolve();
    };
  });
  templateImage.src = "000.png?v=" + Date.now();

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
// Tabs Switching
// -------------------------------------------------------------
function initTabs() {
  const tabBtns = document.querySelectorAll(".admin-tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTab(btn.getAttribute("data-tab"));
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".admin-tab-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".admin-tab-content").forEach((c) => {
    c.classList.toggle("active", c.id === tabId);
  });
  if (tabId === "tab-backup") {
    updateRawJsonView();
  }
}

// -------------------------------------------------------------
// Zoom & Viewport Scaling
// -------------------------------------------------------------
function initZoomAndStage() {
  const zoomSelect = document.getElementById("zoomSelect");
  if (zoomSelect) {
    zoomSelect.addEventListener("change", (e) => {
      currentZoom = e.target.value;
      applyZoom();
    });
  }

  const chkShowBounds = document.getElementById("chkShowBounds");
  if (chkShowBounds) {
    chkShowBounds.addEventListener("change", (e) => {
      showBounds = e.target.checked;
      renderAdminCanvas();
    });
  }

  const chkShowGrid = document.getElementById("chkShowGrid");
  if (chkShowGrid) {
    chkShowGrid.addEventListener("change", (e) => {
      showGrid = e.target.checked;
      renderAdminCanvas();
    });
  }

  window.addEventListener("resize", () => {
    if (currentZoom === "fit") {
      applyZoom();
    }
  });

  const btnQuickAdd = document.getElementById("btnQuickAddCustom");
  if (btnQuickAdd) {
    btnQuickAdd.addEventListener("click", () => {
      switchTab("tab-add");
      document.getElementById("newTextContent")?.focus();
    });
  }
}

function applyZoom() {
  const canvasContainer = document.getElementById("canvasContainer");
  const viewport = document.getElementById("viewport");
  if (!canvasContainer || !viewport) return;

  if (currentZoom === "fit") {
    const availH = viewport.clientHeight - 40;
    const availW = viewport.clientWidth - 40;
    const scaleY = availH / 1536;
    const scaleX = availW / 1024;
    zoomScale = Math.min(scaleY, scaleX, 1.0);
    if (zoomScale < 0.25) zoomScale = 0.25;
  } else {
    zoomScale = parseFloat(currentZoom) || 1.0;
  }

  canvasContainer.style.transform = `scale(${zoomScale})`;
  canvasContainer.style.width = "1024px";
  canvasContainer.style.height = "1536px";
}

// -------------------------------------------------------------
// Element Helper: Find element by ID
// -------------------------------------------------------------
function getElementConfig(id) {
  if (!id) return null;
  if (id.startsWith("custom_")) {
    return layoutConfig.custom_texts?.find((t) => t.id === id) || null;
  }
  if (!layoutConfig[id]) {
    const colInfo = (typeof SHEET_COLUMNS_INFO !== "undefined") ? SHEET_COLUMNS_INFO.find((c) => c.key === id) : null;
    if (colInfo) {
      layoutConfig[id] = {
        id: id,
        colIndex: colInfo.index,
        colLetter: colInfo.letter,
        label: `[${colInfo.letter}] ${colInfo.index + 1}. ${colInfo.name}`,
        category: colInfo.category,
        type: "text",
        x: 512,
        y: 768,
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Prompt",
        color: "#002d62",
        align: "left",
        visible: true,
        sampleText: (typeof SAMPLE_RECORD !== "undefined" && SAMPLE_RECORD[id]) ? SAMPLE_RECORD[id] : colInfo.name
      };
    }
  }
  return layoutConfig[id] || null;
}

// -------------------------------------------------------------
// Bounding Box Calculation for Hit-Testing & Rendering
// -------------------------------------------------------------
function getElementBounds(elem, ctx) {
  if (!elem || elem.visible === false) return null;

  let text = "";
  if (elem.type === "custom") {
    text = elem.text || "ข้อความใหม่";
  } else if (elem.sampleText) {
    text = elem.sampleText;
  } else if (SAMPLE_RECORD[elem.id] !== undefined) {
    text = SAMPLE_RECORD[elem.id];
  } else {
    text = elem.label || elem.id;
  }

  // Format special items like date / time
  if (elem.id === "date") text = "28 กันยายน 2569";
  if (elem.id === "time") text = "09.00";
  if (elem.id === "fuel" && /^\d+$/.test(text)) text = `${text} ลิตร`;
  if (elem.id === "footer_time") text = "09.00 น.";

  const font = `${elem.fontWeight || "normal"} ${elem.fontSize || 20}px Prompt, sans-serif`;
  ctx.save();
  ctx.font = font;

  // Handle badges/pills
  if (elem.type === "badge" || elem.type === "pill") {
    const w = elem.width || 120;
    const h = elem.height || 36;
    ctx.restore();
    return {
      id: elem.id,
      x: elem.x,
      y: elem.y,
      w: w,
      h: h,
      type: elem.type,
      text: text
    };
  }

  // Handle multi-line support text
  if (elem.type === "support_item") {
    const maxW = 320;
    const lines = wrapThaiCanvasText(ctx, text, maxW, font);
    const lineH = 21;
    const h = Math.max(34, lines.length * lineH + 6);
    ctx.restore();
    return {
      id: elem.id,
      x: elem.x - 30, // Include icon offset
      y: elem.y,
      w: maxW + 35,
      h: h,
      type: "support_item",
      text: text
    };
  }

  // Standard text or custom text
  const tw = ctx.measureText(text).width;
  const th = (elem.fontSize || 20) * 1.25;
  ctx.restore();

  let left = elem.x;
  if (elem.align === "center") {
    left = elem.x - tw / 2;
  } else if (elem.align === "right") {
    left = elem.x - tw;
  }

  const pad = 4;
  return {
    id: elem.id,
    x: left - pad,
    y: elem.y - pad,
    w: tw + pad * 2,
    h: th + pad * 2,
    type: elem.type || "text",
    text: text
  };
}

// -------------------------------------------------------------
// Canvas Rendering
// -------------------------------------------------------------
function renderAdminCanvas() {
  const canvas = document.getElementById("adminCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // 1. Draw Template Image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (templateImage && templateImage.complete && templateImage.naturalWidth > 0) {
    ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px Prompt";
    ctx.fillText("กำลังโหลดแม่แบบ...", 450, 750);
  }

  // 2. Draw Grid (if enabled)
  if (showGrid) {
    ctx.save();
    ctx.strokeStyle = "rgba(0, 102, 178, 0.15)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    // Major axes
    ctx.strokeStyle = "rgba(229, 28, 36, 0.25)";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.restore();
  }

  // 3. Render all elements
  const allElements = getAllRenderableElements();

  allElements.forEach((elem) => {
    if (elem.visible === false) return;
    renderSingleElement(ctx, elem);
  });

  // 4. Render Bounding Boxes & Selection Highlight
  if (showBounds || selectedId) {
    allElements.forEach((elem) => {
      const bounds = getElementBounds(elem, ctx);
      if (!bounds) return;

      const isSel = elem.id === selectedId;

      if (isSel) {
        // Highlight Selected Element
        ctx.save();
        ctx.strokeStyle = "#e51c24";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);

        // Fill subtle tint
        ctx.fillStyle = "rgba(229, 28, 36, 0.1)";
        ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);

        // Draw coordinate anchor marker
        ctx.fillStyle = "#e51c24";
        ctx.beginPath();
        ctx.arc(elem.x, elem.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label above bounds
        ctx.fillStyle = "#e51c24";
        ctx.font = "bold 13px Prompt";
        ctx.setLineDash([]);
        const labelText = `${elem.label || elem.id} (${elem.x}, ${elem.y})`;
        ctx.fillText(labelText, bounds.x, Math.max(16, bounds.y - 6));
        ctx.restore();
      } else if (showBounds) {
        // Unselected normal bounds
        ctx.save();
        ctx.strokeStyle = elem.type === "custom" ? "rgba(217, 119, 6, 0.6)" : "rgba(0, 102, 178, 0.35)";
        ctx.lineWidth = 1;
        ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
        ctx.restore();
      }
    });
  }
}

function getAllRenderableElements() {
  const list = [];
  // Standard items in layoutConfig
  for (const [key, val] of Object.entries(layoutConfig)) {
    if (key === "custom_texts") continue;
    if (val && typeof val === "object" && val.x !== undefined) {
      list.push(val);
    }
  }
  // Sheet columns from SHEET_COLUMNS_INFO not yet in layoutConfig
  if (typeof SHEET_COLUMNS_INFO !== "undefined" && Array.isArray(SHEET_COLUMNS_INFO)) {
    SHEET_COLUMNS_INFO.forEach((col) => {
      if (!layoutConfig[col.key]) {
        const item = {
          id: col.key,
          colIndex: col.index,
          colLetter: col.letter,
          label: `[${col.letter}] ${col.index + 1}. ${col.name}`,
          category: col.category,
          type: "text",
          x: 512,
          y: 768,
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "Prompt",
          color: "#002d62",
          align: "left",
          visible: false,
          sampleText: (typeof SAMPLE_RECORD !== "undefined" && SAMPLE_RECORD[col.key]) ? SAMPLE_RECORD[col.key] : col.name
        };
        layoutConfig[col.key] = item;
        list.push(item);
      }
    });
  }
  // Custom texts
  if (Array.isArray(layoutConfig.custom_texts)) {
    layoutConfig.custom_texts.forEach((item) => list.push(item));
  }
  return list;
}

function renderSingleElement(ctx, elem) {
  ctx.save();

  // Badges & Pills
  if (elem.type === "badge" || elem.type === "pill") {
    if (elem.id === "hosp_affected") {
      const val = elem.sampleText || SAMPLE_RECORD.hosp_affected || "ไม่ได้รับ";
      const isRed = val === "ได้รับ" || val === "1" || (typeof val === "string" && val.includes("ได้") && !val.includes("ไม่"));
      drawDynamicPill(ctx, elem.x, elem.y, val, isRed ? "red" : "green");
      ctx.restore();
      return;
    }
    let img = preloadedAssets[elem.assetKey];
    if (img && img.complete) {
      ctx.drawImage(img, elem.x, elem.y);
    } else {
      drawDynamicPill(ctx, elem.x, elem.y, elem.label || elem.id, "green");
    }
    ctx.restore();
    return;
  }

  // Support items (with icon & word-wrap)
  if (elem.type === "support_item") {
    const text = elem.sampleText || SAMPLE_RECORD[elem.id] || elem.label;
    let iconImg = preloadedAssets[elem.defaultIconKey];
    let xText = elem.x;
    if (iconImg && iconImg.complete) {
      ctx.drawImage(iconImg, elem.x - 25, elem.y + 2);
    }
    const lines = wrapThaiCanvasText(ctx, text, 320, `bold ${elem.fontSize || 16}px Prompt`);
    ctx.fillStyle = elem.color || "#002d62";
    let currY = elem.y;
    lines.forEach((line, idx) => {
      ctx.font = idx === 0 ? `bold ${elem.fontSize || 16}px Prompt` : `14px Prompt`;
      ctx.textBaseline = "top";
      ctx.textAlign = elem.align || "left";
      ctx.fillText(line, xText, currY);
      currY += 21;
    });
    ctx.restore();
    return;
  }

  // Normal or Custom Text
  let text = "";
  if (elem.type === "custom") {
    text = elem.text || "ข้อความใหม่";
  } else if (elem.sampleText) {
    text = elem.sampleText;
  } else if (SAMPLE_RECORD[elem.id] !== undefined) {
    text = SAMPLE_RECORD[elem.id];
  } else {
    text = elem.label || elem.id;
  }

  if (elem.id === "date") text = "28 กันยายน 2569";
  if (elem.id === "time") text = "09.00";
  if (elem.id === "fuel" && /^\d+$/.test(text)) text = `${text} ลิตร`;
  if (elem.id === "footer_time") text = "09.00 น.";

  ctx.font = `${elem.fontWeight || "normal"} ${elem.fontSize || 20}px ${elem.fontFamily || "Prompt"}, sans-serif`;
  ctx.fillStyle = elem.color || "#002d62";
  ctx.textAlign = elem.align || "left";
  ctx.textBaseline = "top";
  ctx.fillText(String(text), elem.x, elem.y);

  ctx.restore();
}

// -------------------------------------------------------------
// Mouse & Canvas Interaction
// -------------------------------------------------------------
function initCanvasInteraction() {
  const canvas = document.getElementById("adminCanvas");
  if (!canvas) return;

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  canvas.addEventListener("mousemove", (e) => {
    const coords = getCanvasCoords(e);
    const hoverInfo = document.getElementById("canvasHoverInfo");
    if (hoverInfo) {
      hoverInfo.textContent = `พิกัด: X=${Math.round(coords.x)}, Y=${Math.round(coords.y)}`;
    }

    if (isDragging && selectedId) {
      const elem = getElementConfig(selectedId);
      if (elem) {
        const dx = coords.x - dragStartMouse.x;
        const dy = coords.y - dragStartMouse.y;
        elem.x = Math.max(0, Math.min(1024, Math.round(dragStartElemPos.x + dx)));
        elem.y = Math.max(0, Math.min(1536, Math.round(dragStartElemPos.y + dy)));

        updateInspectorInputs(elem);
        renderAdminCanvas();
      }
      return;
    }

    // Change cursor if hovering over selectable item
    const ctx = canvas.getContext("2d");
    const hit = findElementAtCoords(coords.x, coords.y, ctx);
    canvas.style.cursor = hit ? "pointer" : "default";
  });

  canvas.addEventListener("mousedown", (e) => {
    const coords = getCanvasCoords(e);
    const ctx = canvas.getContext("2d");
    const hit = findElementAtCoords(coords.x, coords.y, ctx);

    if (hit) {
      selectElement(hit.id);
      isDragging = true;
      dragStartMouse = { x: coords.x, y: coords.y };
      const elem = getElementConfig(hit.id);
      dragStartElemPos = { x: elem.x, y: elem.y };
      canvas.classList.add("dragging");
    } else {
      // Clicked empty area
      selectElement(null);
    }
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      canvas.classList.remove("dragging");
      renderAdminCanvas();
    }
  });

  // Keyboard Arrow Key Nudging
  window.addEventListener("keydown", (e) => {
    if (!selectedId) return;
    // If active element is an input or textarea, do not intercept arrows
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
    if (activeTag === "input" || activeTag === "textarea") return;

    const step = e.shiftKey ? 10 : 1;
    let handled = false;
    const elem = getElementConfig(selectedId);
    if (!elem) return;

    if (e.key === "ArrowLeft") {
      elem.x = Math.max(0, elem.x - step);
      handled = true;
    } else if (e.key === "ArrowRight") {
      elem.x = Math.min(1024, elem.x + step);
      handled = true;
    } else if (e.key === "ArrowUp") {
      elem.y = Math.max(0, elem.y - step);
      handled = true;
    } else if (e.key === "ArrowDown") {
      elem.y = Math.min(1536, elem.y + step);
      handled = true;
    }

    if (handled) {
      e.preventDefault();
      updateInspectorInputs(elem);
      renderAdminCanvas();
    }
  });
}

function findElementAtCoords(cx, cy, ctx) {
  const all = getAllRenderableElements();
  // Reverse order so custom texts or top items take priority
  for (let i = all.length - 1; i >= 0; i--) {
    const elem = all[i];
    if (elem.visible === false) continue;
    const bounds = getElementBounds(elem, ctx);
    if (bounds) {
      if (cx >= bounds.x && cx <= bounds.x + bounds.w && cy >= bounds.y && cy <= bounds.y + bounds.h) {
        return elem;
      }
    }
  }
  return null;
}

// -------------------------------------------------------------
// Table Header Quick Selector Dropdowns (Inspector & Stage)
// -------------------------------------------------------------
function populateHeaderDropdowns() {
  const colSelect = document.getElementById("columnHeaderSelect");
  const stageSelect = document.getElementById("stageColumnSelect");
  if (!colSelect && !stageSelect) return;

  const makeOptionsHtml = (placeholder) => {
    let html = `<option value="">${placeholder}</option>`;

    // 1. Google Sheets Columns (Grouped by Category)
    const catMap = new Map();
    if (typeof SHEET_COLUMNS_INFO !== "undefined" && Array.isArray(SHEET_COLUMNS_INFO)) {
      SHEET_COLUMNS_INFO.forEach((col) => {
        const cat = col.category || "ข้อมูล Google Sheets";
        if (!catMap.has(cat)) catMap.set(cat, []);
        catMap.get(cat).push(col);
      });
    }

    catMap.forEach((cols, catName) => {
      html += `<optgroup label="${catName}">`;
      cols.forEach((col) => {
        html += `<option value="${col.key}">[${col.letter}] ${col.index + 1}. ${col.name}</option>`;
      });
      html += `</optgroup>`;
    });

    // 2. Extra Graphic Badges & Assets
    const extraItems = [];
    for (const [key, val] of Object.entries(layoutConfig)) {
      if (key === "custom_texts") continue;
      const inSheet = typeof SHEET_COLUMNS_INFO !== "undefined" && SHEET_COLUMNS_INFO.some((c) => c.key === key);
      if (!inSheet && val && typeof val === "object" && val.x !== undefined) {
        extraItems.push(val);
      }
    }
    if (extraItems.length > 0) {
      html += `<optgroup label="🎨 องค์ประกอบกราฟิกและป้ายสถานะ">`;
      extraItems.forEach((item) => {
        html += `<option value="${item.id}">🏷️ ${item.label || item.id}</option>`;
      });
      html += `</optgroup>`;
    }

    // 3. Custom Texts
    if (Array.isArray(layoutConfig.custom_texts) && layoutConfig.custom_texts.length > 0) {
      html += `<optgroup label="✨ ข้อความอิสระที่เพิ่มเอง (${layoutConfig.custom_texts.length})">`;
      layoutConfig.custom_texts.forEach((item, idx) => {
        const preview = (item.text || item.label || "ข้อความใหม่").substring(0, 30);
        html += `<option value="${item.id}">➕ ${idx + 1}. ${preview}</option>`;
      });
      html += `</optgroup>`;
    }

    return html;
  };

  if (colSelect) {
    const curVal = colSelect.value;
    colSelect.innerHTML = makeOptionsHtml("-- คลิกเพื่อเลือกหัวข้อที่ต้องการปรับตำแหน่ง --");
    if (curVal) colSelect.value = curVal;
  }

  if (stageSelect) {
    const curVal = stageSelect.value;
    stageSelect.innerHTML = makeOptionsHtml("-- เลือกหัวข้อจากตาราง --");
    if (curVal) stageSelect.value = curVal;
  }
}

// -------------------------------------------------------------
// Selection & Inspector Controller
// -------------------------------------------------------------
function selectElement(id) {
  selectedId = id;

  const emptyState = document.getElementById("inspectorEmptyState");
  const controls = document.getElementById("inspectorControls");
  const title = document.getElementById("inspectorTitle");
  const catBadge = document.getElementById("inspectorCategory");

  const colSelect = document.getElementById("columnHeaderSelect");
  if (colSelect) colSelect.value = id || "";
  const stageSelect = document.getElementById("stageColumnSelect");
  if (stageSelect) stageSelect.value = id || "";

  if (!id) {
    if (emptyState) emptyState.style.display = "block";
    if (controls) controls.style.display = "none";
    if (title) title.textContent = "เลือกจุดข้อความบนรูปภาพ";
    if (catBadge) catBadge.textContent = "ไม่ได้เลือก";
    highlightTreeItem(null);
    renderAdminCanvas();
    return;
  }

  const elem = getElementConfig(id);
  if (!elem) return;

  if (emptyState) emptyState.style.display = "none";
  if (controls) controls.style.display = "block";
  if (title) title.textContent = elem.label || elem.id;
  if (catBadge) catBadge.textContent = elem.category || (elem.type === "custom" ? "ข้อความที่เพิ่มเอง" : "ทั่วไป");

  updateInspectorInputs(elem);
  highlightTreeItem(id);
  switchTab("tab-inspector");
  renderAdminCanvas();
}

function updateInspectorInputs(elem) {
  // Coordinates
  const inputX = document.getElementById("inputX");
  const inputY = document.getElementById("inputY");
  const xPercent = document.getElementById("xPercent");
  const yPercent = document.getElementById("yPercent");

  if (inputX) inputX.value = elem.x;
  if (inputY) inputY.value = elem.y;
  if (xPercent) xPercent.textContent = Math.round((elem.x / 1024) * 100) + "%";
  if (yPercent) yPercent.textContent = Math.round((elem.y / 1536) * 100) + "%";

  // Font Size
  const inputFontSize = document.getElementById("inputFontSize");
  const sliderFontSize = document.getElementById("sliderFontSize");
  const sz = elem.fontSize || 20;
  if (inputFontSize) inputFontSize.value = sz;
  if (sliderFontSize) sliderFontSize.value = Math.min(80, Math.max(10, sz));

  // Font Weight
  const weight = String(elem.fontWeight || "normal");
  document.querySelectorAll(".weight-btn-group .toggle-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-weight") === weight);
  });

  // Alignment
  const align = elem.align || "left";
  document.querySelectorAll(".align-btn-group .toggle-btn").forEach((b) => {
    b.classList.toggle("active", b.getAttribute("data-align") === align);
  });

  // Color
  const color = elem.color || "#002d62";
  const colorPicker = document.getElementById("inputColorPicker");
  const colorHex = document.getElementById("inputColorHex");
  if (colorPicker && color.startsWith("#")) colorPicker.value = color;
  if (colorHex) colorHex.value = color;

  // Visibility
  const chkVisible = document.getElementById("chkVisible");
  if (chkVisible) chkVisible.checked = elem.visible !== false;

  // Custom text content row vs standard sample row
  const customRow = document.getElementById("customTextContentRow");
  const standardRow = document.getElementById("standardSampleRow");
  const inputCustomText = document.getElementById("inputCustomText");
  const inputSampleText = document.getElementById("inputSampleText");
  const btnDeleteCustom = document.getElementById("btnDeleteCustom");

  if (elem.type === "custom") {
    if (customRow) customRow.style.display = "block";
    if (standardRow) standardRow.style.display = "none";
    if (inputCustomText) inputCustomText.value = elem.text || "";
    if (btnDeleteCustom) btnDeleteCustom.style.display = "inline-flex";
  } else {
    if (customRow) customRow.style.display = "none";
    if (standardRow) standardRow.style.display = "block";
    if (inputSampleText) inputSampleText.value = elem.sampleText || SAMPLE_RECORD[elem.id] || "";
    if (btnDeleteCustom) btnDeleteCustom.style.display = "none";
  }
}

function initInspectorControls() {
  // Initialize and populate header quick selectors
  populateHeaderDropdowns();

  const colSelect = document.getElementById("columnHeaderSelect");
  if (colSelect) {
    colSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val) {
        selectElement(val);
      } else {
        selectElement(null);
      }
    });
  }

  const stageSelect = document.getElementById("stageColumnSelect");
  if (stageSelect) {
    stageSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val) {
        selectElement(val);
      } else {
        selectElement(null);
      }
    });
  }

  const btnQuickAddCustom = document.getElementById("btnQuickAddCustom");
  if (btnQuickAddCustom) {
    btnQuickAddCustom.addEventListener("click", () => {
      switchTab("tab-add");
      const txt = document.getElementById("newTextContent");
      if (txt) txt.focus();
    });
  }

  // Direct X/Y Input
  const inputX = document.getElementById("inputX");
  const inputY = document.getElementById("inputY");

  if (inputX) {
    inputX.addEventListener("input", (e) => {
      const elem = getElementConfig(selectedId);
      if (elem) {
        elem.x = parseInt(e.target.value, 10) || 0;
        renderAdminCanvas();
      }
    });
  }

  if (inputY) {
    inputY.addEventListener("input", (e) => {
      const elem = getElementConfig(selectedId);
      if (elem) {
        elem.y = parseInt(e.target.value, 10) || 0;
        renderAdminCanvas();
      }
    });
  }

  // Stepper buttons for coordinates
  document.querySelectorAll(".btn-step[data-coord]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const elem = getElementConfig(selectedId);
      if (!elem) return;
      const coord = btn.getAttribute("data-coord");
      const delta = parseInt(btn.getAttribute("data-delta"), 10) || 0;

      if (coord === "x") {
        elem.x = Math.max(0, Math.min(1024, elem.x + delta));
      } else if (coord === "y") {
        elem.y = Math.max(0, Math.min(1536, elem.y + delta));
      }

      updateInspectorInputs(elem);
      renderAdminCanvas();
    });
  });

  // Font Size Steppers & Slider
  const inputFontSize = document.getElementById("inputFontSize");
  const sliderFontSize = document.getElementById("sliderFontSize");
  const btnFontMinus = document.getElementById("btnFontMinus");
  const btnFontPlus = document.getElementById("btnFontPlus");

  function changeFontSize(newSz) {
    const elem = getElementConfig(selectedId);
    if (!elem) return;
    elem.fontSize = Math.max(8, Math.min(120, newSz));
    updateInspectorInputs(elem);
    renderAdminCanvas();
  }

  if (inputFontSize) {
    inputFontSize.addEventListener("input", (e) => {
      changeFontSize(parseInt(e.target.value, 10) || 16);
    });
  }
  if (sliderFontSize) {
    sliderFontSize.addEventListener("input", (e) => {
      changeFontSize(parseInt(e.target.value, 10) || 16);
    });
  }
  if (btnFontMinus) {
    btnFontMinus.addEventListener("click", () => {
      const elem = getElementConfig(selectedId);
      if (elem) changeFontSize((elem.fontSize || 20) - 2);
    });
  }
  if (btnFontPlus) {
    btnFontPlus.addEventListener("click", () => {
      const elem = getElementConfig(selectedId);
      if (elem) changeFontSize((elem.fontSize || 20) + 2);
    });
  }

  // Font Weight buttons
  document.querySelectorAll(".weight-btn-group .toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const elem = getElementConfig(selectedId);
      if (!elem) return;
      elem.fontWeight = btn.getAttribute("data-weight");
      updateInspectorInputs(elem);
      renderAdminCanvas();
    });
  });

  // Text Alignment buttons
  document.querySelectorAll(".align-btn-group .toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const elem = getElementConfig(selectedId);
      if (!elem) return;
      elem.align = btn.getAttribute("data-align");
      updateInspectorInputs(elem);
      renderAdminCanvas();
    });
  });

  // Color Pickers & Swatches
  const colorPicker = document.getElementById("inputColorPicker");
  const colorHex = document.getElementById("inputColorHex");

  function changeColor(hex) {
    const elem = getElementConfig(selectedId);
    if (!elem) return;
    elem.color = hex;
    updateInspectorInputs(elem);
    renderAdminCanvas();
  }

  if (colorPicker) {
    colorPicker.addEventListener("input", (e) => changeColor(e.target.value));
  }
  if (colorHex) {
    colorHex.addEventListener("change", (e) => changeColor(e.target.value));
  }

  document.querySelectorAll(".swatch-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      changeColor(btn.getAttribute("data-color"));
    });
  });

  // Visibility Checkbox
  const chkVisible = document.getElementById("chkVisible");
  if (chkVisible) {
    chkVisible.addEventListener("change", (e) => {
      const elem = getElementConfig(selectedId);
      if (!elem) return;
      elem.visible = e.target.checked;
      renderAdminCanvas();
      initTreeList();
    });
  }

  // Custom text content
  const inputCustomText = document.getElementById("inputCustomText");
  if (inputCustomText) {
    inputCustomText.addEventListener("input", (e) => {
      const elem = getElementConfig(selectedId);
      if (elem && elem.type === "custom") {
        elem.text = e.target.value;
        renderAdminCanvas();
      }
    });
  }

  // Sample text preview
  const inputSampleText = document.getElementById("inputSampleText");
  if (inputSampleText) {
    inputSampleText.addEventListener("input", (e) => {
      const elem = getElementConfig(selectedId);
      if (elem) {
        elem.sampleText = e.target.value;
        renderAdminCanvas();
      }
    });
  }

  // Delete Custom Text
  const btnDeleteCustom = document.getElementById("btnDeleteCustom");
  if (btnDeleteCustom) {
    btnDeleteCustom.addEventListener("click", () => {
      if (!selectedId || !selectedId.startsWith("custom_")) return;
      if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อความนี้?")) {
        layoutConfig.custom_texts = layoutConfig.custom_texts.filter((t) => t.id !== selectedId);
        selectElement(null);
        populateHeaderDropdowns();
        initTreeList();
        renderAdminCanvas();
        showToast("ลบข้อความเรียบร้อยแล้ว");
      }
    });
  }

  // Add Custom Text Tab Action
  const btnCreateCustomText = document.getElementById("btnCreateCustomText");
  if (btnCreateCustomText) {
    btnCreateCustomText.addEventListener("click", () => {
      const text = document.getElementById("newTextContent")?.value || "ข้อความใหม่";
      const x = parseInt(document.getElementById("newTextX")?.value, 10) || 512;
      const y = parseInt(document.getElementById("newTextY")?.value, 10) || 768;
      const size = parseInt(document.getElementById("newTextSize")?.value, 10) || 22;
      const color = document.getElementById("newTextColorHex")?.value || "#002d62";

      const newId = `custom_${Date.now()}`;
      const newCustomItem = {
        id: newId,
        label: `ข้อความอิสระ (${text.substring(0, 12)}...)`,
        category: "ข้อความที่เพิ่มเอง",
        type: "custom",
        text: text,
        x: x,
        y: y,
        fontSize: size,
        fontWeight: "bold",
        fontFamily: "Prompt",
        color: color,
        align: "left",
        visible: true
      };

      if (!layoutConfig.custom_texts) layoutConfig.custom_texts = [];
      layoutConfig.custom_texts.push(newCustomItem);

      // Reset form
      if (document.getElementById("newTextContent")) document.getElementById("newTextContent").value = "";

      populateHeaderDropdowns();
      initTreeList();
      selectElement(newId);
      showToast("เพิ่มข้อความใหม่เรียบร้อยแล้ว");
    });
  }
}

// -------------------------------------------------------------
// Elements Tree List (Tab 2)
// -------------------------------------------------------------
function initTreeList() {
  const container = document.getElementById("elementsTreeList");
  if (!container) return;

  container.innerHTML = "";

  // Group elements by category
  const categories = {};
  const all = getAllRenderableElements();

  // Sort all elements by colIndex or logical order
  all.sort((a, b) => {
    const idxA = a.colIndex !== undefined ? a.colIndex : (a.type === "custom" ? 200 : 100);
    const idxB = b.colIndex !== undefined ? b.colIndex : (b.type === "custom" ? 200 : 100);
    return idxA - idxB;
  });

  const treeTotalCount = document.getElementById("treeTotalCount");
  if (treeTotalCount) {
    const sheetColCount = (typeof SHEET_COLUMNS_INFO !== "undefined") ? SHEET_COLUMNS_INFO.length : 58;
    const customCount = Array.isArray(layoutConfig.custom_texts) ? layoutConfig.custom_texts.length : 0;
    treeTotalCount.textContent = `รวม ${all.length} รายการ (${sheetColCount} คอลัมน์${customCount > 0 ? ` + ${customCount} ข้อความเพิ่มเอง` : ""})`;
  }

  all.forEach((elem) => {
    const cat = elem.category || (elem.type === "custom" ? "ข้อความที่เพิ่มเอง" : "ทั่วไป");
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(elem);
  });

  for (const [catName, items] of Object.entries(categories)) {
    const groupDiv = document.createElement("div");
    groupDiv.className = "category-group";

    const titleDiv = document.createElement("div");
    titleDiv.className = "category-title";
    titleDiv.innerHTML = `<span>${catName} (${items.length})</span><span class="cat-arrow">▼</span>`;

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "category-items";

    titleDiv.addEventListener("click", () => {
      const isCollapsed = itemsContainer.classList.toggle("collapsed");
      titleDiv.classList.toggle("collapsed", isCollapsed);
    });

    groupDiv.appendChild(titleDiv);

    items.forEach((elem) => {
      const row = document.createElement("div");
      row.className = "element-item-row";
      if (elem.id === selectedId) row.classList.add("active");
      row.setAttribute("data-id", elem.id);

      const labelSpan = document.createElement("span");
      labelSpan.className = "element-item-label";
      
      let badgeHtml = "";
      if (elem.colLetter) {
        badgeHtml = `<span class="col-badge">[${elem.colLetter}]</span> `;
      } else if (elem.type === "custom") {
        badgeHtml = `<span class="custom-item-badge">เพิ่มเอง</span> `;
      } else {
        badgeHtml = `<span class="col-badge" style="background:#f1f5f9; color:#475569;">[🎨]</span> `;
      }

      const labelText = elem.label || elem.text || elem.id;
      labelSpan.innerHTML = `${badgeHtml}<span>${labelText}</span>`;

      const rightDiv = document.createElement("div");
      rightDiv.style.display = "flex";
      rightDiv.style.alignItems = "center";
      rightDiv.style.gap = "0.5rem";

      const coordsSpan = document.createElement("span");
      coordsSpan.className = "element-item-coords";
      coordsSpan.textContent = `${elem.x}, ${elem.y}`;

      const eyeBtn = document.createElement("button");
      eyeBtn.className = "eye-btn";
      eyeBtn.innerHTML = elem.visible !== false ? "👁️" : "🙈";
      eyeBtn.title = elem.visible !== false ? "ซ่อนข้อความนี้" : "แสดงข้อความนี้";
      eyeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        elem.visible = elem.visible === false ? true : false;
        eyeBtn.innerHTML = elem.visible ? "👁️" : "🙈";
        renderAdminCanvas();
      });

      rightDiv.appendChild(coordsSpan);
      rightDiv.appendChild(eyeBtn);

      row.appendChild(labelSpan);
      row.appendChild(rightDiv);

      row.addEventListener("click", () => {
        selectElement(elem.id);
      });

      itemsContainer.appendChild(row);
    });

    groupDiv.appendChild(itemsContainer);
    container.appendChild(groupDiv);
  }

  // Filter search
  const searchInput = document.getElementById("searchElements");
  if (searchInput) {
    searchInput.oninput = (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll(".element-item-row").forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? "flex" : "none";
      });
      // Auto-expand all categories when searching
      if (q) {
        document.querySelectorAll(".category-items").forEach((c) => c.classList.remove("collapsed"));
        document.querySelectorAll(".category-title").forEach((t) => t.classList.remove("collapsed"));
      }
    };
  }

  // Expand / Collapse All buttons
  const btnExpandAll = document.getElementById("btnExpandAll");
  if (btnExpandAll) {
    btnExpandAll.onclick = () => {
      document.querySelectorAll(".category-items").forEach((c) => c.classList.remove("collapsed"));
      document.querySelectorAll(".category-title").forEach((t) => t.classList.remove("collapsed"));
    };
  }
  const btnCollapseAll = document.getElementById("btnCollapseAll");
  if (btnCollapseAll) {
    btnCollapseAll.onclick = () => {
      document.querySelectorAll(".category-items").forEach((c) => c.classList.add("collapsed"));
      document.querySelectorAll(".category-title").forEach((t) => t.classList.add("collapsed"));
    };
  }
}

function highlightTreeItem(id) {
  document.querySelectorAll(".element-item-row").forEach((row) => {
    const isSel = row.getAttribute("data-id") === id;
    row.classList.toggle("active", isSel);
    if (isSel) {
      // Ensure its parent category is expanded
      const parentItems = row.closest(".category-items");
      if (parentItems) {
        parentItems.classList.remove("collapsed");
        const title = parentItems.previousElementSibling;
        if (title) title.classList.remove("collapsed");
      }
    }
  });
}

// -------------------------------------------------------------
// Backup, Export, Import & Save (Tab 4 & Header)
// -------------------------------------------------------------
function initBackupTab() {
  // Save button
  const btnSave = document.getElementById("btnSaveConfig");
  if (btnSave) {
    btnSave.addEventListener("click", () => {
      if (saveLayoutConfig(layoutConfig)) {
        showToast("บันทึกตำแหน่งและการจัดวางเรียบร้อยแล้ว ✅");
        updateRawJsonView();
      } else {
        alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      }
    });
  }

  // Reset button
  const btnReset = document.getElementById("btnResetConfig");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("คำเตือน: คุณต้องการคืนค่าพิกัดทั้งหมดกลับสู่ค่าเริ่มต้นจากโรงงานใช่หรือไม่? การปรับแต่งทั้งหมดจะถูกรีเซ็ต")) {
        resetLayoutConfig();
        layoutConfig = getLayoutConfig();
        selectElement(null);
        populateHeaderDropdowns();
        initTreeList();
        renderAdminCanvas();
        updateRawJsonView();
        showToast("คืนค่าพิกัดเริ่มต้นสำเร็จ");
      }
    });
  }

  // Export JSON
  const btnExport = document.getElementById("btnExportJSON");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      const jsonStr = JSON.stringify(layoutConfig, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `water_report_layout_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("ส่งออกไฟล์ JSON เรียบร้อยแล้ว");
    });
  }

  // Import JSON
  const fileImport = document.getElementById("fileImportJSON");
  if (fileImport) {
    fileImport.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported && (imported.water_level || imported.date || imported.custom_texts)) {
            layoutConfig = imported;
            saveLayoutConfig(layoutConfig);
            selectElement(null);
            populateHeaderDropdowns();
            initTreeList();
            renderAdminCanvas();
            updateRawJsonView();
            showToast("นำเข้าข้อมูลพิกัดสำเร็จเรียบร้อยแล้ว ✅");
          } else {
            alert("รูปแบบไฟล์ JSON ไม่ถูกต้อง ไม่พบข้อมูลพิกัดของระบบรายงานน้ำ");
          }
        } catch (err) {
          alert("เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: " + err.message);
        }
      };
      reader.readAsText(file);
    });
  }
}

function updateRawJsonView() {
  const textarea = document.getElementById("layoutRawJson");
  if (textarea && layoutConfig) {
    textarea.value = JSON.stringify(layoutConfig, null, 2);
  }
}

// -------------------------------------------------------------
// Helper Drawing Functions (Dynamic Pills & Thai Text Wrap)
// -------------------------------------------------------------
function drawDynamicPill(ctx, x, y, text, type = "green") {
  ctx.save();
  ctx.font = "bold 20px Prompt, sans-serif";
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
  const paragraphs = String(text).split("\n");
  const lines = [];

  let segmenter = null;
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    try {
      segmenter = new Intl.Segmenter("th", { granularity: "word" });
    } catch (e) {}
  }

  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (!trimmed) continue;

    if (segmenter) {
      const words = Array.from(segmenter.segment(trimmed)).map((s) => s.segment);
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
      const words = trimmed.split(" ");
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
