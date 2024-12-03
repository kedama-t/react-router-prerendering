export const meta = () => {
  return [{ title: "React-Routerブログ | トップページ" }];
};

export default function Home() {
  return (
    <>
      <p>
        <a href="https://reactrouter.com/">React Router</a>
        のプリレンダリング機能を使った静的ブログサイトのサンプルです
      </p>
    </>
  );
}
