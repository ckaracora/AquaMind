// Herkese açık tür sayfasının içeriği (docs/DECISIONS/0047-herkese-acik-tur-sayfalari.md). Yalnız sunucuda, derleme anında çalışır: katalog,
// davranış ve bakım kayıtları burada okunur, sayfaya yalnız hazır metin gider; tarayıcıya katalog gönderilmez. İçerik tür kartıyla aynı
// kurallardan gelir (src/lib/species-card.ts): kaynağın yazmadığı değerin satırı kurulmaz, çevirisi olmayan katalog metni gösterilmez.
// Yeni tür verisi üretilmez; sayılar katalogdaki değerlerdir (İngilizcede ABD birimleri parantez içinde, çevrilmiş olarak eklenir).
import {
  LOCALE_NAMES, cmToInches, createDisplayFormat, formatCalendarDate, loadLocaleBundle, localeBundle, messagesFor, type Locale,
} from "@aquamind/localization";
import { catalogTranslator } from "@aquamind/localization/catalog";
import { loadPublicPageMessages, type PublicPageMessages } from "@aquamind/localization/public-pages";
import { loadSpeciesCareTexts, speciesCareTranslator } from "@aquamind/localization/species-care";
import { isVerifiedSpeciesProfile, speciesById, type SpeciesProfile } from "@/data/catalog-species";
import { speciesBehavior } from "@/data/species-behavior";
import { speciesCare } from "@/data/species-care";
import { PUBLIC_LOCALES, PUBLIC_SPECIES_IDS, speciesIndexPath, speciesPagePath, tryInAppHref } from "@/lib/public-pages";
import { behaviorSummary, cardSources, CARE_TEXT_FIELDS, hasCareInfo } from "@/lib/species-card";

export interface PublicRow { label: string; value: string; detail?: string; secondary?: string }
export interface PublicBehaviorLine { text: string; conflict?: string; condition?: string; source?: string; secondary?: string }
export interface PublicLanguageLink { locale: Locale; name: string; href: string; current: boolean }

/** Sayfanın ortak çerçevesi (üst şerit ve dil bağlantıları). */
export interface PublicFrame { locale: Locale; text: PublicPageMessages; languages: PublicLanguageLink[]; indexHref: string }

export interface PublicSpeciesView extends PublicFrame {
  id: string;
  name: string;
  scientificName: string;
  title: string;
  description: string;
  labels: { catalogTitle: string; behaviorTitle: string; careTitle: string; sourcesTitle: string; sourceNote: string };
  facts: PublicRow[];
  behavior: PublicBehaviorLine[];
  behaviorUnknown?: string;
  notes: string[];
  care: PublicRow[];
  /** Kaynaklar adlarına göre: aynı sitenin birden çok sayfası tek adın altında. */
  sources: { name: string; urls: string[] }[];
  verifiedAt?: string;
  tryHref: string;
}

export interface PublicIndexView extends PublicFrame {
  title: string;
  description: string;
  species: { id: string; name: string; scientificName: string; href: string }[];
}

/** Dilin bütün metinleri: arayüz (tür kartı etiketleri), canlı ve bakım katalog çevirisi, bu sayfaların metinleri. */
async function localeTexts(locale: Locale) {
  await Promise.all([loadLocaleBundle(locale), loadSpeciesCareTexts(locale)]);
  return {
    t: messagesFor(locale),
    catalog: catalogTranslator(locale, localeBundle(locale)?.catalogSpecies),
    careText: speciesCareTranslator(locale),
    text: await loadPublicPageMessages(locale),
  };
}

function frame(locale: Locale, text: PublicPageMessages, pathFor: (locale: Locale) => string): PublicFrame {
  return {
    locale, text, indexHref: speciesIndexPath(locale),
    languages: PUBLIC_LOCALES.map((other) => ({ locale: other, name: LOCALE_NAMES[other], href: pathFor(other), current: other === locale })),
  };
}

/** Sayfada gösterilebilen tür: listede, katalogda, kaynaklı ve doğrulanmış. */
export function publicSpeciesProfile(id: string): SpeciesProfile | undefined {
  if (!PUBLIC_SPECIES_IDS.includes(id)) return undefined;
  const profile = speciesById(id);
  return isVerifiedSpeciesProfile(profile) ? profile : undefined;
}

/** Aynı adlı kaynakların adresleri tek satırda, ilk geçtiği sırayla. */
export function groupSources(list: readonly { name: string; url: string }[]): { name: string; urls: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const { name, url } of list) groups.set(name, [...(groups.get(name) ?? []), url]);
  return [...groups].map(([name, urls]) => ({ name, urls }));
}

export async function publicSpeciesView(locale: Locale, id: string): Promise<PublicSpeciesView | undefined> {
  const profile = publicSpeciesProfile(id);
  if (!profile) return undefined;
  const { t, catalog, careText, text } = await localeTexts(locale);
  const name = catalog(profile.commonName);
  if (!name) return undefined;
  const c = t.livestock.card;
  const metric = createDisplayFormat(locale, { volume: "liters", temperature: "celsius", dateFormat: "day-first" });
  // İngilizce sayfa ABD'deki okur için galon, °F ve inç değerini de yazar (çevrilmiş değer; katalog metriktir).
  const us = locale === "en" ? createDisplayFormat(locale, { volume: "gallons", temperature: "fahrenheit", dateFormat: "month-first" }) : undefined;
  const range = (low: number, high: number, write: (value: number) => string) => (low === high ? write(low) : `${write(low)}–${write(high)}`);
  const withUs = (value: string, converted?: string) => (converted ? `${value} (${converted})` : value);
  const volume = (liters: number) => withUs(metric.volume(liters), us?.volume(liters));
  const length = (cm: number) => withUs(`${metric.number(cm)} cm`, us ? `${us.number(cmToInches(cm))} in` : undefined);
  const [low, high] = profile.temperature;
  const temperature = withUs(`${range(low, high, (value) => metric.temperatureNumber(value))} ${metric.temperatureSymbol}`,
    us ? `${range(low, high, (value) => us.temperatureNumber(value))} ${us.temperatureSymbol}` : undefined);
  const ph = profile.ph ? range(profile.ph[0], profile.ph[1], (value) => metric.measurement(value)) : undefined;
  const secondary = profile.secondarySources ?? {};
  const secondaryNote = t.common.secondarySource;

  const facts: PublicRow[] = [
    { label: c.adultSize, value: length(profile.adultSizeCm) },
    {
      label: c.minVolume, value: volume(profile.minVolumeL),
      ...(profile.additionalVolumePerAnimalL ? { detail: c.extraVolume(volume(profile.additionalVolumePerAnimalL)) } : {}),
      ...(secondary.minVolumeL?.length ? { secondary: secondaryNote } : {}),
    },
    ...(profile.minTankLengthCm !== undefined ? [{ label: c.minLength, value: length(profile.minTankLengthCm), ...(secondary.minTankLengthCm?.length ? { secondary: secondaryNote } : {}) }] : []),
    { label: c.minGroup, value: c.count(profile.minGroup) },
    { label: c.temperature, value: temperature },
    ...(ph ? [{ label: c.ph, value: ph }] : []),
    ...(profile.flow ? [{ label: c.flow, value: c.flows[profile.flow] }] : []),
  ];

  const records = speciesBehavior[id];
  const summary = behaviorSummary(profile, records);
  const behavior: PublicBehaviorLine[] = summary.lines.map((line) => {
    const condition = line.condition ? catalog(line.condition) : undefined;
    return {
      text: c.behavior[line.kind],
      ...(line.conflict ? { conflict: c.conflict } : {}),
      ...(condition ? { condition } : {}),
      ...(line.source ? { source: c.source(line.source) } : {}),
      ...(line.secondaryUrls ? { secondary: secondaryNote } : {}),
    };
  });
  const notes = [profile.communityCaution, profile.husbandryCaution].map((note) => (note ? catalog(note) : undefined)).filter((note): note is string => Boolean(note));

  const careRecord = speciesCare[id];
  const careInfo = hasCareInfo(careRecord) ? careRecord : undefined;
  const care: PublicRow[] = [];
  if (careInfo) {
    for (const field of CARE_TEXT_FIELDS) {
      const value = careInfo[field] ? careText(careInfo[field]) : undefined;
      if (value) care.push({ label: c.careLabels[field], value });
    }
    if (careInfo.lifespan) care.push({ label: c.careLabels.lifespan, value: c.lifespanValue(metric.number(careInfo.lifespan.years[0]), metric.number(careInfo.lifespan.years[1]), careInfo.lifespan.qualifier) });
    if (careInfo.difficulty) care.push({ label: c.careLabels.difficulty, value: c.difficulties[careInfo.difficulty] });
    if (careInfo.swimLevels?.length) care.push({ label: c.careLabels.swimLevel, value: careInfo.swimLevels.map((level) => c.swimLevels[level]).join(", ") });
    const hardness = careInfo.hardnessDgh;
    if (hardness) care.push({ label: c.careLabels.hardness, value: c.hardnessValue(hardness[0] === null ? undefined : metric.number(hardness[0]), hardness[1] === null ? undefined : metric.number(hardness[1])), detail: c.hardnessNote });
  }

  const sources = cardSources(profile, records, careInfo);
  const groupText = profile.minGroup > 1 ? metric.number(profile.minGroup) : undefined;
  return {
    ...frame(locale, text, (other) => speciesPagePath(other, id)),
    id, name, scientificName: profile.scientificName,
    title: text.speciesTitle(name),
    description: text.speciesDescription({ name, scientificName: profile.scientificName, volume: metric.volume(profile.minVolumeL), temperature: `${range(low, high, (value) => metric.temperatureNumber(value))} ${metric.temperatureSymbol}`, ...(ph ? { ph } : {}), ...(groupText ? { group: groupText } : {}) }),
    labels: { catalogTitle: c.catalogTitle, behaviorTitle: c.behaviorTitle, careTitle: c.careTitle, sourcesTitle: c.sourcesTitle, sourceNote: c.sourceNote },
    facts, behavior, ...(summary.unknown ? { behaviorUnknown: c.behaviorUnknown } : {}), notes, care,
    sources: groupSources(sources.sources),
    ...(sources.verifiedAt ? { verifiedAt: c.verifiedAt(formatCalendarDate(sources.verifiedAt, locale === "en" ? "month-first" : "day-first")) } : {}),
    tryHref: tryInAppHref(id),
  };
}

export async function publicIndexView(locale: Locale): Promise<PublicIndexView> {
  const { catalog, text } = await localeTexts(locale);
  const collator = new Intl.Collator(locale);
  const species = PUBLIC_SPECIES_IDS.flatMap((id) => {
    const profile = publicSpeciesProfile(id);
    const name = profile ? catalog(profile.commonName) : undefined;
    return profile && name ? [{ id, name, scientificName: profile.scientificName, href: speciesPagePath(locale, id) }] : [];
  }).sort((a, b) => collator.compare(a.name, b.name));
  return { ...frame(locale, text, speciesIndexPath), title: text.indexTitle, description: text.indexDescription, species };
}
