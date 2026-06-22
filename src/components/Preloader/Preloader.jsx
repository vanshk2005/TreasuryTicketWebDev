import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { EASE, DURATION, IMAGES } from '../../utils/constants';
import './Preloader.css';

/* Realistic candlestick data that starts low on the screen and goes till the top */
const CANDLES = [
  { x: 50, open: 175, close: 160, high: 150, low: 180, type: 'up', vol: 18 },
  { x: 105, open: 160, close: 140, high: 130, low: 165, type: 'up', vol: 22 },
  { x: 160, open: 140, close: 150, high: 135, low: 155, type: 'down', vol: 12 },
  { x: 215, open: 150, close: 125, high: 115, low: 155, type: 'up', vol: 25 },
  { x: 270, open: 125, close: 100, high: 90, low: 130, type: 'up', vol: 30 },
  { x: 325, open: 100, close: 45, high: 35, low: 105, type: 'up', vol: 55 },
  { x: 380, open: 45, close: 55, high: 40, low: 60, type: 'down', vol: 15 },
  { x: 435, open: 55, close: 35, high: 25, low: 60, type: 'up', vol: 32 },
  { x: 490, open: 35, close: 18, high: 10, low: 40, type: 'up', vol: 40 },
  { x: 545, open: 18, close: 5, high: 2, low: 25, type: 'up', vol: 45 }
];

const GRID_LINES_Y = [40, 80, 120, 160];
const GRID_LINES_X = [100, 200, 300, 400, 500];

const Preloader = ({ onComplete, onTransitionStart }) => {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const statusRef = useRef(null);
  const progressRef = useRef(null);
  const progressGlowRef = useRef(null);
  const horizonRef = useRef(null);
  const timelineRef = useRef(null);

  const [percentage, setPercentage] = useState(0);

  const animatePreloader = useCallback(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete?.();
      },
    });

    timelineRef.current = tl;

    gsap.set('.preloader__candle-wick', { scaleY: 0, transformOrigin: 'center center' });
    gsap.set('.preloader__candle-body', { scaleY: 0 }); // transformOrigin set inline via style
    gsap.set('.preloader__volume-bar', { scaleY: 0, transformOrigin: '50% 100%' });

    const counterObj = { value: 0 };

    /* Phase 1: Fade in counter + status */
    tl.to(counterRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: EASE.luxury,
    })
    .to(statusRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: EASE.smooth,
    }, '-=0.3');

    /* Phase 2: Draw wicks, bodies + count up */
    tl.to('.preloader__candle-wick', {
      scaleY: 1,
      duration: 0.35,
      stagger: {
        each: DURATION.preloader / 12,
        ease: 'power1.inOut'
      },
      ease: 'power1.out'
    }, '+=0.2')
    .to('.preloader__candle-body', {
      scaleY: 1,
      duration: 0.45,
      stagger: {
        each: DURATION.preloader / 12,
        ease: 'power1.inOut'
      },
      ease: 'elastic.out(1.2, 0.8)'
    }, '<+=0.05')
    .to('.preloader__volume-bar', {
      scaleY: 1,
      duration: 0.4,
      stagger: {
        each: DURATION.preloader / 12,
        ease: 'power1.inOut'
      },
      ease: 'power1.out'
    }, '<')
    .to(counterObj, {
      value: 100,
      duration: DURATION.preloader,
      ease: 'power2.inOut',
      onUpdate: () => {
        setPercentage(Math.round(counterObj.value));
      },
    }, '<')
    .to([progressRef.current, progressGlowRef.current], {
      width: '100%',
      duration: DURATION.preloader,
      ease: EASE.luxuryInOut,
    }, '<');

    /* Phase 3: Fade out chart elements */
    tl.to([counterRef.current, statusRef.current, '.preloader__chart'], {
      opacity: 0,
      duration: 0.4,
      ease: EASE.smoothIn,
    }, '+=0.3');

    /* Phase 4: Show horizon line */
    tl.to(horizonRef.current, {
      opacity: 1,
      scaleX: 1,
      duration: 0.6,
      ease: EASE.expo,
    })
    .to(horizonRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: EASE.smooth,
    }, '+=0.15');

    /* Phase 5: Slide entire preloader up */
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1,
      ease: EASE.luxuryInOut,
      onStart: () => {
        onTransitionStart?.();
      }
    }, '-=0.1');
  }, [onComplete, onTransitionStart]);

  useEffect(() => {
    /* Small delay to ensure DOM is ready */
    const timer = setTimeout(animatePreloader, 200);
    return () => {
      clearTimeout(timer);
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [animatePreloader]);

  return (
    <div className="preloader" ref={containerRef}>
      {/* Background decorations */}
      <div className="preloader__bg">
        <div className="preloader__bg-image" style={{ backgroundImage: `url(${IMAGES.hero2})` }} />
        <div className="preloader__glow preloader__glow--1" />
        <div className="preloader__glow preloader__glow--2" />
        <div className="preloader__grid" />
      </div>

      {/* SVG Stock Chart */}
      <div className="preloader__chart">
        <svg
          className="preloader__chart-svg"
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {GRID_LINES_Y.map((y) => (
            <line
              key={`gy-${y}`}
              className="preloader__grid-line"
              x1="0"
              y1={y}
              x2="600"
              y2={y}
            />
          ))}
          {GRID_LINES_X.map((x) => (
            <line
              key={`gx-${x}`}
              className="preloader__grid-line"
              x1={x}
              y1="0"
              x2={x}
              y2="200"
            />
          ))}

          {/* Volume Bars */}
          {CANDLES.map((candle, index) => {
            return (
              <rect
                key={`vol-${index}`}
                className={`preloader__volume-bar preloader__volume-bar--${candle.type}`}
                x={candle.x - 5}
                y={200 - candle.vol}
                width={10}
                height={candle.vol}
                rx={1}
              />
            );
          })}

          {/* Candlesticks */}
          {CANDLES.map((candle, index) => {
            const isUp = candle.type === 'up';
            const rectY = isUp ? candle.close : candle.open;
            const rectHeight = isUp ? (candle.open - candle.close) : (candle.close - candle.open);

            return (
              <g
                key={index}
                className={`preloader__candle preloader__candle--${candle.type}`}
              >
                {/* Wick line */}
                <line
                  className="preloader__candle-wick"
                  x1={candle.x}
                  y1={candle.high}
                  x2={candle.x}
                  y2={candle.low}
                />
                {/* Body rect */}
                <rect
                  className="preloader__candle-body"
                  x={candle.x - 8}
                  y={rectY}
                  width={16}
                  height={rectHeight}
                  rx={2}
                  style={{ transformOrigin: `${candle.x}px ${candle.open}px` }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Counter */}
      <div className="preloader__counter" ref={counterRef}>
        {percentage}
        <span className="preloader__counter-suffix">%</span>
      </div>

      {/* Status text */}
      <div className="preloader__status" ref={statusRef}>
        Initializing Treasury Systems
      </div>

      {/* Horizon line */}
      <div className="preloader__horizon" ref={horizonRef} />

      {/* Bottom progress bar */}
      <div className="preloader__progress" ref={progressRef} />
      <div className="preloader__progress-glow" ref={progressGlowRef} />
    </div>
  );
};

export default Preloader;
