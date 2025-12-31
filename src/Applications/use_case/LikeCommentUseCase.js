class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute({ threadId, commentId, userId }) {
    await this._threadRepository.verifyThreadExists(threadId);

    // penting: pastikan comment memang milik thread itu
    await this._commentRepository.verifyCommentExists({ threadId, commentId });

    const isLiked = await this._commentLikeRepository.isLiked({ commentId, userId });

    if (isLiked) {
      await this._commentLikeRepository.unlike({ commentId, userId });
      return;
    }
    await this._commentLikeRepository.like({ commentId, userId });
  }
}

module.exports = LikeCommentUseCase;
