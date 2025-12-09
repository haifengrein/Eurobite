import "@testing-library/jest-dom";

// 简单的 localStorage 内存实现，避免在 Node 环境下缺少或部分实现的问题
class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

const storage = new MemoryStorage();

// 覆盖全局 localStorage，保证 test 环境下可用
// @ts-expect-error - Vitest jsdom 环境下允许覆盖
globalThis.localStorage = storage as unknown as Storage;
// @ts-expect-error - window 可能未定义，在 jsdom 环境下存在
if (typeof window !== "undefined") {
  (window as any).localStorage = storage as unknown as Storage;
}

