import { validationResult } from "express-validator";

const handleFormError = (req,res,next) => {
    const result = validationResult(req);

    if (!result.isEmpty()){
        const errors = Object.fromEntries(
            Object.entries(result.mapped()).map(([key,value]) => [key, value.msg])
        );

        if (req.file){

        }

        return res.status(400).json({success: false, message: "Form validation error", errors});
    }

    next();
}

export default handleFormError;