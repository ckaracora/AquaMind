// Tür ve ekipman katalogları ayrı modüllerde: `./catalog-species` ve `./catalog-equipment`
// (docs/DECISIONS/0015-katalog-modulleri-ve-sayfa-hizi.md). Bu dosya yalnızca geriye uyumluluk içindir (betikler ve testler).
// Uygulama kodu ilgili modülü doğrudan içe aktarır; böylece canlılar sayfası ekipman kataloğunu, ekipman sayfası tür kataloğunu indirmez.
export * from "./catalog-species";
export * from "./catalog-equipment";
