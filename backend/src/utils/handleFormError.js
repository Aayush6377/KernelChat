import { validationResult } from "express-validator";
import fs from "fs";

const handleFormError = (req,res,next) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        const errors = Object.fromEntries(
            Object.entries(result.mapped()).map(([key,value]) => [key, value.msg])
        );

        if (req.file){
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error("Error deleting orphaned file on validation fail:", err);
                }
            });
        }

        return res.status(400).json({success: false, message: "Form validation error", errors});
    }

    next();
}

export default handleFormError;