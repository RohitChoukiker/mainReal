import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/userModel';
import { signupSchema } from '../../../validators/userValidator';


export async function POST(req: NextRequest) {
    dbConnect();

if(req.method != "POST"){
    return NextResponse.json({ message:'Methon is not allowed'},{status:405})
}



}
