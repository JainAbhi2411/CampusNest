import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Eye, ArrowLeft, Share2, Facebook, Twitter, Linkedin, ThumbsUp, Heart, Lightbulb, CheckCircle } from 'lucide-react';
import { blogApi } from '@/db/api';
import { useAuth } from 'miaoda-auth-react';
import type { BlogPost } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [isReacting, setIsReacting] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setIsLoading(true);
      const postData = await blogApi.getBlogPostBySlug(postSlug);
      
      if (postData) {
        setPost(postData);
        
        // Load related posts
        if (postData.category_id) {
          const related = await blogApi.getRelatedPosts(postData.id, postData.category_id, 3);
          setRelatedPosts(related);
        }

        // Load reaction counts
        const counts = await blogApi.getPostReactionCounts(postData.id);
        setReactionCounts(counts);

        // Load user reactions if logged in
        if (user) {
          const reactions = await blogApi.getUserReactions(postData.id, user.id);
          setUserReactions(reactions.map(r => r.reaction_type));
        }
      }
    } catch (error) {
      console.error('Failed to load blog post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = async (reactionType: 'like' | 'love' | 'insightful' | 'helpful') => {
    if (!user || !post || isReacting) return;

    try {
      setIsReacting(true);
      const hasReacted = userReactions.includes(reactionType);

      if (hasReacted) {
        // Remove reaction
        await blogApi.removeReaction(post.id, user.id, reactionType);
        setUserReactions(prev => prev.filter(r => r !== reactionType));
        setReactionCounts(prev => ({
          ...prev,
          [reactionType]: Math.max(0, (prev[reactionType] || 0) - 1),
        }));
      } else {
        // Add reaction
        await blogApi.addReaction(post.id, user.id, reactionType);
        setUserReactions(prev => [...prev, reactionType]);
        setReactionCounts(prev => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error('Failed to update reaction:', error);
    } finally {
      setIsReacting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';

  const handleShare = (platform: string) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-32 mb-8 bg-muted" />
          <Skeleton className="h-12 w-full mb-4 bg-muted" />
          <Skeleton className="h-6 w-3/4 mb-8 bg-muted" />
          <Skeleton className="aspect-video w-full mb-8 bg-muted" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-full bg-muted" />
            <Skeleton className="h-4 w-3/4 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${post.title} - Roomsaathi Blog`}
        description={post.excerpt || post.title}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-muted/30 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/blog">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            {post.category && (
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                {post.category.name}
              </span>
            )}

            <h1 className="text-3xl xl:text-5xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.avatar_url && (
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.full_name || 'Author'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="font-medium text-foreground">
                    {post.author.full_name || 'Anonymous'}
                  </span>
                </div>
              )}
              {post.published_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.read_time} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                  prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                  prose-li:text-muted-foreground prose-li:mb-2
                  prose-img:rounded-lg prose-img:shadow-lg
                  prose-blockquote:border-l-4 prose-blockquote:border-secondary
                  prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Reactions Section */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="mb-4">
                  <h3 className="text-base xl:text-lg font-semibold mb-2">
                    {user ? 'How did you find this article?' : 'Sign in to react to this article'}
                  </h3>
                  <p className="text-xs xl:text-sm text-muted-foreground">
                    {user ? 'Share your thoughts with a reaction' : 'Login to share your thoughts'}
                  </p>
                </div>
                <div className="grid grid-cols-2 xl:flex xl:flex-wrap gap-2 xl:gap-3">
                  {[
                    { type: 'like', icon: ThumbsUp, label: 'Like', color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600' },
                    { type: 'love', icon: Heart, label: 'Love', color: 'hover:bg-red-50 hover:text-red-600 hover:border-red-600' },
                    { type: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-600' },
                    { type: 'helpful', icon: CheckCircle, label: 'Helpful', color: 'hover:bg-green-50 hover:text-green-600 hover:border-green-600' },
                  ].map((reaction) => {
                    const Icon = reaction.icon;
                    const hasReacted = userReactions.includes(reaction.type);
                    const count = reactionCounts[reaction.type] || 0;

                    return (
                      <Button
                        key={reaction.type}
                        variant="outline"
                        size="sm"
                        onClick={() => handleReaction(reaction.type as 'like' | 'love' | 'insightful' | 'helpful')}
                        disabled={!user || isReacting}
                        className={`flex items-center justify-center gap-2 transition-all min-h-[44px] ${
                          hasReacted
                            ? 'bg-secondary text-secondary-foreground border-secondary'
                            : reaction.color
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs xl:text-sm">{reaction.label}</span>
                        {count > 0 && (
                          <span className="ml-1 px-2 py-0.5 rounded-full bg-muted text-xs font-semibold">
                            {count}
                          </span>
                        )}
                      </Button>
                    );
                  })}
                </div>
                {!user && (
                  <div className="mt-4">
                    <Link to="/login">
                      <Button variant="secondary" size="sm" className="w-full xl:w-auto">
                        Login to React
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-col xl:flex-row xl:items-center gap-3 xl:gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Share2 className="h-4 w-4 xl:h-5 xl:w-5" />
                    <span className="text-sm xl:text-base font-medium">Share this article:</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare('facebook')}
                      className="hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] min-h-[44px] min-w-[44px]"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare('twitter')}
                      className="hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] min-h-[44px] min-w-[44px]"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare('linkedin')}
                      className="hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] min-h-[44px] min-w-[44px]"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Table of Contents (could be enhanced) */}
            <div className="w-full xl:w-64 xl:sticky xl:top-24 xl:self-start">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Quick Info</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Category</div>
                      <div className="font-medium">{post.category?.name || 'Uncategorized'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Reading Time</div>
                      <div className="font-medium">{post.read_time} minutes</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Views</div>
                      <div className="font-medium">{post.views}</div>
                    </div>
                    {post.published_at && (
                      <div>
                        <div className="text-muted-foreground mb-1">Published</div>
                        <div className="font-medium">{formatDate(post.published_at)}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl xl:text-3xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full shadow-card hover:shadow-3xl transition-smooth-slow card-3d overflow-hidden group">
                      {relatedPost.featured_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        {relatedPost.category && (
                          <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-3">
                            {relatedPost.category.name}
                          </span>
                        )}
                        <h3 className="text-lg font-bold mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{relatedPost.read_time} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{relatedPost.views}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPostPage;
