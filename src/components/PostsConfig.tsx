import PostFiltersAndSort from "./PostFilterAndSort";
import AddNewUserForm from "./AddNewUserForm";
import "./PostsConfig.css";

const PostsConfig = ({
  handleOptionChange,
  maxPostsOnPage,
}: {
  handleOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  maxPostsOnPage: number;
}) => {
  return (
    <div className="posts_list__config">
      <div className="posts_list__posts-limit">
        <div>
          <label htmlFor="postLimit">количество выводимых постов: </label>
          <select
            className="default-fields default-fields_select"
            id="postLimit"
            onChange={(e) => handleOptionChange(e)}
            value={maxPostsOnPage}
          >
            <option className="default-fields_select_option" value={10}>
              10
            </option>
            <option className="default-fields_select_option" value={20}>
              20
            </option>
            <option className="default-fields_select_option" value={50}>
              50
            </option>
            <option className="default-fields_select_option" value={100}>
              100
            </option>
          </select>
        </div>

        <AddNewUserForm />
      </div>
      <PostFiltersAndSort />
    </div>
  );
};

export default PostsConfig;
