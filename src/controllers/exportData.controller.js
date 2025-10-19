import { Session } from "../models/attempted.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Parser } from "json2csv";
import { ApiError } from "../utils/ApiError.js";

export const exportResultsAsCsv = asyncHandler(async (req, res) => {
    // 1. Fetch all submitted sessions from the database.
    // The .populate() method is the key: it automatically fetches the linked user's details.
    const sessions = await Session.find({ status: "submitted" })
        .populate({
            path: 'userId', // The field in the Session schema we want to populate
            model: 'User', // The model to use for the lookup
            select: 'fullName rollNumber email phoneNumber' // Specify which user fields to retrieve
        });

    if (!sessions || sessions.length === 0) {
        throw new ApiError(404, "No submitted quiz sessions found to export.");
    }

    // 2. Transform the data into a flat structure suitable for a CSV file.
    const flattenedData = sessions.map(session => {
        // Safety check in case a user was deleted but their session remains
        const userDetails = session.userId || {}; 
        return {
            'Name': userDetails.fullName,
            'Roll Number': userDetails.rollNumber,
            'Email': userDetails.email,
            'Phone Number': userDetails.phoneNumber,
            'Score': session.score,
            'Submitted At (IST)': session.completedAt 
                ? new Date(session.completedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) 
                : 'N/A',
        };
    });

    // 3. Define the fields/columns for the CSV in the desired order.
    const fields = ['Name', 'Roll Number', 'Email', 'Phone Number', 'Score', 'Submitted At (IST)'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(flattenedData);

    // 4. Set HTTP headers to tell the browser to download the file.
    res.header('Content-Type', 'text/csv');
    res.attachment('quiz-results.csv');
    res.status(200).send(csv);
});

