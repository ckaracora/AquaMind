export type NavigationKey = "overview"|"aquariums"|"water"|"maintenance"|"livestock"|"plants"|"equipment"|"products"|"calculators"|"aquamatch"|"settings";

// Bağlantının ekrandaki adı dil dosyasındadır: `messages.navigation.items[key]` (@aquamind/localization).
export interface NavigationItem {
  key: NavigationKey;
  href: string;
  comingSoon?: boolean;
}

export const primaryNavigationItems: NavigationItem[] = [
  {key:"overview",href:"/"},
  {key:"aquariums",href:"/aquariums"},
  {key:"water",href:"/water"},
  {key:"maintenance",href:"/maintenance"},
  {key:"livestock",href:"/livestock"},
  {key:"plants",href:"/plants"},
  {key:"equipment",href:"/equipment"},
  {key:"products",href:"/products"},
  {key:"calculators",href:"/calculators"},
  {key:"aquamatch",href:"/aquamatch",comingSoon:true},
];

export const settingsNavigationItem: NavigationItem = {key:"settings",href:"/settings"};
export const allNavigationItems: NavigationItem[] = [...primaryNavigationItems,settingsNavigationItem];
