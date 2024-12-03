import {
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
} from 'react-router';
import matter from 'gray-matter';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { loadContent } from '~/util/loadMarkdown';

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  return [
    { title: `React-Routerブログ | ${loaderData?.data.title}` },
    { description: loaderData?.data.description },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const path = args.params['*'] as string;
  const mdContent = loadContent('./articles', path);
  const { content, data } = matter(mdContent);
  return { url: path, content, data };
};

export default function Article() {
  const { url, content, data } = useLoaderData<typeof loader>();

  return (
    <article className="prose lg:prose-xl w-11/12 m-auto">
      <h1>{data.title}</h1>
      <p className="text-info text-xs">{url}</p>
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </article>
  );
}
