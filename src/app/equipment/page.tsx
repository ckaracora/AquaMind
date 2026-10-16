"use client";
import { FormEvent, useEffect, useId, useMemo, useState } from "react";
import { ChevronDown, Filter, LampDesk, PencilLine, Plus, Search, SlidersHorizontal, Trash2, UserRound, Waves, Wind, X, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ModalDialog } from "@/components/modal-dialog";
import { PageHeader } from "@/components/page-header";
import { equipmentBrandsForCategory, equipmentById, equipmentForBrandInCategory, equipmentForCategory, hasStandaloneCapacityData, profileForEquipment } from "@/data/catalog-equipment";
import { parseUserValue, userValueField, userValueHint, userValueText, withUserValue, type FlowUnit, type UserValueField } from "@/lib/user-equipment-value";
import { useAquariums } from "@/providers/aquarium-provider";
import type { Aquarium, Equipment } from "@/types/aquarium";
const categories: Array<[
    Equipment["category"],
    string
]> = [["filter", "Filtre"], ["lighting", "Aydınlatma"], ["heater", "Isıtıcı"], ["co2", "CO₂"], ["uv", "UV"], ["air_pump", "Hava motoru"], ["dosing_pump", "Dozaj pompası"], ["other", "Diğer"]];
const field = "mt-1.5 w-full rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60";
export default function EquipmentPage() { const { aquariums, equipment, addEquipment, updateEquipment, removeEquipment } = useAquariums(); const [aquariumId, setAquariumId] = useState(aquariums[0]?.id ?? ""); const [category, setCategory] = useState<"all" | Equipment["category"]>("all"); const [query, setQuery] = useState(""); const [open, setOpen] = useState(false); const [editing, setEditing] = useState<Equipment>(); useEffect(() => { const requested = new URLSearchParams(location.search).get("aquarium"); if (requested && aquariums.some(a => a.id === requested))
    setAquariumId(requested); }, [aquariums]); const base = equipment.filter(e => e.aquariumId === aquariumId); const items = useMemo(() => base.filter(e => category === "all" || e.category === category).filter(e => `${e.brand ?? ""} ${e.model ?? ""}`.toLowerCase().includes(query.toLowerCase())), [base, category, query]); return <AppShell><PageHeader title="Ekipmanlar"/><div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10"><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow mb-2 text-aqua">Donanım</p><h1 className="text-2xl font-extrabold sm:text-3xl">Ekipmanlar</h1><p className="mt-2 text-sm text-[#71858d]">Akvaryum sistemini oluşturan cihazları yönet.</p></div><div className="flex gap-2"><label className="relative flex-1 sm:min-w-52"><select value={aquariumId} onChange={e => setAquariumId(e.target.value)} className="min-h-11 w-full appearance-none rounded-xl border border-white/[.08] bg-panel px-4 py-3 pr-9 text-xs font-bold outline-none sm:min-h-0">{aquariums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5 text-[#71858d]"/></label><button onClick={() => setOpen(true)} className="flex min-h-11 min-w-11 items-center gap-2 rounded-xl bg-aqua px-4 py-3 text-xs font-extrabold text-ink sm:min-h-0 sm:min-w-0"><Plus size={16}/>Ekipman ekle</button></div></div><div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><Summary icon={SlidersHorizontal} label="Toplam ekipman" value={base.length}/><Summary icon={Waves} label="Filtre" value={base.filter(e => e.category === "filter").length}/><Summary icon={LampDesk} label="Aydınlatma" value={base.filter(e => e.category === "lighting").length}/><Summary icon={Zap} label="Diğer sistemler" value={base.filter(e => !["filter", "lighting"].includes(e.category)).length}/></div><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:justify-between"><div className="flex gap-1 overflow-x-auto">{(["all", ...categories.map(x => x[0])] as const).map(k => <button key={k} onClick={() => setCategory(k)} className={`min-h-11 min-w-11 shrink-0 rounded-xl px-3 py-2.5 text-[11px] sm:text-[10px] font-bold sm:min-h-0 sm:min-w-0 ${category === k ? "bg-aqua/10 text-aqua" : "bg-white/[.025] text-[#647981]"}`}>{k === "all" ? "Tümü" : categories.find(x => x[0] === k)?.[1]}</button>)}</div><label className="relative"><Search size={15} className="absolute left-3 top-3 text-[#586e77]"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Marka veya model ara..." className="w-full rounded-xl border border-white/[.07] bg-panel py-2.5 pl-9 pr-3 text-xs outline-none sm:w-60"/></label></div>{items.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map(item => <article key={item.id} className="surface p-5"><div className="mb-5 flex items-start justify-between"><span className="grid size-11 place-items-center rounded-xl bg-aqua/10 text-aqua"><EquipmentIcon category={item.category}/></span><span className="rounded-full bg-white/[.04] px-2 py-1 text-[11px] sm:text-[8px] font-bold text-[#71858d]">{categories.find(x => x[0] === item.category)?.[1]}</span></div><h2 className="text-base font-extrabold">{item.brand || "Markasız"}</h2><p className="mt-1 text-xs text-[#91a3aa]">{item.model || "Model belirtilmemiş"}</p><div className="mt-5 rounded-xl bg-white/[.025] p-3"><p className="text-[11px] sm:text-[8px] font-bold uppercase tracking-wider text-[#586e77]">Teknik bilgiler</p><p className="mt-1 text-[11px] text-[#91a3aa]">{item.specifications || "Bilgi eklenmemiş"}</p></div><UserValueRow item={item} edit={() => setEditing(item)}/><div className="mt-4 flex items-center justify-between border-t border-white/[.05] pt-3"><p className="text-[11px] sm:text-[9px] text-[#586e77]">Kurulum: {new Date(item.installedAt).toLocaleDateString("tr-TR")}</p><button onClick={() => confirm(`${item.brand} ${item.model} silinsin mi?`) && removeEquipment(item.id)} aria-label="Ekipmanı sil" className="-m-[15px] grid size-11 place-items-center rounded-xl text-[#586e77] hover:text-red-400"><Trash2 size={14}/></button></div></article>)}</div> : <Empty />}</div>{open && <EquipmentForm aquarium={aquariums.find(a => a.id === aquariumId)!} initialCategory={category === "all" ? "filter" : category} close={() => setOpen(false)} add={item => { addEquipment(item); setOpen(false); }}/>}{editing && <UserValueDialog aquarium={aquariums.find(a => a.id === editing.aquariumId)!} item={editing} close={() => setEditing(undefined)} save={item => { updateEquipment(item); setEditing(undefined); }}/>}</AppShell>; }
function Summary({ icon: Icon, label, value }: {
    icon: typeof Filter;
    label: string;
    value: number;
}) { return <div className="surface p-4"><Icon size={17} className="mb-4 text-aqua"/><p className="text-2xl font-extrabold">{value}</p><p className="mt-1 text-[11px] sm:text-[9px] font-bold uppercase tracking-wider text-[#647981]">{label}</p></div>; }
function EquipmentIcon({ category }: {
    category: Equipment["category"];
}) { const Icon = category === "lighting" ? LampDesk : category === "air_pump" ? Wind : category === "filter" ? Waves : Zap; return <Icon size={21}/>; }
function Empty() { return <div className="surface grid min-h-64 place-items-center text-center"><div><SlidersHorizontal size={38} className="mx-auto mb-3 text-aqua"/><p className="text-sm font-bold">Ekipman bulunamadı</p><p className="mt-1 text-xs text-[#647981]">İlk ekipman kaydını ekleyebilirsin.</p></div></div>; }
// Elle değer girişi (docs/DECISIONS/0017-elle-girilen-ekipman-degerleri.md): katalogda doğrulanmış kapasite verisi olmayan
// filtre, ısıtıcı ve hava motorunda kullanıcı etiketteki değeri girer; sağlık analizi sonucu bu değere dayandığını belirtir.
function UserValueRow({ item, edit }: { item: Equipment; edit: () => void }) {
  const profile = profileForEquipment(item);
  if (!userValueField(item.category, profile)) return null;
  const text = userValueText(item, profile);
  return <div className={`mt-3 flex items-center justify-between gap-3 rounded-xl border p-3 ${text ? "border-aqua/15 bg-aqua/[.05]" : "border-amber-300/15 bg-amber-300/[.06]"}`}>
    <div>
      <p className={`flex items-center gap-1 text-[11px] sm:text-[8px] font-bold uppercase tracking-wider ${text ? "text-aqua" : "text-amber-300"}`}>{text ? <><UserRound size={10}/>Senin girdiğin değer</> : "Değeri eksik"}</p>
      <p className="mt-1 text-[11px] text-[#91a3aa]">{text ?? "Etiketteki değeri girersen sağlık analizine katılır."}</p>
    </div>
    <button type="button" onClick={edit} className="flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1 rounded-lg border border-white/[.08] px-2.5 py-1.5 text-[11px] sm:text-[10px] font-bold text-[#91a3aa] hover:text-aqua sm:min-h-0 sm:min-w-0"><PencilLine size={11}/>{text ? "Değiştir" : "Değer gir"}</button>
  </div>;
}

function UserValueInput({ valueField, category, volumeL, raw, unit, error, setRaw, setUnit, initialFocus }: {
  valueField: UserValueField;
  category: Equipment["category"];
  volumeL: number;
  raw: string;
  unit: FlowUnit;
  error?: string;
  setRaw: (value: string) => void;
  setUnit: (unit: FlowUnit) => void;
  /** Pencere açılınca odak bu alana gelsin (bkz. src/lib/dialog-focus.ts). Yalnız tek alanlı değer penceresinde kullanılır. */
  initialFocus?: boolean;
}) {
  const parsed = parseUserValue(raw, valueField, unit);
  const hint = parsed.value !== undefined ? userValueHint(valueField, category, parsed.value, volumeL) : undefined;
  return <div className="rounded-xl border border-aqua/15 bg-aqua/[.05] p-4 sm:col-span-2">
    <label className="text-xs font-bold text-[#91a3aa]">{valueField.label}
      <span className="mt-1.5 flex gap-2">
        <input name="userValue" value={raw} onChange={e => setRaw(e.target.value)} inputMode="decimal" autoComplete="off" placeholder={valueField.kind === "power" ? "ör. 100" : "ör. 600"} aria-invalid={Boolean(error)} data-autofocus={initialFocus ? "" : undefined} className={`${field} mt-0 min-w-0 flex-1`}/>
        {valueField.kind === "flow"
          ? <select value={unit} onChange={e => setUnit(e.target.value as FlowUnit)} aria-label="Birim" className="shrink-0 rounded-xl border border-white/[.08] bg-[#09171e] px-3 py-3 text-sm outline-none focus:border-aqua/60"><option value="lph">L/saat (L/H)</option><option value="lpm">L/dakika (L/min)</option></select>
          : <span className="grid shrink-0 place-items-center rounded-xl border border-white/[.08] px-4 text-sm font-bold text-[#91a3aa]">W</span>}
      </span>
    </label>
    <p className="mt-2 text-[11px] sm:text-[10px] font-normal text-[#71858d]">{valueField.help}</p>
    {valueField.kind === "flow" && unit === "lpm" && parsed.value !== undefined && <p className="mt-1 text-[11px] sm:text-[10px] text-aqua/80">Kayda {parsed.value.toLocaleString("tr-TR")} L/saat olarak yazılır.</p>}
    {error && <p role="alert" className="mt-2 text-[11px] sm:text-[10px] font-bold text-red-400">{error}</p>}
    {!error && hint && <p className="mt-2 text-[11px] sm:text-[10px] text-amber-300">{hint}</p>}
  </div>;
}

function UserValueDialog({ aquarium, item, close, save }: { aquarium: Aquarium; item: Equipment; close: () => void; save: (item: Equipment) => void }) {
  const valueField = userValueField(item.category, profileForEquipment(item));
  const current = valueField?.kind === "power" ? item.userPowerW : item.userRatedFlowLph;
  const [raw, setRaw] = useState(current === undefined ? "" : String(current).replace(".", ","));
  const [unit, setUnit] = useState<FlowUnit>("lph");
  const [error, setError] = useState<string>();
  const titleId = useId();
  const descriptionId = useId();
  if (!valueField) return null;
  const activeField = valueField;
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = parseUserValue(raw, activeField, unit);
    if (parsed.error) { setError(parsed.error); return; }
    save(withUserValue(item, activeField, parsed.value));
  }
  return <ModalDialog close={close} labelledBy={titleId} describedBy={descriptionId} width="max-w-md"><form onSubmit={submit} noValidate>
    <div className="mb-6 flex justify-between"><div><p className="eyebrow text-aqua">{aquarium.name}</p><h2 id={titleId} className="mt-1 text-xl font-extrabold">{item.brand || "Markasız"} {item.model}</h2><p id={descriptionId} className="mt-1 text-[11px] sm:text-[10px] text-[#647981]">Cihazın üzerindeki değeri gir. Alanı boş bırakıp kaydedersen değer silinir.</p></div><button type="button" onClick={close} aria-label="Kapat" className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17}/></button></div>
    <UserValueInput initialFocus valueField={activeField} category={item.category} volumeL={aquarium.netVolumeLiters} raw={raw} unit={unit} error={error} setRaw={value => { setRaw(value); setError(undefined); }} setUnit={next => { setUnit(next); setError(undefined); }}/>
    <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={close} className="min-h-11 min-w-11 rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa] sm:min-h-0 sm:min-w-0">Vazgeç</button><button className="min-h-11 min-w-11 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink sm:min-h-0 sm:min-w-0">Kaydet</button></div>
  </form></ModalDialog>;
}

function EquipmentForm({ aquarium, initialCategory, close, add }: {
  aquarium: Aquarium;
  initialCategory: Equipment["category"];
  close: () => void;
  add: (item: Equipment) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  // Listede olmayan cihaz için kullanıcı marka ve modeli kendisi yazar.
  const [manual, setManual] = useState(false);
  const categoryItems = equipmentForCategory(selectedCategory);
  const brands = equipmentBrandsForCategory(selectedCategory);
  const [brand, setBrand] = useState(categoryItems[0]?.brand ?? "");
  const models = equipmentForBrandInCategory(selectedCategory, brand);
  const [modelQuery, setModelQuery] = useState("");
  const visibleModels = models.filter(item => item.model.toLocaleLowerCase("tr-TR").includes(modelQuery.toLocaleLowerCase("tr-TR")));
  const [selected, setSelected] = useState(models[0]?.id ?? "");
  const [raw, setRaw] = useState("");
  const [unit, setUnit] = useState<FlowUnit>("lph");
  const [error, setError] = useState<string>();
  const [manualBrand, setManualBrand] = useState("");
  const [manualModel, setManualModel] = useState("");
  // Elle yazılan marka ve model listedeki bir cihazla aynıysa kayıt o cihaza bağlanır; doğrulanmış değeri varsa o kullanılır.
  const typedMatch = manual && manualBrand.trim() && manualModel.trim() ? profileForEquipment({ id: "", aquariumId: aquarium.id, category: selectedCategory, installedAt: "", brand: manualBrand, model: manualModel }) : undefined;
  const profile = manual ? typedMatch : equipmentById(selected);
  const valueField = profile ? userValueField(profile.category, profile) : manual ? userValueField(selectedCategory) : undefined;
  function resetValue() { setRaw(""); setError(undefined); }
  function changeCategory(next: Equipment["category"]) { const nextItems = equipmentForCategory(next); setSelectedCategory(next); setBrand(nextItems[0]?.brand ?? ""); setModelQuery(""); setSelected(nextItems[0]?.id ?? ""); resetValue(); }
  function changeBrand(next: string) { setBrand(next); setModelQuery(""); setSelected(equipmentForBrandInCategory(selectedCategory, next)[0]?.id ?? ""); resetValue(); }
  function changeModelQuery(next: string) { setModelQuery(next); const normalized = next.toLocaleLowerCase("tr-TR"); setSelected(models.find(item => item.model.toLocaleLowerCase("tr-TR").includes(normalized))?.id ?? ""); resetValue(); }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const parsed = valueField ? parseUserValue(raw, valueField, unit) : {};
    if (parsed.error) { setError(parsed.error); return; }
    const base = { id: crypto.randomUUID(), aquariumId: aquarium.id, installedAt: String(d.get("installedAt")), notes: String(d.get("notes") || "") };
    if (manual && !profile) {
      if (!manualBrand.trim() || !manualModel.trim()) return;
      add(withUserValue({ ...base, category: selectedCategory, brand: manualBrand.trim(), model: manualModel.trim() }, valueField, parsed.value));
      return;
    }
    if (!profile) return;
    add(withUserValue({ ...base, catalogId: profile.id, category: profile.category, brand: profile.brand, model: profile.model, specifications: profile.specifications }, valueField, parsed.value));
  }
  const capacityReady = hasStandaloneCapacityData(profile);
  const turnover = profile?.category === "filter" && profile.ratedFlowLph ? profile.ratedFlowLph * .65 / aquarium.netVolumeLiters : undefined;
  const mismatch = profile && ((profile.recommendedMinL && aquarium.netVolumeLiters < profile.recommendedMinL) || (profile.recommendedMaxL && aquarium.netVolumeLiters > profile.recommendedMaxL));
  const titleId = useId();
  const descriptionId = useId();
  return <ModalDialog close={close} labelledBy={titleId} describedBy={descriptionId}><form onSubmit={submit}>
    <div className="mb-6 flex justify-between"><div><p className="eyebrow text-aqua">{aquarium.name}</p><h2 id={titleId} className="mt-1 text-xl font-extrabold">Ekipman ekle</h2><p id={descriptionId} className="mt-1 text-[11px] sm:text-[10px] text-[#647981]">{manual ? "Listede olmayan cihazını marka ve modeliyle kaydet." : "Kategori → marka → model sırasıyla ilerle."}</p></div><button type="button" onClick={close} aria-label="Kapat" className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/[.04] text-[#71858d] sm:size-9"><X size={17}/></button></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={`text-xs font-bold text-[#91a3aa] ${manual ? "sm:col-span-2" : ""}`}>1. Ekipman türü<select value={selectedCategory} onChange={e => changeCategory(e.target.value as Equipment["category"])} className={field}>{categories.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      {manual ? <>
        <label className="text-xs font-bold text-[#91a3aa]">2. Marka<input required name="brand" value={manualBrand} onChange={e => { setManualBrand(e.target.value); resetValue(); }} maxLength={60} autoComplete="off" placeholder="ör. Aquawing" className={field}/></label>
        <label className="text-xs font-bold text-[#91a3aa]">3. Model<input required name="model" value={manualModel} onChange={e => { setManualModel(e.target.value); resetValue(); }} maxLength={80} autoComplete="off" placeholder="ör. AQ604F" className={field}/></label>
      </> : <>
        <label className="text-xs font-bold text-[#91a3aa]">2. Marka<select value={brand} onChange={e => changeBrand(e.target.value)} disabled={!brands.length} className={field}>{brands.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">3. Model<span className="relative mt-1.5 block"><Search size={15} className="pointer-events-none absolute left-3 top-3.5 text-[#586e77]"/><input value={modelQuery} onChange={e => changeModelQuery(e.target.value)} placeholder="Model adı ara..." className={`${field} mt-0 pl-9`}/></span><select required name="catalogId" value={selected} onChange={e => { setSelected(e.target.value); resetValue(); }} disabled={!visibleModels.length} className={field}>{visibleModels.map(item => <option key={item.id} value={item.id}>{item.model}</option>)}</select>{modelQuery && !visibleModels.length && <span className="mt-2 block text-[11px] sm:text-[10px] font-normal text-amber-300">Bu markada aramayla eşleşen model bulunamadı.</span>}</label>
      </>}
      <p className="text-[11px] sm:text-[10px] text-[#71858d] sm:col-span-2">{manual ? "Cihazın listede olabilir. " : "Cihazın listede yok mu? "}<button type="button" onClick={() => { setManual(!manual); setManualBrand(""); setManualModel(""); resetValue(); }} className="-my-[14.5px] inline-flex min-h-11 min-w-11 items-center font-bold text-aqua underline-offset-2 hover:underline">{manual ? "Listeden seçmeye dön" : "Marka ve modeli kendim yazacağım"}</button></p>
      {!manual && !profile && <div className="rounded-xl border border-amber-300/15 bg-amber-300/[.06] p-4 text-[11px] sm:text-[10px] text-amber-100/70 sm:col-span-2">Bu kategoride listede model bulunmuyor. Cihazını marka ve modeliyle kendin kaydedebilirsin.</div>}
      {typedMatch && <p className="text-[11px] sm:text-[10px] font-bold text-aqua sm:col-span-2">Bu cihaz listemizde var; kayıt listedeki bilgileriyle eşleşecek.</p>}
      {profile && <><div className="rounded-xl border border-aqua/15 bg-aqua/[.05] p-4 sm:col-span-2"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-extrabold">{profile.brand} {profile.model}</p><p className="mt-1 text-[11px] sm:text-[10px] text-[#71858d]">{profile.specifications}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[11px] sm:text-[8px] font-bold ${capacityReady?"bg-emerald-400/10 text-emerald-400":"bg-amber-300/10 text-amber-300"}`}>{capacityReady?"Teknik veri hazır":valueField?"Değeri eksik":"Model kayıtlı"}</span></div>{(profile.recommendedMinL || profile.recommendedMaxL) && <p className="mt-3 text-[11px] sm:text-[9px] text-aqua/70">Önerilen hacim: {profile.recommendedMinL ?? 0}–{profile.recommendedMaxL ?? "+"} L</p>}</div>{(!capacityReady || mismatch || (turnover && turnover > 10)) && <div className="rounded-xl border border-amber-300/15 bg-amber-300/[.06] p-4 sm:col-span-2"><p className="text-[11px] sm:text-[10px] font-extrabold text-amber-300">Akvaryumun için dikkat</p>{!capacityReady && valueField && <p className="mt-2 text-[11px] sm:text-[10px] text-amber-100/80">• Bu modelin değerini güvenilir bir kaynaktan doğrulayamadık. Etiketteki değeri aşağıya girersen sağlık analizine katılır; boş bırakırsan cihaz kaydedilir ama hesaba girmez.</p>}{!capacityReady && profile.capacityDataNote && <p className="mt-2 text-[11px] sm:text-[9px] text-amber-100/65">• {profile.capacityDataNote}</p>}{mismatch && <p className="mt-2 text-[11px] sm:text-[9px] text-amber-100/65">• Üretici hacim aralığı {aquarium.netVolumeLiters} L akvaryumunu kapsamıyor.</p>}{turnover && turnover > 10 && <p className="mt-2 text-[11px] sm:text-[9px] text-amber-100/65">• Tahmini akış {turnover.toFixed(1)} çevrim/saat; bazı canlılar için güçlü olabilir.</p>}</div>}</>}
      {valueField && <UserValueInput valueField={valueField} category={profile?.category ?? selectedCategory} volumeL={aquarium.netVolumeLiters} raw={raw} unit={unit} error={error} setRaw={value => { setRaw(value); setError(undefined); }} setUnit={next => { setUnit(next); setError(undefined); }}/>}
      {manual && !profile && !valueField && <div className="rounded-xl border border-white/[.08] bg-white/[.025] p-4 text-[11px] sm:text-[10px] text-[#91a3aa] sm:col-span-2">Bu tür ekipman sağlık hesabına girmez; yalnızca kaydı tutulur.</div>}
      {manual && !profile && valueField && <p className="text-[11px] sm:text-[10px] text-[#71858d] sm:col-span-2">Değeri boş bırakırsan cihaz kaydedilir ama sağlık hesabına girmez; sonradan ekleyebilirsin.</p>}
      <label className="text-xs font-bold text-[#91a3aa]">Kurulum tarihi<input required name="installedAt" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className={field}/></label>
      <label className="text-xs font-bold text-[#91a3aa] sm:col-span-2">Notlar<textarea name="notes" rows={3} className={field}/></label>
    </div>
    <div className="mt-7 flex justify-end gap-2"><button type="button" onClick={close} className="min-h-11 min-w-11 rounded-xl border border-white/[.08] px-5 py-3 text-xs font-bold text-[#91a3aa] sm:min-h-0 sm:min-w-0">Vazgeç</button><button disabled={!manual && !profile} className="min-h-11 min-w-11 rounded-xl bg-aqua px-5 py-3 text-xs font-extrabold text-ink disabled:opacity-40 sm:min-h-0 sm:min-w-0">Ekipmanı ekle</button></div>
  </form></ModalDialog>;
}
