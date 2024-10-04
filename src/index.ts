import express from 'express';
import categoryRoutes from './routes/categoryRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', categoryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
