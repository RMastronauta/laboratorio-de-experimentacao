async function getTempoMedioAtualizacaoRepositories(arrayRepositories) {
  let totalOldRepositories = 0;
  const today = new Date();

  for (const repo of arrayRepositories) {
    const updatedAt = new Date(repo.updatedAt);
    const ageDiffs = (today - updatedAt) / (1000 * 60 * 60 * 24 * 30); // pegando diferença em meses
    if (ageDiffs < 12)
      // Considerando repositórios com mais de 1 ano sem atualização
      totalOldRepositories++;
  }

  if (arrayRepositories.length === 0) return 0; // Evita divisão por zero

  let oldPercentRepos = (totalOldRepositories / arrayRepositories.length) * 100;
  return oldPercentRepos;
}

export { getTempoMedioAtualizacaoRepositories };
