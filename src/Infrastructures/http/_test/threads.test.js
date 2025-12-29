const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  const registerAndLogin = async (server, { username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia' } = {}) => {
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: { username, password, fullname },
    });

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: { username, password },
    });

    const { data: { accessToken } } = JSON.parse(loginResponse.payload);
    return accessToken;
  };

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const server = await createServer(container);
      const accessToken = await registerAndLogin(server);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'sebuah thread',
          body: 'sebuah body thread',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual('sebuah thread');
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 400 when payload not valid', async () => {
      const server = await createServer(container);
      const accessToken = await registerAndLogin(server);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          title: 'sebuah thread',
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('thread detail flow', () => {
    it('should return 200 and show deleted comment with placeholder content', async () => {
      const server = await createServer(container);
      const accessToken1 = await registerAndLogin(server, { username: 'dicoding', password: 'secret', fullname: 'Dicoding Indonesia' });
      const accessToken2 = await registerAndLogin(server, { username: 'johndoe', password: 'secret', fullname: 'John Doe' });

      // Add thread by dicoding
      const addThreadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: { Authorization: `Bearer ${accessToken1}` },
        payload: { title: 'sebuah thread', body: 'sebuah body thread' },
      });
      const { data: { addedThread } } = JSON.parse(addThreadResponse.payload);

      // Add comment by johndoe
      const addCommentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${addedThread.id}/comments`,
        headers: { Authorization: `Bearer ${accessToken2}` },
        payload: { content: 'sebuah comment' },
      });
      const { data: { addedComment } } = JSON.parse(addCommentResponse.payload);

      // Delete comment by owner
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${addedThread.id}/comments/${addedComment.id}`,
        headers: { Authorization: `Bearer ${accessToken2}` },
      });
      expect(deleteCommentResponse.statusCode).toEqual(200);

      // Get thread detail
      const getThreadResponse = await server.inject({
        method: 'GET',
        url: `/threads/${addedThread.id}`,
      });
      const getThreadJson = JSON.parse(getThreadResponse.payload);

      expect(getThreadResponse.statusCode).toEqual(200);
      expect(getThreadJson.status).toEqual('success');
      expect(getThreadJson.data.thread.id).toEqual(addedThread.id);
      expect(getThreadJson.data.thread.date).toBeDefined();
      // compatibility with Postman typo
      expect(getThreadJson.data.thread.data).toEqual(getThreadJson.data.thread.date);
      expect(getThreadJson.data.thread.comments).toHaveLength(1);
      expect(getThreadJson.data.thread.comments[0].content).toEqual('**komentar telah dihapus**');
    });
  });
});
