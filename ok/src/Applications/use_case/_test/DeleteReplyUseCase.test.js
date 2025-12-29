const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const threadRepository = {};
    threadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());

    const commentRepository = {};
    commentRepository.getCommentById = jest.fn(() => Promise.resolve({
      id: useCasePayload.commentId,
      threadId: useCasePayload.threadId,
      owner: 'user-xxx',
      isDelete: false,
    }));

    const replyRepository = {};
    replyRepository.getReplyById = jest.fn(() => Promise.resolve({
      id: useCasePayload.replyId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
      isDelete: false,
    }));
    replyRepository.deleteReplyById = jest.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({ threadRepository, commentRepository, replyRepository });

    await deleteReplyUseCase.execute(useCasePayload);

    expect(threadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(commentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(replyRepository.getReplyById).toHaveBeenCalledWith(useCasePayload.replyId);
    expect(replyRepository.deleteReplyById).toHaveBeenCalledWith(useCasePayload.replyId);
  });

  it('should throw AuthorizationError when reply owner not match', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const threadRepository = {};
    threadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());

    const commentRepository = {};
    commentRepository.getCommentById = jest.fn(() => Promise.resolve({
      id: useCasePayload.commentId,
      threadId: useCasePayload.threadId,
      owner: 'user-xxx',
      isDelete: false,
    }));

    const replyRepository = {};
    replyRepository.getReplyById = jest.fn(() => Promise.resolve({
      id: useCasePayload.replyId,
      commentId: useCasePayload.commentId,
      owner: 'user-zzz',
      isDelete: false,
    }));

    const deleteReplyUseCase = new DeleteReplyUseCase({ threadRepository, commentRepository, replyRepository });

    await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrow(AuthorizationError);
  });

  it('should throw NotFoundError when comment does not belong to thread', async () => {
    const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const threadRepository = {};
    threadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());

    const commentRepository = {};
    commentRepository.getCommentById = jest.fn(() => Promise.resolve({
      id: useCasePayload.commentId,
      owner: useCasePayload.owner,
      threadId: 'thread-xxx', // different thread
      isDelete: false,
    }));

    const replyRepository = {};
    replyRepository.getReplyById = jest.fn(() => Promise.resolve({
      id: useCasePayload.replyId,
      commentId: useCasePayload.commentId,
      owner: useCasePayload.owner,
      isDelete: false,
    }));
    replyRepository.deleteReplyById = jest.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({ threadRepository, commentRepository, replyRepository });

    await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when reply does not belong to comment', async () => {
    const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
      owner: 'user-123',
    };

    const threadRepository = {};
    threadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());

    const commentRepository = {};
    commentRepository.getCommentById = jest.fn(() => Promise.resolve({
      id: useCasePayload.commentId,
      owner: useCasePayload.owner,
      threadId: useCasePayload.threadId,
      isDelete: false,
    }));

    const replyRepository = {};
    replyRepository.getReplyById = jest.fn(() => Promise.resolve({
      id: useCasePayload.replyId,
      commentId: 'comment-xxx', // different comment
      owner: useCasePayload.owner,
      isDelete: false,
    }));
    replyRepository.deleteReplyById = jest.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({ threadRepository, commentRepository, replyRepository });

    await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(replyRepository.deleteReplyById).not.toHaveBeenCalled();
  });

});
