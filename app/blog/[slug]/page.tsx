"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteShell } from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/data";

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <Link href="/#blog" className="mt-4 inline-block text-[#1e3a5f]">
            Back to blog
          </Link>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="text-sm text-gray-500">
          {post.date} | {post.category}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-black sm:text-4xl">{post.title}</h1>
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={post.image} alt={post.title} fill className="object-cover" sizes="800px" priority />
        </div>
        <div className="prose mt-8 space-y-4 text-gray-700">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Link href="/#blog" className="mt-10 inline-block font-medium text-[#1e3a5f]">
          ← Back to blog
        </Link>
      </article>
    </SiteShell>
  );
}
