import mongoose from 'mongoose';

export const connectToDB = async () => {
  const connectionString = process.env.CONNECTION_STRING;

  if (!connectionString) {
    console.error('Error: CONNECTION_STRING is not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(connectionString);
    console.log('Connected to database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};
