import './config/env';
import express from "express";

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
	console.log(`SERVER RUNNING ON PORT ${port}`);
});