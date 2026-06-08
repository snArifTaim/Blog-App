// Mock data service - replaces Apollo Client for this demo app
const MOCK_POSTS = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  title: `Post ${i + 1}`,
  body: `This is the content of post ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  likes: Math.floor(Math.random() * 100),
}));

export const getPosts = async (page = 1, limit = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const posts = MOCK_POSTS.slice(start, start + limit);
      const total = MOCK_POSTS.length;
      resolve({
        posts,
        total,
        hasMore: start + limit < total,
      });
    }, 500);
  });
};

export const getPost = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = MOCK_POSTS.find((p) => p.id === id);
      resolve(post || null);
    }, 300);
  });
};

export const updatePostLikes = async (id, newLikes) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = MOCK_POSTS.find((p) => p.id === id);
      if (post) {
        post.likes = newLikes;
      }
      resolve({ success: true });
    }, 200);
  });
};
