const fs = require("fs");
const axios = require("axios");
require("dotenv").config();
const xlsx = require("xlsx");
const hsKeyIssa = process.env.hsKeyIssa;

const loopDelay = async (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const hsClient = axios.create({
	baseURL: "https://api.hubapi.com/",
	headers: {
		Authorization: `Bearer ${hsKeyIssa}`
	}
});

const createEmail = async (data) => {
	//console.log(data);
	if (data.state == "PUBLISHED_AB") {
		data.state = "DRAFT_AB";
	}
	if (data.state == "AUTOMATED_AB") {
		data.state = "AUTOMATED_DRAFT_AB";
	}
	if (data.state == "PUBLISHED_AB_VARIANT") {
		data.state = "DRAFT_AB_VARIANT";
	}
	if (data.state == "PUBLISHED") {
		data.state = "DRAFT";
	}
	if (data.state == "AUTOMATED") {
		data.state = "AUTOMATED_DRAFT";
	}
	let emailData = {
		businessUnitId: "1656486",
		publishDate: data.publishDate,
		isPublished: data.isPublished,
		isTransactional: data.isTransactional,
		jitterSendTime: data.jitterSendTime,
		state: data.state,
		subcategory: data.subcategory,
		name: data.name,
		campaignName: data.campaignName,
		fromName: data.from?.fromName,
		replyTo: data.from?.replyTo,
		content: data.content,
		subject: data.subject
	};
	try {
		let email = await hsClient.post(`/marketing/v3/emails`, emailData);
		return email.data;
	} catch (error) {
		console.log("error", error.response.data);
	}
};


// Main function to read, update, and write the Excel file
const main = async () => {
	let emailReadFile = "./full-emails.json";
	const outputFilePath = "written-emails.json";

	const emailData = JSON.parse(fs.readFileSync(emailReadFile));

	let emailArr = [];
	let count = 0;
	for (let email of emailData) {
		// const emailId = email.id;
		await loopDelay(50);
		console.log("email", email.id + " " + count + "name: " + email.name);
		let emailContent = email;
		let createdEmail = await createEmail(emailContent);
		emailArr.push(createdEmail);
		count++;
	}
	fs.writeFileSync(outputFilePath, JSON.stringify(emailArr, null, 2));
	//console.log("data", data);
};

main();
