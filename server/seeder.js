import mongoose from 'mongoose';
import dotenv from 'dotenv';
import foodData from './data/foodData.js';
import Food from './models/Food.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();


const importData = async () => {
    try {
        await Food.deleteMany();
        await User.deleteMany();

        await Food.insertMany(foodData);

        // Create a default admin
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'admin'
        });

        // Create a default user
        await User.create({
            name: 'User',
            email: 'user@example.com',
            password: 'password123',
        });

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {

        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Food.deleteMany();
        console.log('Data Destroyed Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
