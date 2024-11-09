const axios = require('axios');

const assessCode = async (req, res) => {
    console.log('assessCode controller activated');
    try {
        const { codeDetails } = req.body;
        if (!codeDetails) {
            res.status(400).json({ error: 'Code content is required' });
            return;
        }

        const instructionalPrompt =
            "Analyze the following: 1: Question, and its 2: Description, and 3: The code attempt. " + "\n" +
            "Assess the code, focusing on its efficiency and style. Determine the correctness of the code, given the language and question specified. " +
            "Your response should include:" + "\n" +
            "\n" +
            "\t1. Time Complexity – Provide the Big-O notation." + "\n" +
            "\t2. Space Complexity – Provide the Big-O notation." + "\n" +
            "\t3. Code Style – Briefly assess readability, naming conventions, and formatting." + "\n" +
            "\t4. Optimization Hints – Suggest improvements if the time or space complexity could be reduced." + "\n" +
            "\t5. General Comments – Summarize any other relevant observations and assess correctness to question requirements " +
            "(e.g., potential edge cases, overall structure)." + "\n" +
            "\n" +
            "Keep each response concise but comprehensive.";

        console.log('Submitting code to OpenAI API:', instructionalPrompt, codeDetails);

        // API request to OpenAI for code assessment
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: "You are a coding assistant." },
                    { role: 'user', content: `${instructionalPrompt}\n\n${codeDetails}` }
                ],
                temperature: 0
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        const feedback = response.data.choices[0].message.content;
        res.json({ feedback });
    } catch (error) {
        console.error('Error in assessCode controller:', error);
        res.status(500).json({ error: 'Failed to process code assessment' });
    }
};

module.exports = {
    assessCode
};