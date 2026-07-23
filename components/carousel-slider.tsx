"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselSlide {
  image: string
  title: string
  subtitle: string
}

interface CarouselSliderProps {
  slides: CarouselSlide[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function CarouselSlider({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
}: CarouselSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [isAutoPlaying, slides.length, autoPlayInterval])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 10 seconds of user interaction
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative w-full rounded-3xl overflow-hidden group">
      {/* Slides Container */}
      <div className="relative h-96 sm:h-[500px] w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl sm:text-4xl font-bold mb-2">{slide.title}</h3>
              <p className="text-lg text-gray-200">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 transition-all backdrop-blur-sm border border-white/30 group-hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 transition-all backdrop-blur-sm border border-white/30 group-hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-white w-8 h-2"
                : "bg-white/50 hover:bg-white/75 w-2 h-2"
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
        <p className="text-white text-sm font-semibold">
          {currentSlide + 1} / {slides.length}
        </p>
      </div>
    </div>
  )
}
