import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getExecutiveDashboardData } from './server/agents/reportingAgent';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/dashboard', getExecutiveDashboardData);
app.get('/api/reports/executive', getExecutiveDashboardData);

app.listen(PORT, () => {
  console.log(`Sleepsia Intelligence Server running at http://localhost:${PORT}`);
});