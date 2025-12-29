/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'sebuah balasan',
    date = new Date(),
    owner = 'user-123',
    isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies(id, comment_id, content, date, owner, is_delete) VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, commentId, content, date, owner, isDelete],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
