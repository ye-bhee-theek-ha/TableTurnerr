"use client";

import React, { use } from 'react';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Contact {
  phone: string;
  email: string;
}

interface Hours {
  day: string;
  hours: string;
}

interface LocationProps {
  title: string;
  subtitle?: string;
  address: Address;
  mapQuery: string;
  contact?: Contact;
  hours?: Hours[];
  openingTime?: string;
  actionLinkDirections?: {
    text: string;
    url: string;
  };
  actionLinkContact?: {
    text: string;
    url: string;
  };
}

const LocationComponent: React.FC<LocationProps> = ({
  title,
  subtitle,
  address,
  mapQuery,
  contact,
  hours,
  openingTime,
  actionLinkDirections,
  actionLinkContact,    
}) => {
  // Create the Google Maps embed URL
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  
  return (
    <div className="mx-[70px]">
      <h2 className="text-h2 mb-[32px]">{title}</h2>
      
      <div className="relative">
        {/* Map Container */}
        <div className="w-full h-[400px] rounded-[14px] overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              id="gmap_canvas"
              src={mapUrl}
              aria-label={`Map showing location of ${title}`}
            ></iframe>
        </div>

        {/* Overlay Container */}
        <div className="absolute inset-0 z-10 p-[16px] flex flex-wrap pointer-events-none justify-between">
        
          <div className='flex flex-col gap-2'>
            <div className="flex flex-col h-fit w-[264px] px-[24px] py-[21px] items-start gap-[10px] self-stretch rounded-[30px] border-white/25 border bg-white/40 shadow-black/15 shadow-[6px] backdrop-blur-[14px]">
                <div>
                    {subtitle && <div className="text-normal2 font-medium text-black/50">{subtitle}</div>}
                    <p className="text-normal2 font-medium text-black">{title}</p>
                </div>

                <div className='w-full'>
                    <button className='h-[25px] text-normal3 text-black/50 w-full flex items-center justify-center bg-black/10 rounded-full'>
                        {actionLinkContact?.text}
                    </button>
                </div>

                <div className='w-full'>
                    <button className='h-[25px] w-full flex items-center justify-center bg-primary rounded-full text-white'>
                        {actionLinkDirections?.text}
                    </button>
                </div>
            </div>
						{(mapQuery || contact?.phone || contact?.email) && (
							<div className="flex flex-col h-fit w-[220px] px-[24px] py-[21px] items-start gap-[10px] self-stretch rounded-[30px] border-white/25 border bg-white/40 shadow-black/15 shadow-[6px] backdrop-blur-[14px]">
									<div>
										{mapQuery && 
										<>
											<div className='text-normal4 text-black/50'>
													Address
											</div>
											<div className='text-normal4 text-black leading-[24px] mb-[10px]'>
												{mapQuery}
											</div>
										</>
										}

										{contact?.phone && contact?.email &&
										<>
											<div className='text-normal4 text-black/50'>
													Contact
											</div>
											<div className='text-normal4 text-black leading-[24px]'>
												{contact?.phone}
												<br />
												{contact?.email}
											</div>
										</>
										}
									</div>
							</div>
						)}
          </div>
          


          <div className="flex flex-col h-fit w-[264px] px-[24px] py-[21px] items-end gap-[10px] self-stretch rounded-[30px] border-white/25 border bg-white/40 shadow-black/15 shadow-[6px] backdrop-blur-[14px]">
            {openingTime && (
              <div className="w-full">
                <p className="text-normal4 font-medium">Opens at {openingTime}</p>
              </div>
            )}
            
            {hours && hours.length > 0 && (
              <div className="w-full">
                <h4 className="text-normal4 font-medium text-center text-gray-600 mb-2">Timings</h4>
                <div className="">
                  {hours.map((item, index) => (
                    <React.Fragment key={index}>
											<div className='w-full flex items-center justify-between'>
												<p className="text-normal4 text-black/60">{item.day}</p>
												<p className="text-normal4 text-black/60">{item.hours}</p>
											</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationComponent;