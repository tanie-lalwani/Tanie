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
      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-2.5 border-b border-white/12 pb-3 sm:mb-5">
        <p className="section-eyebrow">
          {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>
      </div>

      <div
        className="relative flex min-h-72 flex-col items-center justify-center gap-4 sm:min-h-80 sm:block"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Large screens: chevrons at sides */}
        <div className="hidden sm:block">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous project"
            className="ui-icon-button absolute left-0 z-10 h-8 w-8 text-lg sm:h-10 sm:w-10 sm:text-xl md:h-12 md:w-12 md:text-2xl"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            {'<'}
          </button>
        </div>
        <div className="flex w-full items-center justify-center">
          <AnimatePresence mode="wait">
            <ProjectCard key={activeProject.site} {...activeProject} />
          </AnimatePresence>
        </div>
        <div className="hidden sm:block">
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next project"
            className="ui-icon-button absolute right-0 z-10 h-8 w-8 text-lg sm:h-10 sm:w-10 sm:text-xl md:h-12 md:w-12 md:text-2xl"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            {'>'}
          </button>
        </div>
        {/* Small screens: chevrons below video */}
        <div className="flex items-center justify-center gap-4 sm:hidden">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous project"
            className="ui-icon-button h-9 w-9 text-lg"
          >
            {'<'}
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Next project"
            className="ui-icon-button h-9 w-9 text-lg"
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
}
