/**
 * Default Layout Configuration for Flood Situation Report Infographic
 * Dimensions: 1024 x 1536 px
 * Maps 1:1 to Google Sheets Columns (A - AL: 38 Columns)
 */

const SHEET_COLUMNS_INFO = [
  { index: 0, letter: "A", key: "date", name: "วันที่", category: "ส่วนหัว (Header)" },
  { index: 1, letter: "B", key: "time", name: "เวลา", category: "ส่วนหัว (Header)" },
  { index: 2, letter: "C", key: "water_level", name: "ระดับน้ำ/จุดเฝ้าระวัง", category: "1. สถานการณ์พื้นที่" },
  { index: 3, letter: "D", key: "villages", name: "หมู่บ้านได้รับผลกระทบ", category: "1. สถานการณ์พื้นที่" },
  { index: 4, letter: "E", key: "households", name: "ครัวเรือน", category: "1. สถานการณ์พื้นที่" },
  { index: 5, letter: "F", key: "people", name: "ประชาชนได้รับผลกระทบ", category: "1. สถานการณ์พื้นที่" },
  { index: 6, letter: "G", key: "routes_cut", name: "เส้นทางถูกตัดขาด", category: "1. สถานการณ์พื้นที่" },
  { index: 7, letter: "H", key: "trend", name: "แนวโน้ม", category: "1. สถานการณ์พื้นที่" },
  { index: 8, letter: "I", key: "hosp_affected", name: "โรงพยาบาลได้รับผลกระทบ", category: "2. สถานการณ์โรงพยาบาล" },
  { index: 9, letter: "J", key: "staff_total", name: "บุคลากรทั้งหมด", category: "2. สถานการณ์โรงพยาบาล" },
  { index: 10, letter: "K", key: "staff_affected", name: "บุคลากรได้รับผลกระทบ", category: "2. สถานการณ์โรงพยาบาล" },
  { index: 11, letter: "L", key: "staff_absent", name: "ไม่สามารถมาปฏิบัติงาน", category: "2. สถานการณ์โรงพยาบาล" },
  { index: 12, letter: "M", key: "beds_total", name: "เตียงทั้งหมด", category: "2. สถานการณ์โรงพยาบาล" },
  { index: 13, letter: "N", key: "beds_current", name: "ผู้ป่วยในปัจจุบัน", category: "2. สถานการณ์โรงพยาบาล" },
  { index: 14, letter: "O", key: "beds_available", name: "เตียงพร้อมรับผู้ป่วย", category: "2. สถานการณ์โรงพยาบาล" },
  { index: 15, letter: "P", key: "patients_affected", name: "ผู้ป่วยที่ได้รับผลกระทบ", category: "2. สถานการณ์โรงพยาบาล" },
  { index: 16, letter: "Q", key: "ambulance_ready", name: "รถพยาบาลพร้อมใช้งาน", category: "3. ระบบการแพทย์ฉุกเฉิน" },
  { index: 17, letter: "R", key: "ems_status", name: "EMS", category: "3. ระบบการแพทย์ฉุกเฉิน" },
  { index: 18, letter: "S", key: "referral_status", name: "การส่งต่อผู้ป่วย", category: "3. ระบบการแพทย์ฉุกเฉิน" },
  { index: 19, letter: "T", key: "dest_hospital", name: "โรงพยาบาลปลายทางที่ประสานไว้", category: "3. ระบบการแพทย์ฉุกเฉิน" },
  { index: 20, letter: "U", key: "bedridden", name: "ผู้ป่วยติดบ้าน/ติดเตียง", category: "4. กลุ่มเปราะบางในพื้นที่" },
  { index: 21, letter: "V", key: "oxygen", name: "ผู้ป่วยที่ต้องใช้ออกซิเจน", category: "4. กลุ่มเปราะบางในพื้นที่" },
  { index: 22, letter: "W", key: "dialysis", name: "ผู้ป่วยฟอกไต", category: "4. กลุ่มเปราะบางในพื้นที่" },
  { index: 23, letter: "X", key: "chronic_med", name: "ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง", category: "4. กลุ่มเปราะบางในพื้นที่" },
  { index: 24, letter: "Y", key: "urgent_evac", name: "ต้องอพยพเร่งด่วน", category: "4. กลุ่มเปราะบางในพื้นที่" },
  { index: 25, letter: "Z", key: "medicine", name: "ยาและเวชภัณฑ์", category: "5. ยา/สาธารณูปโภค" },
  { index: 26, letter: "AA", key: "food_water", name: "อาหาร/น้ำดื่ม", category: "5. ยา/สาธารณูปโภค" },
  { index: 27, letter: "AB", key: "electricity", name: "ไฟฟ้า", category: "5. ยา/สาธารณูปโภค" },
  { index: 28, letter: "AC", key: "tap_water", name: "น้ำประปา", category: "5. ยา/สาธารณูปโภค" },
  { index: 29, letter: "AD", key: "internet", name: "ระบบสื่อสาร/Internet", category: "5. ยา/สาธารณูปโภค" },
  { index: 30, letter: "AE", key: "generator", name: "เครื่องปั่นไฟ", category: "5. ยา/สาธารณูปโภค" },
  { index: 31, letter: "AF", key: "fuel", name: "น้ำมันสำรอง", category: "5. ยา/สาธารณูปโภค" },
  { index: 32, letter: "AG", key: "support_1", name: "สิ่งที่ต้องการสนับสนุน 1", category: "6. สิ่งที่ต้องการสนับสนุนจากจังหวัด" },
  { index: 33, letter: "AH", key: "support_2", name: "สิ่งที่ต้องการสนับสนุน 2", category: "6. สิ่งที่ต้องการสนับสนุนจากจังหวัด" },
  { index: 34, letter: "AI", key: "support_3", name: "สิ่งที่ต้องการสนับสนุน 3", category: "6. สิ่งที่ต้องการสนับสนุนจากจังหวัด" },
  { index: 35, letter: "AJ", key: "hosp_status", name: "สถานะโรงพยาบาล", category: "7. ข้อมูลท้ายรายงาน (Footer)" },
  { index: 36, letter: "AK", key: "reporter_name", name: "ผู้รายงาน", category: "7. ข้อมูลท้ายรายงาน (Footer)" },
  { index: 37, letter: "AL", key: "reporter_pos", name: "ตำแหน่ง", category: "7. ข้อมูลท้ายรายงาน (Footer)" }
];

const DEFAULT_LAYOUT = {
  // 1. Header (A - B)
  date: {
    id: "date",
    colIndex: 0,
    colLetter: "A",
    label: "[A] 1. วันที่ (ส่วนหัว)",
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
    colIndex: 1,
    colLetter: "B",
    label: "[B] 2. เวลา (ส่วนหัว)",
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

  // 2. Box 1: สถานการณ์พื้นที่ (C - H)
  water_level: {
    id: "water_level",
    colIndex: 2,
    colLetter: "C",
    label: "[C] 3. ระดับน้ำ/จุดเฝ้าระวัง (จุด)",
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
    colIndex: 3,
    colLetter: "D",
    label: "[D] 4. หมู่บ้านได้รับผลกระทบ (แห่ง)",
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
    colIndex: 4,
    colLetter: "E",
    label: "[E] 5. ครัวเรือนได้รับผลกระทบ (ครัวเรือน)",
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
    colIndex: 5,
    colLetter: "F",
    label: "[F] 6. ประชาชนได้รับผลกระทบ (คน)",
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
    colIndex: 6,
    colLetter: "G",
    label: "[G] 7. เส้นทางถูกตัดขาด (จุด)",
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
    colIndex: 7,
    colLetter: "H",
    label: "[H] 8. แนวโน้ม (ป้ายสถานะ)",
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

  // 3. Box 2: สถานการณ์โรงพยาบาล (I - P)
  hosp_affected: {
    id: "hosp_affected",
    colIndex: 8,
    colLetter: "I",
    label: "[I] 9. โรงพยาบาลได้รับผลกระทบ (ป้ายสถานะ)",
    category: "2. สถานการณ์โรงพยาบาล",
    type: "badge",
    assetKey: "hosp_badge",
    x: 360,
    y: 350,
    visible: true
  },
  staff_total: {
    id: "staff_total",
    colIndex: 9,
    colLetter: "J",
    label: "[J] 10. บุคลากรทั้งหมด (คน)",
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
    colIndex: 10,
    colLetter: "K",
    label: "[K] 11. บุคลากรได้รับผลกระทบ (คน)",
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
    colIndex: 11,
    colLetter: "L",
    label: "[L] 12. ไม่สามารถมาปฏิบัติงาน (คน)",
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
    colIndex: 12,
    colLetter: "M",
    label: "[M] 13. เตียงทั้งหมด (เตียง)",
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
    colIndex: 13,
    colLetter: "N",
    label: "[N] 14. ผู้ป่วยในปัจจุบัน (คน)",
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
    colIndex: 14,
    colLetter: "O",
    label: "[O] 15. เตียงพร้อมรับผู้ป่วย (เตียง)",
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
    colIndex: 15,
    colLetter: "P",
    label: "[P] 16. ผู้ป่วยที่ได้รับผลกระทบ",
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

  // 4. Box 3: ระบบการแพทย์ฉุกเฉิน (Q - T)
  ambulance_ready: {
    id: "ambulance_ready",
    colIndex: 16,
    colLetter: "Q",
    label: "[Q] 17. รถพยาบาลพร้อมใช้งาน",
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
    colIndex: 17,
    colLetter: "R",
    label: "[R] 18. EMS (ป้ายสถานะ)",
    category: "3. ระบบการแพทย์ฉุกเฉิน",
    type: "badge",
    x: 360,
    y: 835,
    visible: true
  },
  referral_status: {
    id: "referral_status",
    colIndex: 18,
    colLetter: "S",
    label: "[S] 19. การส่งต่อผู้ป่วย (ป้ายสถานะ)",
    category: "3. ระบบการแพทย์ฉุกเฉิน",
    type: "badge",
    x: 360,
    y: 895,
    visible: true
  },
  dest_hospital: {
    id: "dest_hospital",
    colIndex: 19,
    colLetter: "T",
    label: "[T] 20. โรงพยาบาลปลายทางที่ประสานไว้",
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

  // 5. Box 4: กลุ่มเปราะบางในพื้นที่ (U - Y)
  bedridden: {
    id: "bedridden",
    colIndex: 20,
    colLetter: "U",
    label: "[U] 21. ผู้ป่วยติดบ้าน/ติดเตียง",
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
    colIndex: 21,
    colLetter: "V",
    label: "[V] 22. ผู้ป่วยที่ต้องใช้ออกซิเจน",
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
    colIndex: 22,
    colLetter: "W",
    label: "[W] 23. ผู้ป่วยฟอกไต",
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
    colIndex: 23,
    colLetter: "X",
    label: "[X] 24. ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง",
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
    colIndex: 24,
    colLetter: "Y",
    label: "[Y] 25. ต้องอพยพเร่งด่วน",
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

  // 6. Box 5: ยา / เวชภัณฑ์ / สาธารณูปโภค (Z - AF)
  medicine: {
    id: "medicine",
    colIndex: 25,
    colLetter: "Z",
    label: "[Z] 26. ยาและเวชภัณฑ์ (ป้ายสถานะ)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 215,
    y: 1083,
    visible: true
  },
  food_water: {
    id: "food_water",
    colIndex: 26,
    colLetter: "AA",
    label: "[AA] 27. อาหาร/น้ำดื่ม (ป้ายสถานะ)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 215,
    y: 1148,
    visible: true
  },
  electricity: {
    id: "electricity",
    colIndex: 27,
    colLetter: "AB",
    label: "[AB] 28. ไฟฟ้า (ป้ายสถานะ)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 215,
    y: 1190,
    visible: true
  },
  tap_water: {
    id: "tap_water",
    colIndex: 28,
    colLetter: "AC",
    label: "[AC] 29. น้ำประปา (ป้ายสถานะ)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 215,
    y: 1233,
    visible: true
  },
  internet: {
    id: "internet",
    colIndex: 29,
    colLetter: "AD",
    label: "[AD] 30. ระบบสื่อสาร/Internet (ป้ายสถานะ)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 215,
    y: 1283,
    visible: true
  },
  generator: {
    id: "generator",
    colIndex: 30,
    colLetter: "AE",
    label: "[AE] 31. เครื่องปั่นไฟ (ป้ายสถานะ)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 218,
    y: 1324,
    visible: true
  },
  fuel: {
    id: "fuel",
    colIndex: 31,
    colLetter: "AF",
    label: "[AF] 32. น้ำมันสำรอง (ป้ายสถานะ)",
    category: "5. ยา/สาธารณูปโภค",
    type: "badge",
    x: 218,
    y: 1363,
    visible: true
  },

  // 7. Box 6: สิ่งที่ต้องการสนับสนุนจากจังหวัด (AG - AI)
  support_1: {
    id: "support_1",
    colIndex: 32,
    colLetter: "AG",
    label: "[AG] 33. สิ่งที่ต้องการสนับสนุน 1",
    category: "6. สิ่งที่ต้องการสนับสนุนจากจังหวัด",
    type: "support_item",
    defaultIconKey: "icon_support_1",
    x: 580,
    y: 1146,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  support_2: {
    id: "support_2",
    colIndex: 33,
    colLetter: "AH",
    label: "[AH] 34. สิ่งที่ต้องการสนับสนุน 2",
    category: "6. สิ่งที่ต้องการสนับสนุนจากจังหวัด",
    type: "support_item",
    defaultIconKey: "icon_support_2",
    x: 580,
    y: 1220,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },
  support_3: {
    id: "support_3",
    colIndex: 34,
    colLetter: "AI",
    label: "[AI] 35. สิ่งที่ต้องการสนับสนุน 3",
    category: "6. สิ่งที่ต้องการสนับสนุนจากจังหวัด",
    type: "support_item",
    defaultIconKey: "icon_support_3",
    x: 580,
    y: 1298,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Prompt",
    color: "#002d62",
    align: "left",
    visible: true
  },

  // 8. Footer: ข้อมูลท้ายรายงาน (AJ - AL)
  hosp_status: {
    id: "hosp_status",
    colIndex: 35,
    colLetter: "AJ",
    label: "[AJ] 36. สถานะโรงพยาบาล (ป้ายท้าย)",
    category: "7. ข้อมูลท้ายรายงาน (Footer)",
    type: "badge",
    x: 225,
    y: 1418,
    visible: true
  },
  reporter_name: {
    id: "reporter_name",
    colIndex: 36,
    colLetter: "AK",
    label: "[AK] 37. ผู้รายงาน (ชื่อ)",
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
    colIndex: 37,
    colLetter: "AL",
    label: "[AL] 38. ตำแหน่งผู้รายงาน",
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
  footer_time: {
    id: "footer_time",
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
