import cors from "cors"; // CORS - Cross-Origin Resource Sharing
import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import {MORGAN_FORMAT} from "./libs/utils/config";
import session from "express-session";//foydalanuvchi ma'lumotlarini vaqtincha saqlash) uchun ishlatiladi.
import ConnectMongoDB from "connect-mongodb-session";//Session ma'lumotlarini MongoDB bazasida saqlash uchun ishlatiladi.
import { T } from "./libs/types/common";
import {Server as SocketIOServer} from "socket.io";
import http from "http"



const MongoDBStore = ConnectMongoDB(session); // function dan qatrgann class 
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection:"session",
})


// 1- Entrance 
const app = express();
app.use(express.static(path.join(__dirname, 'public'))); // Middleware Design Pattern => public
app.use("/uploads", express.static("./uploads"))
app.use(express.urlencoded({ extended: true }));  // Middleware Design Pattern => Traditional API
app.use(express.json()); 
app.use(cors({ credentials: true, origin: "http://localhost:3000"})); // Middleware Design Pattern => Rest API
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT)); // har bir  htpp faylgan jonatilgan log uchun ketgan vaqtdi console,logda korsatadi 

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

// 3- Views 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 4- Routing 
app.use("/admin", routerAdmin);//SSR = Service Site Rendining : EJS admin uchun 
app.use("/", router);// SPA - single page application : REACT  loyihamizda REST API korinishida ishlatamiuz  public uchun  


const server =http.createServer(app);
const io = new SocketIOServer(server,{
    cors:{
        origin : true ,
        credentials:true,
    },
});

let summaryClient =0;
io.on("connection",(socket) => {
    summaryClient++;
    console.log(`${summaryClient} a user connected`);
    socket.on("disconnect",() => {
        summaryClient--;
        console.log(`${summaryClient} a user disconnected`);
    });
});



export default app;