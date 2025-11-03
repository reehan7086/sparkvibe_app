type Props = {
  message: any;
  isSender: boolean;
};

export default function ChatMessage({ message, isSender }: Props) {
  return (
    <div
      className={`my-1 p-2 rounded-xl max-w-xs ${
        isSender ? 'bg-blue-100 self-end' : 'bg-pink-50 self-start'
      }`}
    >
      <p className="text-gray-800">{message.message}</p>
      <small className="text-gray-500 text-xs">
        {new Date(message.created_at).toLocaleTimeString()}
      </small>
    </div>
  );
}
