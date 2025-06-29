import PropTypes from 'prop-types';

export function SearchBar({
  searchTerm,
  setSearchTerm,
  handleSearch,
  searchMode,
  resetSearch
}) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by name or ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch}>Search</button>
      {searchMode && (
        <button onClick={resetSearch} className="reset-btn">
          Show All
        </button>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  searchMode: PropTypes.bool.isRequired,
  resetSearch: PropTypes.func.isRequired
};