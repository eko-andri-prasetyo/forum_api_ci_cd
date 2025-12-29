const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, owner) {
    const { threadId } = useCasePayload;
    await this._threadRepository.verifyThreadExists(threadId);

    const newComment = new NewComment({ ...useCasePayload, owner });
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
