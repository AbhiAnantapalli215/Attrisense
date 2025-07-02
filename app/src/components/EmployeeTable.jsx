// components/EmployeeTable.js
import PropTypes from 'prop-types';
import { FiEye, FiPlus, FiUser } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

const departmentMap = {
  'Sales': { display: 'Sales', class: 'sales' },
  'Research & Development': { display: 'R&D', class: 'r-d' },
  'Human Resources': { display: 'HR', class: 'hr' },
};
const roleMap = {
  'Healthcare Representative': { display: 'Healthcare Rep', class: 'healthcare-rep' },
  'Human Resources': { display: 'HR', class: 'human-resources' },
  'Laboratory Technician': { display: 'Lab Tech', class: 'lab-tech' },
  'Manager': { display: 'Manager', class: 'manager' },
  'Manufacturing Director': { display: 'Manufacturing Dir', class: 'manufacturing-director' },
  'Research Director': { display: 'R&D Director', class: 'research-director' },
  'Research Scientist': { display: 'Researcher', class: 'research-scientist' },
  'Sales Executive': { display: 'Sales Exec', class: 'sales-executive' },
  'Sales Representative': { display: 'Sales Rep', class: 'sales-rep' },
};

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
            <EmployeeRow key={employee.id} employee={employee} addToMonitor={addToMonitor} onSelectProfile={onSelectProfile}/>
          ))}
        </tbody>
      </table>
    </div>
  );
}

EmployeeTable.propTypes = {
  employees: PropTypes.array.isRequired,
  addToMonitor: PropTypes.func.isRequired,
  onSelectProfile: PropTypes.func.isRequired
};

function EmployeeRow({ employee, addToMonitor}) {
  const navigate = useNavigate();
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
      <td className="emp-id">{employee.id}</td>
      <td className="emp-dept">
        <span className={`dept-label ${dept.class}`}>{dept.display}</span>
      </td>
      <td className="emp-role">
        <span className={`role-label ${role.class}`}>{role.display}</span>
      </td>
      <td className="emp-actions">
        <div className="emp-dash">
          <ActionButton icon={<FiUser />} label="Profile" onClick={() => navigate(`/profile/${employee.id}`)}/>
          <ActionButton icon={<FiEye />} label="View" onClick={() => navigate(`/dashboard/${employee.id}`)}/>
          <ActionButton icon={<FiPlus />} label="Add" onClick={() => addToMonitor(employee.id)} />
        </div>
      </td>
    </tr>
  );
}

EmployeeRow.propTypes = {
  employee: PropTypes.object.isRequired,
  addToMonitor: PropTypes.func.isRequired,
};


function ActionButton({ icon, label, onClick }) {
  return (
    <button type="button" onClick={onClick}>
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
  onClick: PropTypes.func.isRequired
};
