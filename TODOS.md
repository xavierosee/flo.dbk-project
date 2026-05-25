# TODOS — Le Guide DBK

## QR code imprimable (v1.1)
- **What:** QR code par pub, rendu dans la fiche et imprimable.
- **Why deferred:** Coupé du scope v1 lors de l'eng review (2026-05-25) — cas d'usage jugé trop niche pour justifier la dépendance + le CSS print + un test.
- **Use case (le vrai):** le bar imprime le QR et l'affiche au comptoir/mur ; les clients le scannent pour arriver sur la fiche du bar dans le Guide DBK. Ce n'est PAS "scanner l'URL où on est déjà".
- **Pros:** pont numérique→physique réel ; effet démo portfolio (maîtrise du print CSS).
- **Cons:** dépendance `qrcode`, CSS `@media print`, bloc DOM dédié, test — pour un usage rare.
- **Context:** en path routing v1, l'URL est `https://lindexdbk.fr/pub/[pub_id]`. Reprise : npm `qrcode` → `QRCode.toDataURL(url)` → `<img>` dans un `.pub-qr-block` masqué (`display:none`) sauf `@media print { display:block }`. Bouton "Imprimer" → `window.print()`.
- **Depends on / blocked by:** rien (indépendant). À faire après stabilisation v1.
