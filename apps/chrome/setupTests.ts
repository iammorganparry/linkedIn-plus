import { vi } from "vitest";

global.chrome = {
  tabs: {
    onUpdated: {
      addListener: vi.fn(),
    },
    query: vi.fn().mockImplementationOnce((queryInfo, callback) => {
      callback([
        {
          id: 123,
          active: true,
        },
      ]);
    }),
    sendMessage: vi.fn(),
  },
  runtime: {
    onMessage: {
      addListener: vi.fn(),
    },
  },
} as unknown as typeof chrome;