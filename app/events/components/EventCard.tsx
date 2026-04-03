import Image from "next/image";
import Link from "next/link";
import type { WPPost } from "@/lib/blog";

interface Props {
  post: WPPost;
}

export default function EventCard({ post }: Props) {
  let date: string;
  if (post.eventDate) {
    const [y, m, d] = post.eventDate.split("-").map(Number);
    date = new Date(y, m - 1, d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else {
    date = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Chicago",
    });
  }

  return (
    <Link
      href={`/events/${post.slug}`}
      className="bg-white rounded-[30px] p-[19px] flex flex-col gap-[22px] hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full aspect-[16/9] rounded-[10px] overflow-hidden">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-sage/20" />
        )}
      </div>
      <div className="flex flex-col gap-[10px]">
        <h2 className="font-poppins-bold text-[30px] md:text-[35px] text-dark leading-tight">
          {post.title}
        </h2>
        {date && (
          <p className="font-poppins text-[18px] text-sage italic">{date}</p>
        )}
        <div
          className="font-poppins-regular text-[18px] text-dark line-clamp-4"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <span className="font-poppins-bold text-[20px] text-orange-glow uppercase">
          Read More &gt;
        </span>
      </div>
    </Link>
  );
}
