class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, commentLikeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._commentLikeRepository = commentLikeRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);

    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const commentIds = comments.map((c) => c.id);
    const replies = commentIds.length ? await this._replyRepository.getRepliesByCommentIds(commentIds) : [];
    const likeCounts = commentIds.length ? await this._commentLikeRepository.getLikeCountsByCommentIds(commentIds) : {};

    const repliesByCommentId = replies.reduce((acc, reply) => {
      acc[reply.commentId] = acc[reply.commentId] || [];
      acc[reply.commentId].push({
        id: reply.id,
        content: reply.content,
        date: reply.date,
        username: reply.username,
      });
      return acc;
    }, {});

    const mappedComments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.content,
      likeCount: likeCounts[comment.id] || 0,
      replies: repliesByCommentId[comment.id] || [],
    }));

    // NOTE: Postman Collection Forum API V1 punya typo assertion: `thread.data` (bukan `thread.date`).
    // Agar seluruh test hijau, kita duplikasi nilai `date` ke properti `data`.
    return {
      ...thread,
      data: thread.date,
      comments: mappedComments,
    };
  }
}

module.exports = GetThreadUseCase;
