import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../utils/dbConnect';
import User, { Role } from '../../../../../models/userModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = "123123123 " as string;

// Create a schema for billing settings if it doesn't exist
const createBillingSchema = async () => {
    if (!mongoose.models.BrokerBillingSetting) {
        const BrokerBillingSettingSchema = new mongoose.Schema({
            brokerId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User', 
                required: true,
                unique: true
            },
            subscriptionPlan: { 
                type: String, 
                enum: ['Free', 'Basic', 'Professional', 'Enterprise'],
                default: 'Professional' 
            },
            subscriptionPrice: {
                type: Number,
                default: 99
            },
            billingCycle: {
                type: String,
                enum: ['Monthly', 'Annually'],
                default: 'Monthly'
            },
            nextBillingDate: {
                type: Date,
                default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            },
            paymentMethods: [{
                type: {
                    type: String,
                    enum: ['Credit Card', 'Debit Card', 'Bank Account'],
                    default: 'Credit Card'
                },
                last4: String,
                expiryDate: String,
                isDefault: {
                    type: Boolean,
                    default: false
                }
            }],
            billingHistory: [{
                date: { type: Date },
                description: { type: String },
                amount: { type: Number },
                status: { 
                    type: String,
                    enum: ['Paid', 'Pending', 'Failed'],
                    default: 'Paid'
                },
                invoiceUrl: { type: String }
            }]
        }, { timestamps: true });

        mongoose.model('BrokerBillingSetting', BrokerBillingSettingSchema);
    }
    
    return mongoose.models.BrokerBillingSetting;
};

// GET endpoint to fetch billing information
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
        
        // Get the billing model
        const BrokerBillingSetting = await createBillingSchema();
        
        // Find the broker's billing settings
        let settings = await BrokerBillingSetting.findOne({ brokerId: decoded.id });
        
        // If no settings exist, create default settings
        if (!settings) {
            // Create mock billing history
            const billingHistory = [];
            const today = new Date();
            
            for (let i = 0; i < 3; i++) {
                const date = new Date(today);
                date.setMonth(today.getMonth() - i);
                date.setDate(1); // First day of the month
                
                billingHistory.push({
                    date,
                    description: 'Professional Plan - Monthly',
                    amount: 99,
                    status: 'Paid',
                    invoiceUrl: `/invoices/invoice-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}.pdf`
                });
            }
            
            settings = await BrokerBillingSetting.create({
                brokerId: decoded.id,
                subscriptionPlan: 'Professional',
                subscriptionPrice: 99,
                billingCycle: 'Monthly',
                nextBillingDate: new Date(today.getFullYear(), today.getMonth() + 1, 1), // First day of next month
                paymentMethods: [{
                    type: 'Credit Card',
                    last4: '4242',
                    expiryDate: '04/2025',
                    isDefault: true
                }],
                billingHistory
            });
        }
        
        // Return the billing settings
        return NextResponse.json({ 
            success: true,
            data: settings
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error fetching billing information:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}

// PUT endpoint to update payment method
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
        
        // Get the billing model
        const BrokerBillingSetting = await createBillingSchema();
        
        // Handle subscription plan update
        if (body.subscriptionPlan) {
            // Update the subscription plan
            await BrokerBillingSetting.findOneAndUpdate(
                { brokerId: decoded.id },
                { 
                    $set: { 
                        subscriptionPlan: body.subscriptionPlan,
                        subscriptionPrice: body.subscriptionPrice || 99, // Default to $99 if not provided
                        billingCycle: body.billingCycle || 'Monthly' // Default to Monthly if not provided
                    }
                },
                { new: true, upsert: true }
            );
            
            return NextResponse.json({ 
                success: true,
                message: 'Subscription plan updated successfully'
            }, { status: 200 });
        }
        
        // Handle payment method update
        if (body.paymentMethod) {
            const paymentMethod = {
                type: body.paymentMethod.type || 'Credit Card',
                last4: body.paymentMethod.last4,
                expiryDate: body.paymentMethod.expiryDate,
                isDefault: body.paymentMethod.isDefault || false
            };
            
            // If this is the default payment method, unset any existing default
            if (paymentMethod.isDefault) {
                await BrokerBillingSetting.findOneAndUpdate(
                    { brokerId: decoded.id },
                    { $set: { 'paymentMethods.$[].isDefault': false } },
                    { new: true, upsert: true }
                );
            }
            
            // Add the new payment method
            await BrokerBillingSetting.findOneAndUpdate(
                { brokerId: decoded.id },
                { $push: { paymentMethods: paymentMethod } },
                { new: true, upsert: true }
            );
            
            return NextResponse.json({ 
                success: true,
                message: 'Payment method added successfully'
            }, { status: 200 });
        }
        
        return NextResponse.json({ message: 'No valid update parameters provided' }, { status: 400 });
        
    } catch (error: any) {
        console.error('Error updating billing information:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}