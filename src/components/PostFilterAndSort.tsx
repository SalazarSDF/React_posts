import { useState, ChangeEvent } from "react";
import { getAllUsers } from "../features/users/usersSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import {
  changeFilterOption,
  changeSortOption,
} from "../features/posts/postsSlice";
import { TPostData } from "../features/posts/postsSlice";
import "./PostFilterAndSort.css";

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
    dispatch(changeSortOption({ option: sortOption }));
  };

  return (
    <div className="posts_list__filter-and-sort">
      <div>
        <label>Фильтр по заголовку:</label>
        <input
          className="default-fields"
          type="text"
          value={postFilter}
          onChange={handlePostNameFilterChange}
        />
      </div>
      <div>
        <label>Фильтр по имени юзера:</label>
        <select
          className="default-fields default-fields_select"
          onChange={handleUserNameFilterChange}
        >
          <option
            className="default-fields default-fields_select_option"
            value="all"
          >
            All
          </option>
          {users.map((user) => (
            <option
              className="default-fields default-fields_select_option"
              key={user.id}
              value={user.id}
            >{`${user.firstName} ${user.lastName}`}</option>
          ))}
        </select>
      </div>
      <div className="posts_list__filter-and-sort_checkbox_container">
        <label>Только избранные?</label>
        <input
          className="posts_list__filter-and-sort_checkbox"
          type="checkbox"
          checked={favoriteFilter}
          onChange={handleFavoriteFilterChange}
        />
      </div>
      <div>
        <label>Сортировать по:</label>
        <select
          className="default-fields default-fields_select"
          onChange={handleSortChange}
        >
          <option
            className="default-fields default-fields_select_option"
            value="idAsc"
          >
            ID Ascending
          </option>
          <option
            className="default-fields default-fields_select_option"
            value="idDesc"
          >
            ID Descending
          </option>
          <option
            className="default-fields default-fields_select_option"
            value="titleAsc"
          >
            Title Ascending
          </option>
          <option
            className="default-fields default-fields_select_option"
            value="titleDesc"
          >
            Title Descending
          </option>
          <option
            className="default-fields default-fields_select_option"
            value="userAsc"
          >
            Username Ascending
          </option>
          <option
            className="default-fields default-fields_select_option"
            value="userDesc"
          >
            Username Descending
          </option>
          <option
            className="default-fields default-fields_select_option"
            value="FavFirst"
          >
            Favorites First
          </option>
          <option
            className="default-fields default-fields_select_option"
            value="FavLast"
          >
            Favorites Last
          </option>
        </select>
      </div>
    </div>
  );
};

export default PostFiltersAndSort;
