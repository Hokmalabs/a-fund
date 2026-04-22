import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { blogPosts } from '@/lib/data'
import { Clock, User, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug)
  if (!post) notFound()

  const others = blogPosts.filter(p => p.id !== post.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <Image src={post.image} alt={post.titre} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-3xl mx-auto">
          <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {post.categorie}
          </span>
          <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">
            {post.titre}
          </h1>
        </div>
      </div>

      {/* Contenu */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-1.5"><User size={14} /> {post.auteur}</span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {new Date(post.datePublication).toLocaleDateString('fr-CI', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {post.tempsLecture} min de lecture</span>
          </div>

          {/* Corps */}
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-lg font-medium text-gray-800 leading-relaxed">{post.extrait}</p>
            <p>{post.contenu}</p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-100 flex-wrap">
            <Tag size={14} className="text-gray-400" />
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Retour */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-green-600 text-sm font-medium mt-8 hover:underline">
            <ArrowLeft size={14} /> Retour au blog
          </Link>
        </div>
      </section>

      {/* Articles similaires */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-gray-800 mb-6">
            Articles similaires
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="card overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative w-full h-40 overflow-hidden">
                  <Image src={p.image} alt={p.titre} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-xs text-green-600 font-medium mb-1">{p.categorie}</p>
                  <h3 style={{ fontFamily: 'Georgia, serif' }} className="font-bold text-gray-800 text-sm leading-snug group-hover:text-green-700 transition-colors">
                    {p.titre}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Clock size={11} /> {p.tempsLecture} min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}