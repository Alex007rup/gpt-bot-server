const express = require("express");
const dotenv = require("dotenv");
const { marked } = require("marked");
const hljs = require("highlight.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const app = express();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

marked.setOptions({
    highlight: (code, lang) => {
        return hljs.highlight(lang, code).value;
    },
    breaks: true,
    gfm: true,
    tables: true,
    smartLists: true,
    smartypants: true,
    xhtml: true,
});

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", async (req, res) => {
    const prompt = "create a table for indian patriots";
    const result = await model.generateContent(prompt);
    const markdown = result.response.text();
    const html = marked(markdown);
    const fullHtml = `
    <html lang="en">
    <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css">
      <link rel="stylesheet" href="/style-server.css">
    </head>
    <body>
      ${html}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
      <script>
        hljs.highlightAll();
      </script>
    </body>
    </html>
  `;
    res.send(fullHtml);
});

app.listen(process.env.PORT, (err) => {
    err && console.log(err);
    !err && console.log("Server Started");
});
