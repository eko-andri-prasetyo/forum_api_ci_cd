// src/Infrastructures/http/createServer.js

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');

const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const replies = require('../../Interfaces/http/api/replies');
const likes = require('../../Interfaces/http/api/likes');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  // Register JWT plugin dulu
  await server.register(Jwt);

  // Wajib: nama strategy harus sama dengan yang dipakai di routes: 'forumapi_jwt'
  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      // Starter Dicoding kadang typo ACCCESS_TOKEN_AGE (3x C), jadi kita fallback.
      maxAgeSec: Number(process.env.ACCESS_TOKEN_AGE || process.env.ACCCESS_TOKEN_AGE),
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Register semua plugin routes (users, auth, threads, comments, replies, likes)
  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
    {
      plugin: threads,
      options: { container },
    },
    {
      plugin: comments,
      options: { container },
    },
    {
      plugin: replies,
      options: { container },
    },
    {
      plugin: likes,
      options: { container },
    },
  ]);

  // Debug: print registered routes for verification
  try {
    const routeTable = server.table().map((r) => `${r.method.toUpperCase()} ${r.path}`);
    console.log('Registered routes:', routeTable);
  } catch (e) {
    console.error('Failed to list routes', e);
  }

  // Global error handler (DomainErrorTranslator + ClientError)
  server.ext('onPreResponse', (request, h) => {

    const { response } = request;

    if (response instanceof Error) {
      console.error('🔥 SERVER ERROR:', response);
      const translatedError = DomainErrorTranslator.translate(response);

      // Client error (4xx) dari domain kita
      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // Biarkan Hapi handle error non-server (misal 404 Not Found default)
      if (!translatedError.isServer) {
        return h.continue;
      }

      // Server error (5xx)
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
