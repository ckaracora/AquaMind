// Gizlilik sayfasının İngilizce metinleri (karar 0021, 5. paket). Türkçe dosyayla (`tr-privacy.ts`) aynı biçimdedir.
//
// TASLAK: Türkçe metin gibi onaylanmadı ve hukuki incelemeden geçmedi. Haklar bölümü Türkiye'deki yasaya (KVKK) değil, kullanıcının
// tabi olduğu veri koruma yasasına atıf yapar; mağaza yayınından önce yayın yapılan ülkelere göre incelenir.
import type { PrivacyMessages } from "./tr-privacy";

export const enPrivacy: PrivacyMessages = {
  eyebrow: "Your data and privacy",
  title: "Privacy",
  updatedAt: "2026-10-31",
  updated: (date) => `Last updated: ${date}`,
  draftNotice: "Draft: this text has not been approved yet and has not been legally reviewed.",
  summaryTitle: "In short",
  summary: [
    "Everything you enter in AquaMind is stored only in the browser on this device. It is not sent to us, and there is no copy on any server of ours.",
    "There are no accounts. We do not use cookies, advertising, analytics or tracking tools.",
    "The site is served by a hosting service called Vercel. As with any website, when you open a page your browser sends its IP address and browser information to Vercel's servers.",
  ],
  sections: [
    {
      title: "What is stored on this device",
      paragraphs: [
        "Your aquariums, water readings, maintenance records, livestock, plants, equipment and settings are kept in your browser's local storage (localStorage). A deleted aquarium is kept on this device for 30 more days so that you can restore it.",
        "The \"Full name\" and \"Email\" fields on the Settings page are not saved anywhere today.",
        "This data does not move to another device or browser by itself. If you clear the browser's site data, or the browser clears it to free up space, the data is deleted too. That is why we recommend making regular backups from Settings.",
      ],
    },
    {
      title: "Backup file",
      paragraphs: [
        "The \"Export data\" button downloads a JSON file containing all your records. The file is not encrypted: anyone who opens it can read its contents. Keep it somewhere you trust and do not share it with anyone.",
        "\"Restore from backup\" loads this file only into the browser on this device; the file is not sent anywhere.",
      ],
    },
    {
      title: "The service that hosts the site",
      paragraphs: [
        "AquaMind's pages are served by Vercel Inc. (United States). When you open a page, your browser sends its IP address and browser information to Vercel's servers along with the page it requests. Vercel processes this information to run the service and keep it secure.",
        "Your aquarium records are not added to these requests; they stay in your browser.",
      ],
      link: { label: "Vercel privacy policy", url: "https://vercel.com/legal/privacy-policy" },
    },
    {
      title: "Links to other sites",
      paragraphs: [
        "If you click a source, store or guide link in the catalog, that site opens in a new tab. That site's own privacy rules apply.",
      ],
    },
    {
      title: "Deleting your data",
      paragraphs: [
        "Settings → \"Reset all data\" deletes all AquaMind records on this device. Clearing the browser's site data has the same effect. Backup files you downloaded are on your device; you delete them yourself.",
      ],
    },
    {
      title: "Your rights and contacting us",
      paragraphs: [
        "You can write to us to exercise your rights under the data protection law that applies to you, or to ask a question about this text.",
      ],
      pending: "The data controller's name and contact address have not been decided yet; they will be added here before publication.",
    },
    {
      title: "If this text changes",
      paragraphs: [
        "If accounts, cloud sync or social features are added, what data goes where will change. This text will be updated before those features arrive, and the change will be shown on this page with its date.",
      ],
    },
  ],
  opensNewTab: "opens in a new tab",
  backToSettings: "Back to Settings",
};
