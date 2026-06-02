# PRD: TasteMatch

## Overview

TasteMatch is a restaurant discovery platform designed to eliminate decision fatigue.

Instead of overwhelming users with hundreds of restaurant options, TasteMatch asks users a few simple questions and returns only three highly relevant restaurant recommendations at a time.

The goal is to help users answer:

"Where should we eat tonight?"

in less than 30 seconds.

---

# Problem Statement

Current restaurant discovery apps like Google Maps, Yelp, and TripAdvisor create choice overload.

Users often spend 20-40 minutes scrolling through endless options without making a decision.

TasteMatch solves this by:

* Limiting recommendations
* Using lifestyle-based filters
* Curating only the most relevant restaurants
* Returning 3 choices instead of 300

---

# Target Users

### Primary

* Couples planning date nights
* Friends planning girls' night
* Professionals seeking happy hour spots
* Travelers visiting new cities
* Families looking for dinner options

### Secondary

* Foodies
* Tourists
* Remote workers
* Business travelers

---

# Core User Flow

## Step 1

User opens app.

Large question:

"What kind of outing is this?"

Options:

* Date Night ❤️
* Girls Night 🍸
* Happy Hour 🍻
* Family Dinner 👨‍👩‍👧‍👦
* Business Dinner 💼
* Casual Hangout 🍕
* Surprise Me 🎲

---

## Step 2

Select Budget

Options:

* $
* $$
* $$$
* $$$$

Labels:

* Casual
* Mid-Range
* Upscale
* Fine Dining

---

## Step 3

Select Cuisine

Examples:

* Italian
* French
* Japanese
* Sushi
* Steakhouse
* Mexican
* Mediterranean
* Indian
* Thai
* Korean
* American
* Seafood
* Vegetarian
* Vegan

Multi-select allowed.

---

## Step 4

Travel Distance

Slider:

0-50 miles

Examples:

* Within 5 min
* Within 15 min
* Within 30 min
* Worth the Drive

---

## Step 5

Location

Default:

Current GPS location

Examples:

* Amsterdam
* Paris
* London
* Dallas
* New York

User can search any city worldwide.

---

# Results Page

Instead of infinite scrolling:

Display ONLY 3 restaurants.

Card layout:

Restaurant Image

Name

Cuisine

Distance

Price Level

Rating

Reservation Button

Map Button

---

# Refresh Feature

Large button:

"Show Me 3 More"

When clicked:

* Previous results disappear
* New 3 restaurants appear
* Never repeat previous suggestions

Creates a Tinder-like experience for restaurants.

---

# Fine Dining Classification

Fine dining must never mix with casual restaurants.

Create restaurant classification tags:

## Casual

Requirements:

* Walk-in friendly
* Counter service allowed
* Fast casual allowed

---

## Mid Range

Requirements:

* Table service
* Standard restaurant experience

---

## Fine Dining

Requirements:

One or more:

* White tablecloth service
* Tasting menu
* Prix fixe menu
* Michelin Guide listing
* Reservations encouraged
* Sommelier service
* Chef-driven menu

Display premium chips:

⭐ Fine Dining

🍷 Tasting Menu

🎖 Michelin

👔 Dress Code

This visually separates luxury dining experiences.

---

# Smart Recommendation Logic

Scoring factors:

### Date Night

Prioritize:

* Ambiance
* Romantic lighting
* Higher ratings
* Fine dining
* Wine bars

---

### Girls Night

Prioritize:

* Cocktails
* Trendy spots
* Shareable plates
* Instagram-worthy interiors

---

### Happy Hour

Prioritize:

* Drink specials
* Bar seating
* Affordable pricing

---

### Family Dinner

Prioritize:

* Large seating
* Kid-friendly
* Affordable

---

# Modern UI Design

Style:

Minimalist luxury with editorial magazine feel

Inspired by:

* Airbnb
* Notion
* Apple
* Resy
* Editorial food brand sites (clean grid, oversized serif typography, soft cream backgrounds, coral/warm accent color)

### Design Reference

Based on the provided design reference (detox+ inspired layout):

* Off-white / cream background (#FAFAF6 - #FAFAFA)
* Oversized serif display typography for headlines (warm coral / terracotta tone)
* Minimal left sidebar with category navigation
* Clean product/restaurant cards in a 3-column grid
* Generous whitespace
* Editorial top banner strip for promotions or location prompts
* Subtle uppercase micro-labels for metadata
* Photography-forward cards with centered hero imagery

Colors:

Background:
#FAFAFA

Primary:
#111111

Accent (Editorial Coral):
#E94F2E

Accent (Luxury Gold):
#D4AF37

Success:
#34C759

Cards:

* Rounded corners (lg-xl radius)
* Soft shadows
* Glassmorphism elements where appropriate
* Large photography
* White card surface over cream background

Typography:

* Display: Serif (e.g., Fraunces, PP Editorial, Instrument Serif) for hero headlines
* Body: Inter / Geist / SF Pro
* Micro-labels: Uppercase, tracked, small

Animations:

* Smooth transitions
* Card fades
* Loading skeletons
* Subtle hover lift on cards

---

# Mobile Compatibility (Required)

TasteMatch must be fully mobile-compatible and feel native on phone.

### Responsive Requirements

* Mobile-first responsive design (Tailwind breakpoints: sm, md, lg, xl)
* Touch-optimized tap targets (min 44x44px)
* Bottom-sheet style modals on mobile
* Swipeable result cards (Tinder-like swipe on phone)
* Sticky bottom CTA bar for "Show Me 3 More" on mobile
* GPS location prompt on first load
* Single-column card stack on mobile, 3-column grid on desktop
* Collapsible sidebar → hamburger or bottom nav on mobile
* PWA-ready (installable to home screen)
* Optimized images (Next.js Image with responsive sizes)
* Safe-area insets for iOS notch / home indicator
* No hover-only interactions — all functions must work on touch

### Mobile UX Patterns

* Step-by-step flow uses full-screen vertical questions on mobile
* Multi-select chips wrap and remain tappable
* Distance slider is large and thumb-friendly
* Location search opens a full-screen search modal on mobile
* Results page: vertical scroll of 3 large cards, each tappable to expand

---

# Tech Stack

## Frontend

Next.js 15

React

TypeScript

Tailwind CSS v4

shadcn/ui

Framer Motion

---

## Backend

Next.js API Routes

Server Actions

---

## Authentication

Clerk

or

Supabase Auth

---

## Database (Free)

Supabase PostgreSQL

Free Tier

Store:

* User profiles
* Saved restaurants
* Search history
* Favorite cities

---

# Restaurant Data Source

## Primary API

Free:

Google Places API (free credits)

---

## Alternative Free APIs

### OpenStreetMap

Nominatim

Overpass API

Free forever

---

### Foursquare Places API

Free developer tier

Good restaurant metadata

---

### Yelp Fusion API

Free developer tier

Restaurant ratings

Photos

Categories

---

# Recommended Data Architecture

Use:

Foursquare API

*

OpenStreetMap

Benefits:

* Free
* Global coverage
* Reliable restaurant metadata

---

# Features V2

## Save Favorites

Heart icon

Save restaurant collections.

Examples:

* Date Night Spots
* Amsterdam Favorites
* Paris Trip

---

## AI Matchmaker

User enters:

"We want sushi for a date night under $80."

AI automatically selects filters.

---

## Group Voting

Share 3 restaurant options.

Friends vote.

Highest vote wins.

---

## Restaurant Roulette

Skip filters entirely.

Press:

"Pick For Me"

Instantly shows 3 restaurants.

---

# Admin Dashboard

Manage:

* Featured restaurants
* Fine dining classifications
* City popularity analytics
* User activity

---

# Success Metrics

### Launch

100 active users

---

### Month 3

1,000 users

---

### Month 6

10,000 users

---

# Future Monetization

### Restaurant Sponsorships

Featured placement.

---

### Premium Membership ($4.99/month)

* Unlimited refreshes
* AI concierge
* Saved lists
* Travel itineraries

---

### Reservation Partnerships

Affiliate revenue through:

* OpenTable
* Resy
* SevenRooms

---

# MVP Goal

A user should be able to:

1. Open the website (on desktop or mobile)
2. Choose outing type
3. Choose budget
4. Choose cuisine
5. Choose travel distance
6. Get exactly 3 restaurant recommendations
7. Refresh for 3 new recommendations

Total decision time:

Under 30 seconds.

Must work flawlessly on both desktop and mobile browsers.
