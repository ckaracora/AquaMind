import { z } from "zod";

// Kullanıcı tercihleri. Tip ve varsayılanlar burada tek yerde tanımlanır;
// ayarlar sayfası bunları içe aktarır (kendi kopyasını tutmaz).

export const preferencesSchema = z.object({
  temperature: z.enum(["celsius", "fahrenheit"]),
  volume: z.enum(["liters", "gallons"]),
  dateFormat: z.enum(["day-first", "month-first"]),
  maintenance: z.boolean(),
  waterAlerts: z.boolean(),
  productNews: z.boolean(),
  compactMode: z.boolean(),
});

export type Preferences = z.infer<typeof preferencesSchema>;

export const DEFAULT_PREFERENCES: Preferences = {
  temperature: "celsius",
  volume: "liters",
  dateFormat: "day-first",
  maintenance: true,
  waterAlerts: true,
  productNews: false,
  compactMode: false,
};
