"use client"

import { Heart, MessageCircle, Share2, TrendingUp, Users, Flame, Zap } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const communityPosts = [
  {
    id: 1,
    author: "Sarah Johnson",
    username: "@sarahjohnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    achievement: "Just completed a half marathon in 1 hour 45 min! New personal record 🎉",
    sport: "Running",
    likes: 342,
    comments: 28,
    time: "2 hours ago",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    author: "Mike Chen",
    username: "@mikechen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    achievement: "Hit a personal record: 300 lb deadlift! Finally achieved my goal 💪",
    sport: "Gym",
    likes: 567,
    comments: 45,
    time: "4 hours ago",
    gradient: "from-orange-400 to-red-600",
  },
  {
    id: 3,
    author: "Emma Davis",
    username: "@emmadavis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    achievement: "Completed 30-day yoga challenge! Feeling amazing and more flexible than ever 🧘‍♀️",
    sport: "Yoga",
    likes: 298,
    comments: 32,
    time: "1 day ago",
    gradient: "from-purple-400 to-pink-600",
  },
  {
    id: 4,
    author: "Alex Rodriguez",
    username: "@alexrodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    achievement: "Cycled 50 km through the mountains today! Breathtaking views and great workout 🚴",
    sport: "Cycling",
    likes: 421,
    comments: 38,
    time: "1 day ago",
    gradient: "from-green-400 to-emerald-600",
  },
]

const trendingTopics = [
  { name: "Marathon Training", posts: 1234, icon: Flame },
  { name: "Fitness Goals", posts: 892, icon: Zap },
  { name: "Gym PRs", posts: 756, icon: TrendingUp },
  { name: "Yoga Journey", posts: 645, icon: Heart },
]

export default function Community() {
  const [likedPosts, setLikedPosts] = useState<number[]>([])

  const toggleLike = (postId: number) => {
    setLikedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-3">Community</h1>
          <p className="text-lg text-muted-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            Share achievements and inspire athletes worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6 animate-slideInUp">
            <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow">
              <div className="flex gap-4">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    placeholder="Share your achievement..."
                    className="w-full px-4 py-3 rounded-lg border border-border bg-muted/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                    >
                      Post Achievement
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {communityPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className="bg-card rounded-xl border border-border/50 overflow-hidden premium-shadow hover:border-primary/50 transition-all animate-slideInUp"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Header with gradient accent bar */}
                  <div className={`h-1 bg-gradient-to-r ${post.gradient}`}></div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-primary/20">
                          <AvatarImage src={post.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-foreground truncate">{post.author}</p>
                            <Badge className={`text-xs bg-gradient-to-r ${post.gradient} text-white border-0`}>
                              {post.sport}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {post.username} • {post.time}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-foreground leading-relaxed text-balance">{post.achievement}</p>
                  </div>

                  {/* Actions */}
                  <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                          likedPosts.includes(post.id)
                            ? "text-white bg-gradient-to-r from-pink-500 to-red-600 shadow-lg scale-105"
                            : "text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} />
                        <span className="text-sm font-semibold">
                          {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                        </span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-slideInUp">
            <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600"></div>
                Community Stats
              </h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200/50 dark:border-blue-800/50">
                  <span className="text-muted-foreground text-sm font-medium">Active Members</span>
                  <p className="text-2xl font-bold text-foreground mt-1">12.4k</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-200/50 dark:border-green-800/50">
                  <span className="text-muted-foreground text-sm font-medium">Posts Today</span>
                  <p className="text-2xl font-bold text-foreground mt-1">847</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-200/50 dark:border-purple-800/50">
                  <span className="text-muted-foreground text-sm font-medium">Interactions</span>
                  <p className="text-2xl font-bold text-foreground mt-1">23.5k</p>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Trending Now
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => {
                  const IconComponent = topic.icon
                  return (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                        <p className="font-semibold text-foreground text-sm">{topic.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground ml-6">{topic.posts.toLocaleString()} posts</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Invite Friends */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-6 premium-shadow">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                Invite Friends
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Share achievements and motivate each other</p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
                Get Invite Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
