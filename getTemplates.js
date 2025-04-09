const fs = require("fs");
const axios = require("axios");
require("dotenv").config();
const xlsx = require("xlsx");
const hsKey = process.env.hsKey;
const loopDelay = async (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

//Get all Email from source portal
let getAllEmails = async () => {
	let requestObj = {
		method: "GET",
		url: 'https://api.hubapi.com/marketing/v3/emails/?limit=100&createdAfter=2024-12-09T00%3A00%3A00.000Z&createdBefore=2025-01-01T23%3A59%3A59.999Z',
		headers: {
			Authorization: `Bearer ${hsKey}`
		}
	};

	let keepLooping = true;

	let allEmails = [];

	while (keepLooping) {
		await loopDelay(100);
		let response = await axios(requestObj);

		allEmails = allEmails.concat(
			response.data.results.map((email) => {
				return {
					templatePath: email.content.templatePath,
					emailName: email.name,
					emailId: email.id
				};
			})
		);

		if (response.data.paging?.next) {
			requestObj.url = response.data.paging.next.link;
		} else {
			keepLooping = false;
		}
	}

	return allEmails;
};

// Function to write updated rows to a new Excel file
// Main function to read, update, and write the Excel file
const main = async () => {
	let emailExcelFile = "./emailsWithTemplates.json";
	try {
		let emails = await getAllEmails();
		fs.writeFileSync(emailExcelFile, JSON.stringify(emails, null, 2));
	} catch (error) {
		console.error("An error occurred:", error);
	}
};
main();


