// Testler için bellek içi `localStorage` yerine geçen basit bir sahte depo.
// Yeni bağımlılık (jsdom, happy-dom) eklemeden depolama katmanını doğrulamayı sağlar.
// Bu dosya `*.test.ts` desenine uymadığı için Vitest tarafından test olarak toplanmaz.

export interface SetItemCall {
  key: string;
  value: string;
}

/** `setItem` çağrısını başarısız kılmak için kanca; `undefined` dönerse yazma normal ilerler. */
export type SetItemFailure = (key: string, callIndex: number) => Error | undefined;

export class FakeLocalStorage {
  private store = new Map<string, string>();

  /** Yapılan tüm `setItem` çağrıları, sırasıyla. Yazma sırasını doğrulamak için. */
  readonly setItemCalls: SetItemCall[] = [];

  /** Ayarlanırsa her `setItem` öncesi çağrılır; `Error` dönerse yazma o hatayla başarısız olur. */
  failOnSet: SetItemFailure | undefined;

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    return [...this.store.keys()][index] ?? null;
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }

  setItem(key: string, value: string): void {
    const failure = this.failOnSet?.(key, this.setItemCalls.length);
    if (failure) {
      // Gerçek tarayıcıda olduğu gibi, başarısız yazma depoyu değiştirmez.
      this.setItemCalls.push({ key, value });
      throw failure;
    }
    this.setItemCalls.push({ key, value });
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  // --- test yardımcıları ---

  /** Depodaki tüm anahtarlar. */
  keys(): string[] {
    return [...this.store.keys()];
  }

  /** Ham değeri doğrudan yerleştirir; `setItemCalls` kaydına girmez. */
  seedRaw(key: string, value: string): void {
    this.store.set(key, value);
  }

  /** Nesneyi JSON olarak doğrudan yerleştirir; `setItemCalls` kaydına girmez. */
  seedJson(key: string, value: unknown): void {
    this.store.set(key, JSON.stringify(value));
  }

  /** Anahtarın ham değeri. */
  raw(key: string): string | null {
    return this.getItem(key);
  }

  /** Anahtarın JSON olarak çözülmüş değeri. */
  json<T = unknown>(key: string): T | null {
    const raw = this.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  }

  /** `setItem` çağrılarının anahtar sırası. */
  writtenKeys(): string[] {
    return this.setItemCalls.map((call) => call.key);
  }

  resetCalls(): void {
    this.setItemCalls.length = 0;
    this.failOnSet = undefined;
  }
}

interface WindowLike {
  localStorage: FakeLocalStorage;
}

// `globalThis.window` DOM tip tanımlarında zaten var; test ortamında onun yerine
// sahte bir nesne koyabilmek için tipi gevşetiyoruz.
const globalWithWindow = globalThis as unknown as { window?: WindowLike };

/**
 * Sahte depoyu `globalThis.window.localStorage` olarak kurar.
 * Depolama katmanı `typeof window === "undefined"` kontrolü yaptığı için
 * sunucu tarafı davranışını test etmek üzere `removeFakeLocalStorage` ile kaldırılabilir.
 */
export function installFakeLocalStorage(): FakeLocalStorage {
  const storage = new FakeLocalStorage();
  globalWithWindow.window = { localStorage: storage };
  return storage;
}

export function removeFakeLocalStorage(): void {
  delete globalWithWindow.window;
}
