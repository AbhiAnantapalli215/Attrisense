// pages/ProfilePage.jsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import UserBoard from '../components/UserBoard';

export default function UserDashboard() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      const docRef = doc(db, 'employeelist', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEmployee({ id: docSnap.id, ...docSnap.data() });
      } else {
        setEmployee(null);
      }
    };
    fetchEmployee();
  }, [id]);

  if (!employee) return <div>Loading...</div>;

  return <UserBoard employee={employee} employeeId={id} />;
}
