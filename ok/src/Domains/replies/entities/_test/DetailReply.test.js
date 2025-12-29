const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should create DetailReply object correctly when not deleted', () => {
    const payload = {
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      isDelete: false,
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.commentId).toEqual(payload.commentId);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.username).toEqual(payload.username);
  });

  it('should create DetailReply object with placeholder content when deleted', () => {
    const payload = {
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      isDelete: true,
    };

    const detailReply = new DetailReply(payload);

    expect(detailReply.content).toEqual('**balasan telah dihapus**');
  });

  it('should throw error when payload does not contain needed property', () => {
    // cover: if (!id || !commentId || !date || !username || content === undefined || isDelete === undefined)
    expect(() => new DetailReply({
      commentId: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      isDelete: false,
    })).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

    expect(() => new DetailReply({
      id: 'reply-123',
      // commentId missing
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      isDelete: false,
    })).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

    expect(() => new DetailReply({
      id: 'reply-123',
      commentId: 'comment-123',
      // content missing -> undefined
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      isDelete: false,
    })).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

    expect(() => new DetailReply({
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      // date missing
      username: 'dicoding',
      isDelete: false,
    })).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

    expect(() => new DetailReply({
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      // username missing
      isDelete: false,
    })).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');

    expect(() => new DetailReply({
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      // isDelete missing -> undefined
    })).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // cover: type checking
    expect(() => new DetailReply({
      id: 123,
      commentId: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      isDelete: false,
    })).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new DetailReply({
      id: 'reply-123',
      commentId: 123,
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      isDelete: false,
    })).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new DetailReply({
      id: 'reply-123',
      commentId: 'comment-123',
      content: 123,
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      isDelete: false,
    })).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new DetailReply({
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      date: 123,
      username: 'dicoding',
      isDelete: false,
    })).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new DetailReply({
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      username: 123,
      isDelete: false,
    })).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new DetailReply({
      id: 'reply-123',
      commentId: 'comment-123',
      content: 'sebuah balasan',
      date: '2021-08-08T08:07:01.522Z',
      username: 'dicoding',
      isDelete: 'false',
    })).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
