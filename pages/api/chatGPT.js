export default async function chat(req, res) {

    console.log(req)

    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.question,
      max_tokens: 512,
      temperature: 0,
    });
    
    const completion = response['data']['choices'][0]['text'];

    console.log(completion);

    // Need to implement error message on frontend if API call fails
  
    res.status(200).json({ result: completion })
  }