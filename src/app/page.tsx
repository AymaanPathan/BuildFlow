import { PricingCards } from "./components/Cards/card";
import Hero from "./components/Hero/Hero";
import Navbar from "./components/Navbar/navbar";
import Theme from "./theme/theme";
import data from "./components/Cards/data.json";

export default function Home() {
  return (
    <Theme>
      <Navbar />
      <Hero />
      <PricingCards plans={data} />
    </Theme>
  );
}
