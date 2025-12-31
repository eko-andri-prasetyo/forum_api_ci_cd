const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor({ pool }) {
    super();
    this._pool = pool;
  }

  async isLiked({ commentId, userId }) {
    const query = {
      text: 'SELECT 1 FROM comment_likes WHERE comment_id=$1 AND user_id=$2 LIMIT 1',
      values: [commentId, userId],
    };
    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async like({ commentId, userId }) {
    const query = {
      text: 'INSERT INTO comment_likes(comment_id, user_id) VALUES($1, $2) ON CONFLICT DO NOTHING',
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async unlike({ commentId, userId }) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id=$1 AND user_id=$2',
      values: [commentId, userId],
    };
    await this._pool.query(query);
  }

  async getLikeCountsByCommentIds(commentIds) {
    if (!commentIds.length) return {};
    
    const query = {
      text: `
        SELECT comment_id, COUNT(*)::int AS count
        FROM comment_likes
        WHERE comment_id = ANY($1)
        GROUP BY comment_id
      `,
      values: [commentIds],
    };
    
    const result = await this._pool.query(query);
    return result.rows.reduce((acc, row) => {
      acc[row.comment_id] = row.count;
      return acc;
    }, {});
  }
}

module.exports = CommentLikeRepositoryPostgres;
