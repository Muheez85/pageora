const express = require("express");
const { getBooks,getBookBySlug,createBook,updateBook} = require("../controllers/bookController");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.get("/", getBooks);


router.get("/:slug", getBookBySlug)


router.post("/", upload.single("image"), createBook);

router.patch("/:id", upload.single("image"), updateBook);

module.exports = router;