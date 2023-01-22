import Head from "next/head";
import ImageToText from "components/ImageToText";

export default function Home() {
  return (
    <>
      <Head>
        <title>Image To Text OCR</title>
        <meta name="description" content="Convert Image To Text" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ImageToText />
      </main>
    </>
  );
}
