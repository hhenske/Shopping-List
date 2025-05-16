# 🛒 Shopping List App

A web-based shopping list manager that lets you organize items by store, with functionality to download, share, or send lists to other devices. Built with HTML, CSS, JavaScript, and a Bubble.io backend.

## ✨ Features

- ✅ Organize items under different store categories
- ➕ Add, remove, and sort items dynamically
- 📤 Send list data to a device (as JSON)
- 📋 Copy plain text version of the list
- 💾 Download your list as a `.json` file
- 🔒 Modal-based login/signup interface

## 🖼️ UI Highlights

- Responsive layout with store columns
- Button theming with colors:
  - Red (`#d67777`, `#c26565`, `#7b2e2e`)
  - Brown (`#302f0f`, `#2a2a0a`)
  - Light gray (`#d9d9d9`)
- Fonts: **Lato** (body), **Macondo** (buttons/headings)

## 📁 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** [Bubble.io](https://bubble.io)
- **Fonts:** Google Fonts (Lato, Macondo)
- **Icons:** Font Awesome

## 📦 Coming Soon

- List syncing across devices
- User-specific saved lists
- Auto-suggestions based on past entries

## 🧪 Local Development

Clone and open `index.html` in your browser. No server needed.

```bash
git clone https://github.com/yourusername/shopping-list-app.git
cd shopping-list-app
open index.html # or double-click it

## 🧪 To Do:
#### Currently, we are randomly generating prices for each store. The app is supposed to find prices from 3 local stores, Costco, Aldi and Walmart and display those instead, so shoppers can decide which store list to put each item on. It's probably most efficient to have users make the list first, then make 1 api call to each store for the items on the list. Then allow users to sort into store lists. Here are the steps I think I need:
1- Locate APIs, find endpoints and how to access
2 - Decide what details I want to display (price, description, image?)
3 - Remove  and replace price logic and Store A, B, C
4 - Add a button to initiate API calls
5 - Display price and details when available
6 - Hide store lists below the unsorted list until price and details are displays
7 - Show store lists for users to click/drag items to
8 - switch click/drag to a mobile friendly drag and drop: sortable.js
9 - Reconsider buttons on bottom of page because we need a save to database and hopefully one or two of the current options won't be necessary
10 - change the READ.me to reflect what is actually happening
