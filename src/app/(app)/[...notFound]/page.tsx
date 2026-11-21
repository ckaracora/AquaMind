// Eşleşmeyen uygulama adresleri eski kök yerleşimin dil betiği, sağlayıcıları ve görünümüyle 404 verir.
import { notFound } from "next/navigation";

export default function UnknownPage() {
  notFound();
}
