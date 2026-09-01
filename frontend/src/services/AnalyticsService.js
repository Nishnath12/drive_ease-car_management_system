import api from './api';
const AnalyticsService={getDashboard:()=>api.get('/analytics')};
export default AnalyticsService;
