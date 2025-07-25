import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useSnackbar } from 'notistack';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [lastDocs, setLastDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const capitalizeWords = (term) =>
    term
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

  const fetchEmployees = async (pageDirection = 0) => {
    if (loading) return;
    setLoading(true);

    try {
      let q = query(collection(db, 'employeelist'), orderBy('EmployeeNumber'), limit(15));

      if (selectedDepartment && selectedDepartment !== 'all') {
        q = query(q, where('Department', '==', selectedDepartment));
      }
      if (selectedJobRole && selectedJobRole !== 'all') {
        q = query(q, where('JobRole', '==', selectedJobRole));
      }
      if (selectedStatus && selectedStatus !== 'all') {
        q = query(q, where('Attrition', '==', selectedStatus));
      }

      if (pageDirection === 1 && lastDocs[currentPage]) {
        q = query(q, startAfter(lastDocs[currentPage]));
      } else if (pageDirection === -1 && currentPage > 1) {
        q = query(q, startAfter(lastDocs[currentPage - 2]));
      }

      const snapshot = await getDocs(q);
      setEmployees(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setHasMore(snapshot.docs.length === 15);

      if (pageDirection === 1) {
        setLastDocs((prev) => [...prev.slice(0, currentPage + 1), snapshot.docs.at(-1)]);
        setCurrentPage((prev) => prev + 1);
      } else if (pageDirection === -1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        setLastDocs(snapshot.docs.length > 0 ? [snapshot.docs.at(-1)] : []);
        setCurrentPage(0);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      resetSearch();
      return;
    }

    setLoading(true);
    setSearchMode(true);

    try {
      let q;
      if (/^\d+$/.test(searchTerm)) {
        q = query(collection(db, 'employeelist'), where('EmployeeNumber', '==', parseInt(searchTerm.trim())));
      } else {
        const formatted = capitalizeWords(searchTerm);
        q = query(
          collection(db, 'employeelist'),
          orderBy('Name'),
          where('Name', '>=', formatted),
          where('Name', '<=', formatted + '\uf8ff')
        );
      }

      if (selectedDepartment && selectedDepartment !== 'all') {
        q = query(q, where('Department', '==', selectedDepartment));
      }
      if (selectedJobRole && selectedJobRole !== 'all') {
        q = query(q, where('JobRole', '==', selectedJobRole));
      }
      if (selectedStatus && selectedStatus !== 'all') {
        q = query(q, where('Attrition', '==', selectedStatus));
      }

      q = query(q, limit(15));

      const snapshot = await getDocs(q);
      setEmployees(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setHasMore(false);
      setLastDocs([]);
      setCurrentPage(0);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    setSearchMode(false);
    setSelectedDepartment('');
    setSelectedJobRole('');
    setSelectedStatus('');
    fetchEmployees(0);
  };
  
  const addToMonitor = async (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
      enqueueSnackbar('Employee data not found.', { variant: 'error' });
      return;
    }
    if (employee.Attrition === "Yes") {
      enqueueSnackbar('Employee already left the Company.', { variant: 'error' });
      return;
    }
    const userDc = await getDoc(doc(db, 'monitor', String(employee.EmployeeNumber)));
    if (userDc.exists()) {
      enqueueSnackbar('Employee is already under monitoring.', { variant: 'info' });
      return;
    }
    try {
      const now = new Date().toISOString();
      const user = auth.currentUser;
      let addedBy = '0';

      if (user) {
        const userDoc = await getDoc(doc(db, 'userData', user.uid));
        if (userDoc.exists()) {
          addedBy = userDoc.data().EmployeeNumber || '0';
        }
      }
      addedBy = parseInt(addedBy, 10);

      const monitorData = {
        EmployeeNumber: employee.EmployeeNumber,
        Name: employee.Name,
        RiskScore: employee?.monitor?.prediction || null,
        Department: employee.Department,
        addedBy,
        addedAt: now,
        status: 'reviewed',
        remarks: ''
      };

      const monitorRef = doc(db, 'monitor', String(employeeId));
      await setDoc(monitorRef, monitorData);

      enqueueSnackbar('Employee added to monitor.', { variant: 'success' });
    } catch (error) {
      console.error('Error adding to monitor:', error);
      enqueueSnackbar('Failed to add employee to monitor.', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (searchMode && searchTerm) {
      handleSearch();
    } else {
      fetchEmployees(0);
    }
  }, [searchMode, searchTerm, selectedDepartment, selectedJobRole, selectedStatus]);

  return {
    employees,
    loading,
    hasMore,
    searchTerm,
    setSearchMode,
    searchMode,
    currentPage: currentPage + 1,
    setSearchTerm,
    handleSearch,
    resetSearch,
    handleNextPage: () => hasMore && fetchEmployees(1),
    handlePrevPage: () => currentPage > 0 && fetchEmployees(-1),
    canGoBack: currentPage > 0,
    addToMonitor,
    setSelectedDepartment,
    setSelectedJobRole,
    setSelectedStatus
  };
}
