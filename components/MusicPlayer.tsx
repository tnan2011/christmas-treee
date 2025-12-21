import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface Song {
  title: string;
  artist: string;
  src: string;
  cover: string;
}

const playlist: Song[] = [
  {
    title: 'Last Christmas',
    artist: 'Hehe',
    src: '/music/audio6.mp3',
    cover: '/photos/image2.jpg',
  },
  {
    title: 'Last Christmas',
    artist: 'Hehe',
    src: '/music/audio2.mp3',
    cover: '/photos/image1.png',
  },
];

export const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // 🔥 autoplay
  const [progress, setProgress] = useState(0);

  const song = playlist[index];

  /* Play / Pause */
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch(() => setIsPlaying(false)); // bị chặn autoplay
    }

    setIsPlaying(!isPlaying);
  };

  /* Next / Prev */
  const nextSong = () => {
    setIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  /* Update progress */
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const { currentTime, duration } = audioRef.current;
    setProgress(duration ? (currentTime / duration) * 100 : 0);
  };

  /* Autoplay when song changes */
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.load();

    if (isPlaying) {
      audioRef.current
        .play()
        .catch(() => {
          // Browser chặn autoplay
          setIsPlaying(false);
        });
    }
  }, [index, isPlaying]);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
      <div className="flex items-center gap-4 bg-silver/80 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-lg">
        
        {/* Cover */}
        <img
          src={song.cover}
          alt="cover"
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* Info */}
        <div className="flex flex-col min-w-[180px]">
          <span className="text-white text-sm font-semibold truncate">
            {song.title}
          </span>
          <span className="text-white/60 text-xs truncate">
            {song.artist}
          </span>

          {/* Progress */}
          <div className="w-full h-[2px] bg-white/20 mt-1">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSong}
            className="text-white/70 hover:text-white transition"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 flex items-center justify-center rounded-full 
                      bg-silver text-black hover:scale-110 transition"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            onClick={nextSong}
            className="text-white/70 hover:text-white transition"
          >
            <SkipForward size={18} />
          </button>
        </div>


        {/* Audio */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={nextSong}
          preload="auto"
        >
          <source src={song.src} type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
};
