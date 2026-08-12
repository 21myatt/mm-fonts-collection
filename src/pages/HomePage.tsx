import { ArrowRight } from "lucide-react";
import { useRouter } from "../router";

function HomePage() {
  const { navigate } = useRouter();

  return (
    <main className="home-page">
      <section>
        <h1>Burmese Text Engine</h1>
        <p>Burmese Text Engine (Work in progress)</p>
        <button onClick={() => navigate("/open-source-fonts")}>
          Open source fonts <ArrowRight size={17} />
        </button>
      </section>
    </main>
  );
}

export default HomePage;
