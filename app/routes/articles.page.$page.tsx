import matter from "gray-matter";
import { Link, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { listContents } from "~/util/loadMarkdown";

export const meta = () => {
  return [{ title: "React-Routerブログ | 記事一覧" }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const page = Number(args.params.page);
  const { contents, hasNext } = listContents("./articles", page);
  const articles = contents.map((article) => {
    const { content, data } = matter(article.content);
    return { url: article.url, content, data };
  });
  return { articles, hasNext, page };
};

export default function Articles() {
  const { articles, hasNext, page } = useLoaderData<typeof loader>();
  return (
    <>
      <ul className="flex flex-row flex-wrap gap-2 mb-2 justify-center">
        {articles.map(({ url, data }) => (
          <li className="card bg-base-100 w-96 shadow-xl" key={url}>
            <div className="card-body">
              <h2 className="card-title">{data.title}</h2>
              <p className="text-info text-xs">{url}</p>
              {data.description && <p>{data.description}</p>}
              <Link to={url} className="btn btn-primary text-md">
                読む
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-row gap-2 w-full justify-center">
        {page >= 1 && (
          <Link className="btn btn-primary" to={`/articles/page/${page - 1}`}>
            前のページ
          </Link>
        )}
        {hasNext && (
          <Link className="btn btn-primary" to={`/articles/page/${page + 1}`}>
            次のページ
          </Link>
        )}
      </div>
    </>
  );
}
