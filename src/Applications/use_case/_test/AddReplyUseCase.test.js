const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
    };
    const credentialId = 'user-123';

    const expectedAddedReply = {
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    };

    const returnedAddedReply = {
      id: 'reply-123',
      content: 'sebuah balasan',
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
    replyRepository.addReply = jest.fn(() => Promise.resolve(returnedAddedReply));

    const addReplyUseCase = new AddReplyUseCase({ threadRepository, commentRepository, replyRepository });

    const addedReply = await addReplyUseCase.execute(useCasePayload, credentialId);

    expect(threadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(commentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(replyRepository.addReply).toHaveBeenCalledTimes(1);
    const passedNewReply = replyRepository.addReply.mock.calls[0][0];
    expect(passedNewReply.commentId).toEqual(useCasePayload.commentId);
    expect(passedNewReply.content).toEqual(useCasePayload.content);
    expect(passedNewReply.owner).toEqual(credentialId);
    expect(addedReply).toStrictEqual(expectedAddedReply);
  });

  it('should throw NotFoundError when comment does not belong to thread', async () => {
    const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
    };
    const credentialId = 'user-123';

    const threadRepository = {};
    threadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());

    const commentRepository = {};
    commentRepository.getCommentById = jest.fn(() => Promise.resolve({
      id: useCasePayload.commentId,
      threadId: 'thread-xxx', // different thread
      owner: 'user-xxx',
      isDelete: false,
    }));

    const replyRepository = {};
    replyRepository.addReply = jest.fn(() => Promise.resolve());

    const addReplyUseCase = new AddReplyUseCase({ threadRepository, commentRepository, replyRepository });

    await expect(addReplyUseCase.execute(useCasePayload, credentialId)).rejects.toThrow(NotFoundError);
    expect(replyRepository.addReply).not.toHaveBeenCalled();
  });

});
