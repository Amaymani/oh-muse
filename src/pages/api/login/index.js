import connectDB from "@/lib/dbConnect";
import User from "@/lib/models/user";
import bcrypt from 'bcryptjs';


export default async function POST(req, res) {
    try{
        const {email, password} = await req.body;
        await connectDB();
        const existingUser = await User.findOne({ email:email });
        if(existingUser === null){
            return await res.status(401).json({ message: "User not found" });
        } else{
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return await res.status(401).json({ message: "Invalid credentials" });
            } else {
                return await res.status(200).json({message: "Successful Login"})
            }
        }
        

    }
    catch(error){
        console.log(error);
    }
}