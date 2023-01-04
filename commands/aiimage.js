const buildEmbed = require('../utils/buildEmbed');
const { handleError } = require('../utils/errorHandler');

module.exports = async (message, openai, prompt) => {
  try {
    message.reply('one moment, crafting an image...');

    const imageResp = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
    });
    const imageUrl = imageResp.data.data[0].url;
    const embed = buildEmbed(imageUrl);
    return message.reply({ embeds: [embed] });
  } catch (error) {
    console.log(error.response.data.error.message);
    return handleError(message, error.response.data.error.message);
  }
};
