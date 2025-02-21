import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URL as string);
		console.log("CONNECTED TO DATABASE MongoDB");
	}
	catch (err) {
		console.error(err);
	}
}

export default connectDB;