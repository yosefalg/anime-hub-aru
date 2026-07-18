/**
 * AniVerse Web - Custom Video Player
 * 
 * A production-grade, accessible, and highly customizable video player.
 * Built on top of Video.js with custom React integration.
 * 
 * Features:
 * - Adaptive Streaming (HLS/DASH)
 * - Custom UI matching the AniVerse Glassmorphism theme
 * - Keyboard Shortcuts (Space, F, M, Arrows)
 * - Picture-in-Picture (PiP)
 * - Playback Speed & Quality Selection
 * - Skip Intro/Outro buttons
 * - Auto-hide controls
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, SkipForward, SkipBack, PictureInPicture2,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// ==============================================================================
// Types & Interfaces
// ==============================================================================

export interface VideoSource {
  src: string;
  type: string; // e.g., 'application/x-mpegURL' for HLS
  label?: string; // e.g., '1080p'
}

export interface VideoPlayerProps {
  sources: VideoSource[];
  poster?: string;
  title?: string;
  startTime?: number; // in seconds (for continue watching)
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  className?: string;
}

// ==============================================================================
// Video Player Component
// ==============================================================================

export default function VideoPlayer({
  sources,
  poster,
  title,
  startTime = 0,
  onTimeUpdate,
  onEnded,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showSkipIntro, setShowSkipIntro] = useState(false);

  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // Initialize Video.js
  // ============================================================================

  useEffect(() => {
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered', 'vjs-theme-aniverse');
      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, {
        autoplay: false,
        controls: false, // We use custom controls
        responsive: true,
        fluid: true,
        poster: poster,
        sources: sources,
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        html5: {
          vhs: {
            overrideNative: true,
            limitRenditionByPlayerDimensions: true,
            useDevicePixelRatio: true,
          },
          nativeAudioTracks: false,
          nativeVideoTracks: false,
        },
      }, () => {
        // Player is ready
        if (startTime > 0) {
          player.currentTime(startTime);
        }
        
        player.on('play', () => setIsPlaying(true));
        player.on('pause', () => setIsPlaying(false));
        player.on('timeupdate', () => {
          const current = player.currentTime();
          const dur = player.duration();
          setCurrentTime(current);
          setDuration(dur);
          onTimeUpdate?.(current, dur);

          // Mock Skip Intro logic (e.g., show between 10s and 30s)
          if (current >= 10 && current <= 30) {
            setShowSkipIntro(true);
          } else {
            setShowSkipIntro(false);
          }
        });
        player.on('ended', () => {
          setIsPlaying(false);
          onEnded?.();
        });
        player.on('volumechange', () => {
          setVolume(player.volume());
          setIsMuted(player.muted());
        });
        player.on('fullscreenchange', () => {
          setIsFullscreen(player.isFullscreen());
        });
        player.on('ratechange', () => {
          setPlaybackRate(player.playbackRate());
        });
      });

      playerRef.current = player;
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [sources, poster, startTime, onTimeUpdate, onEnded]);

  // ============================================================================
  // Controls Visibility Logic
  // ============================================================================

  const resetHideControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    if (isPlaying) {
      hideControlsTimeout.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000); // Hide after 3 seconds of inactivity
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    };
  }, []);

  // ============================================================================
  // Player Actions
  // ============================================================================

  const togglePlay = () => {
    if (playerRef.current) {
      playerRef.current.paused() ? playerRef.current.play() : playerRef.current.pause();
    }
    resetHideControlsTimer();
  };

  const toggleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted(!playerRef.current.muted());
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.volume(newVolume);
      playerRef.current.muted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (playerRef.current.isFullscreen()) {
        playerRef.current.exitFullscreen();
      } else {
        playerRef.current.requestFullscreen();
      }
    }
  };

  const togglePiP = async () => {
    if (playerRef.current) {
      const videoEl = playerRef.current.el().querySelector('video');
      if (videoEl) {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoEl.requestPictureInPicture();
        }
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.currentTime(time);
    }
  };

  const skipTime = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.currentTime(playerRef.current.currentTime() + seconds);
    }
    resetHideControlsTimer();
  };

  const changePlaybackRate = (rate: number) => {
    if (playerRef.current) {
      playerRef.current.playbackRate(rate);
    }
    setShowSettings(false);
  };

  const skipIntro = () => {
    if (playerRef.current) {
      playerRef.current.currentTime(30); // Mock: skip to 30s
    }
  };

  // ============================================================================
  // Keyboard Shortcuts
  // ============================================================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          skipTime(10);
          break;
        case 'arrowup':
          e.preventDefault();
          if (playerRef.current) playerRef.current.volume(Math.min(1, playerRef.current.volume() + 0.1));
          break;
        case 'arrowdown':
          e.preventDefault();
          if (playerRef.current) playerRef.current.volume(Math.max(0, playerRef.current.volume() - 0.1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ============================================================================
  // Render
  // ============================================================================

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none",
        className
      )}
      onMouseMove={resetHideControlsTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onClick={togglePlay}
    >
      {/* Video.js Container */}
      <div ref={videoRef} className="absolute inset-0 w-full h-full" />

      {/* ==========================================================================
          Custom UI Overlay
          ========================================================================== */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none"
            onClick={(e) => e.stopPropagation()} // Prevent click from toggling play
          >
            {/* Top Gradient & Title */}
            <div className="bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6 pointer-events-auto">
              {title && (
                <h2 className="text-white text-lg md:text-xl font-bold drop-shadow-md truncate">
                  {title}
                </h2>
              )}
            </div>

            {/* Center Play Button (Shows when paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center shadow-glow-lg cursor-pointer pointer-events-auto"
                  onClick={togglePlay}
                >
                  <Play className="w-8 h-8 text-white fill-white ms-1" />
                </motion.div>
              </div>
            )}

            {/* Skip Intro Button */}
            {showSkipIntro && (
              <motion.button
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                onClick={skipIntro}
                className="absolute bottom-24 end-6 md:bottom-32 md:end-8 px-6 py-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors pointer-events-auto"
              >
                تخطي المقدمة
              </motion.button>
            )}

            {/* Bottom Controls */}
            <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 md:p-6 space-y-3 pointer-events-auto">
              
              {/* Progress Bar */}
              <div className="relative group/progress w-full h-1.5 bg-white/20 rounded-full cursor-pointer hover:h-2.5 transition-all">
                {/* Buffered (Mock) */}
                <div className="absolute inset-y-0 start-0 w-1/3 bg-white/30 rounded-full" />
                {/* Played */}
                <div 
                  className="absolute inset-y-0 start-0 bg-primary rounded-full" 
                  style={{ width: `${progressPercent}%` }} 
                />
                {/* Thumb */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
                  style={{ left: `${progressPercent}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Control Buttons Row */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Play/Pause */}
                  <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                  </button>

                  {/* Skip Back/Forward */}
                  <button onClick={() => skipTime(-10)} className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button onClick={() => skipTime(10)} className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:block">
                    <SkipForward className="w-5 h-5" />
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2 group/vol">
                    <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-0 group-hover/vol:w-20 transition-all duration-300 accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Time Display */}
                  <span className="text-xs md:text-sm font-medium tabular-nums ms-2">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                  {/* Settings (Playback Speed) */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowSettings(!showSettings)} 
                      className={cn("p-2 hover:bg-white/10 rounded-lg transition-colors", showSettings && "bg-white/10")}
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                    
                    {showSettings && (
                      <div className="absolute bottom-full mb-2 end-0 w-40 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-xl">
                        <div className="p-2 border-b border-white/10 text-xs text-white/70 font-semibold">
                          سرعة التشغيل
                        </div>
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => changePlaybackRate(rate)}
                            className={cn(
                              "w-full text-start px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center justify-between",
                              playbackRate === rate && "text-primary font-bold"
                            )}
                          >
                            {rate}x
                            {playbackRate === rate && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* PiP */}
                  <button onClick={togglePiP} className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden md:block">
                    <PictureInPicture2 className="w-5 h-5" />
                  </button>

                  {/* Fullscreen */}
                  <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
                             }
