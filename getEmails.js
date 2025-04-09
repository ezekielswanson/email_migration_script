
//To manipulate the files
const fs = require("fs");

//Library for the requests
const axios = require("axios");

//Seucurity for the api key
require("dotenv").config();

//To manipulate the excel file
const xlsx = require("xlsx");

//Storing the hs api key
const hsKey = process.env.hsKey;

const loopDelay = async (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};


//Update this
let readExcel = (emailExcelFile) => {
	const workbook = xlsx.readFile(emailExcelFile);
	const sheetName = workbook.SheetNames[0];
	const worksheet = workbook.Sheets["EMAILS"];
	const headers = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
	const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);

	return { data, headers };
};




/*
Get the matching email by id in hubspot and returns their data
*/

let identifyAssociatedTemplateInHubSpot = async (emailId) => {
	let hsClient = axios.create({
		baseURL: "https://api.hubapi.com/",
		headers: {
			Authorization: `Bearer ${hsKey}`
		}
	});

	let getEmailTemplateId = await hsClient.get(
		`/marketing/v3/emails/${emailId}`
	);
	let email = getEmailTemplateId.data;

	return email;
};

// Main function to read, update, and write the Excel file
//Reads through email template data and grabs the id from emails

const main = async () => {
	let emailJsonFile = "./emailsWithTemplates.json";
	const outputFilePath = "full-emails.json";

	const emailData = JSON.parse(fs.readFileSync(emailJsonFile));
	let emailArr = [];
	for (let email of emailData) {

		//Loop through get email id's
		console.log("email", email);
		let emailId = email.emailId;
		
		let emailContent = await identifyAssociatedTemplateInHubSpot(emailId);
		emailArr.push(emailContent);
	}
	fs.writeFileSync(outputFilePath, JSON.stringify(emailArr, null, 2));
	// console.log("data", data);
};

main();
