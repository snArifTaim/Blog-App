import { ApolloClient, InMemoryCache, ApolloLink, Observable, makeVar } from '@apollo/client';

// Reactive Variable for Favorites
export const favoritePostsVar = makeVar([]);

// Mock Data Generation
const generatePosts = () => {
    const posts = [];
    for (let i = 1; i <= 50; i++) {
        posts.push({
            id: i.toString(),
            title: `Post Title ${i}`,
            body: `This is the body of post ${i}. It contains some sample text to demonstrate the layout and design of the blog post.`,
            likes: Math.floor(Math.random() * 100),
        });
    }
    return posts;
};

const MOCK_POSTS = generatePosts();

// Custom Mock Link
const mockLink = new ApolloLink((operation) => {
    return new Observable((observer) => {
        const { operationName, variables } = operation;

        setTimeout(() => {
            try {
                if (operationName === 'GetPosts') {
                    const { page = 1, limit = 10 } = variables;
                    const start = (page - 1) * limit;
                    const end = start + limit;
                    const posts = MOCK_POSTS.slice(start, end);

                    observer.next({
                        data: {
                            posts: posts,
                        },
                    });
                } else if (operationName === 'GetPost') {
                    const { id } = variables;
                    const post = MOCK_POSTS.find((p) => p.id === id);
                    observer.next({
                        data: {
                            post: post || null,
                        },
                    });
                } else if (operationName === 'LikePost') {
                    // Fake mutation
                    const { id } = variables;
                    const post = MOCK_POSTS.find((p) => p.id === id);
                    if (post) {
                        // In a real app, we'd update the server. Here we just return success.
                    }
                    observer.next({
                        data: {
                            likePost: {
                                id,
                                success: true
                            }
                        }
                    })
                }
                else {
                    observer.error(new Error(`Unknown operation: ${operationName}`));
                }
                observer.complete();
            } catch (e) {
                observer.error(e);
            }
        }, 800); // Simulate network delay
    });
});

// Cache Setup
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                posts: {
                    keyArgs: false, // Allow merging for pagination
                    merge(existing = [], incoming, { args }) {
                        // Simple append logic. 
                        // If page 1 (or no args), reset? 
                        // Actually, for infinite scroll, we usually just append.
                        // But if we refresh, we might want to replace.
                        // For this assignment, simple append is usually enough, 
                        // but let's be safer: if page is 1, replace.
                        const page = args?.page || 1;
                        if (page === 1) return incoming;
                        return [...existing, ...incoming];
                    },
                },
            },
        },
    },
});

const client = new ApolloClient({
    link: mockLink,
    cache: cache,
});

export default client;
