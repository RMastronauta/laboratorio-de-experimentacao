const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const progressBarStep = (loaded, total, barLength = 30) => {
  const percent = ((loaded / total) * 100).toFixed(0);
  const progress = Math.round((loaded / total) * barLength);

  const bar = '█'.repeat(progress) + '-'.repeat(barLength - progress);

  process.stdout.write(`\r[${bar}] ${percent}% | ${loaded}/${total}`);
};

const progressBar = async (total = 20, delay = 100) => {
  for (let i = 0; i <= total; i++) {
    progressBarStep(i, total);
    await sleep(delay);
  }
};

export { progressBar, progressBarStep };
