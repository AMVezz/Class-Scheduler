const db = require("../config/db");

class CourseRepository {
  async getAll() {
    const result = await db.query("SELECT * FROM courses");
    return result.rows;
  }

  async getById(id) {
    const result = await db.query("SELECT * FROM courses WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  async search({ q = "", name = "", professor = "" }) {
    const where = [];
    const vals = [];
    let i = 1;
    const trim = (s) => (typeof s === "string" ? s.trim() : "");

    const qVal = trim(q), nameVal = trim(name), profVal = trim(professor);

    if (qVal) {
      where.push(`(code ILIKE '%'||$${i}||'%' OR title ILIKE '%'||$${i}||'%' OR instructor ILIKE '%'||$${i}||'%')`);
      vals.push(qVal);
    } else {
      if (nameVal) { where.push(`(code ILIKE '%'||$${i}||'%' OR title ILIKE '%'||$${i}||'%')`); vals.push(nameVal); i++; }
      if (profVal){ where.push(`instructor ILIKE '%'||$${i}||'%'`); vals.push(profVal); }
    }
    if (!where.length) return [];

    const sql = `
      SELECT id, code, title, instructor, start_time, end_time, days
      FROM courses
      WHERE ${where.join(" AND ")}
      ORDER BY code ASC
      LIMIT 200
    `;
    const r = await db.query(sql, vals);
    return r.rows;
  }

}

module.exports = new CourseRepository();
