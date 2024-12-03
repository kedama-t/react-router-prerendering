import fs from "node:fs";
import path from "node:path";

// Markdownコンテンツを読み込み
export const loadContent = (dir: string, slug: string) => {
    const combinedPath = path.join(
        dir,
        `${slug.endsWith("/") ? slug.slice(0, -1) : slug}.md`,
    );
    const content = fs.readFileSync(combinedPath, "utf-8");
    return content;
};

// ディレクトリ内のMarkdownファイルを一括取得
export const listContents = (dir: string, page = 0, itemsParPage = 6) => {
    const list = fs
        .readdirSync(dir, {
            encoding: "utf8",
            recursive: true,
            withFileTypes: true,
        })
        // ファイルかつ拡張子が.mdのファイルのみを抽出
        .filter((file) => file.isFile() && file.name.endsWith(".md"))
        // タイムスタンプの降順でソート
        .sort(
            (a, b) =>
                fs.statSync(`${b.parentPath}/${b.name}`).mtimeMs -
                fs.statSync(`${a.parentPath}/${a.name}`).mtimeMs
        )
        .map((file) => {
            const url = `/${file.parentPath}/${path.basename(file.name, ".md")}`;
            const fileName = `${file.parentPath}/${file.name}`;
            return { url, content: fs.readFileSync(fileName, "utf-8") };
        });
    // ページネーション
    const contents = list.slice(page * itemsParPage, (page + 1) * itemsParPage);
    // 次のページがあるか
    const hasNext = list.length > (page + 1) * itemsParPage;
    return { contents, hasNext };
};
