import React from 'react';
import Image from 'next/image';

import profileImg from "@/../public/Images/profile.png";

interface ReviewCardProps {
  starCount: number;
  reviewText: string;
  reviewerName: string;
  profileImage: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  starCount,
  reviewText,
  reviewerName,
  profileImage
}) => {
  // Ensure star count is between 0 and 5
  const stars = Math.min(Math.max(0, starCount), 5);
  
  return (
    <div className="flex flex-col items-start gap-3 p-[20px_30px] rounded-2xl bg-white shadow-[0px_0px_18px_0px_rgba(0,0,0,0.12)]">
      {/* Star Rating */}
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <span key={index} className="text-2xl">
            {index < stars ? "★" : ""}
          </span>
        ))}
      </div>
      
      {/* Review Text */}
      <p className="text-normal1 text-gray-800">
        {reviewText}
      </p>
      
      {/* Reviewer Info */}
      <div className="flex items-center mt-auto  gap-2">
        {profileImage && (
          <div className="w-8 h-8 overflow-hidden rounded-full">
            <Image 
              src={profileImg}
              alt={`${reviewerName}'s profile`}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <span className="text-grey font-medium">{reviewerName}</span>
      </div>
    </div>
    
  );
};

export default ReviewCard;