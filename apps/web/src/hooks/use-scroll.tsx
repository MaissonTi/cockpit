import { useEffect, useRef, useState } from 'react';

interface UseScrollProps {
  dependencies: any[]; // Dependências para disparar o scroll
}

const useScroll = ({ dependencies }: UseScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setUnreadMessages(0);
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
      const atBottom = scrollHeight - scrollTop <= clientHeight + 10;
      setIsAtBottom(atBottom);

      if (atBottom) {
        setUnreadMessages(0);
      }
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    } else {
      setUnreadMessages(prev => prev + 1);
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

export default useScroll;
