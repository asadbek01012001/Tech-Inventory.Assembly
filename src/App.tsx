import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as XLSX from "xlsx";
// @ts-ignore
import "leaflet/dist/leaflet.css";

interface Camera {
  type: string;
  quantity: number;
}

interface ObjectData {
  fullName: string;
  phone: string;
  position: string;
  mfy: string;
  region: string;
  district: string;
  street: string;
  address: string;
  objectType: string;
  lat: string;
  lng: string;
  cameras: Camera[];
  projectName: string;
  documentType: string;
  documentNumber: string;
  date: string;
  photos: File[];
}

interface FormData {
  fullName: string;
  phone: string;
  position: string;
  region: string;
  district: string;
  projectName: string;
  documentType: string;
  documentNumber: string;
  date: string;
  mfy: string;
  street: string;
  address: string;
  objectType: string;
  lat: string;
  lng: string;
  cameras: Camera[];
  photos: File[];
}

const initialForm: FormData = {
  fullName: "",
  phone: "",
  position: "",
  region: "",
  district: "",
  projectName: "",
  documentType: "",
  documentNumber: "",
  date: new Date().toISOString().slice(0, 10),
  mfy: "",
  street: "",
  address: "",
  objectType: "",
  lat: "",
  lng: "",
  cameras: [],
  photos: [],
};

const CAMERA_TYPES = ["Face ID", "LPR / Avto nomer", "PTZ", "Bullet", "Dome"];

const OBJECT_TYPE_COLORS: Record<string, string> = {
  "MFY kirish/chiqish yo'li": "bg-blue-100 text-blue-700",
  "Chorraha": "bg-orange-100 text-orange-700",
  "Maktab": "bg-green-100 text-green-700",
  "Bozor": "bg-purple-100 text-purple-700",
};

function SelectField({ label, value, onChange, options, required = false }: any) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white font-semibold appearance-none cursor-pointer text-gray-800 shadow-sm hover:border-blue-300 transition-all"
        >
          <option value="" disabled>
            — Tanlang —
          </option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", required = false }: any) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
        className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white font-semibold text-gray-800 shadow-sm hover:border-blue-300 transition-all placeholder-gray-400"
        placeholder="Kiritish..."
      />
    </div>
  );
}

function Field({ label, value, onChange, type = "text", select = false, options = [], required = false }: any) {
  if (select) {
    return (
      <SelectField
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        required={required}
      />
    );
  }
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      required={required}
    />
  );
}

function Button({ children, onClick, variant = "primary", disabled = false, size = "md" }: any) {
  const styles: Record<string, string> = {
    primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300",
    success: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md hover:shadow-lg",
    excel: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    back: "bg-slate-500 hover:bg-slate-600 active:bg-slate-700 text-white shadow-md hover:shadow-lg",
  };
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full font-bold rounded-xl transition-all cursor-pointer ${styles[variant]} ${sizes[size]} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

function Login({ form, set, next }: any) {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Kirish</h2>
        <p className="text-sm text-gray-500 mt-1">Tizimga kirish uchun ma'lumotlaringizni kiriting</p>
      </div>
      <Field label="Telefon raqam" value={form.phone} onChange={(v: any) => set("phone", v)} required />
      <Field label="Parol" value="" onChange={() => {}} type="password" required />
      <Button onClick={next}>Kirish</Button>
    </div>
  );
}

function Profile({ form, set, next }: any) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Profil Ma'lumotlari</h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <Field label="Ism Familiya" value={form.fullName} onChange={(v: any) => set("fullName", v)} required />
        <Field label="Telefon raqam" value={form.phone} onChange={(v: any) => set("phone", v)} required />
        <Field label="Lavozim" value={form.position} onChange={(v: any) => set("position", v)} select options={["Surveyor", "Supervisor", "Installer"]} required />
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="secondary" onClick={() => {}}>Orqaga</Button>
          <Button onClick={next}>Davom etish</Button>
        </div>
      </div>
    </div>
  );
}


function Project({ form, set, next, back }: any) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Loyiha Ma'lumotlari</h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <Field label="Viloyat" value={form.region} onChange={(v: any) => set("region", v)} select options={["Toshkent shahri", "Toshkent viloyati", "Samarqand", "Buxoro", "Farg'ona"]} required />
        <Field label="Tuman" value={form.district} onChange={(v: any) => set("district", v)} select options={["Yashnobod", "Chilonzor", "Mirzo Ulug'bek", "Yunusobod", "Shayxontohur"]} required />
        <Field label="Loyiha nomi" value={form.projectName} onChange={(v: any) => set("projectName", v)} required />
        <Field label="Hujjat turi" value={form.documentType} onChange={(v: any) => set("documentType", v)} select options={["Farmoyish", "Qaror", "Tezkor topshiriq"]} required />
        <Field label="Hujjat raqami" value={form.documentNumber} onChange={(v: any) => set("documentNumber", v)} required />
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="secondary" onClick={back}>← Orqaga</Button>
          <Button onClick={next}>Keyingi →</Button>
        </div>
      </div>
    </div>
  );
}

function ObjectInfo({ form, set, next, back }: any) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Obyekt Ma'lumotlari</h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <Field label="MFY nomi" value={form.mfy} onChange={(v: any) => set("mfy", v)} required />
        <Field label="Ko'cha" value={form.street} onChange={(v: any) => set("street", v)} required />
        <Field label="Adres" value={form.address} onChange={(v: any) => set("address", v)} required />
        <Field label="Obyekt turi" value={form.objectType} onChange={(v: any) => set("objectType", v)} select options={["MFY kirish/chiqish yo'li", "Chorraha", "Maktab", "Bozor"]} required />
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Button variant="secondary" onClick={back}>← Orqaga</Button>
          <Button onClick={next}>Location →</Button>
        </div>
      </div>
    </div>
  );
}

type GeoStatus = "idle" | "loading" | "success" | "denied" | "unavailable";

function Location({ form, set, next, back }: any) {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [lat, setLat] = useState<number | null>(
    form.lat ? parseFloat(form.lat) : null
  );
  const [lng, setLng] = useState<number | null>(
    form.lng ? parseFloat(form.lng) : null
  );

  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("unavailable");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLat(latitude);
        setLng(longitude);
        set("lat", latitude.toString());
        set("lng", longitude.toString());
        setStatus("success");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
        } else {
          setStatus("unavailable");
        }
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleNext = () => {
    if (lat && lng) next();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">GPS Location</h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg">

        {lat && lng ? (
          <>
            {/* @ts-ignore */}
            <MapContainer center={[lat, lng] as [number, number]} zoom={16} className="w-full h-72 rounded-xl mb-6">
              {/* @ts-ignore */}
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
              <Marker position={[lat, lng]}>
                <Popup>{form.mfy}</Popup>
              </Marker>
            </MapContainer>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
                <p className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">Latitude</p>
                <p className="text-lg font-bold text-gray-800 font-mono">{lat.toFixed(6)}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
                <p className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">Longitude</p>
                <p className="text-lg font-bold text-gray-800 font-mono">{lng.toFixed(6)}</p>
              </div>
            </div>

            <button
              onClick={getLocation}
              className="w-full mb-6 py-2.5 border-2 border-blue-200 rounded-xl text-blue-600 font-bold text-sm hover:bg-blue-50 transition"
            >
              Qayta olish
            </button>
          </>
        ) : (
          <div className="mb-6">
            {status === "idle" && (
              <div className="flex flex-col items-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-bold text-base mb-1">Joylashuvni aniqlash</p>
                <p className="text-gray-400 text-sm text-center mb-6">Ob'ekt joylashuvini GPS orqali aniqlang</p>
                <button
                  onClick={getLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition shadow-md"
                >
                  Joylashuvni olish
                </button>
              </div>
            )}

            {status === "loading" && (
              <div className="flex flex-col items-center py-12">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-600 font-semibold text-sm">GPS signal qabul qilinmoqda...</p>
                <p className="text-gray-400 text-xs mt-1">Bir necha soniya kuting</p>
              </div>
            )}

            {status === "denied" && (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <p className="text-red-600 font-bold mb-1">Ruxsat berilmadi</p>
                <p className="text-gray-500 text-sm text-center mb-4">
                  Brauzer sozlamalaridan joylashuv ruxsatini yoqib, qayta urinib ko'ring
                </p>
                <button
                  onClick={getLocation}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition"
                >
                  Qayta urinish
                </button>
              </div>
            )}

            {status === "unavailable" && (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-bold mb-1">Joylashuvni olish imkoni yo'q</p>
                <p className="text-gray-500 text-sm text-center">
                  Bu qurilmada GPS mavjud emas yoki brauzer qo'llab-quvvatlamaydi.
                  Telefon orqali kirganingizda joylashuv avtomatik aniqlanadi.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={back}>← Orqaga</Button>
          <Button onClick={handleNext} disabled={!lat || !lng}>Keyingi →</Button>
        </div>
      </div>
    </div>
  );
}

function Photos({ form, set, next, back }: any) {
  const photos: File[] = form.photos || [];
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      set("photos", [...photos, ...Array.from(e.target.files!)]);
      e.target.value = "";
    }
  };

  const removePhoto = (idx: number) =>
    set("photos", photos.filter((_: File, i: number) => i !== idx));

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Foto Yuklash</h2>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
        {...({ capture: "environment" } as any)}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <p className="text-sm text-gray-500 mb-4">Kamera yoki galereyadan rasm tanlang</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => cameraRef.current?.click()}
            className="p-6 border-2 border-dashed border-blue-300 rounded-xl hover:bg-blue-50 transition text-center"
          >
            <p className="text-3xl mb-2">📷</p>
            <p className="text-sm font-bold text-gray-700">Kamera</p>
          </button>
          <button
            onClick={() => galleryRef.current?.click()}
            className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition text-center"
          >
            <p className="text-3xl mb-2">🖼️</p>
            <p className="text-sm font-bold text-gray-700">Galereya</p>
          </button>
        </div>

        {photos.length > 0 && (
          <>
            <div className="bg-emerald-50 p-3 rounded-xl border-2 border-emerald-200 mb-4">
              <p className="text-emerald-700 text-sm font-bold">✓ {photos.length} ta rasm yuklandi</p>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {photos.map((file, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`foto-${idx}`}
                    className="w-full h-24 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {photos.length === 0 && (
          <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <p className="text-amber-700 text-sm font-semibold">⚠ Kamida bitta rasm yuklang</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={back}>← Orqaga</Button>
          <Button onClick={next} disabled={photos.length === 0}>Keyingi →</Button>
        </div>
      </div>
    </div>
  );
}

function CameraInfo({ form, next, back }: any) {
  const [cameraType, setCameraType] = useState("Face ID");
  const [quantity, setQuantity] = useState(1);
  const [cameras, setCameras] = useState<Camera[]>(form.cameras || []);

  const addCamera = () => {
    if (cameraType && quantity > 0) {
      setCameras([...cameras, { type: cameraType, quantity }]);
      setCameraType("Face ID");
      setQuantity(1);
    }
  };

  const removeCamera = (index: number) => {
    setCameras(cameras.filter((_: Camera, i: number) => i !== index));
  };

  const handleNext = () => {
    form.cameras = cameras;
    next();
  };

  const totalCameras = cameras.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Kamera Ma'lumotlari</h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 mb-6">
          <h3 className="text-sm font-bold text-blue-800 mb-4 uppercase tracking-wider">Yangi Kamera Qo'shish</h3>
          <SelectField
            label="Kamera Turi"
            value={cameraType}
            onChange={setCameraType}
            options={CAMERA_TYPES}
            required
          />
          <TextField label="Soni" value={quantity} onChange={(v: number) => setQuantity(Math.max(1, v))} type="number" required />
          <Button onClick={addCamera}>+ Kamerani Qo'shish</Button>
        </div>

        {cameras.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">Qo'shilgan Kameralar</h3>
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Jami: {totalCameras} ta
              </span>
            </div>
            <div className="space-y-2">
              {cameras.map((camera: Camera, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{camera.type}</p>
                      <p className="text-xs text-gray-500">{camera.quantity} dona</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCamera(idx)}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm transition flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {cameras.length === 0 && (
          <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <p className="text-amber-700 text-sm font-semibold">
              ⚠ Kamida bitta kamera qo'shishingiz kerak
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={back}>← Orqaga</Button>
          <Button onClick={handleNext} disabled={cameras.length === 0}>Keyingi →</Button>
        </div>
      </div>
    </div>
  );
}

function Checklist({ checks, setChecks, next, back }: any) {
  const items = [
    ["electricity", "Elektr mavjud"],
    ["internet", "Internet mavjud"],
    ["pole", "Ustun yoki devor mavjud"],
    ["angle", "Kamera burchagi mos"],
    ["lighting", "Yoritish mavjud"],
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tekshiruv Ro'yxati</h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="space-y-2 mb-6">
          {items.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setChecks({ ...checks, [key]: !checks[key] })}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition text-sm font-semibold ${
                checks[key]
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-white border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <span>{label}</span>
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  checks[key] ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                {checks[key] ? "✓" : ""}
              </span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={back}>← Orqaga</Button>
          <Button onClick={next}>Yakunlash →</Button>
        </div>
      </div>
    </div>
  );
}

function Review({ form, onSubmit, back }: any) {
  const totalCameras = form.cameras.reduce((sum: number, c: Camera) => sum + c.quantity, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Yakuniy Ko'rib Chiqish</h2>
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="mb-6 pb-6 border-b-2 border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{form.mfy}</h3>
          <p className="text-sm text-gray-500">{form.street}, {form.address}</p>
        </div>
        <div className="space-y-2.5 mb-6 pb-6 border-b-2 border-gray-100">
          {[
            ["Viloyat", form.region],
            ["Tuman", form.district],
            ["Loyiha", form.projectName],
            ["Hujjat", `${form.documentType} #${form.documentNumber}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{k}</span>
              <span className="text-sm font-bold text-gray-800">{v}</span>
            </div>
          ))}
        </div>
        {form.cameras.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-700">Kameralar</h4>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">
                Jami {totalCameras} ta
              </span>
            </div>
            <div className="space-y-2">
              {form.cameras.map((cam: Camera, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border-2 border-blue-100">
                  <span className="text-sm font-semibold text-gray-700">{cam.type}</span>
                  <span className="text-sm font-bold text-blue-700">{cam.quantity} dona</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200 mb-6">
          <p className="text-emerald-700 text-sm font-bold">✓ Barcha ma'lumotlar to'g'ri kiritildi</p>
          <p className="text-emerald-600 text-xs mt-1">Server bazaga saqlanadi va supervisor tekshiruviga tushadi.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={back}>← Orqaga</Button>
          <Button variant="success" onClick={onSubmit}>Yuborish</Button>
        </div>
      </div>
    </div>
  );
}

function ObjectDetail({ object, onBack }: { object: ObjectData; onBack: () => void }) {
  const totalCameras = object.cameras.reduce((sum, c) => sum + c.quantity, 0);
  const badge = OBJECT_TYPE_COLORS[object.objectType] || "bg-gray-100 text-gray-700";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Button variant="back" onClick={onBack}>← Orqaga</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3 ${badge} bg-opacity-20`}>
            {object.objectType}
          </span>
          <h2 className="text-xl font-bold mb-1">{object.mfy}</h2>
          <p className="text-blue-200 text-sm">{object.street}, {object.address}</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              ["Surveyor", object.fullName],
              ["Telefon", object.phone],
              ["Lavozim", object.position],
              ["Sana", object.date],
              ["Viloyat", object.region],
              ["Tuman", object.district],
              ["Loyiha", object.projectName],
              ["Hujjat", `${object.documentType} #${object.documentNumber}`],
            ].map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{k}</p>
                <p className="text-sm font-bold text-gray-800">{v}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-100">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Latitude</p>
              <p className="text-sm font-bold text-gray-800 font-mono">{object.lat}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-100">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Longitude</p>
              <p className="text-sm font-bold text-gray-800 font-mono">{object.lng}</p>
            </div>
          </div>

          {object.photos.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-800">Rasmlar</h3>
                <span className="text-xs bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-full">
                  {object.photos.length} ta foto
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {object.photos.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  const download = () => {
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = file.name || `foto-${idx + 1}.jpg`;
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  };
                  return (
                    <button
                      key={idx}
                      onClick={download}
                      title="Yuklab olish uchun bosing"
                      className="relative group overflow-hidden rounded-xl border-2 border-gray-200 hover:border-blue-400 transition"
                    >
                      <img
                        src={url}
                        alt={`foto-${idx + 1}`}
                        className="w-full h-28 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                        <svg className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t-2 border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-800">Kameralar</h3>
              <div className="flex gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-full">
                  {object.cameras.length} tur
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-full">
                  Jami {totalCameras} ta
                </span>
              </div>
            </div>

            {object.cameras.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-sm text-gray-400">Kamera ma'lumoti yo'q</p>
              </div>
            ) : (
              <div className="space-y-3">
                {object.cameras.map((cam, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl border-2 border-blue-100"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">{cam.type}</p>
                      <p className="text-xs text-gray-500">Kamera turi</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-700">{cam.quantity}</p>
                      <p className="text-xs text-gray-500">dona</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-4 bg-gray-800 rounded-xl flex items-center justify-between">
              <span className="text-sm font-bold text-gray-300">Jami kameralar:</span>
              <span className="text-xl font-bold text-white">{totalCameras} ta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyObjects({ objects, setStep }: { objects: ObjectData[]; setStep: (s: number) => void }) {
  const [selected, setSelected] = useState<ObjectData | null>(null);

  const exportToExcel = () => {
    const headers = [
      "Surveyor ismi",
      "Telefon",
      "Lavozim",
      "Sana",
      "Loyiha nomi",
      "Hujjat turi",
      "Hujjat raqami",
      "Viloyat",
      "Tuman",
      "MFY nomi",
      "Ko'cha",
      "Manzil",
      "Obyekt turi",
      "Latitude",
      "Longitude",
      "Foto soni",
      "Kameralar",
      "Jami kamera soni",
    ];

    const rows = objects.map((obj) => {
      const camerasCell =
        obj.cameras.length === 0
          ? "—"
          : obj.cameras.map((c) => `${c.type}: ${c.quantity} dona`).join(", ");
      const totalCams = obj.cameras.reduce((s, c) => s + c.quantity, 0);
      return [
        obj.fullName,
        obj.phone,
        obj.position,
        obj.date,
        obj.projectName,
        obj.documentType,
        obj.documentNumber,
        obj.region,
        obj.district,
        obj.mfy,
        obj.street,
        obj.address,
        obj.objectType,
        obj.lat,
        obj.lng,
        obj.photos.length,
        camerasCell,
        totalCams,
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    ws["!cols"] = [
      { wch: 20 }, { wch: 18 }, { wch: 14 }, { wch: 12 },
      { wch: 30 }, { wch: 18 }, { wch: 14 }, { wch: 18 },
      { wch: 20 }, { wch: 22 }, { wch: 20 }, { wch: 20 },
      { wch: 22 }, { wch: 14 }, { wch: 14 }, { wch: 10 },
      { wch: 45 }, { wch: 16 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Obyektlar");
    XLSX.writeFile(wb, `obyektlar_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  if (selected) {
    return <ObjectDetail object={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setStep(3)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Yangi Ob'ekt
        </button>
        {objects.length > 0 && (
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Excel yuklash
          </button>
        )}
        <span className="ml-auto text-sm text-gray-400 font-semibold">{objects.length} ta ob'ekt</span>
      </div>

      {objects.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Hozircha saqlangan ob'ektlar yo'q</p>
        </div>
      ) : (
        <div className="space-y-3">
          {objects.map((obj, idx) => {
            const totalCams = obj.cameras.reduce((sum, c) => sum + c.quantity, 0);
            const badge = OBJECT_TYPE_COLORS[obj.objectType] || "bg-gray-100 text-gray-600";
            return (
              <button
                key={idx}
                onClick={() => setSelected(obj)}
                className="w-full text-left bg-white rounded-2xl shadow-md hover:shadow-lg border-2 border-transparent hover:border-blue-200 transition-all p-5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge}`}>
                        {obj.objectType}
                      </span>
                      <span className="text-xs text-gray-400">{obj.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-800 truncate">{obj.mfy}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{obj.street}, {obj.address}</p>
                    <p className="text-xs text-gray-400 mt-1">{obj.district}, {obj.region}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="bg-blue-50 rounded-xl p-3 group-hover:bg-blue-100 transition">
                      <p className="text-xl font-bold text-blue-700">{totalCams}</p>
                      <p className="text-xs text-blue-500 font-semibold">kamera</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">{obj.cameras.length} tur</p>
                  </div>
                </div>

                {obj.cameras.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                    {obj.cameras.map((cam, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-lg">
                        {cam.type} × {cam.quantity}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-1 text-blue-500 text-xs font-bold group-hover:gap-2 transition-all">
                  <span>Batafsil ko'rish</span>
                  <span>→</span>
                </div>
              </button>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [checks, setChecks] = useState({
    electricity: true,
    internet: true,
    pole: true,
    angle: true,
    lighting: true,
  });
  const [objects, setObjects] = useState<ObjectData[]>([]);

  const set = (key: keyof FormData, value: any) =>
    setForm((current) => ({ ...current, [key]: value }));
  const next = () => setStep((current) => Math.min(current + 1, 9));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  const handleSubmit = () => {
    const newObject: ObjectData = {
      fullName: form.fullName,
      phone: form.phone,
      position: form.position,
      mfy: form.mfy,
      region: form.region,
      district: form.district,
      street: form.street,
      address: form.address,
      objectType: form.objectType,
      lat: form.lat,
      lng: form.lng,
      cameras: form.cameras,
      projectName: form.projectName,
      documentType: form.documentType,
      documentNumber: form.documentNumber,
      date: form.date,
      photos: form.photos,
    };
    setObjects((prev) => [newObject, ...prev]);
    setForm(initialForm);
    setStep(2);
  };

  // Step mapping (no HomeScreen):
  // 0: Login  1: Profile  2: MyObjects
  // 3: Project  4: ObjectInfo  5: Location
  // 6: Photos  7: CameraInfo  8: Checklist  9: Review
  const screens = [
    <Login form={form} set={set} next={next} />,
    <Profile form={form} set={set} next={next} />,
    <MyObjects objects={objects} setStep={setStep} />,
    <Project form={form} set={set} next={next} back={back} />,
    <ObjectInfo form={form} set={set} next={next} back={back} />,
    <Location form={form} set={set} next={next} back={back} />,
    <Photos form={form} set={set} next={next} back={back} />,
    <CameraInfo form={form} next={next} back={back} />,
    <Checklist checks={checks} setChecks={setChecks} next={next} back={back} />,
    <Review form={form} onSubmit={handleSubmit} back={back} />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="w-full px-3 py-6">{screens[step]}</div>
    </div>
  );
}
