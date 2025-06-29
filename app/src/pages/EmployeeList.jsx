import { useEmployees } from '../hooks/useEmployees';
import { SearchBar } from '../components/SearchBar';
import { EmployeeTable } from '../components/EmployeeTable';
import { PaginationControls } from '../components/PaginationControls';
export default function EmployeeList() {
  const {
    employees,
    loading,
    hasMore,
    searchTerm,
    searchMode,
    currentPage,
    canGoBack,
    addToMonitor,
    setSearchTerm,
    handleSearch,
    resetSearch,
    handleNextPage,
    handlePrevPage
  } = useEmployees();
  return (
    <div className="employee-list-container">
      <h1>Employee Directory</h1>
      
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        searchMode={searchMode}
        resetSearch={resetSearch}
      />

      <EmployeeTable employees={employees} addToMonitor={addToMonitor}/>

      {!loading && employees.length === 0 && (
        <div className="no-results">No employees found</div>
      )}

      <PaginationControls 
        loading={loading}
        hasMore={hasMore}
        currentPage={currentPage}
        canGoBack={canGoBack}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        searchMode={searchMode}
      />
    </div>
  );
}