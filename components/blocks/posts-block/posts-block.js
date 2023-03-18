import PostList from './post-list';

export default function PostsBlock({ data: { title, posts } }) {
  return (
    <section>
      {title && <h2>{title}</h2>}

      {posts && (
        <PostList posts={posts} />
      )}
    </section>
  );
}
