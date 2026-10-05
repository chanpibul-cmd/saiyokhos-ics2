/**
 * Layout Configuration for Flood Situation Report Infographic
 * Dimensions: 1024 x 1536 px
 * Supports Dynamic Google Sheets Columns (A - BT: 72+ Columns & Future Scalability)
 */

function getExcelColLetter(idx) {
  let letter = "";
  let i = Number(idx) + 1;
  while (i > 0) {
    const mod = (i - 1) % 26;
    letter = String.fromCharCode(65 + mod) + letter;
    i = Math.floor((i - mod) / 26);
  }
  return letter;
}

function categorizeColumn(name, idx) {
  const n = String(name || "").trim().toLowerCase();
  if (n === "วันที่" || n === "เวลา" || idx === 0 || idx === 1) {
    return "⏱️ 1. ข้อมูลทั่วไปและเวลา";
  }
  if (n.includes("ตำบล") || n.includes("ระดับน้ำ") || n.includes("เฝ้าระวัง") || n.includes("หมู่บ้าน") || n.includes("ครัวเรือน") || n.includes("ประชาชน") || n.includes("เส้นทาง") || n.includes("แนวโน้ม")) {
    return "🌊 2. สถานการณ์พื้นที่และระดับน้ำ";
  }
  if (n.includes("ติดเตียง") || n.includes("ติดบ้าน") || n.includes("ออกซิเจน") || n.includes("ฟอกไต") || n.includes("ยาต่อเนื่อง") || n.includes("ครรภ์") || n.includes("insulin") || n.includes("เบาหวาน") || n.includes("smiv") || n.includes("เปราะบาง") || n.includes("อพยพ")) {
    return "🧓 3. กลุ่มเปราะบางในพื้นที่";
  }
  if (n.includes("ศูนย์พักพิง") || n.includes("โรงครัว") || n.includes("mcatt") || n.includes("เยียวยา")) {
    return "🏕️ 4. ศูนย์พักพิงและการเยียวยา";
  }
  if (n.includes("โรงพยาบาล") || n.includes("รพ.") || n.includes("บุคลากร") || n.includes("ปฏิบัติงาน") || n.includes("เตียง") || n.includes("ผู้ป่วยใน") || n.includes("ผู้ป่วยที่ได้รับผลกระทบ") || n.includes("ฉุกเฉิน")) {
    return "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร";
  }
  if (n.includes("รถพยาบาล") || n.includes("ems") || n.includes("ส่งต่อ") || n.includes("ปลายทาง")) {
    return "🚑 6. ระบบการแพทย์ฉุกเฉิน (EMS)";
  }
  if (n.includes("เวชภัณฑ์") || n.includes("อาหาร") || n.includes("น้ำดื่ม") || n.includes("ไฟฟ้า") || n.includes("ประปา") || n.includes("สื่อสาร") || n.includes("internet") || n.includes("ปั่นไฟ") || n.includes("น้ำมัน")) {
    return "💊 7. ยา เวชภัณฑ์ และสาธารณูปโภค";
  }
  if (n.includes("สนับสนุน")) {
    return "🤝 8. สิ่งที่ต้องการสนับสนุนจากจังหวัด";
  }
  if (n.includes("สถานะ") || n.includes("ผู้รายงาน") || n.includes("ตำแหน่ง")) {
    return "👤 9. ข้อมูลท้ายรายงาน (Footer)";
  }
  return "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)";
}

function getColumnKey(name, idx) {
  const clean = String(name || "").replace(/\s+/g, " ").trim();
  const map = {
    "วันที่": "date",
    "เวลา": "time",
    "พื้นที่เฝ้าระวัง ตำบล": "water_level",
    "ระดับน้ำ/จุดเฝ้าระวัง": "water_level",
    "ระดับน้ำ": "water_level",
    "หมู่บ้านได้รับผลกระทบ": "villages",
    "ครัวเรือน": "households",
    "ครัวเรือนที่ได้รับผลกระทบ": "households",
    "ประชาชนได้รับผลกระทบ": "people",
    "เส้นทางถูกตัดขาด": "routes_cut",
    "แนวโน้ม": "trend",
    "ผู้ป่วยติดเตียง": "bedridden",
    "ผู้ป่วยติดบ้าน/ติดเตียง": "bedridden",
    "ผู้ป่วยติดเตียงได้รับผลกระทบ": "bedridden_affected",
    "ผู้ป่วยติดเตียงได้รับการช่วยเหลือ": "bedridden_helped",
    "ผู้ป่วยที่ต้องใช้ออกซิเจน": "oxygen",
    "ผู้ป่วยที่ต้องใช้ออกซิเจนได้รับผลกระทบ": "oxygen_affected",
    "ผู้ป่วยที่ต้องใช้ออกซิเจนได้รับการช่วยเหลือ": "oxygen_helped",
    "ผู้ป่วยฟอกไต": "dialysis",
    "ผู้ป่วยฟอกไตได้รับผลกระทบ": "dialysis_affected",
    "ผู้ป่วยฟอกไตได้รับการช่วยเหลือ": "dialysis_helped",
    "ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง": "chronic_med",
    "ผู้ป่วยโรคเรื้อรังขาดยา": "chronic_med",
    "ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง ได้รับผลกระทบ": "chronic_med_affected",
    "ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง ได้รับการช่วยเหลือ": "chronic_med_helped",
    "หญิงตั้งครรภ์ใกล้คลอด": "pregnant_total",
    "หญิงตั้งครรภ์ใกล้คลอดได้รับผลกระทบ": "pregnant_affected",
    "หญิงตั้งครรภ์ใกล้คลอดได้รับการช่วยเหลือ": "pregnant_helped",
    "ผู้ป่วยเบาหวานที่ต้องรับinsulin": "diabetes_total",
    "ผู้ป่วยเบาหวานที่ต้องรับinsulinได้รับผลกระทบ": "diabetes_affected",
    "ผู้ป่วยเบาหวานที่ต้องรับinsulinได้รับการช่วยเหลือ": "diabetes_helped",
    "ผู้ป่วย SMIV": "smiv_total",
    "ผู้ป่วย SMIV ได้รับผลกระทบ": "smiv_affected",
    "ผู้ป่วย SMIV ได้รับการช่วยเหลือ": "smiv_helped",
    "ศูนย์พักพิงที่เปิดบริการ (แห่ง)": "shelter_total",
    "ศูนย์พักพิงที่เปิดบริการ": "shelter_total",
    "จำนวนผู้ใช้ศูนย์พักพิง(คน)": "shelter_people",
    "จำนวนผู้ใช้ศูนย์พักพิง": "shelter_people",
    "โรงครัวสนาม จำนวน": "kitchen_total",
    "โรงครัวสนาม": "kitchen_total",
    "MCATT เข้าดำเนินการเยียวยา": "mcatt_status",
    "โรงพยาบาลได้รับผลกระทบ": "hosp_affected",
    "บุคลากรทั้งหมด": "staff_total",
    "บุคลากรได้รับผลกระทบ": "staff_affected",
    "ได้รับการช่วยเหลือจากรพ.": "staff_helped",
    "ไม่สามารถมาปฏิบัติงาน": "staff_absent",
    "เตียงทั้งหมด": "beds_total",
    "ผู้ป่วยในปัจจุบัน": "beds_current",
    "เตียงพร้อมรับผู้ป่วย": "beds_available",
    "ผู้ป่วยที่ได้รับผลกระทบ": "patients_affected",
    "รถพยาบาลพร้อมใช้งาน": "ambulance_ready",
    "EMS": "ems_status",
    "การส่งต่อผู้ป่วย": "referral_status",
    "โรงพยาบาลปลายทางที่ประสานไว้": "dest_hospital",
    "ยาและเวชภัณฑ์": "medicine",
    "อาหาร/น้ำดื่ม": "food_water",
    "ไฟฟ้า": "electricity",
    "น้ำประปา": "tap_water",
    "ระบบสื่อสาร/Internet": "internet",
    "เครื่องปั่นไฟ": "generator",
    "น้ำมันสำรอง": "fuel",
    "สิ่งที่ต้องการสนับสนุน 1": "support_1",
    "สิ่งที่ต้องการสนับสนุน 2": "support_2",
    "สิ่งที่ต้องการสนับสนุน 3": "support_3",
    "สิ่งที่ต้องการสนับสนุน 3 / เพิ่มเติม อื่นๆ": "support_3",
    "สถานะโรงพยาบาล": "hosp_status",
    "ผู้รายงาน": "reporter_name",
    "ตำแหน่ง": "reporter_pos",
    "ต้องอพยพเร่งด่วน": "urgent_evac"
  };

  if (map[clean]) return map[clean];
  for (const [k, v] of Object.entries(map)) {
    if (clean.replace(/[\s\-_/.]/g, "") === k.replace(/[\s\-_/.]/g, "")) {
      return v;
    }
  }

  const letter = getExcelColLetter(idx).toLowerCase();
  return `col_${letter}`;
}

const DEFAULT_LAYOUT = {
  date: {
    id: "date",
    colIndex: 0,
    colLetter: "A",
    label: "วันที่ (ส่วนหัว)",
    category: "ส่วนหัว (Header)",
    type: "text",
    x: 343,
    y: 221,
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  time: {
    id: "time",
    colIndex: 1,
    colLetter: "B",
    label: "เวลา (ส่วนหัว)",
    category: "ส่วนหัว (Header)",
    type: "text",
    x: 619,
    y: 222,
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  water_level: {
    id: "water_level",
    colIndex: 2,
    colLetter: "C",
    label: "ระดับน้ำ/จุดเฝ้าระวัง (จุด)",
    category: "1. สถานการณ์พื้นที่",
    type: "text",
    x: 299,
    y: 316,
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "center",
    visible: true
  },
  villages: {
    id: "villages",
    colIndex: 3,
    colLetter: "D",
    label: "หมู่บ้านได้รับผลกระทบ (แห่ง)",
    category: "1. สถานการณ์พื้นที่",
    type: "text",
    x: 292,
    y: 404,
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "center",
    visible: true
  },
  households: {
    id: "households",
    colIndex: 4,
    colLetter: "E",
    label: "ครัวเรือนได้รับผลกระทบ (ครัวเรือน)",
    category: "1. สถานการณ์พื้นที่",
    type: "text",
    x: 294,
    y: 462,
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
    x: 827,
    y: 196,
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "center",
    visible: false
  },
  routes_cut: {
    id: "routes_cut",
    colIndex: 5,
    colLetter: "F",
    label: "เส้นทางถูกตัดขาด (จุด)",
    category: "1. สถานการณ์พื้นที่",
    type: "text",
    x: 302,
    y: 519,
    fontSize: 38,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "center",
    visible: true
  },
  trend: {
    id: "trend",
    colIndex: 6,
    colLetter: "G",
    label: "ป้ายแนวโน้มสถานการณ์ (Pill)",
    category: "1. สถานการณ์พื้นที่",
    type: "badge",
    x: 48,
    y: 1058,
    visible: false
  },
  checkboxes: {
    id: "checkboxes",
    label: "ตัวเลือกแนวโน้ม (Checkboxes)",
    category: "1. สถานการณ์พื้นที่",
    type: "badge",
    x: 54,
    y: 909,
    visible: false
  },
  hosp_affected: {
    id: "hosp_affected",
    colIndex: 32,
    colLetter: "AG",
    label: "[AG] 33. โรงพยาบาลได้รับผลกระทบ (ป้ายสถานะ)",
    category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร",
    type: "badge",
    assetKey: "hosp_badge",
    x: 566,
    y: 1048,
    visible: false
  },
  staff_total: {
    id: "staff_total",
    colIndex: 33,
    colLetter: "AH",
    label: "บุคลากรทั้งหมด (คน)",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 973,
    y: 356,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  staff_affected: {
    id: "staff_affected",
    colIndex: 34,
    colLetter: "AI",
    label: "บุคลากรได้รับผลกระทบ (คน)",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 973,
    y: 390,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  staff_helped: {
    id: "staff_helped",
    colIndex: 35,
    colLetter: "AJ",
    label: "[AJ] 36. ได้รับการช่วยเหลือจากรพ. (คน)",
    category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร",
    type: "text",
    x: 971,
    y: 431,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: false
  },
  staff_absent: {
    id: "staff_absent",
    colIndex: 36,
    colLetter: "AK",
    label: "ไม่สามารถมาปฏิบัติงาน (คน)",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 977,
    y: 421,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  beds_total: {
    id: "beds_total",
    colIndex: 37,
    colLetter: "AL",
    label: "เตียงทั้งหมด",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 951,
    y: 498,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  beds_current: {
    id: "beds_current",
    colIndex: 38,
    colLetter: "AM",
    label: "ผู้ป่วยในปัจจุบัน",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 947,
    y: 529,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  beds_available: {
    id: "beds_available",
    colIndex: 39,
    colLetter: "AN",
    label: "เตียงพร้อมรับผู้ป่วย",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 951,
    y: 562,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: true
  },
  patients_affected: {
    id: "patients_affected",
    colIndex: 40,
    colLetter: "AO",
    label: "ผู้ป่วยที่ได้รับผลกระทบ",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "text",
    x: 845,
    y: 569,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#004b6e",
    align: "right",
    visible: false
  },
  ambulance_ready: {
    id: "ambulance_ready",
    colIndex: 41,
    colLetter: "AP",
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
    visible: false
  },
  ems_status: {
    id: "ems_status",
    colIndex: 42,
    colLetter: "AQ",
    label: "EMS (Badge)",
    category: "3. ระบบการแพทย์ฉุกเฉิน",
    type: "badge",
    x: 477,
    y: 582,
    visible: false
  },
  referral_status: {
    id: "referral_status",
    colIndex: 43,
    colLetter: "AR",
    label: "การส่งต่อผู้ป่วย (Badge)",
    category: "3. ระบบการแพทย์ฉุกเฉิน",
    type: "badge",
    x: 473,
    y: 636,
    visible: false
  },
  dest_hospital: {
    id: "dest_hospital",
    colIndex: 44,
    colLetter: "AS",
    label: "โรงพยาบาลปลายทางที่ประสาน",
    category: "3. ระบบการแพทย์ฉุกเฉิน",
    type: "text",
    x: 513,
    y: 720,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "center",
    visible: false
  },
  bedridden: {
    id: "bedridden",
    colIndex: 7,
    colLetter: "H",
    label: "ผู้ป่วยติดบ้าน/ติดเตียง",
    category: "4. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 212,
    y: 1195,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  bedridden_affected: {
    id: "bedridden_affected",
    colIndex: 8,
    colLetter: "I",
    label: "[I] 9. ผู้ป่วยติดเตียงได้รับผลกระทบ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 261,
    y: 1195,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "left",
    visible: true,
    sampleText: "0"
  },
  bedridden_helped: {
    id: "bedridden_helped",
    colIndex: 9,
    colLetter: "J",
    label: "[J] 10. ผู้ป่วยติดเตียงได้รับการช่วยเหลือ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 351,
    y: 1193,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  oxygen: {
    id: "oxygen",
    colIndex: 10,
    colLetter: "K",
    label: "ผู้ป่วยที่ต้องใช้ออกซิเจน",
    category: "4. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 209,
    y: 1224,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  oxygen_affected: {
    id: "oxygen_affected",
    colIndex: 11,
    colLetter: "L",
    label: "[L] 12. ผู้ป่วยที่ต้องใช้ออกซิเจนได้รับผลกระทบ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 282,
    y: 1223,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  oxygen_helped: {
    id: "oxygen_helped",
    colIndex: 12,
    colLetter: "M",
    label: "[M] 13. ผู้ป่วยที่ต้องใช้ออกซิเจนได้รับการช่วยเหลือ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 351,
    y: 1224,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  dialysis: {
    id: "dialysis",
    colIndex: 13,
    colLetter: "N",
    label: "ผู้ป่วยฟอกไต",
    category: "4. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 211,
    y: 1255,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  dialysis_affected: {
    id: "dialysis_affected",
    colIndex: 14,
    colLetter: "O",
    label: "[O] 15. ผู้ป่วยฟอกไตได้รับผลกระทบ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 282,
    y: 1255,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  dialysis_helped: {
    id: "dialysis_helped",
    colIndex: 15,
    colLetter: "P",
    label: "[P] 16. ผู้ป่วยฟอกไตได้รับการช่วยเหลือ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 350,
    y: 1256,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  chronic_med: {
    id: "chronic_med",
    colIndex: 16,
    colLetter: "Q",
    label: "ผู้ป่วยโรคเรื้อรังขาดยา",
    category: "4. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 211,
    y: 1287,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  chronic_med_affected: {
    id: "chronic_med_affected",
    colIndex: 17,
    colLetter: "R",
    label: "[R] 18. ได้รับยาต่อเนื่อง ได้รับผลกระทบ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 283,
    y: 1289,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  chronic_med_helped: {
    id: "chronic_med_helped",
    colIndex: 18,
    colLetter: "S",
    label: "[S] 19. ได้รับยาต่อเนื่อง ได้รับการช่วยเหลือ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 348,
    y: 1287,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  pregnant_total: {
    id: "pregnant_total",
    colIndex: 19,
    colLetter: "T",
    label: "[T] 20. หญิงตั้งครรภ์ใกล้คลอด (ราย)",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 210,
    y: 1323,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  pregnant_affected: {
    id: "pregnant_affected",
    colIndex: 20,
    colLetter: "U",
    label: "[U] 21. หญิงตั้งครรภ์ได้รับผลกระทบ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 286,
    y: 1323,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  pregnant_helped: {
    id: "pregnant_helped",
    colIndex: 21,
    colLetter: "V",
    label: "[V] 22. หญิงตั้งครรภ์ได้รับการช่วยเหลือ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 350,
    y: 1323,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  diabetes_total: {
    id: "diabetes_total",
    colIndex: 22,
    colLetter: "W",
    label: "[W] 23. เบาหวานที่ต้องรับinsulin",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 512,
    y: 768,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: false
  },
  diabetes_affected: {
    id: "diabetes_affected",
    colIndex: 23,
    colLetter: "X",
    label: "[X] 24. เบาหวานinsulin ได้รับผลกระทบ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 512,
    y: 768,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: false
  },
  diabetes_helped: {
    id: "diabetes_helped",
    colIndex: 24,
    colLetter: "Y",
    label: "[Y] 25. เบาหวานinsulin ได้รับการช่วยเหลือ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 512,
    y: 768,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: false
  },
  smiv_total: {
    id: "smiv_total",
    colIndex: 25,
    colLetter: "Z",
    label: "[Z] 26. ผู้ป่วย SMIV (ราย)",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 210,
    y: 1363,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  smiv_affected: {
    id: "smiv_affected",
    colIndex: 26,
    colLetter: "AA",
    label: "[AA] 27. ผู้ป่วย SMIV ได้รับผลกระทบ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 286,
    y: 1363,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: true
  },
  smiv_helped: {
    id: "smiv_helped",
    colIndex: 27,
    colLetter: "AB",
    label: "[AB] 28. ผู้ป่วย SMIV ได้รับการช่วยเหลือ",
    category: "🧓 3. กลุ่มเปราะบางในพื้นที่",
    type: "text",
    x: 349,
    y: 1361,
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
    x: 308,
    y: 1230,
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#e51c24",
    align: "right",
    visible: false
  },
  shelter_total: {
    id: "shelter_total",
    colIndex: 28,
    colLetter: "AC",
    label: "[AC] 29. ศูนย์พักพิงที่เปิดบริการ (แห่ง)",
    category: "🏕️ 4. ศูนย์พักพิงและการเยียวยา",
    type: "text",
    x: 945,
    y: 680,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  shelter_people: {
    id: "shelter_people",
    colIndex: 29,
    colLetter: "AD",
    label: "[AD] 30. จำนวนผู้ใช้ศูนย์พักพิง (คน)",
    category: "🏕️ 4. ศูนย์พักพิงและการเยียวยา",
    type: "text",
    x: 946,
    y: 725,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  kitchen_total: {
    id: "kitchen_total",
    colIndex: 30,
    colLetter: "AE",
    label: "[AE] 31. โรงครัวสนาม จำนวน",
    category: "🏕️ 4. ศูนย์พักพิงและการเยียวยา",
    type: "text",
    x: 945,
    y: 768,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  mcatt_status: {
    id: "mcatt_status",
    colIndex: 31,
    colLetter: "AF",
    label: "[AF] 32. MCATT เข้าดำเนินการเยียวยา",
    category: "🏕️ 4. ศูนย์พักพิงและการเยียวยา",
    type: "text",
    x: 816,
    y: 832,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true,
    sampleText: "0"
  },
  medicine: {
    id: "medicine",
    colIndex: 45,
    colLetter: "AT",
    label: "ยาและเวชภัณฑ์ (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    exactAssetKey: "pill_peangphor",
    x: 903,
    y: 959,
    visible: true
  },
  food_water: {
    id: "food_water",
    colIndex: 46,
    colLetter: "AU",
    label: "อาหาร/น้ำดื่ม (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    exactAssetKey: "pill_peangphor",
    x: 903,
    y: 1002,
    visible: true
  },
  electricity: {
    id: "electricity",
    colIndex: 47,
    colLetter: "AV",
    label: "ไฟฟ้า (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    exactAssetKey: "pill_pokati",
    x: 904,
    y: 1044,
    visible: true
  },
  tap_water: {
    id: "tap_water",
    colIndex: 48,
    colLetter: "AW",
    label: "น้ำประปา (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    exactAssetKey: "pill_pokati",
    x: 905,
    y: 1081,
    visible: true
  },
  internet: {
    id: "internet",
    colIndex: 49,
    colLetter: "AX",
    label: "ระบบสื่อสาร/Internet (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    exactAssetKey: "pill_pokati",
    x: 897,
    y: 1122,
    visible: true
  },
  generator: {
    id: "generator",
    colIndex: 50,
    colLetter: "AY",
    label: "เครื่องปั่นไฟ (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    exactAssetKey: "pill_prom",
    x: 898,
    y: 1161,
    visible: true
  },
  fuel: {
    id: "fuel",
    colIndex: 51,
    colLetter: "AZ",
    label: "น้ำมันสำรอง (Badge)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 897,
    y: 1196,
    visible: true
  },
  support_1: {
    id: "support_1",
    colIndex: 52,
    colLetter: "BA",
    label: "สนับสนุนจากจังหวัด ข้อ 1",
    category: "6. สนับสนุนจากจังหวัด",
    type: "support_item",
    iconKey: "icon_support_1",
    x: 434,
    y: 1289,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  support_2: {
    id: "support_2",
    colIndex: 53,
    colLetter: "BB",
    label: "สนับสนุนจากจังหวัด ข้อ 2",
    category: "6. สนับสนุนจากจังหวัด",
    type: "support_item",
    iconKey: "icon_support_2",
    x: 430,
    y: 1324,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  support_3: {
    id: "support_3",
    colIndex: 54,
    colLetter: "BC",
    label: "สนับสนุนจากจังหวัด ข้อ 3",
    category: "6. สนับสนุนจากจังหวัด",
    type: "support_item",
    iconKey: "icon_support_3",
    x: 429,
    y: 1361,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  hosp_status: {
    id: "hosp_status",
    colIndex: 55,
    colLetter: "BD",
    label: "สถานะโรงพยาบาล (Badge ท้าย)",
    category: "7. ข้อมูลท้ายรายงาน (Footer)",
    type: "badge",
    x: 802,
    y: 313,
    visible: false
  },
  reporter_name: {
    id: "reporter_name",
    colIndex: 56,
    colLetter: "BE",
    label: "ชื่อผู้รายงาน",
    category: "7. ข้อมูลท้ายรายงาน (Footer)",
    type: "text",
    x: 864,
    y: 1419,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: false
  },
  reporter_pos: {
    id: "reporter_pos",
    colIndex: 57,
    colLetter: "BF",
    label: "ตำแหน่งผู้รายงาน",
    category: "7. ข้อมูลท้ายรายงาน (Footer)",
    type: "text",
    x: 861,
    y: 1445,
    fontSize: 13,
    fontWeight: "normal",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: false
  },
  footer_time: {
    id: "footer_time",
    label: "เวลา (ท้ายรายงาน)",
    category: "👤 9. ข้อมูลท้ายรายงาน (Footer)",
    type: "text",
    x: 854,
    y: 1461,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: false
  },
  report_time_footer: {
    id: "report_time_footer",
    label: "เวลา (ท้ายรายงาน)",
    category: "7. ข้อมูลท้ายรายงาน (Footer)",
    type: "text",
    x: 857,
    y: 1469,
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: false
  },
  col_bg: {
    id: "col_bg",
    colIndex: 58,
    colLetter: "BG",
    label: "[BG] 59. ถนน1",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 22,
    y: 640,
    fontSize: 74,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bh: {
    id: "col_bh",
    colIndex: 59,
    colLetter: "BH",
    label: "[BH] 60. ถนน2",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 23,
    y: 668,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bi: {
    id: "col_bi",
    colIndex: 60,
    colLetter: "BI",
    label: "[BI] 61. ถนน3",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 24,
    y: 692,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bj: {
    id: "col_bj",
    colIndex: 61,
    colLetter: "BJ",
    label: "[BJ] 62. ถนน4",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 23,
    y: 717,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bk: {
    id: "col_bk",
    colIndex: 62,
    colLetter: "BK",
    label: "[BK] 63. ถนน5",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 23,
    y: 739,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bl: {
    id: "col_bl",
    colIndex: 63,
    colLetter: "BL",
    label: "[BL] 64. ถนน6",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 23,
    y: 762,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bm: {
    id: "col_bm",
    colIndex: 64,
    colLetter: "BM",
    label: "[BM] 65. ถนน7",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 22,
    y: 785,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bn: {
    id: "col_bn",
    colIndex: 65,
    colLetter: "BN",
    label: "[BN] 66. ถนน8",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 24,
    y: 812,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bo: {
    id: "col_bo",
    colIndex: 66,
    colLetter: "BO",
    label: "[BO] 67. ถนน9",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 23,
    y: 836,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bp: {
    id: "col_bp",
    colIndex: 67,
    colLetter: "BP",
    label: "[BP] 68. ถนน10",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 25,
    y: 859,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bq: {
    id: "col_bq",
    colIndex: 68,
    colLetter: "BQ",
    label: "[BQ] 69. ถนน11",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 23,
    y: 884,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_br: {
    id: "col_br",
    colIndex: 69,
    colLetter: "BR",
    label: "[BR] 70. ถนน12",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 23,
    y: 908,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bs: {
    id: "col_bs",
    colIndex: 70,
    colLetter: "BS",
    label: "[BS] 71. ถนน13",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 23,
    y: 933,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  col_bt: {
    id: "col_bt",
    colIndex: 71,
    colLetter: "BT",
    label: "[BT] 72. ถนน14",
    category: "➕ 10. ข้อมูลเพิ่มเติม (ตาม Sheet)",
    type: "text",
    x: 22,
    y: 959,
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#009944",
    align: "left",
    visible: true,
    sampleText: "*"
  },
  custom_texts: [
    {
      id: "custom_1790929328920",
      label: "ข้อความอิสระ (โรงครัวสนาม...)",
      category: "ข้อความที่เพิ่มเอง",
      type: "custom",
      text: "โรงครัวสนาม",
      x: 807,
      y: 771,
      fontSize: 18,
      fontWeight: "500",
      fontFamily: "Prompt",
      color: "#002d62",
      align: "left",
      visible: true
    }
  ]
};

// Initial 72 columns matching Google Sheets "data" (A - BT)
const SHEET_COLUMNS_INFO = Object.values(DEFAULT_LAYOUT)
  .filter((item) => typeof item.colIndex === "number")
  .map((item) => ({
    index: item.colIndex,
    letter: item.colLetter,
    key: item.id,
    name: item.label.replace(/^\[[A-Z]+\]\s*\d+\.\s*/, ""),
    category: item.category
  }));

/**
 * Synchronizes sheet headers dynamically to support 72+ or any future columns.
 */
function syncSheetColumns(headers) {
  if (!headers || !Array.isArray(headers)) return;
  headers.forEach((h, idx) => {
    const name = String(h || "").trim();
    if (!name && idx >= SHEET_COLUMNS_INFO.length) return;
    const letter = getExcelColLetter(idx);
    const key = getColumnKey(name, idx);
    const category = categorizeColumn(name, idx);

    const existingIdx = SHEET_COLUMNS_INFO.findIndex((c) => c.key === key || c.index === idx);
    const infoObj = {
      index: idx,
      letter: letter,
      key: key,
      name: name || `คอลัมน์ [${letter}]`,
      category: category
    };

    if (existingIdx >= 0) {
      SHEET_COLUMNS_INFO[existingIdx] = { ...SHEET_COLUMNS_INFO[existingIdx], ...infoObj };
    } else {
      SHEET_COLUMNS_INFO.push(infoObj);
    }

    if (!DEFAULT_LAYOUT[key]) {
      DEFAULT_LAYOUT[key] = {
        id: key,
        colIndex: idx,
        colLetter: letter,
        label: `[${letter}] ${idx + 1}. ${name || key}`,
        category: category,
        type: "text",
        x: 512,
        y: 768,
        fontSize: 20,
        fontWeight: "bold",
        fontFamily: "Prompt",
        color: "#002d62",
        align: "left",
        visible: false
      };
    } else {
      DEFAULT_LAYOUT[key].colIndex = idx;
      DEFAULT_LAYOUT[key].colLetter = letter;
      DEFAULT_LAYOUT[key].label = `[${letter}] ${idx + 1}. ${name || DEFAULT_LAYOUT[key].label}`;
      DEFAULT_LAYOUT[key].category = category;
    }
  });
}

const STORAGE_KEY_LAYOUT = "water_report_layout_v1";

function getLayoutConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LAYOUT);
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
      for (const [key, val] of Object.entries(parsed)) {
        if (key === "custom_texts") {
          merged.custom_texts = Array.isArray(val) ? val : [];
        } else if (val && typeof val === "object") {
          if (merged[key]) {
            merged[key] = { ...merged[key], ...val };
          } else {
            merged[key] = val;
          }
        }
      }
      return merged;
    }
  } catch (e) {
    console.warn("Could not load layout from localStorage:", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
}

function saveLayoutConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY_LAYOUT, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error("Could not save layout to localStorage:", e);
    return false;
  }
}

function resetLayoutConfig() {
  try {
    localStorage.removeItem(STORAGE_KEY_LAYOUT);
    return true;
  } catch (e) {
    console.error("Could not reset layout:", e);
    return false;
  }
}
