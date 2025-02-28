// components/ui/particles.tsx
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-particles";

export const Particles = (props: any) => (
  <Particles
    options={{
      particles: {
        number: { value: props.quantity || 30 },
        move: { enable: true, speed: 1 },
        size: { value: 1 },
        opacity: { value: 0.3 },
        color: { value: props.color || "#ffffff" },
        links: {
          enable: true,
          distance: 150,
          color: props.color || "#ffffff",
          opacity: 0.2,
        },
      },
    }}
    init={async (engine: Engine) => await loadSlim(engine)}
    {...props}
  />
);
