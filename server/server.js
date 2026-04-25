import express from 'express';
import cors from 'cors';
import smartRouter from "./routes/smartRouter.js"

export const app = express();

app.use(cors());
app.use(express.json());

console.log('FATSECRET_CLIENT_ID:', process.env.FATSECRET_CLIENT_ID ? '✅' : '❌');
console.log('FATSECRET_CLIENT_SECRET:', process.env.FATSECRET_CLIENT_SECRET ? '✅' : '❌');

app.use("/api",smartRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(` Server started on http://localhost:${port}`);
});