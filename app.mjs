import express from "express";
import cors from "cors";
import { blogPosts } from "./db/index.mjs";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/articles", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));

    const startIndex = (safePage - 1) * safeLimit;
    const endIndex = startIndex + safeLimit;

    const results = {
      totalPosts: blogPosts.length,
      totalPages: Math.ceil(blogPosts.length / safeLimit),
      currentPage: safePage,
      limit: safeLimit,
      articles: blogPosts.slice(startIndex, endIndex),
    };

    if (endIndex < blogPosts.length) {
      results.nextPage = safePage + 1;
    }

    if (startIndex > 0) {
      results.previousPage = safePage - 1;
    }

    return res.json(results);
  } catch (e) {
    return res.json({
      message: e.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
