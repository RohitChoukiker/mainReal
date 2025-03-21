import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/userModel';
import { signupSchema } from '../../../validators/userValidator';
