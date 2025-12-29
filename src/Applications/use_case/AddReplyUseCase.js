const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, owner) {
    const { threadId, commentId } = useCasePayload;
    await this._threadRepository.verifyThreadExists(threadId);

    const comment = await this._commentRepository.getCommentById(commentId);
    if (comment.threadId !== threadId) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    const newReply = new NewReply({ ...useCasePayload, owner });
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
