const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should persist comment and return added comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const newComment = new NewComment({
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const addedComment = await commentRepository.addComment(newComment);

      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: newComment.owner,
      }));
    });
  });

  describe('getCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');
      await expect(commentRepository.getCommentById('comment-xxx')).rejects.toThrow(NotFoundError);
    });

    it('should return comment correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const date = new Date('2021-08-08T07:22:33.555Z');
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123', content: 'sebuah comment', date, isDelete: false });

      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');
      const comment = await commentRepository.getCommentById('comment-123');

      expect(comment.id).toEqual('comment-123');
      expect(comment.threadId).toEqual('thread-123');
      expect(comment.content).toEqual('sebuah comment');
      expect(comment.owner).toEqual('user-123');
      expect(comment.date).toEqual(date.toISOString());
      expect(comment.isDelete).toEqual(false);
    });
  });

  describe('deleteCommentById function', () => {
    it('should mark comment as deleted', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'johndoe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');

      // Action
      await commentRepository.deleteCommentById('comment-123');

      // Assert
      const comment = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comment[0].is_delete).toEqual(true);
    });

    it('should throw NotFoundError when comment not found', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');
      await expect(commentRepository.deleteCommentById('comment-xxx'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments in ascending order by date', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'johndoe', password: 'secret', fullname: 'John Doe' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      await CommentsTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-123', owner: 'user-456', content: 'komentar 1', date: new Date('2021-08-08T07:22:33.555Z') });
      await CommentsTableTestHelper.addComment({ id: 'comment-2', threadId: 'thread-123', owner: 'user-123', content: 'komentar 2', date: new Date('2021-08-08T07:26:21.338Z'), isDelete: true });

      const commentRepository = new CommentRepositoryPostgres(pool, () => '123');
      const comments = await commentRepository.getCommentsByThreadId('thread-123');

      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-1');
      expect(comments[0].username).toEqual('johndoe');
      expect(comments[0].content).toEqual('komentar 1');
      expect(comments[1].id).toEqual('comment-2');
      expect(comments[1].username).toEqual('dicoding');
      expect(comments[1].content).toEqual('**komentar telah dihapus**');
    });
  });
});
