## HubSpot Email Migration
Scripts for migrating email templates between HubSpot portals.
Setup

Install dependencies: npm install axios dotenv xlsx
Create .env file with API keys:
hsKey=source_portal_api_key
hsKeyIssa=destination_portal_api_key


## Scripts
Run these in sequence:

getTemplates.js: Fetches email templates from source portal

Output: emailsWithTemplates.json


getEmails.js: Gets full email content for each template

Input: emailsWithTemplates.json
Output: full-emails.json


createEmails.js: Creates emails in destination portal

Input: full-emails.json
Output: written-emails.json
Converts published emails to draft state



## Notes

Includes delay functions to prevent API rate limiting
Business unit ID is hardcoded (1656486) in createEmails.js
Date range filter: Dec 9, 2024 - Jan 1, 2025
