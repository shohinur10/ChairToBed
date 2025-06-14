import { ObjectId } from "mongoose";
import { ViewGroup} from '../enums/view.enum';


export interface  View{
    _id: ObjectId;
    ViewGroup:ViewGroup;
    memberId: ObjectId;
    viewRefId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}


export interface ViewInput {
    memberId:ObjectId;
    viewRefId:ObjectId;
    ViewGroup: ViewGroup;
}