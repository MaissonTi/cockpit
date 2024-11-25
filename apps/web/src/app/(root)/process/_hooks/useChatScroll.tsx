import { useEffect, useRef, useState } from 'react';

interface UseChatScrollProps {
  dependencies: any[]; // Dependências para disparar o scroll
}

const useChatScroll = ({ dependencies }: UseChatScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setUnreadMessages(0); // Reseta o contador de mensagens não lidas
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
      const atBottom = scrollHeight - scrollTop <= clientHeight + 10; // Tolerância de 10px
      setIsAtBottom(atBottom);

      if (atBottom) {
        setUnreadMessages(0); // Reseta mensagens não lidas se estiver no final
      }
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom(); // Rola automaticamente se estiver no final
    } else {
      setUnreadMessages((prev) => prev + 1); // Incrementa mensagens não lidas
    }
  }, dependencies);

  return {
    containerRef,
    isAtBottom,
    unreadMessages,
    scrollToBottom,
    handleScroll,
  };
};

export default useChatScroll;
