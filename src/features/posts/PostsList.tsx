import { useState } from "react";
import { useSelector } from "react-redux";
import { TPost, getPostsStatus } from "./postsSlice";
import { Spinner } from "../../components/Spiner";
import { getAllPosts } from "./postsSlice";
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
  const posts = useSelector(getAllPosts);
  const [activePage, setActivePage] = useState<number>(1);
  const [maxPostsOnPage, setMaxPostsOnPage] = useState(() => {
    const value = localStorage.getItem("maxPostsOnPage");
    return value ? Number(value) : 10;
  });
  const activePosts = splitPosts(posts, maxPostsOnPage);

  function handleOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setActivePage(1);
    setMaxPostsOnPage(Number(e.target.value));
    localStorage.setItem("maxPostsOnPage", e.target.value);
  }
  return (
    <section className="posts_list">
      <h2 className="posts_list__header">Posts</h2>
      {postsStatus === "loading" ? (
        <Spinner></Spinner>
      ) : (
        <>
          <div>
            <label htmlFor="postLimit">количество выводимых постов: </label>
            <select
              id="postLimit"
              onChange={(e) => handleOptionChange(e)}
              value={maxPostsOnPage}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
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
