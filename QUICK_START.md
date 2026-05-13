# 🚀 Tez Boshlash (Quick Start)

## ✅ Talablar

- **Node.js** 16.0.0 yoki undan yangi
- **npm** 7.0.0 yoki undan yangi (yoki yarn, pnpm)
- Modern web brauzer (Chrome, Firefox, Safari, Edge)

## 📥 1. Loyihani o'rnatish

### Option A: npm (Tavsiyalangan)
```bash
npm install
```

### Option B: yarn
```bash
yarn install
```

### Option C: pnpm
```bash
pnpm install
```

## 🎬 2. Development Serverini Ishga Tushirish

```bash
npm run dev
```

Output:
```
  VITE v5.0.0  ready in 245 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

Brauzer avtomatik ochiladi, aks holda `http://localhost:5173` ga o'ting.

## 🎨 3. Loyihani Ko'rish

### Home Screen (Bosh Sahifa)
- Kirish (Login)
- Profil (Profile)
- Bosh sahifa (Home)

### Main Features
1. **Loyiha Ma'lumotlari** - Farmoyish yoki qaror tanlash
2. **Obyekt Ma'lumotlari** - MFY, ko'cha, adres
3. **GPS Location** 🗺️ - Leaflet xarita
4. **Foto Yuklash** - Kamera yoki galereya
5. **Kamera Ma'lumotlari** 📷 - Bir nechta kameralar
6. **Checklist** - Tekshiruv punktlari
7. **Yakuniy Tekshiruv** - Barcha ma'lumotlarni ko'rish

## 🏗️ 4. Production Build Qilish

```bash
npm run build
```

Output:
```
dist/
├── index.html
├── assets/
│   ├── index-*.js
│   ├── index-*.css
│   └── ...
```

## 👁️ 5. Build'ni Kora-Ko'rish

```bash
npm run preview
```

## 📁 Loyiha Strukturasi

```
xavfsiz-shahar-survey/
├── 📄 index.html              # HTML entry point
├── 📄 package.json            # Dependencies va scripts
├── 📄 README.md               # Dokumentasiya
├── 📄 CHANGES.md              # O'zgarishlar
├── 📄 QUICK_START.md          # Bu fayl
├── 📄 .env.example            # Environment variables
├── 📄 .gitignore              # Git ignore
├── 📄 tsconfig.json           # TypeScript config
├── 📄 tsconfig.node.json      # TS config (build tools)
├── 📄 vite.config.ts          # Vite config
├── 📄 tailwind.config.js      # Tailwind CSS config
├── 📄 postcss.config.js       # PostCSS config
├── 📁 src/
│   ├── 📄 main.tsx            # React entry point
│   ├── 📄 App.tsx             # Main component (860+ lines)
│   └── 📄 index.css           # Global styles
└── 📁 dist/                   # Build output (npm run build keyin)
```

## 🔧 Foydalanuvchi Tilishlar (CLI Commands)

| Buyruq | Tavsif |
|--------|--------|
| `npm run dev` | Development serverini ishga tushirish |
| `npm run build` | Production build qilish |
| `npm run preview` | Build'ni preview qilish |
| `npm install` | Dependencies'larni o'rnatish |

## 🌐 Browsing Features

### Step-by-Step Navigation
- **Kirish (0)** - Login formasi
- **Profil (1)** - Surveyor profili
- **Bosh sahifa (2)** - Main dashboard
- **Loyiha (3)** - Projekt ma'lumotlari
- **Obyekt (4)** - Sobje haqida
- **Location (5)** - 🗺️ Leaflet Map
- **Foto (6)** - Rasm yuklash
- **Kamera (7)** - 📷 Bir nechta kameralar
- **Checklist (8)** - Tekshiruv
- **Review (9)** - Yakuniy ko'rib chiqish
- **Mening Obyektlarim (10)** - To'plamlar

### Right Sidebar Features
- 🎯 Barcha step'larni tanlash
- 📊 Demo statistika
- ✅ Self-tests

## 📱 Responsive Design

- **Mobile**: 100% responsive
- **Tablet**: Telefon frame + info panel
- **Desktop**: Full width bilan info panel

## 🎯 Kamera Management Example

```typescript
// Bitta kamera qo'shish
1. Kamera turini tanlash: "Face ID kamera"
2. Brand: "Dahua"
3. Model: "DH-IPC-HFW7442H-Z"
4. Soni: 2
5. O'rnatish nuqtasi: "770"
6. Yo'nalish: "Ko'cha kirish qismi"
7. "Kamerani qo'shish" tugmasini bosish

// Yana kamera qo'shish mumkin
1. Yangi kamera formasi
2. Har bir kameraning o'ziga xos ID'si
3. Review ekranida barcha ko'rsatiladi
```

## 🗺️ Map Features

### Location Step'da
1. **Leaflet Map** - OpenStreetMap
2. **Marker** - Hozirgi location
3. **Coordinates** - Latitude & Longitude
4. **"Joriy Location" Button** - GPS ni ishga tushiradi
5. **Confirm** - Tasdiqlash tugmasi

## 🐛 Debugging

### Browser Console
```javascript
// Form data ko'rish
console.log(form)

// Camera array ko'rish
console.log(form.cameras)

// Network requests
// DevTools → Network tab
```

### Common Issues

| Muammo | Yechim |
|--------|--------|
| Port 5173 band | `npm run dev -- --port 3000` |
| Leaflet CSS error | `npm install` qayta ishga tushiring |
| Map ko'rinmaydi | Browser cache tozalang |
| TypeScript errors | `npm install` qayta ishga tushiring |

## 📚 Qo'shimcha Resurslar

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Leaflet Documentation](https://leafletjs.com)
- [Vite Guide](https://vitejs.dev)

## 🎓 Learning Path

1. **Boshlangich** - Home screen'da navigate qiling
2. **Intermediate** - Form fields'ni o'zgartiring
3. **Advanced** - Components'ni modify qiling
4. **Expert** - App.tsx'da new features qo'shing

## 📦 Deployment

### Vercel (Tavsiyalangan)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
npm run build
git add dist/
git commit -m "Build"
git push
```

## ✨ Keyingi Qadamlar

- [ ] Environment variables setup
- [ ] Backend API integration
- [ ] Database connection
- [ ] Authentication
- [ ] Image upload
- [ ] Email notifications
- [ ] Analytics

## 💬 Savol-Javob

**Q: Port 5173 o'rniga boshqa port ishlatishni xohlayman?**
```bash
npm run dev -- --port 3000
```

**Q: Tailwind CSS o'zlashtirmasini xohlayman?**
- `tailwind.config.js` ni o'zgartiring

**Q: Yangi komponent qo'shishni xohlayman?**
- `src/App.tsx` da yangi function qo'shing

**Q: TypeScript'ni o'chirib qo'yishni xohlayman?**
- `.ts` fayllarini `.js` ga almashtirib, typelari olib tashlang

---

**Xush kelibsiz! 🎉**

Loyihani tamassha qiling, o'zgartirib ko'ring va o'z proyektingizga qo'llanuvchi!

Savol bo'lsa, dokumentatsiyani o'qing yoki README.md'ni tekshiring.
