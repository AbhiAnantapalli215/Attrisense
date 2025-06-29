import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { Button, TextField, Typography, Box, Paper } from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import { useSnackbar } from 'notistack';

const getStatusColor = (status) => {
  switch (status) {
    case 'followed_up': return green[200];
    case 'reviewed': return orange[200];
    case 'active':
    default: return red[200];
  }
};

const Monitor = () => {
  const hrNumber = localStorage.getItem('employeeNumber');
  const [employees, setEmployees] = useState([]);
  const [activeRemark, setActiveRemark] = useState(null);
  const [tempRemark, setTempRemark] = useState('');
  const { enqueueSnackbar } = useSnackbar();

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

  const deleteEmployee = async (id) => {
    await deleteDoc(doc(db, 'monitor', id));
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    enqueueSnackbar(`Successfully removed record ${id}`, { variant: 'info' });
  };

  const updateFields = async (id, updates) => {
    await updateDoc(doc(db, 'monitor', id), updates);
    setEmployees(prev =>
      prev.map(emp => emp.id === id ? { ...emp, ...updates } : emp)
    );
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

  const toggleReviewedStatus = (id, currentStatus,addedBy) => {
    if(addedBy!==0 && addedBy!==hrNumber){
      enqueueSnackbar("You're not authorized to change this status", { variant: 'error' });
      return ;
    }
    else if(currentStatus==='followed_up'){
      enqueueSnackbar("You can't change the status after remark", { variant: 'warning' });
      return ;
    }
    const newStatus = currentStatus === 'reviewed' ? 'active' : 'reviewed';
    const incharge = currentStatus === 'reviewed' ? 0 : hrNumber;
    updateFields(id, { status: newStatus, addedBy: incharge });
    enqueueSnackbar("Status changed successfully", { variant: 'success' });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2} padding={2}>
      {employees.map(emp => {
        const canAct =emp.addedBy === hrNumber || emp.addedBy=='0';
        const showAddRemarks = canAct && emp.status === 'reviewed';
        const showDelete = canAct && emp.status === 'followed_up';

        return (
          <Paper key={emp.id} elevation={3} style={{ padding: 16, borderRadius: 12 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">{emp.Name} ({emp.EmployeeNumber})</Typography>
              <Button
                  onClick={() => toggleReviewedStatus(emp.id, emp.status,emp.addedBy)}
                  style={{
                    minWidth: 16,
                    height: 16,
                    borderRadius: '50%',
                    padding: 0,
                    backgroundColor: getStatusColor(emp.status || 'active'),
                    border: '1px solid #ccc'
                  }}
                  title={emp.status || 'active'}
                />
            </Box>

            <Typography>Risk Score: {emp.RiskScore}</Typography>
            <Typography>Department: {emp.Department}</Typography>
            <Typography>Incharge: {emp.addedBy === 0 ? 'model' : emp.addedBy}</Typography>
            <Typography>Added At: {new Date(emp.addedAt).toLocaleString()}</Typography>

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
                  style={{ marginTop: 8, color: '#666', fontStyle: 'italic' }}
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
                style={{ marginTop: 12 }}
              >
                Delete
              </Button>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

export default Monitor;
