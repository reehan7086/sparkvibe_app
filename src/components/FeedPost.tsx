type Props = {
  post: any;
  onReact: (postId: string, type: string) => void;
};

export default function FeedPost({ post, onReact }: Props) {
  return (
    <div className="bg-pink-50 p-4 rounded-xl shadow-sm mb-4 transition hover:shadow-md">
      <p className="text-gray-800 mb-2">{post.content}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => onReact(post.id, 'support')}
          className="text-red-500 hover:scale-110 transition"
        >
          ❤️ Support
        </button>
        <button
          onClick={() => onReact(post.id, 'chat')}
          className="text-blue-500 hover:scale-110 transition"
        >
          💬 Chat
        </button>
        <button
          onClick={() => onReact(post.id, 'call')}
          className="text-purple-500 hover:scale-110 transition"
        >
          🎧 Call
        </button>
      </div>
    </div>
  );
}
