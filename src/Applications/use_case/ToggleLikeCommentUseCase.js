const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ToggleLikeCommentUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.verifyThreadExists(threadId);
    
    const comment = await this._commentRepository.getCommentById(commentId);
    if (comment.threadId !== threadId) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    const isLiked = await this._commentLikeRepository.isLiked({
      commentId,
      userId,
    });

    if (isLiked) {
      await this._commentLikeRepository.unlike({
        commentId,
        userId,
      });
      return { status: 'unliked' };
    }

    await this._commentLikeRepository.like({
      commentId,
      userId,
    });

    return { status: 'liked' };
  }
}

module.exports = ToggleLikeCommentUseCase;
