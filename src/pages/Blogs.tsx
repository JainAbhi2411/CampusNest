import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Clock, Eye, ArrowRight, TrendingUp, Heart } from 'lucide-react';
import { blogApi } from '@/db/api';
import type { BlogPost, BlogCategory } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedText from '@/components/ui/animated-text';

const Blogs: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [postsData, categoriesData, featuredData, popularData] = await Promise.all([
        blogApi.getBlogPosts({ category: selectedCategory, search: searchQuery }),
        blogApi.getCategories(),
        blogApi.getFeaturedPosts(3),
        blogApi.getPopularPosts(5),
      ]);

      setPosts(postsData);
      setCategories(categoriesData);
      setFeaturedPosts(featuredData);
      setPopularPosts(popularData);
    } catch (error) {
      console.error('Failed to load blog data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <PageMeta
        title="Blog - Roomsaathi"
        description="Read the latest tips, guides, and stories about student accommodation, budget living, and campus life"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground py-16 xl:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <AnimatedText
                text="Roomsaathi Blog"
                className="text-4xl xl:text-5xl font-bold mb-4"
                type="fade-up"
              />
              <p className="text-lg xl:text-xl text-primary-foreground/90 mb-8">
                Tips, guides, and stories to help you find and enjoy your perfect student accommodation
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="h-6 w-6 text-secondary" />
                    <h2 className="text-2xl xl:text-3xl font-bold">Featured Articles</h2>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {featuredPosts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="h-full shadow-card hover:shadow-3xl transition-smooth-slow card-3d overflow-hidden group">
                          {post.featured_image && (
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                          )}
                          <CardContent className="p-6">
                            {post.category && (
                              <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-3">
                                {post.category.name}
                              </span>
                            )}
                            <h3 className="text-xl font-bold mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{post.read_time} min read</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{post.views} views</span>
                              </div>
                              {post.reaction_count > 0 && (
                                <div className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  <span>{post.reaction_count} reactions</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === '' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('')}
                    size="sm"
                    className="min-h-[40px]"
                  >
                    All Articles
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.slug ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory(category.slug)}
                      size="sm"
                      className="min-h-[40px]"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* All Posts */}
              <div>
                <h2 className="text-2xl xl:text-3xl font-bold mb-6">
                  {selectedCategory ? `${categories.find(c => c.slug === selectedCategory)?.name} Articles` : 'Latest Articles'}
                </h2>

                {isLoading ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <Skeleton className="aspect-video bg-muted" />
                        <CardContent className="p-6 space-y-3">
                          <Skeleton className="h-4 w-20 bg-muted" />
                          <Skeleton className="h-6 w-full bg-muted" />
                          <Skeleton className="h-4 w-full bg-muted" />
                          <Skeleton className="h-4 w-3/4 bg-muted" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {posts.map((post) => (
                      <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="h-full shadow-card hover:shadow-3xl transition-smooth-slow overflow-hidden group">
                          {post.featured_image && (
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                          )}
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              {post.category && (
                                <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                                  {post.category.name}
                                </span>
                              )}
                              {post.published_at && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(post.published_at)}</span>
                                </div>
                              )}
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{post.read_time} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{post.views}</span>
                                </div>
                                {post.reaction_count > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    <span>{post.reaction_count}</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-secondary text-sm font-medium group-hover:gap-2 transition-all">
                                <span>Read More</span>
                                <ArrowRight className="h-4 w-4" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No articles found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full xl:w-80 space-y-8">
              {/* Popular Posts */}
              {popularPosts.length > 0 && (
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Popular Articles</h3>
                    <div className="space-y-4">
                      {popularPosts.map((post, index) => (
                        <Link
                          key={post.id}
                          to={`/blog/${post.slug}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm group-hover:text-secondary transition-colors line-clamp-2 mb-1">
                                {post.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                <span>{post.views} views</span>
                                {post.reaction_count > 0 && (
                                  <>
                                    <span>•</span>
                                    <Heart className="h-3 w-3" />
                                    <span>{post.reaction_count}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Categories */}
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.slug
                            ? 'bg-secondary text-secondary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {category.description}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blogs;
