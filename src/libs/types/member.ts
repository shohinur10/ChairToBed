import { MemberType, MemberStatus } from '../enums/member.enum';
import {Session} from 'express-session';
import{ObjectId} from "mongoose";
import { Request } from "express";

export interface Member {
    _id: ObjectId;
        memberType: MemberType; // Optional
        memberStatus: MemberStatus; // Optional
        memberNick: string; // Required
        memberPhone: string; // Required
        memberPassword?: string; // Required
        memberDesc?: string; // Optional
        memberAddress?: string; // Optional
        memberImage?: string; // Optional
        memberPoints: number; // Optional
        createAt: Date; // Required
        updatedAt: Date; // Optional (corrected from 'updete')
    }
export interface MemberInput {
    memberType?: MemberType; // Optional
    memberStatus?: MemberStatus; // Optional
    memberNick: string; // Required
    memberPhone: string; // Required
    memberPassword: string; // Required
    memberDesc?: string; // Optional
    memberAddress?: string; // Optional
    memberImage?: string; // Optional
    memberPoints?: number; // Optional
}

export interface LoginInput {
    memberNick:string;
    memberPassword:string;
}
export interface MemberUpdateInput {
    _id: ObjectId;
        memberStatus?: MemberStatus; // Optional
        memberNick?: string; // Required
        memberPhone?: string; // Required
        memberPassword?: string; // Required
        memberDesc?: string; // Optional
        memberAddress?: string; // Optional
        memberImage?: string; // Optional
        memberPoints?: number; // Optional
}
export interface ExtendedRequest extends Request {
    member: Member;
    file: Express.Multer.File;
    files:Express.Multer.File[];
 }
 


export interface AdminRequest extends Request {
    member: Member;
    session: Session & { member: Member} ;
    file: Express.Multer.File;
    files:Express.Multer.File[];
 }