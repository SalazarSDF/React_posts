import { useState, ChangeEvent } from "react";
import { getAllUsers } from "../features/users/usersSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import {
  changeFilterOption,
  changeSortOption,
} from "../features/posts/postsSlice";
import { TPostData } from "../features/posts/postsSlice";

const PostFiltersAndSort = () => {
  const [postFilter, setPostFilter] = useState<string>("");
  const [favoriteFilter, setFavoriteFilter] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const users = useSelector(getAllUsers);

  const handlePostNameFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPostFilter(event.target.value);
    dispatch(
      changeFilterOption({ option: { filterByPostName: event.target.value } })
    );
  };

  const handleUserNameFilterChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const userId =
      event.target.value === "all" ? "all" : Number(event.target.value);
    dispatch(
      changeFilterOption({
        option: { filterByUserName: userId },
      })
    );
  };

  const handleFavoriteFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFavoriteFilter(event.target.checked);
    dispatch(
      changeFilterOption({
        option: { filterByFavorites: event.target.checked },
      })
    );
  };

  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const sortOption = event.target.value as TPostData["sortOption"];
    console.log("Sorting by:", sortOption);
    dispatch(changeSortOption({ option: sortOption }));
  };

  return (
    <div>
      <div>
        <label>Filter by Post Name:</label>
        <input
          type="text"
          value={postFilter}
          onChange={handlePostNameFilterChange}
        />
      </div>
      <div>
        <label>Filter by User Name:</label>
        <select onChange={handleUserNameFilterChange}>
          <option value="all">All</option>
          {users.map((user) => (
            <option
              key={user.id}
              value={user.id}
            >{`${user.firstName} ${user.lastName}`}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Filter by Favorites:</label>
        <input
          type="checkbox"
          checked={favoriteFilter}
          onChange={handleFavoriteFilterChange}
        />
      </div>
      <div>
        <label>Sort by:</label>
        <select onChange={handleSortChange}>
          <option value="idAsc">ID Ascending</option>
          <option value="idDesc">ID Descending</option>
          <option value="titleAsc">Title Ascending</option>
          <option value="titleDesc">Title Descending</option>
          <option value="userAsc">Username Ascending</option>
          <option value="userDesc">Username Descending</option>
          <option value="FavFirst">Favorites First</option>
          <option value="FavLast">Favorites Last</option>
        </select>
      </div>
      {/* Render the list of posts */}
      {/* Implement logic to filter and sort the posts based on the selected filters */}
    </div>
  );
};

export default PostFiltersAndSort;
