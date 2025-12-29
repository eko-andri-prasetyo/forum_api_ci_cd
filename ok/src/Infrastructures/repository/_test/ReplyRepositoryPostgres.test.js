const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ReplyRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addReply function', () => {
    it('should persist reply and return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123', content: 'sebuah comment' });

      const fakeIdGenerator = () => '123';
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const newReply = new NewReply({
        content: 'sebuah balasan',
        commentId: 'comment-123',
        owner: 'user-123',
      });

      const addedReply = await replyRepository.addReply(newReply);

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: newReply.content,
        owner: newReply.owner,
      }));
    });
  });

  describe('getReplyById function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, () => '123');
      await expect(replyRepository.getReplyById('reply-xxx')).rejects.toThrow(NotFoundError);
    });

    it('should return reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123', content: 'sebuah comment' });
      const date = new Date('2021-08-08T07:59:48.766Z');
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123', content: 'sebuah balasan', date, isDelete: false });

      const replyRepository = new ReplyRepositoryPostgres(pool, () => '123');
      const reply = await replyRepository.getReplyById('reply-123');

      expect(reply.id).toEqual('reply-123');
      expect(reply.commentId).toEqual('comment-123');
      expect(reply.content).toEqual('sebuah balasan');
      expect(reply.owner).toEqual('user-123');
      expect(reply.date).toEqual(date.toISOString());
      expect(reply.isDelete).toEqual(false);
    });
  });

  describe('deleteReplyById function', () => {
    it('should soft delete reply', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123', content: 'sebuah comment' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123', content: 'sebuah balasan', isDelete: false });

      const replyRepository = new ReplyRepositoryPostgres(pool, () => '123');
      await replyRepository.deleteReplyById('reply-123');

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies[0].is_delete).toEqual(true);
    });

    it('should throw NotFoundError when reply not found', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, () => '123');
      await expect(replyRepository.deleteReplyById('reply-xxx')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getRepliesByCommentIds function', () => {
    it('should return empty array when commentIds empty', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool, () => '123');
      const replies = await replyRepository.getRepliesByCommentIds([]);
      expect(replies).toEqual([]);
    });

    it('should return replies in ascending order by date', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe', password: 'secret', fullname: 'John Doe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123', content: 'sebuah comment' });

      await RepliesTableTestHelper.addReply({ id: 'reply-1', commentId: 'comment-123', owner: 'user-456', content: 'balasan 1', date: new Date('2021-08-08T07:59:48.766Z') });
      await RepliesTableTestHelper.addReply({ id: 'reply-2', commentId: 'comment-123', owner: 'user-123', content: 'balasan 2', date: new Date('2021-08-08T08:07:01.522Z') });

      const replyRepository = new ReplyRepositoryPostgres(pool, () => '123');
      const replies = await replyRepository.getRepliesByCommentIds(['comment-123']);

      expect(replies).toHaveLength(2);
      expect(replies[0].id).toEqual('reply-1');
      expect(replies[0].username).toEqual('johndoe');
      expect(replies[1].id).toEqual('reply-2');
      expect(replies[1].username).toEqual('dicoding');
    });
  });
});
