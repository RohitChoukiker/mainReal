import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/dbConnect';
import User, { Role } from '../../../../../models/userModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = "123123123 " as string;

// Create a schema for brokerage settings if it doesn't exist
const createBrokerageSchema = async () => {
    if (!mongoose.models.BrokerageSetting) {
        const BrokerageSettingSchema = new mongoose.Schema({
            brokerId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User', 
                required: true,
                unique: true
            },
            brokerageName: { 
                type: String, 
                default: '' 
            },
            brokerageLicense: { 
                type: String, 
                default: '' 
            },
            taxId: { 
                type: String, 
                default: '' 
            },
            address: { 
                type: String, 
                default: '' 
            },
            city: { 
                type: String, 
                default: '' 
            },
            state: { 
                type: String, 
                default: '' 
            },
            zipCode: { 
                type: String, 
                default: '' 
            },
            website: { 
                type: String, 
                default: '' 
            },
            transactionSettings: {
                autoAssignTC: { type: Boolean, default: true },
                defaultTC: { type: String, default: '' },
                requiredDocuments: { 
                    type: [String], 
                    default: [
                        'Purchase Agreement',
                        'Property Disclosure',
                        'Inspection Report',
                        'Financing Pre-Approval',
                        'Title Report',
                        'Insurance Binder'
                    ] 
                }
            }
        }, { timestamps: true });

        mongoose.model('BrokerageSetting', BrokerageSettingSchema);
    }
    
    return mongoose.models.BrokerageSetting;
};

// GET endpoint to fetch brokerage information
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
        
        // Get the brokerage model
        const BrokerageSetting = await createBrokerageSchema();
        
        // Find the broker's brokerage settings
        let settings = await BrokerageSetting.findOne({ brokerId: decoded.id });
        
        // If no settings exist, create default settings
        if (!settings) {
            // Get the broker's information
            const broker = await User.findById(decoded.id);
            
            if (!broker) {
                return NextResponse.json({ message: 'Broker not found' }, { status: 404 });
            }
            
            settings = await BrokerageSetting.create({
                brokerId: decoded.id,
                brokerageName: broker.companyName || '',
                brokerageLicense: '',
                taxId: '',
                address: broker.address || '',
                city: broker.city || '',
                state: broker.state || '',
                zipCode: broker.pinCode || '',
                website: '',
                transactionSettings: {
                    autoAssignTC: true,
                    defaultTC: '',
                    requiredDocuments: [
                        'Purchase Agreement',
                        'Property Disclosure',
                        'Inspection Report',
                        'Financing Pre-Approval',
                        'Title Report',
                        'Insurance Binder'
                    ]
                }
            });
        }
        
        // Return the brokerage settings
        return NextResponse.json({ 
            success: true,
            data: settings
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error fetching brokerage information:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}

// PUT endpoint to update brokerage information
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
        
        // Get the brokerage model
        const BrokerageSetting = await createBrokerageSchema();
        
        // Create an update object
        const updateData: Record<string, any> = {};
        
        // Handle top-level fields
        const topLevelFields = [
            'brokerageName', 
            'brokerageLicense', 
            'taxId', 
            'address', 
            'city', 
            'state', 
            'zipCode', 
            'website'
        ];
        
        for (const field of topLevelFields) {
            if (field in body) {
                updateData[field] = body[field];
            }
        }
        
        // Handle transaction settings
        if (body.transactionSettings) {
            updateData.transactionSettings = {};
            
            if ('autoAssignTC' in body.transactionSettings) {
                updateData.transactionSettings.autoAssignTC = body.transactionSettings.autoAssignTC;
            }
            
            if ('defaultTC' in body.transactionSettings) {
                updateData.transactionSettings.defaultTC = body.transactionSettings.defaultTC;
            }
            
            if (body.transactionSettings.requiredDocuments) {
                updateData.transactionSettings.requiredDocuments = body.transactionSettings.requiredDocuments;
            }
        }
        
        // Update the brokerage settings
        const updatedSettings = await BrokerageSetting.findOneAndUpdate(
            { brokerId: decoded.id },
            { $set: updateData },
            { new: true, upsert: true, runValidators: true }
        );
        
        // Return the updated settings
        return NextResponse.json({ 
            success: true,
            message: 'Brokerage information updated successfully',
            data: updatedSettings
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error updating brokerage information:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}