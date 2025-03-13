import fs from "fs";
import axios from "axios";

export async function createChart(config, name) {
  try {
    const url = `https://quickchart.io/chart?c=${encodeURIComponent(
      JSON.stringify(config)
    )}`;

    const response = await axios.get(url, { responseType: "arraybuffer" });

    fs.writeFileSync(`graficos/${name}.png`, response.data);
    console.log(`Imagem do gráfico ${name} salva!`);
  } catch (e) {
    console.log(e);
  }
}
