const OpenAI = require("openai");
const { apiKey } = require("./dotenvConfig"); // Update the path as per your directory structure

const openai = new OpenAI(apiKey);

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
