const { createContainer } = require('instances-container');
const Jwt = require('@hapi/jwt');

/* ========= EXTERNAL WRAPPER ========= */
const Pool = require('./externals/Pool');
const IdGenerator = require('./externals/IdGenerator');
const Bcrypt = require('./externals/Bcrypt');

/* ========= SECURITY ========= */
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./security/JwtTokenManager');

/* ========= REPOSITORIES ========= */
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/ReplyRepositoryPostgres');
const CommentLikeRepositoryPostgres = require('./repository/CommentLikeRepositoryPostgres');

/* ========= USE CASES ========= */
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/DeleteReplyUseCase');
const ToggleLikeCommentUseCase = require('../Applications/use_case/ToggleLikeCommentUseCase');
const GetThreadUseCase = require('../Applications/use_case/GetThreadUseCase');

const container = createContainer();

/* ========= REGISTER EXTERNAL ========= */
container.register([
  { key: Pool.name, Class: Pool },
  { key: IdGenerator.name, Class: IdGenerator },
]);

/* ========= REGISTER SECURITY ========= */
container.register([
  {
    key: BcryptPasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        { concrete: Bcrypt },
      ],
    },
  },
  {
    key: JwtTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token,
        },
      ],
    },
  },
]);

/* ========= REGISTER REPOSITORIES ========= */
container.register([
  {
    key: UserRepositoryPostgres.name,
    Class: UserRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'pool', internal: Pool.name },
        { name: 'idGenerator', internal: IdGenerator.name },
      ],
    },
  },
  {
    key: AuthenticationRepositoryPostgres.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'pool', internal: Pool.name },
      ],
    },
  },
  {
    key: ThreadRepositoryPostgres.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'pool', internal: Pool.name },
        { name: 'idGenerator', internal: IdGenerator.name },
      ],
    },
  },
  {
    key: CommentRepositoryPostgres.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'pool', internal: Pool.name },
        { name: 'idGenerator', internal: IdGenerator.name },
      ],
    },
  },
  {
    key: ReplyRepositoryPostgres.name,
    Class: ReplyRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'pool', internal: Pool.name },
        { name: 'idGenerator', internal: IdGenerator.name },
      ],
    },
  },
  {
    key: CommentLikeRepositoryPostgres.name,
    Class: CommentLikeRepositoryPostgres,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'pool', internal: Pool.name },
      ],
    },
  },
]);

/* ========= REGISTER USE CASES ========= */
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'userRepository', internal: UserRepositoryPostgres.name },
        { name: 'passwordHash', internal: BcryptPasswordHash.name },
      ],
    },
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'userRepository', internal: UserRepositoryPostgres.name },
        { name: 'authenticationRepository', internal: AuthenticationRepositoryPostgres.name },
        { name: 'authenticationTokenManager', internal: JwtTokenManager.name },
        { name: 'passwordHash', internal: BcryptPasswordHash.name },
      ],
    },
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'authenticationRepository', internal: AuthenticationRepositoryPostgres.name },
      ],
    },
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'authenticationRepository', internal: AuthenticationRepositoryPostgres.name },
        { name: 'authenticationTokenManager', internal: JwtTokenManager.name },
      ],
    },
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepositoryPostgres.name },
      ],
    },
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepositoryPostgres.name },
        { name: 'commentRepository', internal: CommentRepositoryPostgres.name },
      ],
    },
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepositoryPostgres.name },
        { name: 'commentRepository', internal: CommentRepositoryPostgres.name },
      ],
    },
  },
  {
    key: AddReplyUseCase.name,
    Class: AddReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepositoryPostgres.name },
        { name: 'commentRepository', internal: CommentRepositoryPostgres.name },
        { name: 'replyRepository', internal: ReplyRepositoryPostgres.name },
      ],
    },
  },
  {
    key: DeleteReplyUseCase.name,
    Class: DeleteReplyUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepositoryPostgres.name },
        { name: 'commentRepository', internal: CommentRepositoryPostgres.name },
        { name: 'replyRepository', internal: ReplyRepositoryPostgres.name },
      ],
    },
  },
  {
    key: ToggleLikeCommentUseCase.name,
    Class: ToggleLikeCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepositoryPostgres.name },
        { name: 'commentRepository', internal: CommentRepositoryPostgres.name },
        { name: 'commentLikeRepository', internal: CommentLikeRepositoryPostgres.name },
      ],
    },
  },
  {
    key: GetThreadUseCase.name,
    Class: GetThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepositoryPostgres.name },
        { name: 'commentRepository', internal: CommentRepositoryPostgres.name },
        { name: 'replyRepository', internal: ReplyRepositoryPostgres.name },
        { name: 'commentLikeRepository', internal: CommentLikeRepositoryPostgres.name },
      ],
    },
  },
]);

module.exports = container;
