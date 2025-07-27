
import { LoginInput, Member, MemberInput, MemberUpdateInput } from '../libs/types/member';
import Errors, { HttpCode, Message } from "../libs/utils/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import * as bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/utils/config";
import MemberModel from '../schema/Member.model';

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  public async getFounder(): Promise<Member> {
    const result = await this.memberModel
      .findOne({ memberType: MemberType.FOUNDER })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result.toObject() as Member;
  }
      


  public async getMemberDetails(member:Member): Promise <Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel.findOne({
      _id: memberId,
      memberStatus: MemberStatus.ACTIVE
   })
   .exec();
   if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
   return result.toObject() as Member;

  }
  
   /** SPA Signup */
   public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt(); 
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = ""; // Hide password before returning
      return result.toJSON() as Member;
    } catch (err) {
      console.log("Error , model:signup", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.WRONG_PASSWORD);
    }
  }

  /** SPA Login */
  public async login(input: LoginInput): Promise<Member> {
    // TODO: Consider member status later
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick ,
          memberStatus: { $ne: MemberStatus.DELETE},
        },
        { memberNick: 1, memberPassword: 1, memberStatus: 1 }
      )
      .exec();
  
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    else if (member.memberStatus === MemberStatus.BLOCK){
    throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }
    
    const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
    if (!isMatch) 
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    const foundMember = await this.memberModel
    .findById(member._id)
    .select("memberNick memberType memberStatus memberPoints createdAt updatedAt") // Ensure all required fields are selected
    .exec();

  if (!foundMember) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

  return foundMember.toObject() as Member;
}
  
public async updateMember (
  member: Member, 
  input: Partial<MemberUpdateInput>
):Promise<Member> {
  const memberId = shapeIntoMongooseObjectId(member._id);
  
  // Remove _id from input to avoid conflicts
  const updateData = { ...input };
  delete updateData._id;
  
  const result = await this.memberModel
  .findByIdAndUpdate(memberId, updateData, { new: true}) // new true - bu obshion 
  .exec();
  if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
  return result.toObject() as Member;
}
public async getTopUsers(): Promise<Member[]> {
  const result = await this.memberModel.find({
    memberStatus: MemberStatus.ACTIVE,
    memberPoints: { $gte: 0},
  })
  .sort({ memberPoints: -1 }) // Corrected sorting field
  .limit(4)
  .exec();

  if (!result || result.length === 0) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

  return result.map(doc => doc.toObject() as Member);
}
public async addUserPoint(member: Member, point: number): Promise<Member> {
  const memberId = shapeIntoMongooseObjectId(member._id);

  console.log("addUserPoint - member info:", {
    id: memberId,
    nick: member.memberNick,
    type: member.memberType,
    status: member.memberStatus
  });

  const result = await this.memberModel
    .findOneAndUpdate(
      {
        _id: memberId,
        // Remove the strict memberType filter - allow both USER and FOUNDER to receive points
        memberType: { $in: [MemberType.USER, MemberType.FOUNDER] },
        memberStatus: MemberStatus.ACTIVE,
      },
      { $inc: { memberPoints: point } },
      { new: true }
    )
    .exec();

  if (!result) {
    console.log("addUserPoint - No member found with criteria:", {
      _id: memberId,
      memberType: member.memberType,
      memberStatus: member.memberStatus
    });
    throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
  }
  
  console.log("addUserPoint - Successfully added points. New total:", result.memberPoints);
  return result.toObject() as Member;
}
/** 

  /** SSR Signup */
  public async processSignup(input:MemberInput): Promise<Member>{
    const exist = await this.memberModel
   .findOne({memberType: MemberType.FOUNDER}).exec();
   console.log("→ [About to create member]:", input);


   if(exist) {
     console.log("→ [Founder already exists, cannot create another founder account]");
     throw new Errors(HttpCode.BAD_REQUEST, Message.CREATION_FAILED);
   }
   console.log("→ [No existing founder found, proceeding with signup]");

   const salt = await bcrypt.genSalt();
   input.memberPassword = await bcrypt.hash(input.memberPassword,salt)

   try{
       const result =  await this.memberModel.create(input);
       result.memberPassword = "";
       console.log("→ [Member created successfully]:", result.memberNick);
       return result.toObject() as Member;
   } catch(err){
       console.log("→ [Database creation error]:", err);
       throw new Errors(HttpCode.BAD_REQUEST, Message.CREATION_FAILED);   
   }

};

  /** SSR Login */
  public async processLogin(input:LoginInput): Promise<Member>{
    const member= await this.memberModel
    .findOne({memberNick: input.memberNick},
    {memberNick:1, memberPassword:1})
    .exec();

    if(!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    const isMatch = await bcrypt.compare(input.memberPassword, member.memberPassword);
    // const isMatch = input.memberPassword === member.memberPassword;
    if(!isMatch) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATION_FAILED);

      

    const result = await this.memberModel.findById(member._id).exec();
    if (!result) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    }
    return result.toObject() as Member;
  }
  
  public async getUsers(): Promise<Member[]>{
    const  result = await this.memberModel
    .find({memberType: MemberType.USER})
    .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND,Message.NO_DATA_FOUND);
    return result.map((doc: { toObject: () => Member; }) => doc.toObject() as Member);
  }

  public async updatedChosenUser(input:MemberUpdateInput): Promise<Member>{
    const memberId =shapeIntoMongooseObjectId(input._id);
    const  result = await this.memberModel
    .findByIdAndUpdate({ _id: input._id},input,{new: true})
    .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED,Message.UPDATE_FAILED);
    return result.toObject() as Member;
  }
}
export default MemberService;
