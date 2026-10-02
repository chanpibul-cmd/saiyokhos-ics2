/**
 * Layout Configuration for Flood Situation Report Infographic
 * Dimensions: 1024 x 1536 px
 * Supports Dynamic Google Sheets Columns (A - BF: 58+ Columns & Future Scalability)
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
    "ครัวเรือนที่ได้รับผล    กระทบ": "households",
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
    "ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง ": "chronic_med",
    "ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง ได้รับผลกระทบ": "chronic_med_affected",
    "ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง ได้รับการช่วยเหลือ": "chronic_med_helped",
    "หญิงตั้งครรภ์ใกล้คลอด": "pregnant_total",
    "หญิงตั้งครรภ์ใกล้คลอดได้รับผลกระทบ": "pregnant_affected",
    "หญิงตั้งครรภ์ใกล้คลอดได้รับการช่วยเหลือ": "pregnant_helped",
    "ผู้ป่วยเบาหวานที่ต้องรับinsulin": "diabetes_total",
    "ผู้ป่วยเบาหวานที่ต้องรับinsulinได้รับผลกระทบ": "diabetes_affected",
    "ผู้ป่วยเบาหวานที่ต้องรับinsulinได้รับการช่วยเหลือ": "diabetes_helped",
    "ผู้ป่วย SMIV": "smiv_total",
    "ผู้ป่วย   SMIV": "smiv_total",
    "ผู้ป่วย SMIV ได้รับผลกระทบ": "smiv_affected",
    "ผู้ป่วย   SMIV    ได้รับผลกระทบ": "smiv_affected",
    "ผู้ป่วย SMIV ได้รับการช่วยเหลือ": "smiv_helped",
    "ผู้ป่วย   SMIV    ได้รับการช่วยเหลือ": "smiv_helped",
    "ศูนย์พักพิงที่เปิดบริการ (แห่ง)": "shelter_total",
    "ศูนย์พักพิงที่เปิดบริการ": "shelter_total",
    "จำนวนผู้ใช้ศูนย์พักพิง(คน)": "shelter_people",
    "จำนวนผู้ใช้ศูนย์พักพิง": "shelter_people",
    "โรงครัวสนาม จำนวน": "kitchen_total",
    "โรงครัวสนาม": "kitchen_total",
    "MCATT เข้าดำเนินการเยียวยา": "mcatt_status",
    "MCATT  เข้าดำเนินการเยียวยา": "mcatt_status",
    "โรงพยาบาลได้รับผลกระทบ": "hosp_affected",
    "บุคลากรทั้งหมด": "staff_total",
    "บุคลากรได้รับผลกระทบ": "staff_affected",
    "ได้รับการช่วยเหลือจากรพ.": "staff_helped",
    "ได้รับการช่วยเหลือจากรพ": "staff_helped",
    "ไม่สามารถมาปฏิบัติงาน": "staff_absent",
    "เตียงทั้งหมด": "beds_total",
    "ผู้ป่วยในปัจจุบัน": "beds_current",
    "เตียงพร้อมรับผู้ป่วย": "beds_available",
    "ผู้ป่วยที่ได้รับผลกระทบ": "patients_affected",
    "ห้องฉุกเฉินพร้อมใช้งาน": "patients_affected",
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
    "สิ่งที่ต้องการสนับสนุน 3 / เพิ่มเติม อื่นๆ ": "support_3",
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

  // Fallback for custom/future columns
  const letter = getExcelColLetter(idx).toLowerCase();
  return `col_${letter}`;
}

// Initial 58 columns matching Google Sheets "data" (A - BF)
const SHEET_COLUMNS_INFO = [
  { index: 0, letter: "A", key: "date", name: "วันที่", category: "⏱️ 1. ข้อมูลทั่วไปและเวลา" },
  { index: 1, letter: "B", key: "time", name: "เวลา", category: "⏱️ 1. ข้อมูลทั่วไปและเวลา" },
  { index: 2, letter: "C", key: "water_level", name: "พื้นที่เฝ้าระวัง ตำบล", category: "🌊 2. สถานการณ์พื้นที่และระดับน้ำ" },
  { index: 3, letter: "D", key: "villages", name: "หมู่บ้านได้รับผลกระทบ", category: "🌊 2. สถานการณ์พื้นที่และระดับน้ำ" },
  { index: 4, letter: "E", key: "households", name: "ครัวเรือนที่ได้รับผลกระทบ", category: "🌊 2. สถานการณ์พื้นที่และระดับน้ำ" },
  { index: 5, letter: "F", key: "routes_cut", name: "เส้นทางถูกตัดขาด", category: "🌊 2. สถานการณ์พื้นที่และระดับน้ำ" },
  { index: 6, letter: "G", key: "trend", name: "แนวโน้ม", category: "🌊 2. สถานการณ์พื้นที่และระดับน้ำ" },
  { index: 7, letter: "H", key: "bedridden", name: "ผู้ป่วยติดเตียง", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 8, letter: "I", key: "bedridden_affected", name: "ผู้ป่วยติดเตียงได้รับผลกระทบ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 9, letter: "J", key: "bedridden_helped", name: "ผู้ป่วยติดเตียงได้รับการช่วยเหลือ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 10, letter: "K", key: "oxygen", name: "ผู้ป่วยที่ต้องใช้ออกซิเจน", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 11, letter: "L", key: "oxygen_affected", name: "ผู้ป่วยที่ต้องใช้ออกซิเจนได้รับผลกระทบ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 12, letter: "M", key: "oxygen_helped", name: "ผู้ป่วยที่ต้องใช้ออกซิเจนได้รับการช่วยเหลือ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 13, letter: "N", key: "dialysis", name: "ผู้ป่วยฟอกไต", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 14, letter: "O", key: "dialysis_affected", name: "ผู้ป่วยฟอกไตได้รับผลกระทบ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 15, letter: "P", key: "dialysis_helped", name: "ผู้ป่วยฟอกไตได้รับการช่วยเหลือ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 16, letter: "Q", key: "chronic_med", name: "ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 17, letter: "R", key: "chronic_med_affected", name: "ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง ได้รับผลกระทบ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 18, letter: "S", key: "chronic_med_helped", name: "ผู้ป่วยที่ต้องได้รับยาต่อเนื่อง ได้รับการช่วยเหลือ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 19, letter: "T", key: "pregnant_total", name: "หญิงตั้งครรภ์ใกล้คลอด", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 20, letter: "U", key: "pregnant_affected", name: "หญิงตั้งครรภ์ใกล้คลอดได้รับผลกระทบ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 21, letter: "V", key: "pregnant_helped", name: "หญิงตั้งครรภ์ใกล้คลอดได้รับการช่วยเหลือ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 22, letter: "W", key: "diabetes_total", name: "ผู้ป่วยเบาหวานที่ต้องรับinsulin", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 23, letter: "X", key: "diabetes_affected", name: "ผู้ป่วยเบาหวานที่ต้องรับinsulinได้รับผลกระทบ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 24, letter: "Y", key: "diabetes_helped", name: "ผู้ป่วยเบาหวานที่ต้องรับinsulinได้รับการช่วยเหลือ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 25, letter: "Z", key: "smiv_total", name: "ผู้ป่วย SMIV", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 26, letter: "AA", key: "smiv_affected", name: "ผู้ป่วย SMIV ได้รับผลกระทบ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 27, letter: "AB", key: "smiv_helped", name: "ผู้ป่วย SMIV ได้รับการช่วยเหลือ", category: "🧓 3. กลุ่มเปราะบางในพื้นที่" },
  { index: 28, letter: "AC", key: "shelter_total", name: "ศูนย์พักพิงที่เปิดบริการ (แห่ง)", category: "🏕️ 4. ศูนย์พักพิงและการเยียวยา" },
  { index: 29, letter: "AD", key: "shelter_people", name: "จำนวนผู้ใช้ศูนย์พักพิง(คน)", category: "🏕️ 4. ศูนย์พักพิงและการเยียวยา" },
  { index: 30, letter: "AE", key: "kitchen_total", name: "โรงครัวสนาม จำนวน", category: "🏕️ 4. ศูนย์พักพิงและการเยียวยา" },
  { index: 31, letter: "AF", key: "mcatt_status", name: "MCATT เข้าดำเนินการเยียวยา", category: "🏕️ 4. ศูนย์พักพิงและการเยียวยา" },
  { index: 32, letter: "AG", key: "hosp_affected", name: "โรงพยาบาลได้รับผลกระทบ", category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร" },
  { index: 33, letter: "AH", key: "staff_total", name: "บุคลากรทั้งหมด", category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร" },
  { index: 34, letter: "AI", key: "staff_affected", name: "บุคลากรได้รับผลกระทบ", category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร" },
  { index: 35, letter: "AJ", key: "staff_helped", name: "ได้รับการช่วยเหลือจากรพ.", category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร" },
  { index: 36, letter: "AK", key: "staff_absent", name: "ไม่สามารถมาปฏิบัติงาน", category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร" },
  { index: 37, letter: "AL", key: "beds_total", name: "เตียงทั้งหมด", category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร" },
  { index: 38, letter: "AM", key: "beds_current", name: "ผู้ป่วยในปัจจุบัน", category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร" },
  { index: 39, letter: "AN", key: "beds_available", name: "เตียงพร้อมรับผู้ป่วย", category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร" },
  { index: 40, letter: "AO", key: "patients_affected", name: "ผู้ป่วยที่ได้รับผลกระทบ", category: "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร" },
  { index: 41, letter: "AP", key: "ambulance_ready", name: "รถพยาบาลพร้อมใช้งาน", category: "🚑 6. ระบบการแพทย์ฉุกเฉิน (EMS)" },
  { index: 42, letter: "AQ", key: "ems_status", name: "EMS", category: "🚑 6. ระบบการแพทย์ฉุกเฉิน (EMS)" },
  { index: 43, letter: "AR", key: "referral_status", name: "การส่งต่อผู้ป่วย", category: "🚑 6. ระบบการแพทย์ฉุกเฉิน (EMS)" },
  { index: 44, letter: "AS", key: "dest_hospital", name: "โรงพยาบาลปลายทางที่ประสานไว้", category: "🚑 6. ระบบการแพทย์ฉุกเฉิน (EMS)" },
  { index: 45, letter: "AT", key: "medicine", name: "ยาและเวชภัณฑ์", category: "💊 7. ยา เวชภัณฑ์ และสาธารณูปโภค" },
  { index: 46, letter: "AU", key: "food_water", name: "อาหาร/น้ำดื่ม", category: "💊 7. ยา เวชภัณฑ์ และสาธารณูปโภค" },
  { index: 47, letter: "AV", key: "electricity", name: "ไฟฟ้า", category: "💊 7. ยา เวชภัณฑ์ และสาธารณูปโภค" },
  { index: 48, letter: "AW", key: "tap_water", name: "น้ำประปา", category: "💊 7. ยา เวชภัณฑ์ และสาธารณูปโภค" },
  { index: 49, letter: "AX", key: "internet", name: "ระบบสื่อสาร/Internet", category: "💊 7. ยา เวชภัณฑ์ และสาธารณูปโภค" },
  { index: 50, letter: "AY", key: "generator", name: "เครื่องปั่นไฟ", category: "💊 7. ยา เวชภัณฑ์ และสาธารณูปโภค" },
  { index: 51, letter: "AZ", key: "fuel", name: "น้ำมันสำรอง", category: "💊 7. ยา เวชภัณฑ์ และสาธารณูปโภค" },
  { index: 52, letter: "BA", key: "support_1", name: "สิ่งที่ต้องการสนับสนุน 1", category: "🤝 8. สิ่งที่ต้องการสนับสนุนจากจังหวัด" },
  { index: 53, letter: "BB", key: "support_2", name: "สิ่งที่ต้องการสนับสนุน 2", category: "🤝 8. สิ่งที่ต้องการสนับสนุนจากจังหวัด" },
  { index: 54, letter: "BC", key: "support_3", name: "สิ่งที่ต้องการสนับสนุน 3 / เพิ่มเติม อื่นๆ", category: "🤝 8. สิ่งที่ต้องการสนับสนุนจากจังหวัด" },
  { index: 55, letter: "BD", key: "hosp_status", name: "สถานะโรงพยาบาล", category: "👤 9. ข้อมูลท้ายรายงาน (Footer)" },
  { index: 56, letter: "BE", key: "reporter_name", name: "ผู้รายงาน", category: "👤 9. ข้อมูลท้ายรายงาน (Footer)" },
  { index: 57, letter: "BF", key: "reporter_pos", name: "ตำแหน่ง", category: "👤 9. ข้อมูลท้ายรายงาน (Footer)" }
];

/**
 * Synchronizes sheet headers dynamically to support 58+ or any future columns.
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

const DEFAULT_LAYOUT = {
  "date": {
    "id": "date",
    "colIndex": 0,
    "colLetter": "A",
    "label": "วันที่ (ส่วนหัว)",
    "category": "ส่วนหัว (Header)",
    "type": "text",
    "x": 363,
    "y": 205,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": true
  },
  "time": {
    "id": "time",
    "colIndex": 1,
    "colLetter": "B",
    "label": "เวลา (ส่วนหัว)",
    "category": "ส่วนหัว (Header)",
    "type": "text",
    "x": 599,
    "y": 206,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": true
  },
  "water_level": {
    "id": "water_level",
    "colIndex": 2,
    "colLetter": "C",
    "label": "ระดับน้ำ/จุดเฝ้าระวัง (จุด)",
    "category": "1. สถานการณ์พื้นที่",
    "type": "text",
    "x": 281,
    "y": 284,
    "fontSize": 38,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "center",
    "visible": true
  },
  "villages": {
    "id": "villages",
    "colIndex": 3,
    "colLetter": "D",
    "label": "หมู่บ้านได้รับผลกระทบ (แห่ง)",
    "category": "1. สถานการณ์พื้นที่",
    "type": "text",
    "x": 273,
    "y": 343,
    "fontSize": 38,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "center",
    "visible": true
  },
  "households": {
    "id": "households",
    "colIndex": 4,
    "colLetter": "E",
    "label": "ครัวเรือนได้รับผลกระทบ (ครัวเรือน)",
    "category": "1. สถานการณ์พื้นที่",
    "type": "text",
    "x": 272,
    "y": 383,
    "fontSize": 38,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "center",
    "visible": true
  },
  "people": {
    "id": "people",
    "label": "ประชาชนได้รับผลกระทบ (คน)",
    "category": "1. สถานการณ์พื้นที่",
    "type": "text",
    "x": 827,
    "y": 196,
    "fontSize": 38,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "center",
    "visible": false
  },
  "routes_cut": {
    "id": "routes_cut",
    "colIndex": 5,
    "colLetter": "F",
    "label": "เส้นทางถูกตัดขาด (จุด)",
    "category": "1. สถานการณ์พื้นที่",
    "type": "text",
    "x": 282,
    "y": 420,
    "fontSize": 38,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "center",
    "visible": true
  },
  "trend": {
    "id": "trend",
    "colIndex": 6,
    "colLetter": "G",
    "label": "ป้ายแนวโน้มสถานการณ์ (Pill)",
    "category": "1. สถานการณ์พื้นที่",
    "type": "badge",
    "x": 48,
    "y": 953,
    "visible": true
  },
  "checkboxes": {
    "id": "checkboxes",
    "label": "ตัวเลือกแนวโน้ม (Checkboxes)",
    "category": "1. สถานการณ์พื้นที่",
    "type": "badge",
    "x": 54,
    "y": 909,
    "visible": true
  },
  "hosp_affected": {
    "id": "hosp_affected",
    "colIndex": 32,
    "colLetter": "AG",
    "label": "[AG] 33. โรงพยาบาลได้รับผลกระทบ (ป้ายสถานะ)",
    "category": "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร",
    "type": "badge",
    "assetKey": "hosp_badge",
    "x": 463,
    "y": 1064,
    "visible": true
  },
  "staff_total": {
    "id": "staff_total",
    "colIndex": 33,
    "colLetter": "AH",
    "label": "บุคลากรทั้งหมด (คน)",
    "category": "2. สถานการณ์โรงพยาบาล",
    "type": "text",
    "x": 972,
    "y": 347,
    "fontSize": 28,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#004b6e",
    "align": "right",
    "visible": true
  },
  "staff_affected": {
    "id": "staff_affected",
    "colIndex": 34,
    "colLetter": "AI",
    "label": "บุคลากรได้รับผลกระทบ (คน)",
    "category": "2. สถานการณ์โรงพยาบาล",
    "type": "text",
    "x": 972,
    "y": 372,
    "fontSize": 28,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#004b6e",
    "align": "right",
    "visible": true
  },
  "staff_helped": {
    "id": "staff_helped",
    "colIndex": 35,
    "colLetter": "AJ",
    "label": "[AJ] 36. ได้รับการช่วยเหลือจากรพ. (คน)",
    "category": "🏥 5. สถานการณ์โรงพยาบาลและบุคลากร",
    "type": "text",
    "x": 971,
    "y": 431,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#004b6e",
    "align": "right",
    "visible": true
  },
  "staff_absent": {
    "id": "staff_absent",
    "colIndex": 36,
    "colLetter": "AK",
    "label": "ไม่สามารถมาปฏิบัติงาน (คน)",
    "category": "2. สถานการณ์โรงพยาบาล",
    "type": "text",
    "x": 973,
    "y": 397,
    "fontSize": 28,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#004b6e",
    "align": "right",
    "visible": true
  },
  "beds_total": {
    "id": "beds_total",
    "colIndex": 37,
    "colLetter": "AL",
    "label": "เตียงทั้งหมด",
    "category": "2. สถานการณ์โรงพยาบาล",
    "type": "text",
    "x": 942,
    "y": 481,
    "fontSize": 28,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#004b6e",
    "align": "right",
    "visible": true
  },
  "beds_current": {
    "id": "beds_current",
    "colIndex": 38,
    "colLetter": "AM",
    "label": "ผู้ป่วยในปัจจุบัน",
    "category": "2. สถานการณ์โรงพยาบาล",
    "type": "text",
    "x": 940,
    "y": 509,
    "fontSize": 28,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#004b6e",
    "align": "right",
    "visible": true
  },
  "beds_available": {
    "id": "beds_available",
    "colIndex": 39,
    "colLetter": "AN",
    "label": "เตียงพร้อมรับผู้ป่วย",
    "category": "2. สถานการณ์โรงพยาบาล",
    "type": "text",
    "x": 941,
    "y": 537,
    "fontSize": 28,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#004b6e",
    "align": "right",
    "visible": true
  },
  "patients_affected": {
    "id": "patients_affected",
    "colIndex": 40,
    "colLetter": "AO",
    "label": "ผู้ป่วยที่ได้รับผลกระทบ",
    "category": "2. สถานการณ์โรงพยาบาล",
    "type": "text",
    "x": 845,
    "y": 569,
    "fontSize": 28,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#004b6e",
    "align": "right",
    "visible": false
  },
  "ambulance_ready": {
    "id": "ambulance_ready",
    "colIndex": 41,
    "colLetter": "AP",
    "label": "รถพยาบาลพร้อมใช้งาน",
    "category": "3. ระบบการแพทย์ฉุกเฉิน",
    "type": "text",
    "x": 422,
    "y": 788,
    "fontSize": 28,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#004b6e",
    "align": "center",
    "visible": false
  },
  "ems_status": {
    "id": "ems_status",
    "colIndex": 42,
    "colLetter": "AQ",
    "label": "EMS (Badge)",
    "category": "3. ระบบการแพทย์ฉุกเฉิน",
    "type": "badge",
    "x": 477,
    "y": 582,
    "visible": false
  },
  "referral_status": {
    "id": "referral_status",
    "colIndex": 43,
    "colLetter": "AR",
    "label": "การส่งต่อผู้ป่วย (Badge)",
    "category": "3. ระบบการแพทย์ฉุกเฉิน",
    "type": "badge",
    "x": 473,
    "y": 636,
    "visible": false
  },
  "dest_hospital": {
    "id": "dest_hospital",
    "colIndex": 44,
    "colLetter": "AS",
    "label": "โรงพยาบาลปลายทางที่ประสาน",
    "category": "3. ระบบการแพทย์ฉุกเฉิน",
    "type": "text",
    "x": 513,
    "y": 720,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "center",
    "visible": false
  },
  "bedridden": {
    "id": "bedridden",
    "colIndex": 7,
    "colLetter": "H",
    "label": "ผู้ป่วยติดบ้าน/ติดเตียง",
    "category": "4. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 212,
    "y": 1090,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "bedridden_affected": {
    "id": "bedridden_affected",
    "colIndex": 8,
    "colLetter": "I",
    "label": "[I] 9. ผู้ป่วยติดเตียงได้รับผลกระทบ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 252,
    "y": 1090,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "left",
    "visible": true,
    "sampleText": "0"
  },
  "bedridden_helped": {
    "id": "bedridden_helped",
    "colIndex": 9,
    "colLetter": "J",
    "label": "[J] 10. ผู้ป่วยติดเตียงได้รับการช่วยเหลือ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 351,
    "y": 1090,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "oxygen": {
    "id": "oxygen",
    "colIndex": 10,
    "colLetter": "K",
    "label": "ผู้ป่วยที่ต้องใช้ออกซิเจน",
    "category": "4. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 212,
    "y": 1122,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "oxygen_affected": {
    "id": "oxygen_affected",
    "colIndex": 11,
    "colLetter": "L",
    "label": "[L] 12. ผู้ป่วยที่ต้องใช้ออกซิเจนได้รับผลกระทบ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 274,
    "y": 1123,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "oxygen_helped": {
    "id": "oxygen_helped",
    "colIndex": 12,
    "colLetter": "M",
    "label": "[M] 13. ผู้ป่วยที่ต้องใช้ออกซิเจนได้รับการช่วยเหลือ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 349,
    "y": 1125,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "dialysis": {
    "id": "dialysis",
    "colIndex": 13,
    "colLetter": "N",
    "label": "ผู้ป่วยฟอกไต",
    "category": "4. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 212,
    "y": 1155,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "dialysis_affected": {
    "id": "dialysis_affected",
    "colIndex": 14,
    "colLetter": "O",
    "label": "[O] 15. ผู้ป่วยฟอกไตได้รับผลกระทบ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 272,
    "y": 1156,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "dialysis_helped": {
    "id": "dialysis_helped",
    "colIndex": 15,
    "colLetter": "P",
    "label": "[P] 16. ผู้ป่วยฟอกไตได้รับการช่วยเหลือ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 349,
    "y": 1157,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "chronic_med": {
    "id": "chronic_med",
    "colIndex": 16,
    "colLetter": "Q",
    "label": "ผู้ป่วยโรคเรื้อรังขาดยา",
    "category": "4. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 211,
    "y": 1187,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "chronic_med_affected": {
    "id": "chronic_med_affected",
    "colIndex": 17,
    "colLetter": "R",
    "label": "[R] 18. ได้รับยาต่อเนื่อง ได้รับผลกระทบ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 272,
    "y": 1186,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "chronic_med_helped": {
    "id": "chronic_med_helped",
    "colIndex": 18,
    "colLetter": "S",
    "label": "[S] 19. ได้รับยาต่อเนื่อง ได้รับการช่วยเหลือ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 349,
    "y": 1187,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "pregnant_total": {
    "id": "pregnant_total",
    "colIndex": 19,
    "colLetter": "T",
    "label": "[T] 20. หญิงตั้งครรภ์ใกล้คลอด (ราย)",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 210,
    "y": 1240,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "pregnant_affected": {
    "id": "pregnant_affected",
    "colIndex": 20,
    "colLetter": "U",
    "label": "[U] 21. หญิงตั้งครรภ์ได้รับผลกระทบ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 272,
    "y": 1241,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "pregnant_helped": {
    "id": "pregnant_helped",
    "colIndex": 21,
    "colLetter": "V",
    "label": "[V] 22. หญิงตั้งครรภ์ได้รับการช่วยเหลือ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 349,
    "y": 1240,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "diabetes_total": {
    "id": "diabetes_total",
    "colIndex": 22,
    "colLetter": "W",
    "label": "[W] 23. เบาหวานที่ต้องรับinsulin",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 512,
    "y": 768,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": false
  },
  "diabetes_affected": {
    "id": "diabetes_affected",
    "colIndex": 23,
    "colLetter": "X",
    "label": "[X] 24. เบาหวานinsulin ได้รับผลกระทบ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 512,
    "y": 768,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": false
  },
  "diabetes_helped": {
    "id": "diabetes_helped",
    "colIndex": 24,
    "colLetter": "Y",
    "label": "[Y] 25. เบาหวานinsulin ได้รับการช่วยเหลือ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 512,
    "y": 768,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": false
  },
  "smiv_total": {
    "id": "smiv_total",
    "colIndex": 25,
    "colLetter": "Z",
    "label": "[Z] 26. ผู้ป่วย SMIV (ราย)",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 209,
    "y": 1277,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "smiv_affected": {
    "id": "smiv_affected",
    "colIndex": 26,
    "colLetter": "AA",
    "label": "[AA] 27. ผู้ป่วย SMIV ได้รับผลกระทบ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 271,
    "y": 1277,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "smiv_helped": {
    "id": "smiv_helped",
    "colIndex": 27,
    "colLetter": "AB",
    "label": "[AB] 28. ผู้ป่วย SMIV ได้รับการช่วยเหลือ",
    "category": "🧓 3. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 348,
    "y": 1277,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": true
  },
  "urgent_evac": {
    "id": "urgent_evac",
    "label": "ผู้ป่วยที่ต้องอพยพเร่งด่วน",
    "category": "4. กลุ่มเปราะบางในพื้นที่",
    "type": "text",
    "x": 308,
    "y": 1230,
    "fontSize": 32,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#e51c24",
    "align": "right",
    "visible": false
  },
  "shelter_total": {
    "id": "shelter_total",
    "colIndex": 28,
    "colLetter": "AC",
    "label": "[AC] 29. ศูนย์พักพิงที่เปิดบริการ (แห่ง)",
    "category": "🏕️ 4. ศูนย์พักพิงและการเยียวยา",
    "type": "text",
    "x": 928,
    "y": 653,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": true
  },
  "shelter_people": {
    "id": "shelter_people",
    "colIndex": 29,
    "colLetter": "AD",
    "label": "[AD] 30. จำนวนผู้ใช้ศูนย์พักพิง (คน)",
    "category": "🏕️ 4. ศูนย์พักพิงและการเยียวยา",
    "type": "text",
    "x": 929,
    "y": 691,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": true
  },
  "kitchen_total": {
    "id": "kitchen_total",
    "colIndex": 30,
    "colLetter": "AE",
    "label": "[AE] 31. โรงครัวสนาม จำนวน",
    "category": "🏕️ 4. ศูนย์พักพิงและการเยียวยา",
    "type": "text",
    "x": 860,
    "y": 722,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": true
  },
  "mcatt_status": {
    "id": "mcatt_status",
    "colIndex": 31,
    "colLetter": "AF",
    "label": "[AF] 32. MCATT เข้าดำเนินการเยียวยา",
    "category": "🏕️ 4. ศูนย์พักพิงและการเยียวยา",
    "type": "text",
    "x": 777,
    "y": 799,
    "fontSize": 20,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": true,
    "sampleText": "0"
  },
  "medicine": {
    "id": "medicine",
    "colIndex": 45,
    "colLetter": "AT",
    "label": "ยาและเวชภัณฑ์ (Badge)",
    "category": "5. ยา/สาธารณูปโภค",
    "type": "badge",
    "exactAssetKey": "pill_peangphor",
    "x": 885,
    "y": 929,
    "visible": true
  },
  "food_water": {
    "id": "food_water",
    "colIndex": 46,
    "colLetter": "AU",
    "label": "อาหาร/น้ำดื่ม (Badge)",
    "category": "5. ยา/สาธารณูปโภค",
    "type": "badge",
    "exactAssetKey": "pill_peangphor",
    "x": 885,
    "y": 978,
    "visible": true
  },
  "electricity": {
    "id": "electricity",
    "colIndex": 47,
    "colLetter": "AV",
    "label": "ไฟฟ้า (Badge)",
    "category": "5. ยา/สาธารณูปโภค",
    "type": "badge",
    "exactAssetKey": "pill_pokati",
    "x": 883,
    "y": 1029,
    "visible": true
  },
  "tap_water": {
    "id": "tap_water",
    "colIndex": 48,
    "colLetter": "AW",
    "label": "น้ำประปา (Badge)",
    "category": "5. ยา/สาธารณูปโภค",
    "type": "badge",
    "exactAssetKey": "pill_pokati",
    "x": 885,
    "y": 1067,
    "visible": true
  },
  "internet": {
    "id": "internet",
    "colIndex": 49,
    "colLetter": "AX",
    "label": "ระบบสื่อสาร/Internet (Badge)",
    "category": "5. ยา/สาธารณูปโภค",
    "type": "badge",
    "exactAssetKey": "pill_pokati",
    "x": 885,
    "y": 1098,
    "visible": true
  },
  "generator": {
    "id": "generator",
    "colIndex": 50,
    "colLetter": "AY",
    "label": "เครื่องปั่นไฟ (Badge)",
    "category": "5. ยา/สาธารณูปโภค",
    "type": "badge",
    "exactAssetKey": "pill_prom",
    "x": 884,
    "y": 1131,
    "visible": true
  },
  "fuel": {
    "id": "fuel",
    "colIndex": 51,
    "colLetter": "AZ",
    "label": "น้ำมันสำรอง (Badge)",
    "category": "5. ยา/สาธารณูปโภค",
    "type": "badge",
    "x": 881,
    "y": 1166,
    "visible": true
  },
  "support_1": {
    "id": "support_1",
    "colIndex": 52,
    "colLetter": "BA",
    "label": "สนับสนุนจากจังหวัด ข้อ 1",
    "category": "6. สนับสนุนจากจังหวัด",
    "type": "support_item",
    "iconKey": "icon_support_1",
    "x": 409,
    "y": 1197,
    "fontSize": 12,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": true
  },
  "support_2": {
    "id": "support_2",
    "colIndex": 53,
    "colLetter": "BB",
    "label": "สนับสนุนจากจังหวัด ข้อ 2",
    "category": "6. สนับสนุนจากจังหวัด",
    "type": "support_item",
    "iconKey": "icon_support_2",
    "x": 410,
    "y": 1234,
    "fontSize": 12,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": true
  },
  "support_3": {
    "id": "support_3",
    "colIndex": 54,
    "colLetter": "BC",
    "label": "สนับสนุนจากจังหวัด ข้อ 3",
    "category": "6. สนับสนุนจากจังหวัด",
    "type": "support_item",
    "iconKey": "icon_support_3",
    "x": 410,
    "y": 1274,
    "fontSize": 12,
    "fontWeight": "bold",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": true
  },
  "hosp_status": {
    "id": "hosp_status",
    "colIndex": 55,
    "colLetter": "BD",
    "label": "สถานะโรงพยาบาล (Badge ท้าย)",
    "category": "7. ข้อมูลท้ายรายงาน (Footer)",
    "type": "badge",
    "x": 802,
    "y": 313,
    "visible": false
  },
  "reporter_name": {
    "id": "reporter_name",
    "colIndex": 56,
    "colLetter": "BE",
    "label": "ชื่อผู้รายงาน",
    "category": "7. ข้อมูลท้ายรายงาน (Footer)",
    "type": "text",
    "x": 864,
    "y": 1419,
    "fontSize": 15,
    "fontWeight": "500",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": false
  },
  "reporter_pos": {
    "id": "reporter_pos",
    "colIndex": 57,
    "colLetter": "BF",
    "label": "ตำแหน่งผู้รายงาน",
    "category": "7. ข้อมูลท้ายรายงาน (Footer)",
    "type": "text",
    "x": 861,
    "y": 1445,
    "fontSize": 13,
    "fontWeight": "normal",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": false
  },
  "footer_time": {
    "id": "footer_time",
    "label": "เวลา (ท้ายรายงาน)",
    "category": "👤 9. ข้อมูลท้ายรายงาน (Footer)",
    "type": "text",
    "x": 854,
    "y": 1461,
    "fontSize": 15,
    "fontWeight": "500",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": false
  },
  "report_time_footer": {
    "id": "report_time_footer",
    "label": "เวลา (ท้ายรายงาน)",
    "category": "7. ข้อมูลท้ายรายงาน (Footer)",
    "type": "text",
    "x": 857,
    "y": 1469,
    "fontSize": 15,
    "fontWeight": "500",
    "fontFamily": "Prompt",
    "color": "#002d62",
    "align": "left",
    "visible": false
  },
  "custom_texts": []
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
