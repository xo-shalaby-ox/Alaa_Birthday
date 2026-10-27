/* ═══════════════════════════════════════════════════════════
   💗 EDIT EVERYTHING HERE: texts, dates, photos, song.
   Dates: "YYYY-MM-DD". Photos → public/photos/   Song → public/music/
   A missing photo shows an illustrated placeholder, so nothing breaks.
   Paths start with "/" (files in public/ are served from the site root).
   ═══════════════════════════════════════════════════════════ */
export default {
  her: "Alaa",
  herAr: "الاء",
  him: "Mohamed Shalaby",

  birthday: "2026-10-28", // before this date the gift screen shows a countdown
  engagedDate: "2025-10-03", // shows "days since we said yes" (set to "" to hide)

  // Your song (mp3). Until the file exists, a calm piano piece composed live in the browser plays instead.
  song: { src: "/music/song.mp3", title: "Our Song", artist: "for Alaa" },

  hero: {
    photo: "/photos/hero.jpg", // portrait 4:5
    line: "To the girl who turns ordinary days into my favorite memories. This little corner of the internet is all yours.",
  },

  memories: [
    // square-ish photos look best; add or remove freely
    { src: "/photos/1.jpg", caption: "Your smile" },
    { src: "/photos/2.jpg", caption: "Simple and perfect" },
    { src: "/photos/3.jpg", caption: "The day we said yes", date: "2025-10-03" },
    { src: "/photos/4.jpg", caption: "Little moments" },
    { src: "/photos/5.jpg", caption: "My safest place" },
    { src: "/photos/6.jpg", caption: "Forever us" },
  ],

  reasons: [
    { emoji: "❤️", text: "You have a special way of making me smile, even on my hardest days. Just talking to you can make everything feel better." },
    { emoji: "🫶", text: "With you, I feel a kind of love that makes my heart feel safe. You make me feel important, appreciated, and special." },
    { emoji: "✨", text: "I love how I can be myself around you without pretending to be someone else. You accept me with my flaws, my dreams, and everything that makes me who I am." },
    { emoji: "🌷", text: "Since you came into my life, even the simplest moments have become special. You make ordinary days feel like beautiful memories." },
    { emoji: "🏡", text: "No matter how stressful life gets, thinking about you gives me comfort. You are the person I want to share my worries with, celebrate my successes with, and find peace beside." },
    { emoji: "💍", text: "I love you, not just for who you are, but for the future we’ll build, the memories we’ll share, and the forever I want with you. ❤️💍" },
  ],

  wish: { candles: 5, done: "I hope every wish comes true, and that I'm there when it does." },

  letter: [
    "Happy Birthday, My Benim Güzelim ❤️🎂,",
    "Today, I celebrate not only the day you were born, but also the beautiful soul you are and the happiness you bring into this world. Alaa, I pray that life always treats you gently, that your heart stays peaceful, that your smile never fades, and that every dream you carry inside you finds its way to becoming reality.",
    "My wish for you is to succeed in everything you do, to reach every goal you set for yourself, and to become the woman you've always dreamed of being. And through every step of that journey, I want you to know that you will never have to face life alone. I'll be there to encourage you when you doubt yourself, to hold your hand when things get difficult, to celebrate every little victory, and to remind you of how capable and amazing you are whenever you forget.",
    "I hope I can be the person who makes your difficult days a little easier, your happy days even more beautiful, and your biggest dreams feel a little closer. Your happiness matters to me, your peace matters to me, and seeing you succeed will always be one of the things that makes me proudest.",
    "You deserve a life full of beautiful surprises, endless opportunities, good health, success, and a love that makes you feel safe every single day. And as long as life gives me the chance, I'll keep doing my best to give you that kind of love.",
    "Happy Birthday, my future wife. ❤️💍 May this new year of your life bring you closer to everything you've ever wished for. I'll always be cheering for you, believing in you, standing beside you, and loving you through every chapter of your life.",
  ],

  finale: {
    photo: "/photos/finale.jpg", // optional background
    lines: ["Thank you for every smile and every memory.", "This is only the beginning of our story."],
  },
};
