// Ekipman profilleri: katalog parçası (docs/DECISIONS/0016-gereken-katalog-kayitlarinin-yuklenmesi.md).
// Derleme anında her parça için durağan JSON üretilir; kullanıcı verisi sunucuya gelmez, tarayıcı yalnızca parça numarası ister.
import { catalogBucketNumbers, buildEquipmentBucket } from "@/data/catalog-bucket-builders";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return catalogBucketNumbers("equipment").map((bucket) => ({ bucket: String(bucket) }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ bucket: string }> }) {
  const { bucket } = await params;
  return Response.json(buildEquipmentBucket(Number(bucket)));
}
