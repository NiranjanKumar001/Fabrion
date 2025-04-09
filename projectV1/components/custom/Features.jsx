"use client";
import React from "react";
import ServiceCard from "./ServiceCard";

function Features() {
  const services = [
    {
      icon: "/images/1.png",
      title: "Minimal Interface",
      description: "No clutter. Just you and your ideas.",
    },
    {
      icon: "/images/2.png",
      title: "Layouts Creation",
      description: "Websites that work seamlessly on any device.",
    },
    {
      icon: "/images/3.png",
      title: "AI Optimization",
      description: "Generate content, sections, or styles with AI with your own Gemini api key.",
    },
  ];

  return (
    <section className="p-16 mt-24 max-md:px-8 max-sm:px-5">
      <div className="flex gap-8 justify-between items-start max-md:flex-col max-md:items-center">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
}

export default Features;
