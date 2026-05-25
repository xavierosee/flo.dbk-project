export function mountNotFoundView(container) {
  container.innerHTML = `
    <main class="not-found" role="main">
      <p class="not-found__code">404</p>
      <h1 class="not-found__title">Établissement introuvable</h1>
      <p class="not-found__body">
        L'Inspecteur DBK a cherché. Il a goûté. Il n'a rien trouvé à cette adresse —
        ou alors un verre de limonade ordinaire, sans sirop de banane, sans sirop de kiwi,
        sans âme. Ce n'est pas ici.
      </p>
      <a href="#/" class="not-found__back">Retour au classement</a>
    </main>
  `;
}
