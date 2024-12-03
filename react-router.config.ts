import type { Config } from "@react-router/dev/config";
import fs from "node:fs";
import path from "node:path";

export default {
  basename: "/react-router-prerendering/",

  buildEnd: () => {
    // ./build/clientを./docsにコピー
    if (fs.existsSync("./docs")) {
      fs.rmdirSync("./docs", { recursive: true });
    }
    fs.renameSync("./build/client", "./docs");
    // /react-router-pre-rendering/ディレクトリの中身を/docsに移動
    fs.readdirSync("./docs/react-router-prerendering", {
      withFileTypes: true,
    }).forEach((file) => {
      fs.renameSync(
        `./docs/react-router-prerendering/${file.name}`,
        `./docs/${file.name}`,
      );
    });

    if (fs.existsSync("./docs/react-router-prerendering")) {
      fs.rmdirSync("./docs/react-router-prerendering", { recursive: true });
    }
    // .nojekyllファイルを作成
    fs.writeFileSync("./docs/.nojekyll", "");
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
