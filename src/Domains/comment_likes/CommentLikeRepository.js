class CommentLikeRepository {
  async isLiked() { throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'); }
  async like() { throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'); }
  async unlike() { throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'); }
  async getLikeCountsByCommentIds() { throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED'); }
}

module.exports = CommentLikeRepository;
