const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
  it('should create DetailComment object correctly when not deleted', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: false,
      replies: [],
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.replies).toEqual(payload.replies);
  });

  it('should create DetailComment object with placeholder content when deleted', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: true,
      replies: [],
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.content).toEqual('**komentar telah dihapus**');
  });

  it('should throw error when payload does not contain needed property', () => {
    // cover: if (!id || !username || !date || content === undefined || isDelete === undefined)
    expect(() => new DetailComment({
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: false,
    })).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    expect(() => new DetailComment({
      id: 'comment-123',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: false,
    })).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    expect(() => new DetailComment({
      id: 'comment-123',
      username: 'dicoding',
      content: 'sebuah comment',
      isDelete: false,
    })).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    expect(() => new DetailComment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      // content missing -> undefined
      isDelete: false,
    })).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');

    expect(() => new DetailComment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      // isDelete missing -> undefined
    })).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    // cover: type checking (id/username/date/content string, isDelete boolean)
    expect(() => new DetailComment({
      id: 123,
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: false,
      replies: [],
    })).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new DetailComment({
      id: 'comment-123',
      username: 123,
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: false,
      replies: [],
    })).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new DetailComment({
      id: 'comment-123',
      username: 'dicoding',
      date: 123,
      content: 'sebuah comment',
      isDelete: false,
      replies: [],
    })).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new DetailComment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 123,
      isDelete: false,
      replies: [],
    })).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');

    expect(() => new DetailComment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: 'false',
      replies: [],
    })).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when replies is provided but not an array', () => {
    // cover: if (replies !== undefined && !Array.isArray(replies))
    expect(() => new DetailComment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      isDelete: false,
      replies: {},
    })).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
