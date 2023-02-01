export default async function (req, res) {

  const url = "https://api-inference.huggingface.co/models/stanford-crfm/pubmedgpt";

  const api_token = process.env.REACT_APP_API_KEY;

  const response = await fetch(url, {
    method: "POST",
    headers: {"Authorization": `Bearer ${api_token}`},
    body: JSON.stringify({
      "inputs": {
        "past_user_inputs": null,
        "generated_responses": null,
        "text": "Photosynthesis is "
      },
      "options": {
        "use_gpu": true,
        "use_cache": false,
        "wait_for_model": false
      }
    })
  });

  const data = await response.json();

  console.log(data);

  res.status(200).json({ result: data })
}