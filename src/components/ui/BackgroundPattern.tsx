// components/Admin/BackgroundPattern.tsx
'use client'

import { useCallback } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'

export default function BackgroundPattern() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute inset-0 z-10"
      options={{
        background: {
          color: {
            value: '#ffffff',
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: ['#c96dee', '#c96dee', '#c96dee', '#c96dee'], 
          },
          links: {
            color: '#c96dee',
            distance: 150,
            enable: true,
            opacity: 0.15,
            width: 1,
          },
          move: {
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: true,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
            },
            value: 60,
          },
          opacity: {
            value: 0.3,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
            },
          },
          shape: {
            type: ['circle', 'triangle', 'polygon'],
            options: {
              polygon: {
                sides: 5, // شکل ستاره مانند
              },
            },
          },
          size: {
            value: { min: 2, max: 6 },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 1,
            },
          },
          wobble: {
            enable: true,
            distance: 5,
            speed: 2,
          },
        },
        detectRetina: true,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'grab',
            },
          },
          modes: {
            grab: {
              distance: 180,
              links: {
                opacity: 0.4,
                color: '#c96dee',
              },
            },
          },
        },
      }}
    />
  )
}