const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate-resume', async (req, res) => {
  try {
    const { name, jobRole, education, experience, skills } = req.body;

    if (!name || !jobRole || !education || !experience || !skills) {
      return res.status(400).json({ message: 'Please fill all fields.' });
    }

    const prompt = `You are an expert resume writer. Create a professional, ATS-friendly resume in plain text.

Candidate Information:
- Name: ${name}
- Target Role: ${jobRole}
- Education: ${education}
- Experience: ${experience}
- Skills: ${skills}

Instructions:
- Keep it concise and high quality.
- Use clear section headings.
- Include: Professional Summary, Skills, Experience, Education.
- Tailor wording to the target role.
- Output only resume text.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const generatedResume = result.response.text();

    return res.json({ generatedResume });
  } catch (error) {
    console.error('Resume generation failed:', error.message);
    return res.status(500).json({ message: 'Failed to generate resume.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
