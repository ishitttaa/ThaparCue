import { useEffect } from 'react';

export default function useLockBodyScroll(locked = true) {
  useEffect(() => {
    if (!locked) return undefined;

    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflowY: body.style.overflowY,
    };

    // position: fixed se phone (iOS) pe bhi peeche ka page nahi hilta
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflowY = 'scroll'; // scrollbar ki jagah rakhta hai, layout jump nahi hota

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflowY = prev.overflowY;
      window.scrollTo(0, scrollY); // modal band hone pe wahi position wapas
    };
  }, [locked]);
}