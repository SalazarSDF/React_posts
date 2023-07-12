import "./Pagination.css";
type TPagination = {
  maxPages: number;
  activePage: number;
  changePage: (index: number) => void;
};
const Pagination = ({ maxPages, activePage, changePage }: TPagination) => {
  return (
    <div className="pagination">
      {new Array(maxPages).fill(null).map((_, index) => (
        <button
          key={index}
          onClick={() => changePage(index + 1)}
          className={`pagination__item ${
            activePage === index + 1 ? "active" : ""
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
