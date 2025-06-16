import Errors, { HttpCode ,Message } from "../libs/utils/Errors";
import { AUTH_TIMER } from "../libs/utils/config";
import { Member } from "../libs/types/member";
import  jwt  from "jsonwebtoken";

class AuthService {
    private readonly secretToken;

    constructor () {
        this.secretToken =process.env.SECRET_TOKEN as string;
    }

    public  async createToken(payload: Member) {
        return new Promise((resolve, reject)=> {
            const duration =`${AUTH_TIMER}h`;
            jwt.sign(
                payload,      // user info stored in token (NEVER password!)
                process.env.SECRET_TOKEN as string,    // your secret key (keep safe!)
                {
                 expiresIn: duration,   // expiration time

                },
                (err, token)=> {
                    if (err)
                        reject(
                    new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
                        );
                else resolve(token as string );
                    } 
            );
        });
    }

 public  async checkAuth(token: string ): Promise <Member> {
    const result: Member = (await jwt.verify(
        token,
        this.secretToken
    )) as Member ;
    console.log(`---[AUTH] memberNick: ${result.memberNick}---`);
     return result;
 }
}
export default AuthService;
