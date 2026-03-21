import { AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { ProjectCard } from "./ProjectCard";


export interface Project {
  client: string;
  role: string;
  project: string;
  site: string;
  quote: string;
  outcome: string;
}

interface ProjectsCarouselProps {
  projects: Project[];
}

export function ProjectsCarousel({ projects }: ProjectsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  // Touch/swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const delta = touchEndX.current - touchStartX.current;
    if (delta > 50) goToPrev();
    else if (delta < -50) goToNext();
  };

  return (
    <div className="relative w-full">
      <div className="relative mb-2 flex flex-wrap items-center justify-between gap-2.5 border-b border-sky-700/30 pb-2.5 sm:mb-3 sm:pb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-900">
          {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
      </div>

      <div
        className="relative min-h-72 sm:min-h-80 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Large screens: chevrons at sides */}
        <div className="hidden sm:block">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous project"
            className="absolute left-0 z-10 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/80 text-sky-900 text-lg sm:text-xl md:text-2xl shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            {'<'}
          </button>
        </div>
        <div className="w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <ProjectCard key={activeProject.site} {...activeProject} />
          </AnimatePresence>
        </div>
        <div className="hidden sm:block">
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next project"
            className="absolute right-0 z-10 flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white/80 text-sky-900 text-lg sm:text-xl md:text-2xl shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            {'>'}
          </button>
        </div>
        {/* Small screens: chevrons below video */}
        <div className="absolute left-0 right-0 -bottom-6 flex items-center justify-center gap-4 sm:hidden">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous project"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sky-900 text-lg shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {'<'}
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next project"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sky-900 text-lg shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
}
