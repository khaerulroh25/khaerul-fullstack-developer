import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend IndoKerja.id is setup and ready!',
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
