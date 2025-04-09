const fs = require("fs");
const axios = require("axios");
require("dotenv").config();
const xlsx = require("xlsx");
const hsKey = process.env.hsKey;

let emailExcelFile = "/Users/nikod/Code/issa/emails.xlsx";

const loopDelay = async (ms) => {};

let readExcel = (emailExcelFile) => {
	const workbook = xlsx.readFile(emailExcelFile);
	const sheetName = workbook.SheßetNames[0];
	const worksheet = workbook.Sheets["EMAILS"];
	const headers = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];
	const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);

	return { data, headers };
};

let templateFile = JSON.parse(
	fs.readFileSync("/Users/nikod/Code/issa/emailsTemplates.json")
);

const updateRows = async (data, headers, columnName) => {
	const columnIndex = headers.indexOf(columnName);
	const templatePathIndex = headers.length;

	// Add "Template Path" to headers
	headers.push("Template Path");

	// Loop through the rows and update
	for (let row of data) {
		if (row[columnIndex]) {
			console.log("row[columnIndex]", row[columnIndex]);
			let matchingTemplate = templateFile.find((template) => {
				return template.emailName === row[columnIndex];
			});
			console.log("templatePath", matchingTemplate);
			row.push(matchingTemplate.templatePath);
			console.log("row", row);
		}
	}
	return data;
};

// Function to write updated rows to a new Excel file
const writeExcel = (data, headers, outputFilePath) => {
	const worksheet = xlsx.utils.aoa_to_sheet([headers, ...data]);
	const workbook = xlsx.utils.book_new();
	xlsx.utils.book_append_sheet(workbook, worksheet, "UpdatedSheet");
	xlsx.writeFile(workbook, outputFilePath);
};

// Main function to read, update, and write the Excel file
const main = async () => {
	let emailExcelFile = "/Users/nikod/Code/issa/emails.xlsx";
	const outputFilePath = "HCI Emails with Template Path Test.xlsx";
	const columnName = "Asset Name"; // Replace with the actual column name

	const { data, headers } = readExcel(emailExcelFile);

	console.log("data", data);
	return;
	// Ensure data is iterable
	if (!Array.isArray(data)) {
		console.error("Data is not iterable");
		return;
	}

	const updatedData = await updateRows(data, headers, columnName);
	writeExcel(updatedData, headers, outputFilePath);

	console.log("Excel file updated and saved to", outputFilePath);
};

main();

