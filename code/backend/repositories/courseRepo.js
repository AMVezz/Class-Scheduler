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

  async search(q = "") {
    const result = await db.query(
      `SELECT * FROM courses
       WHERE $1 = ''
          OR subject ILIKE '%'||$1||'%'
          OR title   ILIKE '%'||$1||'%'
          OR number::text ILIKE '%'||$1||'%'`,
      [q]
    );
    return result.rows;
  }
}

module.exports = new CourseRepository();
