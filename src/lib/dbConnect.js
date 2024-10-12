
import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  console.log('Connecting to DB...');
  return mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;
