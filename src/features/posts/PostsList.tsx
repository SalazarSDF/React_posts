import { useState } from "react";
import { useSelector } from "react-redux";
import {
  TPost,
  getFilterOptions,
  getPostsStatus,
  getSortOption,
} from "./postsSlice";
import { Spinner } from "../../components/Spiner";
import { getAllPosts } from "./postsSlice";
import Post from "./Post";
import "./PostsList.css";
import Pagination from "../../components/Pagination";
import PostsConfig from "../../components/PostsConfig";
import filterAndSortPosts from "../../utils/filterAndSortPosts";
import { getAllUsers } from "../users/usersSlice";

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
  const users = useSelector(getAllUsers);
  const filterOptions = useSelector(getFilterOptions);
  const sortOption = useSelector(getSortOption);
  const [activePage, setActivePage] = useState<number>(1);
  const [maxPostsOnPage, setMaxPostsOnPage] = useState(() => {
    const value = localStorage.getItem("maxPostsOnPage");
    return value ? Number(value) : 10;
  });
  let isFilterOrSort = false;
  if (filterOptions || sortOption) {
    isFilterOrSort = true;
  }
  const filteredPosts = isFilterOrSort
    ? filterAndSortPosts({ posts, users, filterOptions, sortOption })
    : posts;
  const getSplitedPosts = splitPosts(filteredPosts, maxPostsOnPage);
  let activePosts = getSplitedPosts[activePage - 1];

  if (getSplitedPosts.length === 0 && postsStatus !== "loading")
    return (
      <section className="posts_list">
        <h2 className="posts_list__header">Posts</h2>
        <PostsConfig
          maxPostsOnPage={maxPostsOnPage}
          handleOptionChange={handleOptionChange}
        />
        <h1>Нет Постов.. =(</h1>
      </section>
    );

  if (!activePosts && postsStatus !== "loading") {
    activePosts = getSplitedPosts[getSplitedPosts.length - 1];
    setActivePage(getSplitedPosts.length);
  }

  function handleOptionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setActivePage(1);
    setMaxPostsOnPage(Number(e.target.value));
    localStorage.setItem("maxPostsOnPage", e.target.value);
  }
  return (
    <section className="posts_list">
      <h2 className="posts_list__header">Posts</h2>
      <PostsConfig
        maxPostsOnPage={maxPostsOnPage}
        handleOptionChange={handleOptionChange}
      />

      {postsStatus === "loading" ? (
        <Spinner></Spinner>
      ) : (
        <>
          <Pagination
            maxPages={getSplitedPosts.length}
            activePage={activePage}
            changePage={(i: number) => setActivePage(i)}
          />

          <ul>
            {activePosts.map((el) => (
              <Post key={el.id} post={el} />
            ))}
          </ul>

          <Pagination
            maxPages={getSplitedPosts.length}
            activePage={activePage}
            changePage={(i: number) => setActivePage(i)}
          />
        </>
      )}
    </section>
  );
};
