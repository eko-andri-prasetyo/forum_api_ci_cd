const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor({ pool, idGenerator }) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `
        INSERT INTO comments (id, thread_id, content, owner)
        VALUES ($1, $2, $3, $4)
        RETURNING id, content, owner
      `,
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async verifyCommentIsExist(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async verifyCommentBelongsToThread(commentId, threadId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      // Dicoding biasanya menganggap mismatch thread-comment => komentar tidak ditemukan
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentById(commentId) {
    const query = {
      text: `
        SELECT id, thread_id as "threadId", content, date, owner, is_delete as "isDelete"
        FROM comments
        WHERE id = $1
      `,
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
    return result.rows[0];
  }

  /**
   * IMPORTANT (Optional Likes):
   * - Return list comments for a thread
   * - Must include: id, username, date, content, likeCount
   * - Soft delete: content harus menjadi "**komentar telah dihapus**"
   */
  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
        SELECT
          c.id,
          u.username,
          c.date,
          c.content,
          c.is_delete as "isDelete",
          COUNT(cl.user_id)::int as "likeCount"
        FROM comments c
        LEFT JOIN users u ON u.id = c.owner
        LEFT JOIN comment_likes cl ON cl.comment_id = c.id
        WHERE c.thread_id = $1
        GROUP BY c.id, u.username, c.date, c.content, c.is_delete
        ORDER BY c.date ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) => ({
      id: row.id,
      username: row.username,
      date: row.date,
      content: row.isDelete ? '**komentar telah dihapus**' : row.content,
      likeCount: row.likeCount ?? 0,
    }));
  }
}

module.exports = CommentRepositoryPostgres;
