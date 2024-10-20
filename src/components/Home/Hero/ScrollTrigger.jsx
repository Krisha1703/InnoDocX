import { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useSession } from "next-auth/react";

const ScrollTrigger = () => {
  const ref = useRef(null);
  const { data: session } = useSession();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Scroll progress from Framer Motion's useScroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    // Manually update the scroll progress from Framer Motion's scrollYProgress
    scrollYProgress.onChange((latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  // Word "Hello" translations
  const helloTranslations = {
    en: 'Hello',
    hi: 'नमस्ते',  // Hindi
    es: 'Hola',    // Spanish
    fr: 'Bonjour', // French
    de: 'Hallo',   // German
    zh: '你好',    // Chinese
    ja: 'こんにちは', // Japanese
    ru: 'Здравствуйте', // Russian
    gu: 'હેલો', //Gujrati
    th: 'สวัสดี' //Thai
  };

  // Automatically cycle through translations
  useEffect(() => {
    const languages = Object.keys(helloTranslations);
    let index = 0;

    const intervalId = setInterval(() => {
      index = (index + 1) % languages.length;
      setCurrentLanguage(languages[index]);
    }, 1000); // Change translation every second

    return () => clearInterval(intervalId); 
  }, []);

  // Sample text
  const text = '"Every word is a step towards creativity, and every shared idea transforms drafts into masterpieces. To-gether, we write the future."';
  const letters = text.split('');

  // Pre-calculate random transforms for each letter
  const randomTransforms = useRef(
    letters.map(() => ({
      translateX: Math.random() * 400 - 200,  // Random position between -200 and 200
      translateY: Math.random() * 400 - 200,  // Random position between -200 and 200
      rotate: Math.random() * 360 - 180,      // Random rotation between -180 and 180 degrees
    }))
  ).current;

   // Calculate manual transforms based on scroll progress
   const computeTransform = (startValue, endValue, progress, speedFactor = 1) => {
    // Apply the speed factor to the scroll progress to make the effect faster
    const adjustedProgress = Math.min(progress * speedFactor, 1);
    return startValue + (endValue - startValue) * adjustedProgress;
  };

  return (
    <section className=''>
      {/* Continuously animating "Hello" with translations */}
      <h1 className="md:text-[1.5rem] lg:text-[2.5rem] text-[2rem] text-blue-700 md:mx-10 mx-5 md:mt-0 mt-10">
        {helloTranslations[currentLanguage]}, {session?.user?.name}
      </h1>

      {/* Scroll-triggered text animation */}
      <div ref={ref} className="md:h-[50vh] h-[20vh] lg:mt-0 md:-mt-40 flex justify-center items-center">
        <motion.div className="flex flex-wrap sm:max-w-[300px] md:max-w-[450px] lg:max-w-[550px] justify-center">
          {letters.map((letter, index) => {
           const { translateX: initialX, translateY: initialY, rotate: initialRotate } = randomTransforms[index];

           // Apply a speed factor to make the animation faster
           const speedFactor = 1.5; // Increase this value to make the effect faster
           const translateX = computeTransform(initialX, 0, scrollProgress, speedFactor);
           const translateY = computeTransform(initialY, 0, scrollProgress, speedFactor);
           const rotate = computeTransform(initialRotate, 0, scrollProgress, speedFactor);
           const opacity = Math.min(scrollProgress * speedFactor, 1); // Fade-in effect

            return (
              <motion.span
                key={index}
                style={{
                  opacity,
                  translateX,
                  translateY,
                  rotate,
                  display: 'inline-block',
                }}
                className="lg:text-[1.2rem] md:text-md text-sm font-black text-blue-400"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollTrigger;