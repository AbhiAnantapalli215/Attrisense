import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  TextField
} from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

// Function to get color by status
const getStatusColor = (status) => {
  switch (status) {
    case 'followed_up': return green[300];
    case 'reviewed': return orange[300];
    case 'active':
    default: return red[300];
  }
};

const Monitor = () => {
  const [hrNumber, setHrNumber] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [activeRemark, setActiveRemark] = useState(null);
  const [tempRemark, setTempRemark] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const docRef = doc(db, "userData", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHrNumber(docSnap.data().EmployeeNumber);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Fetch employees
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'monitor'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const statusOrder = { active: 0, reviewed: 1, followed_up: 2 };
      const sortedData = data.sort((a, b) => {
        const statusA = statusOrder[a.status] ?? 0;
        const statusB = statusOrder[b.status] ?? 0;
        return statusA !== statusB
          ? statusA - statusB
          : (b.RiskScore || 0) - (a.RiskScore || 0);
      });

      setEmployees(sortedData);
    };

    fetchData();
  }, []);

  const deleteEmployee = async (id) => {
    await deleteDoc(doc(db, 'monitor', id));
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    enqueueSnackbar(`Removed record ${id}`, { variant: 'info' });
  };

  const updateFields = async (id, updates) => {
    await updateDoc(doc(db, 'monitor', id), updates);
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
  };

  const handleAddRemark = (id) => {
    updateFields(id, {
      remarks: tempRemark,
      status: 'followed_up',
      addedBy: hrNumber
    });
    setActiveRemark(null);
    setTempRemark('');
  };

  const handleCancelRemark = () => {
    setActiveRemark(null);
    setTempRemark('');
  };

  const toggleReviewedStatus = (id, currentStatus, addedBy) => {
    if (addedBy !== 0 && addedBy !== hrNumber) {
      enqueueSnackbar("Not authorized to change this status", { variant: 'error' });
      return;
    }
    if (currentStatus === 'followed_up') {
      enqueueSnackbar("Can't change status after remark", { variant: 'warning' });
      return;
    }
    const newStatus = currentStatus === 'reviewed' ? 'active' : 'reviewed';
    const incharge = currentStatus === 'reviewed' ? 0 : hrNumber;
    updateFields(id, { status: newStatus, addedBy: incharge });
    enqueueSnackbar("Status updated", { variant: 'success' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        At-risk Employees
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gap={3}
        >
          {employees.map(emp => {
            const canAct = emp.addedBy === hrNumber || emp.addedBy === 0;
            const showAddRemarks = canAct && emp.status === 'reviewed';
            const showDelete = canAct && emp.status === 'followed_up';

            return (
              <Paper
                key={emp.id}
                elevation={3}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fff',
                }}
              >
                {/* Main card content */}
                <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6">
                      {emp.Name} (#{emp.EmployeeNumber})
                    </Typography>
                    <Button
                      onClick={() => toggleReviewedStatus(emp.id, emp.status, emp.addedBy)}
                      sx={{
                        minWidth: 16,
                        height: 16,
                        borderRadius: '50%',
                        padding: 0,
                        backgroundColor: getStatusColor(emp.status || 'active'),
                        border: '1px solid #ccc',
                      }}
                      title='toggle'
                    />
                  </Box>

                  <Typography variant="body2">Risk Score: {emp.RiskScore}</Typography>
                  <Typography variant="body2">Department: {emp.Department}</Typography>
                  <Typography variant="body2">
                    Incharge: {emp.addedBy === 0 ? 'model' : emp.addedBy}
                  </Typography>
                  <Typography variant="body2">
                    Added At: {new Date(emp.addedAt).toLocaleString()}
                  </Typography>

                  <Box mt={2}>
                    {showAddRemarks && activeRemark !== emp.id && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setActiveRemark(emp.id)}
                      >
                        Add Remarks
                      </Button>
                    )}

                    {activeRemark === emp.id && (
                      <Box display="flex" flexDirection="column" gap={1} mt={1}>
                        <TextField
                          size="small"
                          multiline
                          rows={2}
                          variant="outlined"
                          placeholder="Enter remarks..."
                          value={tempRemark}
                          onChange={(e) => setTempRemark(e.target.value)}
                        />
                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleAddRemark(emp.id)}
                          >
                            Done
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleCancelRemark}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {emp.remarks && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, color: '#666', fontStyle: 'italic' }}
                      >
                        Remarks: {emp.remarks}
                      </Typography>
                    )}
                  </Box>

                  {showDelete && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => deleteEmployee(emp.id)}
                      sx={{width:10, mt: 2 }}
                    >
                      Delete
                    </Button>
                  )}
                </Box>

                {/* Vertical status bar */}
                <Box
                  sx={{
                    width: '16px',
                    backgroundColor: getStatusColor(emp.status || 'active'),
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      transform: 'rotate(-90deg)',
                      whiteSpace: 'nowrap',
                      fontWeight: 'bold',
                      color: '#333',
                    }}
                  >
                    {emp.status?.toUpperCase() || 'ACTIVE'}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
};

export default Monitor;
