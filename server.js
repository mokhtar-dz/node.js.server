const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = '<YOUR_API_KEY>';

const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function sendQueryToChatGPT(prompt) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: prompt}],
      temperature: 0.5,
      max_tokens:4096,
      n: 1
    });
    //let reslut = completion.data.choices[0].message.content;
    let data = completion.data.choices.map((choice) => {
      return {
        content: choice.message.content,
        // add any other properties you need here
      };
    });
    return data;
}
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  try {
    
    res.status(200).send("Hello Server : MOKHTAR MANSOURI");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/correct', async (req, res) => {
  try {
    const response = await sendQueryToChatGPT("Corriger ce text de tout type d'erreur <"+ req.body.text +">.");
    const stringResponse = JSON.stringify(response);
    res.status(200).send({ result:"HELLO"  });
  } catch (error) {
    console.error(error);
    res.status(200).json({ result : error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
