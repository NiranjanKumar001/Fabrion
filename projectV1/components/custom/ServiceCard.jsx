import React from "react";

function ServiceCard({ icon, title, description }) {
  return (
    <article className="flex flex-col flex-1 gap-5 items-center">
      {icon ? (
        <img src={icon} alt={`${title} icon`} className="w-[70px] h-[69px]" />
      ) : (
        <div className=" h-[68px] w-[68px]" />
      )}
      <h2 className="text-3xl font-semibold text-center text-zinc-800">
        {title}
      </h2>
      <p className="text-2xl leading-9 text-center text-neutral-600">
        {description}
      </p>
    </article>
  );
}

export default ServiceCard;
