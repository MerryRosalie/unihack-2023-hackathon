import { type NextPage } from "next";
import Head from "next/head";
import Navbar from "~/components/Navbar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Food Plan</title>
        <meta name="description" content="Food Plan" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-h-screen overflow-hidden">
        <Navbar />
        <main className="flex h-screen w-full items-center justify-around">
          <div className="flex flex-col">
            <h2 className="text-8xl font-bold text-neutral-700">🍐Food Plan</h2>
            <h3 className="mt-2 text-3xl font-semibold">
              All-in-one web app for all things food related
            </h3>
          </div>
          <div>Soz I can't design :')</div>
        </main>
      </main>
    </>
  );
};

export default Home;
