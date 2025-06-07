'use client'

import React, { ReactElement } from "react";

type ServiceCardProps = {
  image?: ReactElement;
  title?: string;
  description?: string;
  className?: string;
};

const ServiceCard = ({ image, title = "", description = "", className = "" }: ServiceCardProps) => {

  return (
    <div
      className={` h-full card service-card dark:border shadow-lg   rounded-[25px] p-3 text-center cursor-pointer ${className}`}
    >
      <div className="card-header">
        <div className="card-image max-w-[200px] h-[150px] mx-auto mb-10">{image}</div>
      </div>
      <div className="card-body">
        <h4 className="card-title text-[19px] font-bold mb-4">{title}</h4>
        <p className="card-desciption text-[#3e3e3e] mb-5">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
