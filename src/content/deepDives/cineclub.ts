import type { CaseImage, DeepDive } from "../caseStudyTypes";

/*
 * CINECLUB walkthrough.
 *
 * Screenshots are Lewis's own, taken in a demo club on an iPhone and cropped
 * by him (4 November 2026). Facts come from the cineclub repository
 * (CLAUDE.md, README.md and REGRESSION_GUARD.md), checked on 4 November 2026.
 */
const DIR = "/assets/photos/cineclub/";

const shot = (file: string, alt: string, caption: string): CaseImage => ({
  src: `${DIR}${file}.jpg`,
  alt,
  caption,
  phone: true,
});

export const cineclubDeepDive: DeepDive = {
  projectId: "cineclub",
  title: "Inside the app",
  intro:
    "A walk through one round of a film club, using screenshots of a demo club on an iPhone. Each round goes the same way: add films, spin, watch, then rate and review.",
  stages: [
    {
      id: "add-films",
      label: "Add films",
      title: "Building the club's list",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "Every member adds films they want to watch to one shared list, which becomes the wheel. There are several ways to find something, so nobody needs to start from an empty search box.",
        },
        {
          kind: "gallery",
          images: [
            shot(
              "films-recommended",
              "Recommended for your club: a grid of film posters, each marked Everyone can watch, with an add button",
              "Recommendations based on the club's top-rated films. Films that every member can stream show first.",
            ),
            shot(
              "films-streaming",
              "Films your club can stream: a search box, genre and decade filters, an A to Z index and a list of films",
              "Films the club can stream, from each member's saved services and country, with search, filters and an A to Z index.",
            ),
            shot(
              "films-wheel-packs",
              "Wheel packs: cards for themes such as First film night and for decades such as 2020s",
              "Wheel packs: ready-made themed collections, grouped by theme and by decade.",
            ),
            shot(
              "films-import",
              "Import films sheet with Letterboxd and IMDb tabs and numbered steps",
              "Import from Letterboxd or IMDb. The numbered steps explain how to export the file on a phone or a computer.",
            ),
            shot(
              "films-seen",
              "Have you seen these? sheet showing the Seven Samurai poster with Seen it and Haven't seen it buttons",
              "After adding films, each member can quickly mark which ones they have already seen, one poster at a time.",
            ),
          ],
        },
      ],
    },

    {
      id: "spin",
      label: "Spin",
      title: "Picking the film",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "Members take turns to spin. The club can use a wheel or a film-strip reel, and both give the same fair pick from the whole list. If the member whose turn it is does not spin, CINECLUB can spin for them automatically.",
        },
        {
          kind: "gallery",
          images: [
            shot(
              "spin-wheel",
              "Spin tab showing whose turn it is, above a black, grey and white wheel of film titles",
              "The Spin tab says whose turn it is. The wheel has one slice for each film on the list.",
            ),
            shot(
              "spin-film-strip",
              "Spin tab with a film-strip reel of posters, an auto-spin countdown and a Spin button",
              "The film-strip view shows posters on a reel instead. The line below counts down to the automatic spin.",
            ),
            shot(
              "spinning-wheel",
              "Dark screen with a close-up of the wheel turning under a pointer and the words Spinning the wheel",
              "During a spin, the wheel fills the screen and slows down under the pointer.",
            ),
            shot(
              "spinning-reel",
              "Dark screen with the poster reel moving behind a white frame and the words Running the reel",
              "The reel version slides posters past a frame until one stops inside it.",
            ),
          ],
        },
      ],
    },

    {
      id: "watch",
      label: "Watch",
      title: "This week's film",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "The chosen film goes to the top of the Spin tab with a deadline. Members mark it as watched, and the club can see progress without anyone revealing what they thought.",
        },
        {
          kind: "gallery",
          images: [
            shot(
              "this-weeks-film",
              "This week's film card for The Brutalist with the deadline, an I've watched it button and watched and rated counts",
              "The film card shows the poster, who spun and added it, the time left, and how many members have watched and rated. Can't watch? and Skip film handle weeks when the film does not work for someone.",
            ),
          ],
        },
      ],
    },

    {
      id: "rate",
      label: "Rate",
      title: "Ratings and reviews",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "Each member gives a half-star rating and a short review. Reviews stay sealed until every member has watched and rated, so nobody is influenced by anyone else. Then the club can see every review and talk about the film.",
        },
        {
          kind: "gallery",
          images: [
            shot(
              "ratings-list",
              "Ratings tab listing past films with posters and average star ratings",
              "The Ratings tab keeps every past film with the club's average score.",
            ),
            shot(
              "ratings-review",
              "Tampopo opened, showing a rating chart, two members' reviews and a discussion section",
              "Opening a film shows how the scores spread, each member's review and a discussion thread.",
            ),
          ],
        },
      ],
    },

    {
      id: "stats",
      label: "Stats",
      title: "Stats, achievements and chat",
      status: "done",
      blocks: [
        {
          kind: "text",
          text: "Over time, the club builds up a history. Stats and achievements make that history fun to look back on, and the club chat keeps conversation in the same place as the films.",
        },
        {
          kind: "gallery",
          images: [
            shot(
              "stats-club",
              "Club stats: films watched, films on the wheel, members, ratings given, average rating and time watched",
              "Club stats: films watched, films still on the wheel, ratings given, average score and total time watched.",
            ),
            shot(
              "stats-you",
              "Personal stats: films watched, added and rated, average rating, current streak and time watched",
              "Personal stats for each member, including their current streak.",
            ),
            shot(
              "stats-achievements",
              "Achievements list where each badge is named after a film, such as The Shining and Back to the Future",
              "Achievements. Each one is named after a film that matches it, for example Back to the Future for films from five different decades.",
            ),
            shot(
              "chat",
              "Club chat with a message box and a Send button",
              "The club chat.",
            ),
          ],
        },
      ],
    },

    {
      id: "built",
      label: "How it is built",
      title: "How it is built",
      status: "done",
      blocks: [
        {
          kind: "list",
          items: [
            "A web app written in TypeScript, with the screens moving to React one at a time.",
            "Supabase (Postgres) stores clubs, films and ratings. Database rules check every read and write, so a member can only see their own clubs.",
            "Cloudflare Pages hosts the site. A Cloudflare Worker sends reminders, runs the automatic spin and fetches film details from TMDB.",
            "A regression guard lists every promise the app makes to members, with the test that protects each one. Changes run those tests before they are published.",
          ],
        },
      ],
    },
  ],
};
