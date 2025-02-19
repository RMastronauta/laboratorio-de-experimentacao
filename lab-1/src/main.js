import { getPercentOldRepositories } from "../rqs/rq1.js";
import { getPercentOldRepositories } from "./requisitos/requisito-1.js";

const start = async () => {
  const listRepositories = await getRepositoriesQuantity(1000);

  console.log(await getPercentOldRepositories(listRepositories));
};

start();
