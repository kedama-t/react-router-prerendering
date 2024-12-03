import type { Config } from "@react-router/dev/config";
import fs from "node:fs";
import path from "node:path";

export default {
  basename: "/react-router-pre-rendering/",

  buildEnd: () => {
    // ./build/clientを./docsにコピー
    if (fs.existsSync("./docs")) {
      fs.rmdirSync("./docs", { recursive: true });
    }
    fs.renameSync("./build/client", "./docs");
    // /react-router-pre-rendering/ディレクトリの中身を/docsに移動
    fs.readdirSync("./docs/react-router-pre-rendering", {
      withFileTypes: true,
    }).forEach((file) => {
      fs.renameSync(
        `./docs/react-router-pre-rendering/${file.name}`,
        `./docs/${file.name}`,
      );
    });

    if (fs.existsSync("./docs/react-router-pre-rendering")) {
      fs.rmdirSync("./docs/react-router-pre-rendering", { recursive: true });
    }
  },
  async prerender({ getStaticPaths }) {
    // _index.tsxなど、静的ルート
    const staticPaths = getStaticPaths();
    // ダイナミックルート
    const dynamicPaths = fs
      .readdirSync("./articles", {
        encoding: "utf8",
        recursive: true,
        withFileTypes: true,
      })
      .filter((file) => file.isFile() && file.name.endsWith(".md"))
      .map((file) => {
        return `/${file.parentPath}/${path.basename(file.name, ".md")}`;
      });
    // ページネーション
    const pages = Array(Math.ceil(dynamicPaths.length / 6))
      .fill(null)
      .map((_, i) => `/articles/page/${i}`);

    return [...staticPaths, ...dynamicPaths, ...pages];
  },
} satisfies Config;
