import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/router';
import ChatMessage from '../../components/ChatMessage';

export default function Chat() {
  const router = useRouter();
  const { id, type } = router.query as { id: string; type: string };
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState<any>(null);

  // Fetch current Supabase user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  // Fetch messages & subscribe to real-time updates
  useEffect(() => {
    if (!id) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages:${id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `post_id=eq.${id}`,
        },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [id]);

  const sendMessage = async () => {
    if (!input || !user || !id) return;
    await supabase
      .from('messages')
      .insert({ post_id: id, user_id: user.id, message: input });
    setInput('');
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col h-screen">
      <h1 className="text-2xl font-bold text-center mb-4 text-blue-400">
        Chat
      </h1>

      <div className="flex-1 overflow-y-auto mb-4 flex flex-col space-y-2">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isSender={user?.id === msg.user_id}
          />
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-400 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
