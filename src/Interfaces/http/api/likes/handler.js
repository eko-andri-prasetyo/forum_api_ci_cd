const ToggleLikeCommentUseCase = require('../../../../Applications/use_case/ToggleLikeCommentUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async putLikeCommentHandler(request) {
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const likeCommentUseCase = this._container.getInstance(ToggleLikeCommentUseCase.name);
    await likeCommentUseCase.execute({ threadId, commentId, userId });

    return {
      status: 'success',
    };
  }
}

module.exports = LikesHandler;

