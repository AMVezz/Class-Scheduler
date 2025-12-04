

'use strict';

const db = require('../config/db');

class CourseRepository {
  // List all courses
  async getAll() {
    const result = await db.query(`
      SELECT id, code, title, instructor, start_time, end_time, days
      FROM courses
      ORDER BY code ASC
    `);
    return result.rows;
  }

  // Get a single course by id
  async getById(id) {
    const result = await db.query(
      `
      SELECT id, code, title, instructor, start_time, end_time, days
      FROM courses
      WHERE id = $1
      `,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Search courses.
   * Supports:
   *  - q: global search across code/title/instructor
   *  - name: matches code OR title
   *  - professor: matches instructor
   * If q is provided, name/professor are ignored.
   */
  async search({ q = '', name = '', professor = '' }) {
    const where = [];
    const values = [];
    let i = 1;

    const trim = (s) => (typeof s === 'string' ? s.trim() : '');

    const qVal = trim(q);
    const nameVal = trim(name);
    const profVal = trim(professor);

    if (qVal) {
      where.push(
        `(code ILIKE '%' || $${i} || '%' OR title ILIKE '%' || $${i} || '%' OR instructor ILIKE '%' || $${i} || '%')`
      );
      values.push(qVal);
    } else {
      if (nameVal) {
        where.push(`(code ILIKE '%' || $${i} || '%' OR title ILIKE '%' || $${i} || '%')`);
        values.push(nameVal);
        i++;
      }
      if (profVal) {
        where.push(`instructor ILIKE '%' || $${i} || '%'`);
        values.push(profVal);
        i++;
      }
    }

    if (where.length === 0) return [];

    const sql = `
      SELECT id, code, title, instructor, start_time, end_time, days
      FROM courses
      WHERE ${where.join(' AND ')}
      ORDER BY code ASC
      LIMIT 200
    `;

    const result = await db.query(sql, values);
    return result.rows;
  }
}


module.exports = new CourseRepository();
code/backend/repositories/CourseRepository.js
