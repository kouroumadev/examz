const fs = require("fs");
backend_url = process.env.BACKEND_URL;
frontend_url = process.env.WEB_URL;
s3Enabled = process.env.S3_ENABLED
is_dev = process.env.NODE_ENV === "development"
if (s3Enabled === undefined) {
    if (is_dev) {
        s3Enabled = false
    } else {
        s3Enabled = true
    }
} else {
    s3Enabled = s3Enabled === "true";
}
if (is_dev) {
    if (backend_url === undefined) {
        backend_url = "http://localhost:8000";
    }
    if (frontend_url === undefined) {
        frontend_url = "http://localhost:3000";
    }
} else {
    S3Enabled = true
    if (backend_url === undefined) {
        backend_url = "https://api.examz.pro";
    }
    if (frontend_url === undefined) {
        frontend_url = "https://examz.pro";
    }
}
const content = 'const baseUrl = "' + backend_url + '";\nconst s3Enabled=' + s3Enabled + '\nconst config = {baseUrl, s3Enabled}\nexport default config\n';
fs.writeFile("config.js", content, (err) => {
    if (err) {
        console.error(err);
    }
});

module.exports = {
    images: {
        reactStrictMode: true, domains: [frontend_url],
    },
};
