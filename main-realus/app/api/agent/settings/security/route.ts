import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/dbConnect';
import User from '../../../../../models/userModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const JWT_SECRET = "123123123 " as string;

// Create a schema for security settings if it doesn't exist
const createSecuritySchema = async () => {
    if (!mongoose.models.SecuritySetting) {
        const SecuritySettingSchema = new mongoose.Schema({
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User', 
                required: true,
                unique: true
            },
            twoFactorEnabled: { 
                type: Boolean, 
                default: false 
            },
            recoveryCodes: { 
                type: [String],
                default: [] 
            },
            loginHistory: [{
                date: { type: Date, default: Date.now },
                ipAddress: { type: String },
                device: { type: String },
                location: { type: String }
            }]
        }, { timestamps: true });

        mongoose.model('SecuritySetting', SecuritySettingSchema);
    }
    
    return mongoose.models.SecuritySetting;
};

// GET endpoint to fetch security settings
export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        
        // Get the token from cookies
        const token = req.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }
        
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }
        
        // Get the security model
        const SecuritySetting = await createSecuritySchema();
        
        // Find the user's security settings
        let settings = await SecuritySetting.findOne({ userId: decoded.id });
        
        // If no settings exist, create default settings
        if (!settings) {
            settings = await SecuritySetting.create({
                userId: decoded.id,
                twoFactorEnabled: false,
                recoveryCodes: [],
                loginHistory: []
            });
        }
        
        // Return the security settings (excluding recovery codes for security)
        const securityData = settings.toObject();
        securityData.recoveryCodes = securityData.recoveryCodes.length > 0 ? ['********'] : [];
        
        return NextResponse.json({ 
            success: true,
            data: securityData
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error fetching security settings:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}

// PUT endpoint to update password
export async function PUT(req: NextRequest) {
    try {
        await dbConnect();
        
        // Get the token from cookies
        const token = req.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }
        
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }
        
        // Get the request body
        const body = await req.json();
        
        // Check if this is a password update request
        if (body.currentPassword && body.newPassword) {
            // Find the user
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }
            
            // Verify the current password
            const isPasswordValid = await user.comparePassword(body.currentPassword);
            
            if (!isPasswordValid) {
                return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
            }
            
            // Hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(body.newPassword, salt);
            
            // Update the password
            user.password = hashedPassword;
            user.confirmPassword = hashedPassword; // Update confirmPassword as well
            await user.save();
            
            return NextResponse.json({ 
                success: true,
                message: 'Password updated successfully'
            }, { status: 200 });
        }
        
        // If this is a 2FA settings update
        if ('twoFactorEnabled' in body) {
            const SecuritySetting = await createSecuritySchema();
            
            // Generate recovery codes if enabling 2FA
            let recoveryCodes = [];
            if (body.twoFactorEnabled && body.generateRecoveryCodes) {
                // Generate 5 random recovery codes
                for (let i = 0; i < 5; i++) {
                    const code = Math.floor(1000 + Math.random() * 9000) + '-' + 
                                Math.floor(1000 + Math.random() * 9000) + '-' + 
                                Math.floor(1000 + Math.random() * 9000);
                    recoveryCodes.push(code);
                }
            }
            
            // Update the security settings
            const updateData: Record<string, any> = {
                twoFactorEnabled: body.twoFactorEnabled
            };
            
            if (recoveryCodes.length > 0) {
                updateData.recoveryCodes = recoveryCodes;
            }
            
            // Update or create the security settings
            const updatedSettings = await SecuritySetting.findOneAndUpdate(
                { userId: decoded.id },
                { $set: updateData },
                { new: true, upsert: true }
            );
            
            return NextResponse.json({ 
                success: true,
                message: 'Security settings updated successfully',
                data: {
                    twoFactorEnabled: updatedSettings.twoFactorEnabled,
                    recoveryCodes: recoveryCodes.length > 0 ? recoveryCodes : undefined
                }
            }, { status: 200 });
        }
        
        return NextResponse.json({ message: 'No valid update parameters provided' }, { status: 400 });
        
    } catch (error: any) {
        console.error('Error updating security settings:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}

// POST endpoint to record login history
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        
        // Get the token from cookies
        const token = req.cookies.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
        }
        
        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
        }
        
        // Get the request body
        const body = await req.json();
        
        // Get the security model
        const SecuritySetting = await createSecuritySchema();
        
        // Add login history entry
        const loginEntry = {
            date: new Date(),
            ipAddress: body.ipAddress || req.headers.get('x-forwarded-for') || 'unknown',
            device: body.device || req.headers.get('user-agent') || 'unknown',
            location: body.location || 'unknown'
        };
        
        // Update the security settings with the new login entry
        await SecuritySetting.findOneAndUpdate(
            { userId: decoded.id },
            { 
                $push: { 
                    loginHistory: {
                        $each: [loginEntry],
                        $sort: { date: -1 },
                        $slice: 10 // Keep only the 10 most recent logins
                    }
                }
            },
            { new: true, upsert: true }
        );
        
        return NextResponse.json({ 
            success: true,
            message: 'Login history recorded'
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error recording login history:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}