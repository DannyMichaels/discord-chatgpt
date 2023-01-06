const createS3 = require('../utils/createS3');
const createTextFile = require('../utils/createTextFile');
const { handleError } = require('../utils/errorHandler');
const s3 = createS3();
const axios = require('axios');

module.exports = async (message, openai, prompt) => {
  try {
    const txtFile = [...message.attachments.values()][0];

    // if attaching a text file, concat that to the prompt
    if (txtFile) {
      const response = await axios({
        method: 'get',
        url: txtFile.url,
        responseType: 'plain/text',
      });

      prompt += ` ${response.data}`;
    }

    console.log({ prompt });

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      // prompt: args.join(' '),
      prompt: prompt,
      temperature: 1,
      max_tokens: 2049,
      // stop: ['ChatGPT:', `${message.author.username}:`],
    });

    const text = completion.data.choices[0].text;

    // if longer than 2000 characters make txt file and upload to s3
    if (text.length > 2000 || txtFile) {
      const { data, key } = await createTextFile(s3, message, text);

      let chunks = text.match(/.{1,2000}/g); // chunks of 2000 each
      for await (const chunk of chunks) {
        await message.channel.send(chunk);
      }

      await message.reply({
        files: [{ attachment: data.Location, name: `${prompt}.txt` }],
      });

      await s3
        .deleteObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
        })
        .promise();

      return;
    }

    return await message.reply(text); // MUST USE AWAIT HERE
  } catch (error) {
    console.log({ error });
    const error1 = error?.response?.data?.error?.message;
    const error2 = error?.rawError?.message;

    return handleError(message, (error1 || error2) ?? 'ERROR');
  }
};
