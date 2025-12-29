const GetThreadUseCase = require('../GetThreadUseCase');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const threadId = 'thread-123';
    const threadRepository = {};
    threadRepository.getThreadById = jest.fn(() => Promise.resolve({
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    }));

    const commentRepository = {};
    commentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([
      new DetailComment({
        id: 'comment-1',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'komentar 1',
        isDelete: false,
      }),
      new DetailComment({
        id: 'comment-2',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'komentar 2',
        isDelete: true,
      }),
    ]));

    const replyRepository = {};
    replyRepository.getRepliesByCommentIds = jest.fn(() => Promise.resolve([
      new DetailReply({
        id: 'reply-1',
        commentId: 'comment-2',
        content: 'balasan 1',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        isDelete: true,
      }),
    ]));

    const getThreadUseCase = new GetThreadUseCase({ threadRepository, commentRepository, replyRepository });

    const thread = await getThreadUseCase.execute(threadId);

    expect(threadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(commentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(replyRepository.getRepliesByCommentIds).toHaveBeenCalledWith(['comment-1', 'comment-2']);

    expect(thread.data).toEqual(thread.date);
    expect(thread.comments).toHaveLength(2);
    expect(thread.comments[0].content).toEqual('komentar 1');
    expect(thread.comments[0].replies).toEqual([]);
    expect(thread.comments[1].content).toEqual('**komentar telah dihapus**');
    expect(thread.comments[1].replies).toHaveLength(1);
    expect(thread.comments[1].replies[0].content).toEqual('**balasan telah dihapus**');
  });

  it('should return thread with empty comments and should not call reply repository when no comments', async () => {
    const threadId = 'thread-empty';
    const threadRepository = {};
    threadRepository.getThreadById = jest.fn(() => Promise.resolve({
      id: threadId,
      title: 'thread kosong',
      body: 'body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    }));

    const commentRepository = {};
    commentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([]));

    const replyRepository = {};
    replyRepository.getRepliesByCommentIds = jest.fn(() => Promise.resolve([]));

    const getThreadUseCase = new GetThreadUseCase({ threadRepository, commentRepository, replyRepository });

    const thread = await getThreadUseCase.execute(threadId);

    expect(threadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(commentRepository.getCommentsByThreadId).toHaveBeenCalledWith(threadId);
    expect(replyRepository.getRepliesByCommentIds).not.toHaveBeenCalled();
    expect(thread.comments).toEqual([]);
  });

  it('should show deleted reply placeholder content', async () => {
    const threadId = 'thread-xyz';
    const threadRepository = {};
    threadRepository.getThreadById = jest.fn(() => Promise.resolve({
      id: threadId,
      title: 'sebuah thread',
      body: 'body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    }));

    const commentRepository = {};
    commentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([
      new DetailComment({
        id: 'comment-1',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'komentar 1',
        isDelete: false,
      }),
    ]));

    const replyRepository = {};
    replyRepository.getRepliesByCommentIds = jest.fn(() => Promise.resolve([
      new DetailReply({
        id: 'reply-1',
        commentId: 'comment-1',
        username: 'dicoding',
        date: '2021-08-08T07:59:48.766Z',
        content: 'balasan',
        isDelete: true,
      }),
    ]));

    const getThreadUseCase = new GetThreadUseCase({ threadRepository, commentRepository, replyRepository });
    const thread = await getThreadUseCase.execute(threadId);

    expect(thread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
  });

});
