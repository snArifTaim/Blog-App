// Simple event bus for in-app events (pub/sub)
const listeners = new Map();

const on = (event, cb) => {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(cb);
  return () => off(event, cb);
};

const off = (event, cb) => {
  if (!listeners.has(event)) return;
  listeners.get(event).delete(cb);
  if (listeners.get(event).size === 0) listeners.delete(event);
};

const emit = (event, payload) => {
  if (!listeners.has(event)) return;
  for (const cb of Array.from(listeners.get(event))) {
    try {
      cb(payload);
    } catch (err) {
      // swallow to avoid breaking emitter
      // in real app, consider logging
    }
  }
};

export default { on, off, emit };
