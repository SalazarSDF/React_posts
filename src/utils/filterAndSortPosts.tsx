import { TPost } from "../features/posts/postsSlice";
import { TPostData } from "../features/posts/postsSlice";

//TODO:  Sort by userAsc userDesc
function sortPosts({
  posts,
  sortOption,
}: {
  posts: TPost[];
  sortOption: TPostData["sortOption"];
}) {
  if (!sortOption) return posts;
  switch (sortOption) {
    case "idAsc":
      return posts.sort((a, b) => a.id - b.id);
    case "idDesc":
      return posts.sort((a, b) => b.id - a.id);
    case "titleAsc":
      return posts.sort((a, b) => a.title.localeCompare(b.title));
    case "titleDesc":
      return posts.sort((a, b) => b.title.localeCompare(a.title));
    case "userAsc":
      // return posts.sort((a, b) => a.username.localeCompare(b.username));
      return posts;
    case "userDesc":
      //return posts.sort((a, b) => b.username.localeCompare(a.username));
      return posts;
    case "FavFirst":
      return posts.sort((a, b) => {
        if (a.selected === true && b.selected === false) {
          return -1; // a comes before b
        } else if (a.selected === false && b.selected === true) {
          return 1; // b comes before a
        } else {
          return 0; // no change in order
        }
      });
    case "FavLast":
      return posts.sort((a, b) => {
        if (a.selected === true && b.selected !== true) {
          return 1; // b comes before a
        } else if (a.selected !== true && b.selected === true) {
          return -1; // a comes before b
        } else {
          return 0; // no change in order
        }
      });
    default:
      return posts;
  }
}

function matchCase(value: string, regex: RegExp): boolean {
  return regex.test(value);
}

//TODO: add filterByUserName
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
  if (filterByPostName) {
    const searchRegex = new RegExp(filterByPostName.trim(), "i");

    filteredPosts = filteredPosts.filter(({ title }) =>
      matchCase(title, searchRegex)
    );
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
}: {
  posts: TPost[];
  filterOptions: TPostData["filterOptions"];
  sortOption: TPostData["sortOption"];
}): TPost[] {
  const filteredPosts = filterPosts({ posts, filterOptions });
  const sortedPosts = sortPosts({ posts: filteredPosts, sortOption });
  return sortedPosts;
}

export default filterAndSortPosts;
