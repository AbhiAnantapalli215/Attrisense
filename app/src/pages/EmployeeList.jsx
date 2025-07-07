// ✅ pages/EmployeeList.jsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import { SearchBar } from '../components/SearchBar';
import { EmployeeTable } from '../components/EmployeeTable';
import { PaginationControls } from '../components/PaginationControls';

export default function EmployeeList() {
  const [searchParams] = useSearchParams();
  const {
    employees,
    searchTerm,
    setSearchTerm,
    handleSearch,
    resetSearch,
    setSearchMode,
    searchMode,
    loading,
    hasMore,
    currentPage,
    canGoBack,
    handleNextPage,
    handlePrevPage,
    setSelectedDepartment,
    setSelectedJobRole,
    setSelectedStatus,
    addToMonitor
  } = useEmployees();

  useEffect(() => {
    setSelectedDepartment(searchParams.get('department') || '');
    setSelectedJobRole(searchParams.get('jobRole') || '');
    setSelectedStatus(searchParams.get('attrition') || '');

    const search = searchParams.get('search') || '';
    if (search) {
      setSearchTerm(search);
      setSearchMode(true);
    } else {
      setSearchTerm('');
      setSearchMode(false);
    }
  }, [searchParams]);

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
      <EmployeeTable employees={employees} addToMonitor={addToMonitor} />
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
