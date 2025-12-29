const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const credentialId = 'user-123';

    const expectedAddedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    const returnedAddedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    const threadRepository = {};
    threadRepository.addThread = jest.fn(() => Promise.resolve(returnedAddedThread));

    const addThreadUseCase = new AddThreadUseCase({ threadRepository });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload, credentialId);

    // Assert
    expect(threadRepository.addThread).toHaveBeenCalledTimes(1);
    const passedNewThread = threadRepository.addThread.mock.calls[0][0];
    expect(passedNewThread).toBeDefined();
    expect(passedNewThread.title).toEqual(useCasePayload.title);
    expect(passedNewThread.body).toEqual(useCasePayload.body);
    expect(passedNewThread.owner).toEqual(credentialId);
    expect(addedThread).toStrictEqual(expectedAddedThread);
  });
});
