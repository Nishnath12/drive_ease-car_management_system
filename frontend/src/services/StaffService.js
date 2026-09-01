import api from './api';
const StaffService={
  getStaff:()=>api.get('/staff'),
  createEmployee:(data)=>api.post('/staff/employees',data),
  updateEmployee:(id,data)=>api.put(`/staff/employees/${id}`,data),
  setStatus:(id,is_active)=>api.patch(`/staff/employees/${id}/status`,{is_active})
};
export default StaffService;
