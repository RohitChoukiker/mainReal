import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/dbConnect';
import User, { Role } from '../../../../../models/userModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = "123123123 " as string;

// Create a schema for notification preferences if it doesn't exist
const createNotificationSchema = async () => {
    if (!mongoose.models.BrokerNotificationPreference) {
        const BrokerNotificationPreferenceSchema = new mongoose.Schema({
            brokerId: { 
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
                newAgentRegistrations: { type: Boolean, default: true },
                transactionStatusChanges: { type: Boolean, default: true },
                documentUploads: { type: Boolean, default: true },
                tcAssignments: { type: Boolean, default: true },
                complaints: { type: Boolean, default: true }
            }
        }, { timestamps: true });

        mongoose.model('BrokerNotificationPreference', BrokerNotificationPreferenceSchema);
    }
    
    return mongoose.models.BrokerNotificationPreference;
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
        
        // Check if the user is a broker
        if (decoded.role !== Role.Broker) {
            return NextResponse.json({ message: 'Unauthorized: Only brokers can access this endpoint' }, { status: 403 });
        }
        
        // Get the notification model
        const BrokerNotificationPreference = await createNotificationSchema();
        
        // Find the broker's notification preferences
        let preferences = await BrokerNotificationPreference.findOne({ brokerId: decoded.id });
        
        // If no preferences exist, create default preferences
        if (!preferences) {
            preferences = await BrokerNotificationPreference.create({
                brokerId: decoded.id,
                enableNotifications: true,
                emailNotifications: true,
                smsNotifications: false,
                notificationTypes: {
                    newAgentRegistrations: true,
                    transactionStatusChanges: true,
                    documentUploads: true,
                    tcAssignments: true,
                    complaints: true
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
        
        // Check if the user is a broker
        if (decoded.role !== Role.Broker) {
            return NextResponse.json({ message: 'Unauthorized: Only brokers can access this endpoint' }, { status: 403 });
        }
        
        // Get the request body
        const body = await req.json();
        
        // Get the notification model
        const BrokerNotificationPreference = await createNotificationSchema();
        
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
                'newAgentRegistrations', 
                'transactionStatusChanges', 
                'documentUploads', 
                'tcAssignments', 
                'complaints'
            ];
            
            for (const type of types) {
                if (type in body.notificationTypes) {
                    updateData.notificationTypes[type] = body.notificationTypes[type];
                }
            }
        }
        
        // Update or create the notification preferences
        const updatedPreferences = await BrokerNotificationPreference.findOneAndUpdate(
            { brokerId: decoded.id },
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