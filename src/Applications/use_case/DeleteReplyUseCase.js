const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, replyId, owner } = useCasePayload;
    await this._threadRepository.verifyThreadExists(threadId);

    const comment = await this._commentRepository.getCommentById(commentId);
    if (comment.threadId !== threadId) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    const reply = await this._replyRepository.getReplyById(replyId);
    if (reply.commentId !== commentId) {
      throw new NotFoundError('balasan tidak ditemukan');
    }

    if (reply.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }

    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
