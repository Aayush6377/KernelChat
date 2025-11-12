import multer from "multer";

const uploader = multer({ dest: "uploads/", limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: (_,file,cb) => {
    const allowedMimetypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedMimetypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("File type not supported. Only JPEG, PNG, or WebP are allowed."), false);
    }
} })

export default uploader.single("profilePic");