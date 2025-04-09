"use client";
import React from "react";
import ServiceCard from "./ServiceCard";

function Features() {
  const services = [
    {
      icon: "",
      title: "Custom Design",
      description: "Tailored websites that reffiect your brand and vision.",
    },
    {
      icon: "",
      title: "Responsive Layouts",
      description: "Websites that work seamlessly son any device.",
    },
    {
      icon: "",
      title: "SEO Optimization",
      description: "Improving your website's visibility on search engines.",
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
