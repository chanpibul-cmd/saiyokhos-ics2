/**
 * Default Layout Configuration for Flood Situation Report Infographic
 * Dimensions: 1024 x 1536 px
 */

const DEFAULT_LAYOUT = {
  // 1. Header
  date: {
    id: "date",
    label: "วันที่ (ส่วนหัว)",
    category: "ส่วนหัว (Header)",
    type: "text",
    x: 338,
    y: 210,
    fontSize: 23,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  time: {
    id: "time",
    label: "เวลา (ส่วนหัว)",
    category: "ส่วนหัว (Header)",
    type: "text",
    x: 658,
    y: 210,
    fontSize: 23,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },

  // 2. Box 1: สถานการณ์พื้นที่
  water_level: {
    id: "water_level",
    label: "ระดับน้ำ/จุดเฝ้าระวัง (จุด)",
    category: "1. สถานการณ์พื้นที่",
    type: "text",
    x: 374,
    y: 338,
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "center",
    visible: true
  },
  villages: {
    id: "villages",
    label: "หมู่บ้านได้รับผลกระทบ (แห่ง)",
    category: "1. สถานการณ์พื้นที่",
    type: "text",
    x: 374,
    y: 390,
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "center",
    visible: true
  },
  households: {
    id: "households",
    label: "ครัวเรือนได้รับผลกระทบ (ครัวเรือน)",
    category: "1. สถานการณ์พื้นที่",
    type: "text",
    x: 374,
    y: 444,
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "center",
    visible: true
  },
  people: {
    id: "people",
    label: "ประชาชนได้รับผลกระทบ (คน)",
    category: "1. สถานการณ์พื้นที่",
    type: "text",
    x: 374,
    y: 499,
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "center",
    visible: true
  },
  routes_cut: {
    id: "routes_cut",
    label: "เส้นทางถูกตัดขาด (จุด)",
    category: "1. สถานการณ์พื้นที่",
    type: "text",
    x: 374,
    y: 556,
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "center",
    visible: true
  },
  trend: {
    id: "trend",
    label: "ป้ายแนวโน้มสถานการณ์ (Pill)",
    category: "1. สถานการณ์พื้นที่",
    type: "badge",
    x: 248,
    y: 618,
    visible: true
  },
  checkboxes: {
    id: "checkboxes",
    label: "ตัวเลือกแนวโน้ม (Checkboxes)",
    category: "1. สถานการณ์พื้นที่",
    type: "badge",
    x: 245,
    y: 660,
    visible: true
  },

  // 3. Box 2: สถานการณ์โรงพยาบาล
  staff_total: {
    id: "staff_total",
    label: "บุคลากรทั้งหมด (คน)",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 920,
    y: 398,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  staff_affected: {
    id: "staff_affected",
    label: "บุคลากรได้รับผลกระทบ (คน)",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 920,
    y: 438,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  staff_absent: {
    id: "staff_absent",
    label: "ไม่สามารถมาปฏิบัติงาน (คน)",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 920,
    y: 480,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  beds_total: {
    id: "beds_total",
    label: "เตียงทั้งหมด",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 920,
    y: 526,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  beds_current: {
    id: "beds_current",
    label: "ผู้ป่วยในปัจจุบัน",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 920,
    y: 567,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  beds_available: {
    id: "beds_available",
    label: "เตียงพร้อมรับผู้ป่วย",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 920,
    y: 608,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  patients_affected: {
    id: "patients_affected",
    label: "ผู้ป่วยที่ได้รับผลกระทบ",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 920,
    y: 649,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },

  // 4. Box 3: ระบบการแพทย์ฉุกเฉิน
  ambulance_ready: {
    id: "ambulance_ready",
    label: "รถพยาบาลพร้อมใช้งาน",
    category: "3. ระบบการแพทย์ฉุกเฉิน",
    type: "text",
    x: 422,
    y: 788,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "center",
    visible: true
  },
  ems_status: {
    id: "ems_status",
    label: "EMS (Badge)",
    category: "3. ระบบการแพทย์ฉุกเฉิน",
    type: "badge",
    x: 360,
    y: 835,
    visible: true
  },
  referral_status: {
    id: "referral_status",
    label: "การส่งต่อผู้ป่วย (Badge)",
    category: "3. ระบบการแพทย์ฉุกเฉิน",
    type: "badge",
    x: 360,
    y: 895,
    visible: true
  },
  dest_hospital: {
    id: "dest_hospital",
    label: "โรงพยาบาลปลายทางที่ประสาน",
    category: "3. ระบบการแพทย์ฉุกเฉิน",
    type: "text",
    x: 422,
    y: 960,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "center",
    visible: true
  },

  // 5. Box 4: กลุ่มเปราะบางในพื้นที่
  bedridden: {
    id: "bedridden",
    label: "ผู้ป่วยติดบ้าน/ติดเตียง",
    category: "4. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 898,
    y: 783,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  oxygen: {
    id: "oxygen",
    label: "ผู้ป่วยที่ต้องใช้ออกซิเจน",
    category: "4. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 898,
    y: 840,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  dialysis: {
    id: "dialysis",
    label: "ผู้ป่วยฟอกไต",
    category: "4. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 898,
    y: 897,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  chronic_med: {
    id: "chronic_med",
    label: "ผู้ป่วยโรคเรื้อรังขาดยา",
    category: "4. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 898,
    y: 954,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  urgent_evac: {
    id: "urgent_evac",
    label: "ผู้ป่วยที่ต้องอพยพเร่งด่วน",
    category: "4. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 898,
    y: 1010,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },

  // 6. Box 5: ยา / เวชภัณฑ์ / สาธารณูปโภค
  medicine: {
    id: "medicine",
    label: "ยาและเวชภัณฑ์ (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 215,
    y: 1083,
    visible: true
  },
  food_water: {
    id: "food_water",
    label: "อาหาร/น้ำดื่ม (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 215,
    y: 1148,
    visible: true
  },
  electricity: {
    id: "electricity",
    label: "ไฟฟ้า (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 215,
    y: 1190,
    visible: true
  },
  tap_water: {
    id: "tap_water",
    label: "น้ำประปา (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 215,
    y: 1233,
    visible: true
  },
  internet: {
    id: "internet",
    label: "ระบบสื่อสาร/Internet (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 215,
    y: 1283,
    visible: true
  },
  generator: {
    id: "generator",
    label: "เครื่องปั่นไฟ (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 218,
    y: 1324,
    visible: true
  },
  fuel: {
    id: "fuel",
    label: "น้ำมันสำรอง (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 218,
    y: 1363,
    visible: true
  },

  // 7. Box 6: สิ่งที่ต้องการสนับสนุนจากจังหวัด
  support_1: {
    id: "support_1",
    label: "สนับสนุนจากจังหวัด ข้อ 1",
    category: "6. สนับสนุนจากจังหวัด",
    type: "support_item",
    x: 580,
    y: 1146,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    visible: true
  },
  support_2: {
    id: "support_2",
    label: "สนับสนุนจากจังหวัด ข้อ 2",
    category: "6. สนับสนุนจากจังหวัด",
    type: "support_item",
    x: 580,
    y: 1220,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    visible: true
  },
  support_3: {
    id: "support_3",
    label: "สนับสนุนจากจังหวัด ข้อ 3",
    category: "6. สนับสนุนจากจังหวัด",
    type: "support_item",
    x: 580,
    y: 1298,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    visible: true
  },

  // 8. Footer
  hosp_status: {
    id: "hosp_status",
    label: "สถานะโรงพยาบาล (Badge ท้าย)",
    category: "7. ข้อมูลท้ายรายงาน (Footer)",
    type: "badge",
    x: 225,
    y: 1418,
    visible: true
  },
  reporter_name: {
    id: "reporter_name",
    label: "ชื่อผู้รายงาน",
    category: "7. ข้อมูลท้ายรายงาน (Footer)",
    type: "text",
    x: 864,
    y: 1410,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  reporter_pos: {
    id: "reporter_pos",
    label: "ตำแหน่งผู้รายงาน",
    category: "7. ข้อมูลท้ายรายงาน (Footer)",
    type: "text",
    x: 864,
    y: 1435,
    fontSize: 13,
    fontWeight: "normal",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  report_time_footer: {
    id: "report_time_footer",
    label: "เวลา (ท้ายรายงาน)",
    category: "7. ข้อมูลท้ายรายงาน (Footer)",
    type: "text",
    x: 854,
    y: 1461,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },

  // 9. Custom Texts (ข้อความอิสระที่เพิ่มเอง)
  custom_texts: []
};

const STORAGE_KEY_LAYOUT = "water_report_layout_v1";

/**
 * Retrieves the current layout config, merging saved overrides with defaults.
 */
function getLayoutConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LAYOUT);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Deep merge with DEFAULT_LAYOUT
      const merged = JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
      for (const [key, val] of Object.entries(parsed)) {
        if (key === "custom_texts") {
          merged.custom_texts = Array.isArray(val) ? val : [];
        } else if (merged[key] && typeof val === "object") {
          merged[key] = { ...merged[key], ...val };
        }
      }
      return merged;
    }
  } catch (e) {
    console.warn("Could not load layout from localStorage:", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
}

/**
 * Saves layout config to localStorage.
 */
function saveLayoutConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY_LAYOUT, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Could not save layout to localStorage:", e);
    return false;
  }
}

/**
 * Resets layout to factory defaults.
 */
function resetLayoutConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY_LAYOUT);
    return true;
  } catch (e) {
    console.error("Could not reset layout:", e);
    return false;
  }
}
