import cors from 'cors';
import express from 'express';
import router from './router';
import routerAdmin from './router-admin';
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import { MORGAN_FORMAT, } from "./src/libs/utils/config";
import session from 'express-session';
import { T } from "./src/libs/types/common"


import connectMongoDB from 'connect-mongodb-session'; // Ensure you have this package installed
import path from 'path';

const MongoDBStore = connectMongoDB(session); // Correctly import and use the connect-mongodb-session package
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: "session",
});



//1 -Entrance 
const app = express();
app.use(express.static(path.join(__dirname, 'public'))); // Middleware Design Pattern => public
app.use("/uploads", express.static("./uploads"))
app.use(express.urlencoded({ extended: true }));  // Middleware Design Pattern => Traditional API
app.use(express.json()); 
app.use(cors({ credentials: true, origin: true})); // Middleware Design Pattern => Rest API
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));



// 2 - CORS
// 2- Session
app.use(
    session({
        secret: String(process.env.SESSION_SECRET),
        cookie:{
            maxAge: 1000 * 3600 * 3,// 3 hours
        },
        store: store,
        resave: true ,
        saveUninitialized: true,
    })
);
app.use(function(req, res, next){
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
})




// 3 - View Engine


// 3- Views 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 4- Routing 
app.use("/admin", routerAdmin);//SSR = Service Site Rendining : EJS admin uchun 
app.use("/", router);// SPA - single page application : REACT  loyihamizda REST API korinishida ishlatamiuz  public uchun  
;


export default app;

