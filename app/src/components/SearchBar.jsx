import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from 'react';

// ✅ Department options
const Departments = [
  { value: "all", label: "All Departments" },
  { value: "Research & Development", label: "R&D" },
  { value: "Sales", label: "Sales" },
  { value: "Human Resources", label: "HR" },
];

// ✅ attrition options (unchanged)
const attrition = [
  { value: "all", label: "All" },
  { value: "No", label: "Present" },
  { value: "Yes", label: "Left" },
];

// ✅ Job roles map
const jobRoleMap = {
  "Research & Development": [
    "Healthcare Representative",
    "Laboratory Technician",
    "Manager",
    "Manufacturing Director",
    "Research Director",
    "Research Scientist"
  ],
  "Sales": [
    "Manager",
    "Sales Executive",
    "Sales Representative"
  ],
  "Human Resources": [
    "Human Resources",
    "Manager"
  ]
};

export function SearchBar({
  searchTerm,
  setSearchTerm,
  handleSearch,
  searchMode,
  resetSearch
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Get current filter values from URL
  const filter1 = searchParams.get('department') || '';
  const filter2 = searchParams.get('jobRole') || '';
  const filter3 = searchParams.get('attrition') || '';
  const urlSearchTerm = searchParams.get('search') || '';

  // ✅ Keep input synced with URL
  useEffect(() => {
    if (urlSearchTerm && searchTerm !== urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [urlSearchTerm]);

  // ✅ Dynamically generate job roles
  const selectedDepartment = filter1;
  let jobRolesOptions = [{ value: "all", label: "All JobRoles" }];

  if (selectedDepartment && selectedDepartment !== 'all') {
    const roles = jobRoleMap[selectedDepartment] || [];
    jobRolesOptions = [
      { value: "all", label: "All JobRoles" },
      ...roles.map(role => ({ value: role, label: role }))
    ];
  } else {
    // If no department selected, show all unique roles
    const allRoles = Array.from(new Set(Object.values(jobRoleMap).flat()));
    jobRolesOptions = [
      { value: "all", label: "All JobRoles" },
      ...allRoles.map(role => ({ value: role, label: role }))
    ];
  }

  // ✅ Update filters in URL
  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value === '' || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }

    // If changing department, reset jobRole
    if (key === 'department') {
      newParams.delete('jobRole');
    }

    setSearchParams(newParams);
  };

  // ✅ Update search in URL
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  // ✅ Reset everything
  const handleResetAll = () => {
    setSearchParams({});
    setShowFilters(false);
  };

  const handleClearSearchTerm = () => {
    setSearchTerm('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const filtersActive = filter1 !== '' || filter2 !== '' || filter3 !== '';

  return (
    <div className='top-container'>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name / ID"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />

        {searchMode && (
          <button
            type="button"
            className="clear-btn"
            onClick={handleClearSearchTerm}
            aria-label="Clear search"
          >
            <IoClose />
          </button>
        )}

        <FaFilter onClick={() => setShowFilters(!showFilters)} className="filter-icon" />
      </div>

      {showFilters && (
        <div className='filter-container'>
          <select
            id="filter1"
            value={filter1}
            onChange={(e) => handleFilterChange('department', e.target.value)}
          >
            {Departments.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            id="filter2"
            value={filter2}
            onChange={(e) => handleFilterChange('jobRole', e.target.value)}
          >
            {jobRolesOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            id="filter3"
            value={filter3}
            onChange={(e) => handleFilterChange('attrition', e.target.value)}
          >
            {attrition.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      )}

      {filtersActive && (
        <div className='reset-container'>
          <button type="button" onClick={handleResetAll}>Reset</button>
        </div>
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
