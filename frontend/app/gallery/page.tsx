'use client';

import { useState, useEffect } from 'react';

const PHOTOS = [
  { src: '/photos/IMG_0772.jpeg', caption: 'Afternoon harbour' },
  { src: '/photos/IMG_2567.jpeg', caption: 'Jellyfish, drifting' },
  { src: '/photos/18374.jpeg', caption: 'Coffee' },
  { src: '/photos/IMG_2590.jpeg', caption: 'Shark overhead' },
  { src: '/photos/19074.jpeg', caption: 'Autumn' },
  { src: '/photos/IMG_3025.jpeg', caption: 'Willows' },
  { src: '/photos/IMG_3061.jpeg', caption: 'Ginza corner' },
  { src: '/photos/19076.jpeg', caption: 'Cat supervisor' },
  { src: '/photos/IMG_3124.jpeg', caption: 'Kaminarimon Gate' },
  { src: '/photos/19129.jpeg', caption: 'Old town' },
  { src: '/photos/IMG_3210.jpeg', caption: 'Early cherry blossoms' },
  { src: '/photos/IMG_3493.jpeg', caption: 'Fuji TV, Odaiba' },
  { src: '/photos/19138.jpeg', caption: 'Basket shop' },
  { src: '/photos/IMG_3512.jpeg', caption: 'Rainbow Bridge, framed' },
  { src: '/photos/IMG_1527.jpeg', caption: 'The Art of Pho' },
  { src: '/photos/IMG_3541.jpeg', caption: 'Skyline' },
  { src: '/photos/IMG_3664.jpeg', caption: 'Backstreet, morning' },
  { src: '/photos/IMG_2274.jpeg', caption: 'Chandeliers' },
  { src: '/photos/IMG_3697.jpeg', caption: 'Train window' },
  { src: '/photos/IMG_3051.jpeg', caption: 'Minori to Minoru' },
  { src: '/photos/IMG_4584.jpeg', caption: 'Ewha Womans University' },
  { src: '/photos/IMG_4895.jpeg', caption: 'Seoul Tower' },
  { src: '/photos/IMG_1003.jpeg', caption: 'Streets' },
  { src: '/photos/IMG_5121.jpeg', caption: 'Bukchon Village' },
  { src: '/photos/IMG_5382.jpeg', caption: 'Night flight' },
  { src: '/photos/IMG_6154.jpeg', caption: 'The Silver Garden' },
  { src: '/photos/IMG_5062.jpeg', caption: 'Plum blossoms' },
  { src: '/photos/IMG_6272.jpeg', caption: 'Marshmallow' },
  { src: '/photos/IMG_6620.jpeg', caption: 'Ni Hao Bar' },
  { src: '/photos/IMG_6420.jpeg', caption: 'Full moon' },
  { src: '/photos/IMG_6618.jpeg', caption: 'Dusk' },
  { src: '/photos/IMG_6431.jpeg', caption: 'Wing at sunset' },
  { src: '/photos/IMG_6619.jpeg', caption: 'Tram tracks' },
  { src: '/photos/IMG_6547.jpeg', caption: 'Boardwalk through canopy' },
  { src: '/photos/IMG_3633.jpeg', caption: 'Railway' },
  { src: '/photos/IMG_3381.jpeg', caption: 'Shiba Park' },
  { src: '/photos/18482.jpeg', caption: 'Bukit Timah Trail' },
  { src: '/photos/18002.jpeg', caption: 'Changi Airport' },
];

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function showPrev() {
    setOpenIndex((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length));
  }
  function showNext() {
    setOpenIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length));
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'Escape') setOpenIndex(null);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openIndex]);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Gallery</h1>
      <p className="text-sage mb-8">Photos from daily life and trips.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <img
              src={photo.src}
              alt={photo.caption}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-canvas/0 group-hover:bg-canvas/50 transition-colors duration-500 ease-out flex items-end p-2">
              <span className="text-xs font-mono text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
                {photo.caption}
              </span>
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setOpenIndex(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            className="absolute left-4 text-white/70 text-3xl font-mono px-3 py-2 hover:text-mint"
            aria-label="Previous photo"
          >
            ‹
          </button>

          <div
            className="max-w-3xl max-h-[80vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={PHOTOS[openIndex].src}
              alt={PHOTOS[openIndex].caption}
              className="max-h-[70vh] object-contain rounded"
            />
            <p className="text-white/80 font-mono text-sm mt-4">{PHOTOS[openIndex].caption}</p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-4 text-white/70 text-3xl font-mono px-3 py-2 hover:text-mint"
            aria-label="Next photo"
          >
            ›
          </button>

          <button
            onClick={() => setOpenIndex(null)}
            className="absolute top-4 right-4 text-white/70 text-xl font-mono hover:text-mint"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
