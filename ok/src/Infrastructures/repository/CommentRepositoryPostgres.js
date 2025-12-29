const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments(id, thread_id, content, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner,
    });
  }

  async getCommentById(commentId) {
    const query = {
      text: 'SELECT id, thread_id as "threadId", content, date, owner, is_delete as "isDelete" FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    const row = result.rows[0];
    return {
      id: row.id,
      threadId: row.threadId,
      content: row.content,
      date: new Date(row.date).toISOString(),
      owner: row.owner,
      isDelete: row.isDelete,
    };
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1 RETURNING id',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete as "isDelete"
        FROM comments
        LEFT JOIN users ON users.id = comments.owner
        WHERE comments.thread_id = $1
        ORDER BY comments.date ASC, comments.id ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((row) => new DetailComment({
      id: row.id,
      username: row.username,
      date: new Date(row.date).toISOString(),
      content: row.content,
      isDelete: row.isDelete,
    }));
  }
}

module.exports = CommentRepositoryPostgres;
