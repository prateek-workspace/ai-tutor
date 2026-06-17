"use client";

const ITEMS = [
  "Hindi", "English", "Hinglish", "Mathematics", "Science", "Social Studies",
  "EVS", "Hands-free", "No typing", "Smartboard-ready", "Concept maps",
  "Instant quizzes", "Live translation", "Activity guides",
];

export default function Marquee() {
  // Duplicate the list so the -50% translate loops seamlessly.
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="bg-black border-y border-white/10 py-5 overflow-hidden marquee-mask">
      <div className="flex w-max animate-marquee">
        {row.map((item, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="text-white/35 text-sm md:text-base tracking-widest uppercase px-6">
              {item}
            </span>
            <span className="text-white/15">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
