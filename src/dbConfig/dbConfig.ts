import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

export async function connect(): Promise<void> {
  if (connection.isConnected) {
    console.log("db already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("db connected successfully");
  } catch (error) {
    console.log("db failed to connect Error: ", error);
    process.exit(1);
  }
}
