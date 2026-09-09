/** Augmenter le volume exige une validation explicite, sans modifier le cron ni lever ses verrous. */
export function capaciteEmail(env: Record<string, string | undefined>) {
  const valeur = Number(env.EMAIL_DAILY_CAP);
  const demandee = Number.isInteger(valeur) && valeur >= 10 && valeur <= 1500 ? valeur : 150;
  return env.EMAIL_CAPACITY_VALIDATED === "true" ? demandee : Math.min(150, demandee);
}
export function reserveComplements(budget: number, actifs: boolean) {
  return actifs ? Math.floor(budget * 0.2) : 0;
}
