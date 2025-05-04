import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../utils/dbConnect';
import User, { Role } from '../../../../models/userModel';

// This is an admin-only endpoint to update existing brokers with broker IDs
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        
        // Find all brokers without broker IDs
        const brokers = await User.find({ 
            role: Role.Broker,
            $or: [
                { brokerId: { $exists: false } },
                { brokerId: null },
                { brokerId: "" }
            ]
        });
        
        console.log(`Found ${brokers.length} brokers without broker IDs`);
        
        const updatedBrokers = [];
        
        // Update each broker with a new broker ID
        for (const broker of brokers) {
            // Generate a broker ID
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let brokerId = "";
            for (let i = 0; i < 11; i++) {
                brokerId += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            // Update the broker
            broker.brokerId = brokerId;
            await broker.save();
            
            updatedBrokers.push({
                id: broker._id,
                name: broker.name,
                email: broker.email,
                brokerId: broker.brokerId
            });
        }
        
        return NextResponse.json({ 
            message: `Updated ${updatedBrokers.length} brokers with new broker IDs`,
            updatedBrokers
        }, { status: 200 });
        
    } catch (error: any) {
        console.error('Error updating broker IDs:', error);
        return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
    }
}