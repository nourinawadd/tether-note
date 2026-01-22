import 'dotenv/config';
import mongoose from 'mongoose';

if(!(process.env.DB_URI) ) {
    throw new Error('Please define the database connection in .env');
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log(`Connected to database in ${process.env.NODE_ENV} mode`);
    }
    catch(e) {
        console.error('Error connecting to database: ', e);
        process.exit(1);
    }
}

export default connectToDatabase;
