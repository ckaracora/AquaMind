import { it } from "vitest";
import { assertEngine119Review, assertEngine119Translations, assertIdentity119Review } from "./engine-identity-checks";

it("motor 1.19 sınırları ve uyarlayıcının çelişkili kayıtları", assertEngine119Review);
it("motor 1.19 uyarılarında İngilizce ve İspanyolca adlar/koşullar", assertEngine119Translations);
it("eski kayıtların tam/parçalı çözümü ve gereken indirmeler", assertIdentity119Review, 60_000);
