"use client"

import type React from "react"

import { Trophy, Award, Target, TrendingUp, MapPin, Calendar, Share2, MessageSquare, Zap, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const badges = [
  {
    id: 1,
    name: "Century Runner",
    icon: "🏃",
    description: "Run 100+ km",
    earned: true,
    color: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    name: "Consistency King",
    icon: "👑",
    description: "30-day streak",
    earned: true,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    id: 3,
    name: "Peak Performance",
    icon: "⭐",
    description: "Personal record",
    earned: true,
    color: "from-purple-400 to-purple-600",
  },
  {
    id: 4,
    name: "Social Butterfly",
    icon: "🦋",
    description: "50 community posts",
    earned: true,
    color: "from-pink-400 to-pink-600",
  },
  {
    id: 5,
    name: "Iron Will",
    icon: "💪",
    description: "100 gym workouts",
    earned: false,
    color: "from-gray-400 to-gray-600",
  },
  {
    id: 6,
    name: "Marathon Master",
    icon: "🏅",
    description: "Complete a marathon",
    earned: false,
    color: "from-gray-400 to-gray-600",
  },
]

const recentActivity = [
  { date: "Today", activity: "Logged a 10 km running workout", time: "2 hours ago", icon: Target },
  { date: "Yesterday", activity: "Completed 60-minute gym session", time: "1 day ago", icon: Zap },
  { date: "Yesterday", activity: "Joined the community with first post", time: "1 day ago", icon: Share2 },
  { date: "2 days ago", activity: "Achieved 7-day workout streak", time: "2 days ago", icon: Trophy },
]

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  gradient: string
}

function StatCard({ label, value, icon, gradient }: StatCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-6 premium-shadow text-white border border-white/10 animate-slideInUp`}
    >
      <p className="text-white/80 text-sm mb-2 font-medium">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold">{value}</p>
        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm">{icon}</div>
      </div>
    </div>
  )
}

export default function Profile() {
  return (
    <div className="min-h-screen bg-background animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 h-40 md:h-56 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-end md:items-end">
            <Avatar className="w-28 h-28 md:w-40 md:h-40 border-4 border-card ring-4 ring-background shadow-2xl">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
              <AvatarFallback>AT</AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-2">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Alex Thompson</h1>
              <div className="flex flex-wrap gap-3 items-center text-white/90 text-sm">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-4 h-4" />
                  San Francisco, CA
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-4 h-4" />
                  Joined Jan 2024
                </span>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto mb-4 md:mb-0">
              <Button className="flex-1 md:flex-none gap-2 bg-gradient-to-r from-white text-blue-600 hover:from-blue-50">
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        {/* Bio Section */}
        <div className="bg-card rounded-xl border border-border/50 p-6 mb-8 premium-shadow">
          <p className="text-foreground leading-relaxed text-lg">
            Passionate about fitness and health. Training for my first ultramarathon while maintaining a balanced
            workout routine. Love sharing achievements with the community and pushing my limits every day. 🚀
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Workouts"
            value="142"
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-blue-400 to-blue-600"
          />
          <StatCard
            label="Total Distance"
            value="847 km"
            icon={<Target className="w-6 h-6" />}
            gradient="from-green-400 to-emerald-600"
          />
          <StatCard
            label="Calories Burned"
            value="84.7k"
            icon={<Zap className="w-6 h-6" />}
            gradient="from-orange-400 to-red-600"
          />
          <StatCard
            label="Current Streak"
            value="12 days"
            icon={<Trophy className="w-6 h-6" />}
            gradient="from-purple-400 to-pink-600"
          />
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted rounded-lg p-1">
            <TabsTrigger value="achievements" className="rounded-md">
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-md">
              Recent Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4 animate-fadeIn">
            <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow">
              <h2 className="text-2xl font-bold text-foreground mb-6">Badges & Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`rounded-xl p-4 transition-all duration-300 border ${
                      badge.earned
                        ? `bg-gradient-to-br ${badge.color} text-white border-white/10 shadow-lg hover:shadow-xl hover:scale-105`
                        : "bg-muted/30 border-border opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-bold ${badge.earned ? "text-white" : "text-foreground"}`}>{badge.name}</p>
                          {badge.earned && <Badge className="text-xs bg-white/20">Earned</Badge>}
                        </div>
                        <p className={`text-sm ${badge.earned ? "text-white/80" : "text-muted-foreground"}`}>
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 animate-fadeIn">
            <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow">
              <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((item, idx) => {
                  const IconComponent = item.icon
                  return (
                    <div
                      key={idx}
                      className="flex gap-4 pb-4 border-b border-border last:border-0 hover:bg-muted/30 p-3 rounded-lg transition-colors"
                    >
                      <div className="pt-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">{item.date}</p>
                        <p className="text-foreground mt-1">{item.activity}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <p className="text-muted-foreground text-sm font-medium">Average Workout</p>
              <Star className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">48 min</p>
            <p className="text-xs text-secondary mt-3 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              12% from last month
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <p className="text-muted-foreground text-sm font-medium">Favorite Sport</p>
              <Award className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">Running</p>
            <p className="text-xs text-muted-foreground mt-3">62 workouts total</p>
          </div>
          <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <p className="text-muted-foreground text-sm font-medium">Community Posts</p>
              <MessageSquare className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-foreground">28</p>
            <p className="text-xs text-muted-foreground mt-3">1.2k total likes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
