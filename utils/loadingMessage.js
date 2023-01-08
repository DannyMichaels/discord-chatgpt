let loadingMessage;
let intervalId;
let dotsCount = 1;

const animateLoadingMessage = async (message) => {
  loadingMessage = await message.reply(`${text}.`);

  intervalId = setInterval(() => {
    dotsCount = dotsCount === 3 ? 1 : (dotsCount += 1);
    loadingMessage.edit(`${text}${'.'.repeat(dotsCount)}`);
  }, 1000);

  return loadingMessage;
};

const deleteLoadingMessage = async () => {
  clearInterval(intervalId);
  return await loadingMessage.delete();
};

module.exports = {
  animateLoadingMessage,
  deleteLoadingMessage,
};
