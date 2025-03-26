// Modified LoadingAnimation Component
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LoadingAnimationProps {
  loadingComplete?: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ loadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hideBackground, setHideBackground] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for mobile responsiveness
  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 639px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (loadingComplete) {
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setHideBackground(true), 500);
      }, 1000);
    }
  }, [loadingComplete]);

  // Mobile-specific animation
  const mobileAnimation = {
    x: isLoading ? "-50%" : "0",
    y: isLoading ? "-50%" : "0",
    top: isLoading ? "50%" : "-2%",
    left: isLoading ? "50%" : "70%",
    scale: isLoading ? 1 : 0.3,
  };

  // Desktop-specific animation
  const desktopAnimation = {
    x: isLoading ? "-50%" : "0",
    y: isLoading ? "-50%" : "0",
    top: isLoading ? "50%" : "-5%",
    left: isLoading ? "50%" : "87%",
    scale: isLoading ? 1 : 0.5,
  };

  return (
    <>
      {!hideBackground && (
        <div
          className={`h-screen w-full flex justify-center items-center fixed top-0 left-0 z-50 transition-all duration-1000 
            ${isLoading ? "bg-[#131619]" : "bg-[rgba(19,22,25,0.8)]"}`}
        >
          <motion.div
            className="w-48 h-48 absolute"
            initial={{ x: "-50%", y: "-50%", top: "50%", left: "50%", scale: 1 }}
            animate={isMobile ? mobileAnimation : desktopAnimation}
            transition={{
              duration: 1,
              ease: "easeInOut",
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
          >
            {/* Outer rotating part */}
            <motion.img
              src="/assets/icons/logo-outer.png"
              alt="Outer Part"
              className="absolute top-0 left-0 w-full h-full brightness-[0.9] contrast-[1.2]"
              initial={{ rotate: 0 }}
              animate={{
                rotate: isLoading ? 360 : 0,
                transition: isLoading
                  ? { repeat: Infinity, duration: 2, ease: "linear" }
                  : { duration: 1, ease: "easeOut" },
              }}
            />
            {/* Center static part */}
            <motion.img
              src="/assets/icons/logo-center.png"
              alt="Center Part"
              className="absolute top-0 left-0 w-full h-full brightness-[1.1]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: 1 },
              }}
            />
          </motion.div>
        </div>
      )}
      {/* Sticky loader position */}
      {hideBackground && (
        <motion.div
          className="w-24 h-24 fixed z-50 sm:absolute top-10 left-[95%] md:top-6 md:right-[15%]"
          animate={{
            opacity: hideBackground ? 1 : 0,
            scale: hideBackground ? 1 : 0.5,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Outer rotating part */}
          <motion.img
            src="/assets/icons/logo-outer.png"
            alt="Outer Part"
            className="absolute sm:top-[3%] left-[-83%] scale-90 w-full h-full brightness-[0.9] contrast-[1.2]"
            animate={{
              rotate: 360,
              transition: { repeat: Infinity, duration: 6, ease: "linear" },
            }}
          />
          {/* Center part */}
          <img
            src="/assets/icons/logo-center.png"
            alt="Center Part"
            className="absolute sm:top-[3%] left-[-83%] scale-90 w-full h-full brightness-[1.1]"
          />
        </motion.div>
      )}
    </>
  );
};

export default LoadingAnimation;
