# Xavfsiz Shahar - Survey Mobil Tizimi

Kamera o'rnatish survey tizimining React + TypeScript interaktiv demosi.

## Yangilangan xususiyatlar

- 🗺️ **Leaflet Map** - OpenStreetMap asosida xarita integratsiyasi
- 📷 **Bir nechta kameralar** - Bitta obyektga bir nechta kamera qo'shish imkoni
- 🎯 **GPS Location** - Xaritada pinni kora-ko'rish va tasdiqlash

## Loyihani o'rnatish

### 1. O'rnatuvchi modullarni yuklab olish

```bash
npm install
# yoki
yarn install
# yoki
pnpm install
```

### 2. Ishchi rejimda ishga tushirish

```bash
npm run dev
# yoki
yarn dev
# yoki
pnpm dev
```

Brauzeringiz avtomatik ravishda `http://localhost:5173` da ochiladi.

### 3. Loyihani build qilish

```bash
npm run build
# yoki
yarn build
# yoki
pnpm build
```

Build qilingan fayllar `dist/` papkasida joylashadi.

### 4. Build qilmagan fayllarni ko'rish

```bash
npm run preview
# yoki
yarn preview
# yoki
pnpm preview
```

## Loyiha strukturasi

```
xavfsiz-shahar-survey/
├── index.html              # HTML entry point
├── package.json            # Project dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Main component
│   └── index.css          # Global styles
└── dist/                   # Build output (after npm run build)
```

## Texnologiyalar

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Leaflet** - Xarita kutubxonasi
- **react-leaflet** - React Leaflet integratsiyasi
- **PostCSS** - CSS processing

## Komponentlar

Loyihada quyidagi asosiy komponentlar mavjud:

1. **Login** - Kirish ekrani
2. **Profile** - Profil ma'lumotlari
3. **HomeScreen** - Bosh sahifa
4. **Project** - Loyiha ma'lumotlari
5. **ObjectInfo** - Obyekt ma'lumotlari
6. **Location** - GPS location (Leaflet Map bilan)
7. **Photos** - Foto yuklash
8. **CameraInfo** - Kamera ma'lumotlari (bir nechta kameralar qo'shish)
9. **Checklist** - Survey checklist
10. **Review** - Yakuniy tekshiruv (barcha kameralarni ko'rish)
11. **MyObjects** - Mening obyektlarim

## Camera Management

CameraInfo komponentida siz:
- Yangi kamera qo'shishingiz mumkin
- Bir nechta kameralarni boshqashingiz mumkin
- Har bir kameraning turini, brandini, modelini va boshqa ma'lumotlarini o'rnatishingiz mumkin
- Qo'shilgan kameralarni o'chirishingiz mumkin

Barcha kameralar Review ekranida ko'rsatiladi.

## Map Integration

Location ekranida:
- OpenStreetMap asosida Leaflet xaritasi
- Joriy GPS koordinatalarini olish tugmasi
- Xarita pinni tasdiqlab keyingi bosqichga o'tishingiz mumkin

## Development

### Hot Module Replacement (HMR)

Vite avtomatik ravishda fayllarni qayta yuklaydi va brauzer yangilaydi.

### TypeScript

TypeScript barcha komponentlar uchun to'liq type safety ta'minlaydi.

### Tailwind CSS

Barcha stil Tailwind CSS utility classlar orqali qo'llaniladi.

## License

MIT

