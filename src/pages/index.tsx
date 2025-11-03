import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import FeedPost from '../components/FeedPost';
import { useRouter } from 'next/router';

interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    // Fetch initial posts
    fetchPosts();

    // Subscribe to realtime new posts
    const channel = supabase
      .channel('feed_posts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'feed_posts' },
        (payload: any) => setPosts((prev) => [payload.new, ...prev])
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('feed_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts(data || []);
  };

  const addPost = async () => {
    if (!content || !user) return;
    await supabase
      .from('feed_posts')
      .insert({ content, user_id: user.id });
    setContent('');
  };

  const handleReact = (postId: string, type: string) => {
    if (!user) return;
    if (type === 'chat' || type === 'call') {
      router.push(`/chat/${postId}?type=${type}`);
    } else {
      supabase
        .from('feed_reactions')
        .insert({ post_id: postId, user_id: user.id, reaction_type: type });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-pink-400">
        SparkVibe Feed
      </h1>

      <div className="mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your feelings..."
          className="w-full p-2 rounded-lg border border-gray-300"
        />
        <button
          onClick={addPost}
          className="mt-2 bg-pink-400 text-white px-4 py-2 rounded-lg w-full"
        >
          Post
        </button>
      </div>

      {posts.map((post) => (
        <FeedPost key={post.id} post={post} onReact={handleReact} />
      ))}
    </div>
  );
}
