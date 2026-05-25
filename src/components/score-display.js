const AXES = [
  { key: 'diabolo', label: 'Intensité du Diabolo' },
  { key: 'glacon',  label: 'Densité Glaçonnaire' },
  { key: 'kiwi',   label: 'Équilibre Kiwi' },
  { key: 'banane',  label: 'Audace de la Banane' },
  { key: 'verre',   label: 'Verre & Service' },
];

function stars(n, max = 5) {
  const full = Math.round(n);
  return '★'.repeat(full) + '☆'.repeat(max - full);
}

export function renderScoreHero(score) {
  const el = document.createElement('div');
  el.className = 'score-hero';
  el.setAttribute('role', 'img');
  el.setAttribute('aria-label', `Note globale : ${score.toFixed(1).replace('.', ',')} sur 5`);
  el.innerHTML = `
    <span class="score-number" aria-hidden="true">${score.toFixed(1).replace('.', ',')}</span>
    <span class="score-stars" aria-hidden="true">${stars(score)}</span>
  `;
  return el;
}

export function renderScoreAxes(subScores) {
  const dl = document.createElement('dl');
  dl.className = 'score-axes';
  for (const { key, label } of AXES) {
    const val = subScores[key];
    dl.innerHTML += `
      <dt>${label}</dt>
      <dd aria-label="${val} sur 5">
        <span aria-hidden="true">${stars(val)}</span>
      </dd>
    `;
  }
  return dl;
}
