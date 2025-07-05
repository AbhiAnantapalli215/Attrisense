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
  if (searchMode) return null;

  return (
    <div className='bottom-pit'>
      <div>
        {loading && <div className="loading-indicator">Loading...</div>}
      </div>
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

      </div>
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
