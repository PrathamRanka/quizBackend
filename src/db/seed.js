import mongoose from "mongoose";
import { User } from "../models/user.model";

const createAdminAccount = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("Database connected for seeding.");

        
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.log("Admin user already exists. Seeding not required.");
            return;
        }

        
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@owasp.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (!adminEmail || !adminPassword) {
            throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
        }

       
        const adminUser = new User({
            email: adminEmail,
            password: adminPassword, 
            role: 'admin',
            username: 'admin',
            fullName: 'Administrator'
        });

        await adminUser.save();
        console.log("✅ Admin account created successfully!");
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);

    } catch (error) {
        console.error("❌ Error seeding admin account:", error);
    } finally {
        
        mongoose.disconnect();
        console.log("Database disconnected.");
    }
};

createAdminAccount();