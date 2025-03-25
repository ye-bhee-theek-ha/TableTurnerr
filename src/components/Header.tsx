import React from 'react'
import { AnimatedMenuButton } from './Menu_Header_btn'
import { AnimatedCTAButton_LoggedOut } from './CTA_header_btn'

function Header() {
  return (
    <div className="p-[20px] w-full">
      {/* <AnimatedCTAButton_LoggedIn alerts={3} /> */}
      <div className="w-full grid grid-cols-3 items-center">
      
        {/* Left Section */}
        <div className="flex justify-start">
          <AnimatedMenuButton
            menuItems={[
              { name: "Home", href: "/" },
              { name: "About", href: "/about" },
              { name: "Services", href: "/services" },
              { name: "Contact", href: "/contact" }
            ]}
          />
        </div>

        {/* Center Section (Always Centered) */}
        <div className="flex justify-center">
          <div className="h-[50px] w-[50px] bg-grey"></div>
        </div>

        {/* Right Section */}
        <div className="flex justify-end">
          <AnimatedCTAButton_LoggedOut />
        </div>
      </div>
    </div>
  )
}

export default Header



