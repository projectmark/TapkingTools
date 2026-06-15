# Changelog - TapkingTools

Dit document bevat de release-historie en wijzigingen van **TapkingTools**, bedacht door **Mark Tapking**.

---

## [v0.1.1] - 14 juni 2026

### Toegevoegd & Gewijzigd
* **Hernoeming tool:** De *Terugbelverzoek tool* is hernoemd naar **Contactverzoek tool** om beter aan te sluiten bij de nieuwe functionaliteiten voor bellen én mailen.
* **Frontend:**
  * Keuzerondjes toegevoegd om expliciet te kiezen tussen een terugbelverzoek (bellen) of e-mailverzoek (mailen).
  * Interface-labels, inline iconen en badges (`*` / `Optioneel`) veranderen dynamisch mee op basis van de geselecteerde contactvorm.
  * De lay-out van het formulier en de live preview is compacter en overzichtelijker gemaakt.
* **Backend & Logica:**
  * Interne module hernoemd van `callback` naar `contact`.
  * Intelligente validatielogica geïmplementeerd: bij een terugbelverzoek is het telefoonnummer verplicht, bij een e-mailverzoek het e-mailadres.
  * Formuliergegevens worden veilig opgeslagen in `localStorage`.
  * Live e-mail preview en onderwerp-generatie tonen automatisch de juiste e-mailindeling en onderwerp-prefix.

---

## [v0.1.0] - 13 juni 2026

### Toegevoegd
* **Basis Architectuur:** De eerste release van TapkingTools. De basis is opgezet als een modulair framework waarmee toekomstige tools eenvoudig kunnen worden toegevoegd en geïntegreerd.
* **Terugbelverzoek tool:** Als eerste module gebouwd om snel en professioneel terugbelverzoeken te registreren en te kopiëren voor verdere afhandeling. Deze tool zal in de toekomst verder worden uitgebreid.
