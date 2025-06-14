import cors from 'cors';
import express from 'express';
import router from './router';
import routerAdmin from './router-admin';






//1 -Entrance 
const app = express();
app.use(express.json());



// 2 - CORS



// 3 - View Engine

app.set('view', 'ejs');

// 4 -Router 
app.use("/admin", routerAdmin);
app.use("/ ",router);


export default app;