// import PropTypes from 'prop-types';

// export function PaginationControls({ 
//   loading, 
//   hasMore, 
//   currentPage,
//   canGoBack,
//   handleNextPage, 
//   handlePrevPage,
//   searchMode 
// }) {
//   // Don't show pagination controls in search mode
//   if (searchMode) return null;

//   return (
//     <div className="pagination-controls">
//       <button
//         onClick={handlePrevPage}
//         disabled={!canGoBack || loading}
//         className="pagination-button prev"
//       >
//         Prev
//       </button>
      
//       <span className="page-indicator"> {currentPage} </span>
      
//       <button
//         onClick={handleNextPage}
//         disabled={!hasMore || loading}
//         className="pagination-button next"
//       >
//         Next
//       </button>

//       {loading && <div className="loading-indicator">Loading...</div>}
//     </div>
//   );
// }

// PaginationControls.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   hasMore: PropTypes.bool.isRequired,
//   currentPage: PropTypes.number.isRequired,
//   canGoBack: PropTypes.bool.isRequired,
//   handleNextPage: PropTypes.func.isRequired,
//   handlePrevPage: PropTypes.func.isRequired,
//   searchMode: PropTypes.bool.isRequired
// };
import PropTypes from 'prop-types';

export function PaginationControls({ 
  loading, 
  hasMore, 
  currentPage,
  canGoBack,
  handleNextPage, 
  handlePrevPage,
  searchMode 
}) {
  // Don't show pagination controls in search mode
  if (searchMode) return null;

  return (
    <div className="pagination-controls">
      <button
        onClick={handlePrevPage}
        disabled={!canGoBack || loading}
        className="pagination-button"
      >
        ‹
      </button>

      <span className="page-indicator">{currentPage}</span>

      <button
        onClick={handleNextPage}
        disabled={!hasMore || loading}
        className="pagination-button"
      >
        ›
      </button>

      {loading && <div className="loading-indicator">Loading...</div>}
    </div>
  );
}

PaginationControls.propTypes = {
  loading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  currentPage: PropTypes.number.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  handleNextPage: PropTypes.func.isRequired,
  handlePrevPage: PropTypes.func.isRequired,
  searchMode: PropTypes.bool.isRequired,
};
