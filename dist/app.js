"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors")); // CORS - Cross-Origin Resource Sharing
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./router"));
const router_admin_1 = __importDefault(require("./router-admin"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./libs/utils/config");
const express_session_1 = __importDefault(require("express-session")); //foydalanuvchi ma'lumotlarini vaqtincha saqlash) uchun ishlatiladi.
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session")); //Session ma'lumotlarini MongoDB bazasida saqlash uchun ishlatiladi.
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default); // function dan qatrgann class 
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: "session",
});
// 1- Entrance 
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, 'public'))); // Middleware Design Pattern => public
app.use("/uploads", express_1.default.static("./uploads"));
app.use(express_1.default.urlencoded({ extended: true })); // Middleware Design Pattern => Traditional API
app.use(express_1.default.json());
app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:3000" })); // Middleware Design Pattern => Rest API
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)(config_1.MORGAN_FORMAT)); // har bir  htpp faylgan jonatilgan log uchun ketgan vaqtdi console,logda korsatadi 
// 2- Session
app.use((0, express_session_1.default)({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
        maxAge: 1000 * 3600 * 3, // 3 hours
    },
    store: store,
    resave: true,
    saveUninitialized: true,
}));
app.use(function (req, res, next) {
    const sessionInstance = req.session;
    res.locals.member = sessionInstance.member;
    next();
});
// 3- Views 
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 4- Routing 
app.use("/admin", router_admin_1.default); //SSR = Service Site Rendining : EJS admin uchun 
app.use("/", router_1.default); // SPA - single page application : REACT  loyihamizda REST API korinishida ishlatamiuz  public uchun  
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: true,
        credentials: true,
    },
});
let summaryClient = 0;
io.on("connection", (socket) => {
    summaryClient++;
    console.log(`${summaryClient} a user connected`);
    socket.on("disconnect", () => {
        summaryClient--;
        console.log(`${summaryClient} a user disconnected`);
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map