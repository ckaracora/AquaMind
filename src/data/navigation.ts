export type NavigationKey = "overview"|"aquariums"|"water"|"maintenance"|"livestock"|"plants"|"equipment"|"products"|"calculators"|"settings";

export interface NavigationItem {
  key: NavigationKey;
  label: string;
  href: string;
}

export const primaryNavigationItems: NavigationItem[] = [
  {key:"overview",label:"Genel Bakış",href:"/"},
  {key:"aquariums",label:"Akvaryumlarım",href:"/aquariums"},
  {key:"water",label:"Su Değerleri",href:"/water"},
  {key:"maintenance",label:"Bakım Günlüğü",href:"/maintenance"},
  {key:"livestock",label:"Canlılar",href:"/livestock"},
  {key:"plants",label:"Bitkiler",href:"/plants"},
  {key:"equipment",label:"Ekipmanlar",href:"/equipment"},
  {key:"products",label:"Ürün Kataloğu",href:"/products"},
  {key:"calculators",label:"Hesaplayıcılar",href:"/calculators"},
];

export const settingsNavigationItem: NavigationItem = {key:"settings",label:"Ayarlar",href:"/settings"};
export const allNavigationItems: NavigationItem[] = [...primaryNavigationItems,settingsNavigationItem];
