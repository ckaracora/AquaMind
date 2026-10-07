// Ekipman marka/model dizini (katalog kimliği olmayan eski kayıtlar için): katalog parçası (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
// Derleme anında her parça için durağan JSON üretilir; kullanıcı verisi sunucuya gelmez, tarayıcı yalnızca parça numarası ister.
import { catalogBucketNumbers, buildEquipmentModelBucket } from "@/data/catalog-bucket-builders";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return catalogBucketNumbers("equipmentModels").map((bucket) => ({ bucket: String(bucket) }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ bucket: string }> }) {
  const { bucket } = await params;
  return Response.json(buildEquipmentModelBucket(Number(bucket)));
}
