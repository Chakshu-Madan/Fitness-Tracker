"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Save, CheckCircle, Camera, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const sportTypes = [
  "Running",
  "Gym",
  "Yoga",
  "Cycling",
  "Swimming",
  "Basketball",
  "Tennis",
  "Football",
  "Hiking",
  "Rowing",
]

interface FormData {
  sport: string
  date: string
  duration: string
  distance: string
  calories: string
  notes: string
}

export default function LogWorkout() {
  const [formData, setFormData] = useState<FormData>({
    sport: "Running",
    date: new Date().toISOString().split("T")[0],
    duration: "",
    distance: "",
    calories: "",
    notes: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Workout logged:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({
        sport: "Running",
        date: new Date().toISOString().split("T")[0],
        duration: "",
        distance: "",
        calories: "",
        notes: "",
      })
      setUploadedFile(null)
      setSubmitted(false)
    }, 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
    }
  }

  const estimatedCalories =
    formData.duration && !formData.calories
      ? Math.round(Number.parseInt(formData.duration) * 10)
      : Number.parseInt(formData.calories) || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-3">Log Your Workout</h1>
          <p className="text-lg text-muted-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-secondary" />
            Track your athletic achievements
          </p>
        </div>

        {submitted && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-400/10 to-emerald-600/10 border border-secondary/30 flex items-center gap-3 animate-slideInUp">
            <CheckCircle className="w-6 h-6 text-secondary flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Workout logged successfully!</p>
              <p className="text-sm text-muted-foreground">Keep up the incredible momentum!</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow animate-slideInUp">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-foreground">Workout Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sport Type */}
              <div className="space-y-2">
                <Label htmlFor="sport" className="text-sm font-semibold">
                  Sport Type
                </Label>
                <Select value={formData.sport} onValueChange={(value) => setFormData({ ...formData, sport: value })}>
                  <SelectTrigger id="sport" className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sportTypes.map((sport) => (
                      <SelectItem key={sport} value={sport}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow animate-slideInUp">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-foreground">Performance Metrics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-semibold">
                  Duration <span className="text-muted-foreground font-normal">(minutes)</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="45"
                  className="w-full rounded-lg"
                />
              </div>

              {/* Distance */}
              <div className="space-y-2">
                <Label htmlFor="distance" className="text-sm font-semibold">
                  Distance <span className="text-muted-foreground font-normal">(km)</span>
                </Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  placeholder="8.5"
                  className="w-full rounded-lg"
                />
              </div>

              {/* Calories */}
              <div className="space-y-2">
                <Label htmlFor="calories" className="text-sm font-semibold">
                  Calories <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="calories"
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    placeholder={String(estimatedCalories)}
                    className="w-full rounded-lg"
                  />
                  {estimatedCalories > 0 && !formData.calories && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary font-semibold">
                      ~{estimatedCalories}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-card rounded-xl border border-border/50 p-6 premium-shadow animate-slideInUp">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
              <h2 className="text-lg font-bold text-foreground">Additional Information</h2>
            </div>

            {/* Notes */}
            <div className="space-y-2 mb-6">
              <Label htmlFor="notes" className="text-sm font-semibold">
                Notes & Feelings
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="How did you feel? Any achievements or milestones?"
                rows={4}
                className="w-full resize-none rounded-lg"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Workout Photo</Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                  {uploadedFile ? (
                    <>
                      <Camera className="w-10 h-10 text-secondary mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm font-medium">✓ Photo uploaded</p>
                      <p className="text-xs text-muted-foreground mt-1">{uploadedFile}</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm font-medium">Drag and drop or click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg rounded-xl font-semibold text-lg py-6"
            disabled={submitted}
          >
            <Save className="w-5 h-5" />
            {submitted ? "Saving..." : "Save Workout"}
          </Button>
        </form>
      </div>
    </div>
  )
}
