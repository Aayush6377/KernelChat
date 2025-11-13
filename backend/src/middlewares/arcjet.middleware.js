import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import createError from "../utils/createError.js";

const arcjetProtection = async (req,_,next) => {
    try {
        const ua = (req.headers["user-agent"] || "").toString();

        if (/PostmanRuntime/i.test(ua)) {
            return next();
        }

        const decision = await aj.protect(req);

        if (decision.isDenied()){
            if (decision.reason.isRateLimit()){
                throw createError(429, "Rate limit exceeded. Please try again later.");
            }
            else if (decision.reason.isBot()){
                throw createError(403, "No bots allowed");
            }
            else{
                throw createError(403, "Access denied by security policy");
            }
        }

        if (decision.results.some(isSpoofedBot)){
            throw createError(403, "Malicious bot activity detected");
        }
        
        next();
    } catch (error) {
        next(error);
    }
}

export default arcjetProtection;