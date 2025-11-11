const createError = (status, message) => {
    const err = new Error(message || "Internal Server Error");
    err.status = status || 500;
    err.success = false;
    return err;
}

export default createError;