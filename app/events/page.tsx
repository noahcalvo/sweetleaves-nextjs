import type { Metadata } from "next";
import { Suspense } from "react";
import { getPosts } from "@/lib/blog";
import LearnGardenClub from "../learn/components/LearnGardenClub";
import EventCard from "./components/EventCard";
import EventSearch from "./components/EventSearch";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming events, in-store specials, and community happenings at Sweetleaves in Minneapolis.",
  alternates: { canonical: "/events/" },
};

interface Props {
  searchParams: Promise<{ search?: string }>;
}

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search || undefined;

  const { posts: allPosts } = await getPosts({
    perPage: 100,
    categorySlug: "events",
    search,
  });

  const today = new Date().toISOString().slice(0, 10);
  const posts = allPosts.filter(
    (post) => !post.eventDate || post.eventDate >= today
  );

  return (
    <div className="max-w-[1366px] mx-auto px-4 md:px-[37px] py-8 flex flex-col gap-[30px] items-center">
      <h1 className="font-poppins-bold text-[35px] md:text-[55px] text-dark-green text-center leading-[0.9]">
        Our Events
      </h1>

      <Suspense>
        <EventSearch />
      </Suspense>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] md:gap-[25px] w-full">
          {posts.map((post) => (
            <EventCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="font-poppins-regular text-[18px] text-sage text-center py-12">
          No events found.
        </p>
      )}

      <LearnGardenClub />
    </div>
  );
}
