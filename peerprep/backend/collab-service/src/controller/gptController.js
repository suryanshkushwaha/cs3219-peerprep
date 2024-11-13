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
          "Analyze the following: 1: Question, and its 2: Description, and 3: The code attempt. " +
          "\n" +
          "Assess the code, focusing on its efficiency and style. Determine the correctness of the code, given the language and question specified. " +
          "Always ensure to not divulge the solution to the question, or any hints that will spoil the solution. " +
          "\n" +
          "Your response should include:" +
          "\n" +
          "\n" +
          "\t1. Time Complexity – Provide the Big-O notation." +
          "\n" +
          "\t2. Space Complexity – Provide the Big-O notation." +
          "\n" +
          "\t3. Code Style – Briefly assess readability, naming conventions, and formatting." +
          "\n" +
          "\t4. Optimization Hints – Suggest improvements if the time or space complexity could be reduced, while ensuring to not expose the solution details." +
          "\n" +
          "\t5. Correctness – Summarize any other relevant observations and assess correctness to question requirements " +
          "(e.g., potential edge cases, overall structure)." +
          "\n" +
          "\n" +
          "Keep each response concise but comprehensive." +
          "\n" +
          "\n" +
          "Here are some few shot exmples of inputs and the expected repsonses you hsould produce:" +
          "\n" +
          "Example 1:\n" +
          "1: Question - Two Sum\n" +
          "2: DescriptionGiven an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n" +
          "3: Code attempt in - javascript\n" +
          "const nums = [2, 7, 11, 15];\n" +
          "const target = 9;\n" +
          "let result = [];\n" +
          "for (let i = 0; i < nums.length; i++) {\n" +
          "    for (let j = i + 1; j < nums.length; j++) {\n" +
          "        if (nums[i] + nums[j] === target) {\n" +
          "            result = [i, j];\n" +
          "        }\n" +
          "    }\n" +
          "}\n" +
          "console.log(result);\n\n" +
          "Expected response 1: \n" +
          "1. Time Complexity: The time complexity of the code is O(n^2), where n is the length of the array. This is because of the nested loops that iterate over the array.\n\n" +
          "2. Space Complexity: The space complexity of the code is O(1), as no additional space is used apart from a single array to store the result.\n\n" +
          "3. Code Style: The code style is basic but functional. Variable names like `nums`, `target`, and `result` are descriptive enough. However, the use of nested loops reduces readability and efficiency. Adding comments to describe the algorithm would improve clarity.\n\n" +
          "4. Optimization Hints: Try using a data structure to track the numbers you’ve seen so far. It’ll help you quickly check if the matching number for the target is already there, saving a lot of extra work!\n\n" +
          "5. Correctness: The code works for small inputs but is inefficient for large arrays. It also does not handle cases where no two numbers add up to the target. Adding an edge case check would make the solution more robust.\n" +
          "\n" +
          "\n" +
          "Example 2:\n" +
          "1: Question - Roman to Integer\n" +
          "2: DescriptionGiven a roman numeral, convert it to an integer.\n" +
          "3: Code attempt in - python\n" +
          "I = 1\n" +
          "V = 5\n" +
          "X = 10\n" +
          "L = 50\n" +
          "C = 100\n" +
          "D = 500\n" +
          "M = 1000\n" +
          's = "LVIII"\n' +
          "length = len(s)\n" +
          "numbers = list(map(list, s))\n" +
          "x = 0\n" +
          "while x < length:\n" +
          "    print(numbers[x])\n" +
          "    x = x + 1\n\n" +
          "Expected response 2:\n" +
          "1. Time Complexity: The time complexity of the code is O(n), where n is the length of the string. This is because the code iterates over the string once.\n\n" +
          "2. Space Complexity: The space complexity of the code is also O(n), where n is the length of the string. This is because the code creates a list of characters from the string.\n\n" +
          "3. Code Style: The code style is not very good. The variable names are not descriptive, which makes the code hard to understand. The code also lacks comments, which would help explain what each part of the code is doing. The use of a while loop instead of a for loop also makes the code less readable.\n\n" +
          "4. Optimization Hints: Try using a data structure to answer this question, maybe something to store your mappings?\n\n" +
          "5. Correctness: The code does not actually convert the roman numeral to an integer, it just prints out the characters in the string. The code does not handle many example cases as well, try to think about more basic testcases and handle them.\n" + 
          "\n" +
          "Example 3:\n" +
          "1: Question - Roman to Integer\n" +
          "2: DescriptionGiven a roman numeral, convert it to an integer.\n" +
          "3: Code attempt in - python\n" +
          "test\n" +
          "Expected response 3: \n" +
          "Without the code attempt, it's impossible to provide a detailed analysis. Please provide the code you want to be analyzed.";

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