import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    // verifyJWT has already run and attached req.user
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Forbidden: This resource is accessible only by admins.");
    }
    next();
});