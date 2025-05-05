import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/dbConnect';
import User from '../../../../../models/userModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = "123123123 " as string;

// First, let's create a schema for notification preferences
// We'll need to update the user model to include this, but for now we'll use a separate collection

// Create a schema for notification preferences if it doesn't exist
const createNotificationSchema = async () => {
    if (!mongoose.models.NotificationPreference) {
        const NotificationPreferenceSchema = new mongoose.Schema({
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User', 
                required: true,
                unique: true
            },
            enableNotifications: { 
                type: Boolean, 
                default: true 
            },
            emailNotifications: { 
                type: Boolean, 
                default: true 
            },
            smsNotifications: { 
                type: Boolean, 
                default: false 
            },
            notificationTypes: {
                newTaskAssignments: { type: Boolean, default: true },
                documentVerification: { type: Boolean, default: true },
                transactionStatusChanges: { type: Boolean, default: true },
                complaintResponses: { type: Boolean, default: true },
                closingDateReminders: { type: Boolean, default: true }
            }
        }, { timestamps: true });

        mongoose.model('NotificationPreference', NotificationPreferenceSchema);
    }
    
    return mongoose.models.NotificationPreference;
};

// GET endpoint to fetch notification preferences
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
        
        // Get the notification model
        const NotificationPreference = await createNotificationSchema();
        
        // Find the user's notification preferences
        let preferences = await NotificationPreference.findOne({ userId: decoded.id });
        
        // If no preferences exist, create default preferences
        if (!preferences) {
            preferences = await NotificationPreference.create({
                userId: decoded.id,
                enableNotifications: true,
                emailNotifications: true,
                smsNotifications: false,
                notificationTypes: {
                    newTaskAssignments: true,
                    documentVerification: true,
                    transactionStatusChanges: true,
                    complaintResponses: true,
                    closingDateReminders: true
                }
            });
        }
        
        // Return the notification preferences
        return NextResponse.json({ 
            success: true,
            data: preferences
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error fetching notification preferences:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}

// PUT endpoint to update notification preferences
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
        
        // Get the notification model
        const NotificationPreference = await createNotificationSchema();
        
        // Update or create notification preferences
        const updateData: Record<string, any> = {};
        
        // Handle top-level preferences
        if ('enableNotifications' in body) updateData.enableNotifications = body.enableNotifications;
        if ('emailNotifications' in body) updateData.emailNotifications = body.emailNotifications;
        if ('smsNotifications' in body) updateData.smsNotifications = body.smsNotifications;
        
        // Handle notification types
        if (body.notificationTypes) {
            updateData.notificationTypes = {};
            const types = [
                'newTaskAssignments', 
                'documentVerification', 
                'transactionStatusChanges', 
                'complaintResponses', 
                'closingDateReminders'
            ];
            
            for (const type of types) {
                if (type in body.notificationTypes) {
                    updateData.notificationTypes[type] = body.notificationTypes[type];
                }
            }
        }
        
        // Update or create the notification preferences
        const updatedPreferences = await NotificationPreference.findOneAndUpdate(
            { userId: decoded.id },
            { $set: updateData },
            { new: true, upsert: true, runValidators: true }
        );
        
        // Return the updated preferences
        return NextResponse.json({ 
            success: true,
            message: 'Notification preferences updated successfully',
            data: updatedPreferences
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error updating notification preferences:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}