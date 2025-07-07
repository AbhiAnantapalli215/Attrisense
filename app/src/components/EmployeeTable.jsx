// components/EmployeeTable.js
import PropTypes from 'prop-types';
import { FiEye, FiPlus, FiUser } from 'react-icons/fi';
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ListPage() {
  const [searchParams] = useSearchParams();

  return (
    <div>
      {employees.map(emp => (
        <Link
          key={emp.id}
          to={`/profile/${emp.id}?${searchParams.toString()}`}
        >
          View Profile
        </Link>
      ))}
    </div>
  );
}

// Department display map
const departmentMap = {
  'Sales': { display: 'Sales', class: 'sales' },
  'Research & Development': { display: 'R&D', class: 'r-d' },
  'Human Resources': { display: 'HR', class: 'hr' },
};

// Role display map
const roleMap = {
  'Healthcare Representative': { display: 'Healthcare Rep', class: 'healthcare-rep' },
  'Human Resources': { display: 'HR', class: 'human-resources' },
  'Laboratory Technician': { display: 'Lab Tech', class: 'lab-tech' },
  'Manager': { display: 'Manager', class: 'manager' },
  'Manufacturing Director': { display: 'Manufact Dir', class: 'manufacturing-director' },
  'Research Director': { display: 'R&D Director', class: 'research-director' },
  'Research Scientist': { display: 'Res Sci', class: 'research-scientist' },
  'Sales Executive': { display: 'Sales Exec', class: 'sales-executive' },
  'Sales Representative': { display: 'Sales Rep', class: 'sales-rep' },
};

// Helper function to format employee ID
function formatEmployeeId(id) {
  const padded = String(id).padStart(4, '0'); // always at least 4 digits
  return `EMP${padded}`;
}

export function EmployeeTable({ employees, addToMonitor, onSelectProfile }) {
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Department</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              addToMonitor={addToMonitor}
              onSelectProfile={onSelectProfile}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

EmployeeTable.propTypes = {
  employees: PropTypes.array.isRequired,
  addToMonitor: PropTypes.func.isRequired,
  onSelectProfile: PropTypes.func.isRequired,
};

function EmployeeRow({ employee, addToMonitor }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dept = departmentMap[employee.Department] || {
    display: employee.Department,
    class: employee.Department?.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  };

  const role = roleMap[employee.JobRole] || {
    display: employee.JobRole,
    class: employee.JobRole?.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  };

  return (
    <tr>
      <td className="emp-name">{employee.Name}</td>
      <td className="emp-id">{formatEmployeeId(employee.id)}</td>
      <td className="emp-dept">
        <span className={`dept-label ${dept.class}`}>{dept.display}</span>
      </td>
      <td className="emp-role">
        <span className={`role-label ${role.class}`}>{role.display}</span>
      </td>
      <td className="emp-actions">
        <div className="emp-dash">
          <ActionButton
            icon={<FiUser />}
            label="Profile"
            title="View Employee's Profile"
            onClick={() => navigate(`/profile/${employee.id}?${searchParams.toString()}`)}
          />
          <ActionButton
            icon={<FiEye />}
            label="View"
            title="View Employee's Dashboard"
            onClick={() => navigate(`/dashboard/${employee.id}?${searchParams.toString()}`)}
          />
          <ActionButton
            icon={<FiPlus />}
            label="Add"
            title="Add Employee to Monitor"
            onClick={() => addToMonitor(employee.id)}
          />
        </div>
      </td>
    </tr>
  );
}

EmployeeRow.propTypes = {
  employee: PropTypes.object.isRequired,
  addToMonitor: PropTypes.func.isRequired,
};

function ActionButton({ icon, label, title, onClick }) {
  return (
    <button type="button" onClick={onClick} title={title}>
      <div className="icon-wrapper">
        {icon}
        <span className="icon-label">{label}</span>
      </div>
    </button>
  );
}

ActionButton.propTypes = {
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string, // tooltip
  onClick: PropTypes.func.isRequired,
};
