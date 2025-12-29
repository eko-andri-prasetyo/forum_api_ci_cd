const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { commentId, content, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies(id, comment_id, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, commentId, content, owner],
    };

    const result = await this._pool.query(query);
    return new AddedReply({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner,
    });
  }

  async getReplyById(replyId) {
    const query = {
      text: 'SELECT id, comment_id as "commentId", content, date, owner, is_delete as "isDelete" FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    const row = result.rows[0];
    return {
      id: row.id,
      commentId: row.commentId,
      content: row.content,
      date: new Date(row.date).toISOString(),
      owner: row.owner,
      isDelete: row.isDelete,
    };
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1 RETURNING id',
      values: [replyId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async getRepliesByCommentIds(commentIds) {
    if (!commentIds.length) {
      return [];
    }

    const query = {
      text: `
        SELECT replies.id, replies.comment_id as "commentId", users.username, replies.date, replies.content, replies.is_delete as "isDelete"
        FROM replies
        LEFT JOIN users ON users.id = replies.owner
        WHERE replies.comment_id = ANY($1::text[])
        ORDER BY replies.date ASC, replies.id ASC
      `,
      values: [commentIds],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new DetailReply({
      id: row.id,
      commentId: row.commentId,
      username: row.username,
      date: new Date(row.date).toISOString(),
      content: row.content,
      isDelete: row.isDelete,
    }));
  }
}

module.exports = ReplyRepositoryPostgres;
