import LandingPage from "@/components/landing-page";

export default async function Home() {
  return (
    <>
      {/* <Hero /> */}
      <div className="flex-1 flex flex-col gap-6 px-4">
        <LandingPage />
      </div>
    </>
  );
}
