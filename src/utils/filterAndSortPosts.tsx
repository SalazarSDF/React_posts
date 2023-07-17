import { TPost } from "../features/posts/postsSlice";
import { TPostData } from "../features/posts/postsSlice";
import { TUser } from "../features/users/usersSlice";

function sortPosts({
  posts,
  sortOption,
}: {
  posts: TPost[];
  sortOption: TPostData["sortOption"];
}) {
  if (!sortOption) return posts;
  const sortedPosts = [...posts];
  switch (sortOption) {
    case "idAsc":
      return sortedPosts.sort((a, b) => a.id - b.id);
    case "idDesc":
      return sortedPosts.sort((a, b) => b.id - a.id);
    case "titleAsc":
      return sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
    case "titleDesc":
      return sortedPosts.sort((a, b) => b.title.localeCompare(a.title));
    case "userAsc":
      return sortedPosts.sort((a, b) =>
        (a.userName || "").localeCompare(b.userName || "")
      );
    case "userDesc":
      return sortedPosts.sort((a, b) => {
        const result = (b.userName || "").localeCompare(a.userName || "");
        return result;
      });
    case "FavFirst":
      return sortedPosts.sort((a, b) => {
        if (a.favorite === true && b.favorite === false) {
          return -1; // a comes before b
        } else if (a.favorite === false && b.favorite === true) {
          return 1; // b comes before a
        } else {
          return 0; // no change in order
        }
      });
    case "FavLast":
      return sortedPosts.sort((a, b) => {
        if (a.favorite === true && b.favorite !== true) {
          return 1; // b comes before a
        } else if (a.favorite !== true && b.favorite === true) {
          return -1; // a comes before b
        } else {
          return 0; // no change in order
        }
      });
    default:
      return sortedPosts;
  }
}

function matchCase(value: string, regex: RegExp): boolean {
  return regex.test(value);
}

function filterPosts({
  posts,
  filterOptions,
}: {
  posts: TPost[];
  filterOptions: TPostData["filterOptions"];
}): TPost[] {
  if (!filterOptions) return posts;
  const { filterByPostName, filterByUserName, filterByFavorites } =
    filterOptions;
  if (!filterByPostName && !filterByUserName && !filterByFavorites) {
    return posts;
  }
  let filteredPosts = [...posts];

  if (filterByPostName || filterByPostName === "") {
    const searchRegex = new RegExp(filterByPostName.trim(), "i");
    filteredPosts = filteredPosts.filter(({ title }) =>
      matchCase(title, searchRegex)
    );
  }
  if (filterByUserName) {
    if (filterByUserName !== "all") {
      filteredPosts = filteredPosts.filter(
        (post) => post.userId === filterByUserName
      );
    }
  }
  if (filterByFavorites) {
    filteredPosts = filteredPosts.filter((post) => post.favorite === true);
  }

  return filteredPosts;
}

function filterAndSortPosts({
  posts,
  filterOptions,
  sortOption,
  users,
}: {
  posts: TPost[];
  filterOptions: TPostData["filterOptions"];
  sortOption: TPostData["sortOption"];
  users: TUser[];
}): TPost[] {
  const postsWithUsers = posts.map((post) => {
    const postUser = users.find((user) => user.id === post.userId);
    if (!postUser) return post;
    const postUserName = `${postUser.firstName} ${postUser.lastName}`;
    return post.userName ? post : { ...post, userName: postUserName };
  });
  const filteredPosts = filterPosts({ posts: postsWithUsers, filterOptions });
  const sortedPosts = sortPosts({ posts: filteredPosts, sortOption });
  return sortedPosts;
}

export default filterAndSortPosts;
