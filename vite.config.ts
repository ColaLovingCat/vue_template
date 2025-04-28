import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";

import { viteMockServe } from "vite-plugin-mock";

import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 解决 `import { ref , reactive ..... } from 'vue'` 大量引入的问题
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [],
      dts: "src/auto-import.d.ts", //存放位置
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
      dts: "src/auto-import.d.ts", //存放位置
    }),
    //
    viteMockServe({
      mockPath: "src/commons/mocks", // 你的 mock 文件夹
      enable: true,
    }),
  ],
  // excel
  assetsInclude: ['**/*.xlsx'],
  // 不加打包后白屏
  base: "./",
  // 关键配置@
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
