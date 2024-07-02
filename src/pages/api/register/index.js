// api/register/index.js

import connectDB from "@/lib/dbConnect";
import User from "@/lib/models/user";
import bcrypt from 'bcryptjs';


export default async function POST(req, res) {
    try {
        const { username, email, password } = await req.body;

        await connectDB();
        const existingUser = await User.findOne({ email:email });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create a new user with the hashed password
        const user = await User.create({ username, email, password: hashedPassword });

        return res.status(201).json({ message: "User Registered", user });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
