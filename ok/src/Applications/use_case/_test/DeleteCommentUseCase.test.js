const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
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
    commentRepository.deleteCommentById = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({ threadRepository, commentRepository });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(threadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(commentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(commentRepository.deleteCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
  });

  it('should throw AuthorizationError when comment owner not match', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const threadRepository = {};
    threadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());

    const commentRepository = {};
    commentRepository.getCommentById = jest.fn(() => Promise.resolve({
      id: useCasePayload.commentId,
      owner: 'user-xxx',
      threadId: useCasePayload.threadId,
      isDelete: false,
    }));

    const deleteCommentUseCase = new DeleteCommentUseCase({ threadRepository, commentRepository });

    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrow(AuthorizationError);
  });

  it('should throw NotFoundError when comment does not belong to thread', async () => {
    const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
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

    const deleteCommentUseCase = new DeleteCommentUseCase({ threadRepository, commentRepository });

    await expect(deleteCommentUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
  });

});
