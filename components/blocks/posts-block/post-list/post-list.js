import styles from './post-list.module.scss';
import Post from './post';

export default function PostList({ posts }) {
  return (
    <>
      <ul className={styles.postList}>
        {posts?.map((post, index) => (
          <li key={index}>
            <Post data={post} />
          </li>
        ))}
      </ul>
    </>
  );
}