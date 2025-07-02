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
  setDoc
} from 'firebase/firestore';
import { db,auth } from '../firebase';
import { useSnackbar } from 'notistack';
import { getDoc } from 'firebase/firestore';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [lastDocs, setLastDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { enqueueSnackbar } = useSnackbar();

  const fetchEmployees = async (pageDirection = 0) => {
    if (loading) return;
    setLoading(true);
    try {
      let q = query(collection(db, 'employeelist'), orderBy('EmployeeNumber'), limit(15));

      if (pageDirection === 1 && lastDocs[currentPage]) {
        q = query(q, startAfter(lastDocs[currentPage]));
      } else if (pageDirection === -1) {
        if (currentPage === 1) {
          q = query(collection(db, 'employeelist'), orderBy('EmployeeNumber'), limit(15));
        } else if (currentPage > 1) {
          q = query(q, startAfter(lastDocs[currentPage - 2]));
        }
      }

      const snapshot = await getDocs(q);
      const newEmployees = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEmployees(newEmployees);

      if (pageDirection === 1) {
        setLastDocs(prev => [...prev.slice(0, currentPage + 1), snapshot.docs[snapshot.docs.length - 1]]);
        setCurrentPage(prev => prev + 1);
      } else if (pageDirection === -1) {
        setCurrentPage(prev => prev - 1);
      } else {
        setLastDocs(snapshot.docs.length > 0 ? [snapshot.docs[snapshot.docs.length - 1]] : []);
        setCurrentPage(0);
      }

      setHasMore(snapshot.docs.length === 15);
    } catch (err) {
      console.error('Error fetching employees:', err);
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
        q = query(
          collection(db, 'employeelist'),
          orderBy('Name'),
          where('Name', '>=', searchTerm.trim()),
          where('Name', '<=', searchTerm.trim() + '\uf8ff'),
          limit(15)
        );
      }

      const snapshot = await getDocs(q);
      setEmployees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setHasMore(false);
      setLastDocs([]);
      setCurrentPage(0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchTerm('');
    setSearchMode(false);
    fetchEmployees(0);
  };

  const handleNextPage = () => {
    if (!hasMore) return;
    fetchEmployees(1);
  };

  const handlePrevPage = () => {
    if (currentPage <= 0) return;
    fetchEmployees(-1);
  };

  // ✅ Function to add employee to "monitor" collection
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

      // ✅ Get current user’s uid
      const user = auth.currentUser;
      let addedBy = '0'; // fallback if user not found

      if (user) {
        // Fetch their userData document
        const userDoc = await getDoc(doc(db, 'userData', user.uid));
        if (userDoc.exists()) {
          addedBy = userDoc.data().EmployeeNumber || '0';
        }
      }
      addedBy=parseInt(addedBy,10);
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
    if (!searchMode) {
      fetchEmployees(0);
    }
  }, [searchMode]);

  return {
    employees,
    loading,
    hasMore,
    searchTerm,
    searchMode,
    currentPage: currentPage + 1,
    setSearchTerm,
    handleSearch,
    resetSearch,
    handleNextPage,
    handlePrevPage,
    canGoBack: currentPage > 0,
    addToMonitor // ✅ make sure this is returned!
  };
}
