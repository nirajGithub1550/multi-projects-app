// src/NestedComments.jsx
import { useState } from 'react';
import './NestedComments.css';

// Initial Mock Tree Data
const INITIAL_DATA = [
  {
    id: 1,
    author: 'Alex',
    text: 'What do you think about React 19?',
    replies: [
      {
        id: 2,
        author: 'Sarah',
        text: 'The React Compiler looks super promising!',
        replies: [
          {
            id: 3,
            author: 'Dan',
            text: 'Yes! No more manual useMemo everywhere.',
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    author: 'Maria',
    text: 'Component recursion is such a common interview topic.',
    replies: [],
  },
];

// RECURSIVE HELPER: Immutably traverses tree to find parentId and insert reply
function insertReply(tree, parentId, newReply) {
  return tree.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        replies: [newReply, ...node.replies], // Add to beginning of replies
      };
    }
    // If it has children, search deeper (DFS)
    if (node.replies && node.replies.length > 0) {
      return {
        ...node,
        replies: insertReply(node.replies, parentId, newReply),
      };
    }
    return node;
  });
}

// ----------------------------------------------------------------------
// 1. RECURSIVE ITEM COMPONENT
// ----------------------------------------------------------------------
function CommentItem({ comment, onAddReply }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    onAddReply(comment.id, replyText);
    setReplyText('');
    setIsReplying(false);
    setIsExpanded(true); // Automatically expand to reveal the new reply
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="comment-node">
      <div className="comment-header">
        <span className="comment-author">@{comment.author}</span>
        {hasReplies && (
          <button 
            className="toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '▼ collapse' : `▶ expand (${comment.replies.length})`}
          </button>
        )}
      </div>

      <p className="comment-text">{comment.text}</p>

      {/* Action buttons */}
      <div className="comment-actions">
        <button 
          className="action-btn"
          onClick={() => setIsReplying(!isReplying)}
        >
          {isReplying ? 'Cancel' : 'Reply'}
        </button>
      </div>

      {/* Sub-comment form */}
      {isReplying && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            autoFocus
          />
          <button type="submit">Post</button>
        </form>
      )}

      {/* RECURSION HAPPENS HERE */}
      {isExpanded && hasReplies && (
        <div className="nested-children">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onAddReply={onAddReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. MAIN ROOT COMPONENT
// ----------------------------------------------------------------------
export default function NestedComments() {
  const [comments, setComments] = useState(INITIAL_DATA);
  const [topLevelText, setTopLevelText] = useState('');

  // Add top-level comment
  const handleAddTopComment = (e) => {
    e.preventDefault();
    if (!topLevelText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: 'You',
      text: topLevelText.trim(),
      replies: [],
    };

    setComments([newComment, ...comments]);
    setTopLevelText('');
  };

  // Add reply to any arbitrary depth node
  const handleAddReply = (parentId, text) => {
    const newReply = {
      id: Date.now(),
      author: 'You',
      text: text.trim(),
      replies: [],
    };

    // Immutably update the nested tree
    setComments((prevTree) => insertReply(prevTree, parentId, newReply));
  };

  return (
    <div className="comments-container">
      <h2>Discussion Tree</h2>
      <p className="hint">Supports infinite nested replies & thread collapsing.</p>

      {/* Top-Level Form */}
      <form onSubmit={handleAddTopComment} className="root-form">
        <input
          type="text"
          placeholder="Start a new discussion..."
          value={topLevelText}
          onChange={(e) => setTopLevelText(e.target.value)}
        />
        <button type="submit">Comment</button>
      </form>

      {/* Render comment tree list */}
      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onAddReply={handleAddReply}
          />
        ))}
      </div>
    </div>
  );
}