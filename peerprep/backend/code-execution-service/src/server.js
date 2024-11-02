const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.post('/run-code', (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  // Write the code to a temporary file
  const tempFilePath = path.join(__dirname, 'tempCode.js');
  fs.writeFileSync(tempFilePath, code);

  // Run the temporary file using Node.js
  exec(`node ${tempFilePath}`, (error, stdout, stderr) => {
    // Clean up the temporary file after execution
    fs.unlinkSync(tempFilePath);

    if (error) {
      return res.json({ output: stderr || 'Error occurred' });
    }
    res.json({ output: stdout || 'No output' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
