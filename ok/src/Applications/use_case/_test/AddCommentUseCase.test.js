const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'sebuah comment',
    };
    const credentialId = 'user-123';

    const expectedAddedComment = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    const returnedAddedComment = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    const threadRepository = {};
    threadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());

    const commentRepository = {};
    commentRepository.addComment = jest.fn(() => Promise.resolve(returnedAddedComment));

    const addCommentUseCase = new AddCommentUseCase({ threadRepository, commentRepository });

    const addedComment = await addCommentUseCase.execute(useCasePayload, credentialId);

    expect(threadRepository.verifyThreadExists).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(commentRepository.addComment).toHaveBeenCalledTimes(1);
    const passedNewComment = commentRepository.addComment.mock.calls[0][0];
    expect(passedNewComment.threadId).toEqual(useCasePayload.threadId);
    expect(passedNewComment.content).toEqual(useCasePayload.content);
    expect(passedNewComment.owner).toEqual(credentialId);
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});
