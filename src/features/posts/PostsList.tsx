import { useState } from "react";
import { useSelector } from "react-redux";
import { TPost, getPostsStatus } from "./postsSlice";
import { Spinner } from "../../components/Spiner";
import { selectAllPosts } from "./postsSlice";
import Post from "./Post";
import "./PostsList.css";
import Pagination from "../../components/Pagination";

function splitPosts(posts: TPost[], maxPages: number) {
  return posts.reduce((acc, val, i) => {
    const idx = Math.floor(i / maxPages);
    const page = acc[idx] || (acc[idx] = []);
    page.push(val);
    return acc;
  }, [] as Array<TPost[]>);
}

export const PostsList = () => {
  const postsStatus = useSelector(getPostsStatus);
  const posts = useSelector(selectAllPosts);
  const [activePage, setActivePage] = useState<number>(1);
  const [maxPostsOnPage, setMaxPostsOnPage] = useState(10);
  const activePosts = splitPosts(posts, maxPostsOnPage);

  return (
    <section className="posts_list">
      <h2 className="posts_list__header">Posts</h2>
      {postsStatus === "loading" ? (
        <Spinner></Spinner>
      ) : (
        <>
          <div>
            <h3>количество выводимых постов</h3>
            <select onChange={(e) => setMaxPostsOnPage(Number(e.target.value))}>
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <Pagination
            maxPages={activePosts.length}
            activePage={activePage}
            changePage={(i: number) => setActivePage(i)}
          />
          <ul>
            {activePosts[activePage - 1].map((el) => (
              <Post key={el.id} post={el} />
            ))}
          </ul>

          <Pagination
            maxPages={activePosts.length}
            activePage={activePage}
            changePage={(i: number) => setActivePage(i)}
          />
        </>
      )}
    </section>
  );
};
