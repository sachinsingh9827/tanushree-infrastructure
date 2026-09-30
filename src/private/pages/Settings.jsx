import { useEffect, useState } from "react";
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from "../../store/websiteApi.js";
import AdminLayout from "../components/AdminLayout.jsx";
import Loader from "../components/Loader.jsx";

function ImageUploadField({ label, name, currentImage }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const imageUrl = previewUrl || currentImage?.url;

  return (
    <label className="grid content-start gap-3 rounded border border-dashed border-slate-300 p-3 dark:border-slate-700">
      <span className="text-sm font-semibold">{label}</span>
      <input
        accept="image/*"
        className="block w-full cursor-pointer rounded border bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-2 file:font-semibold file:text-white dark:bg-slate-900"
        name={name}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          setPreviewUrl(file ? URL.createObjectURL(file) : "");
        }}
        type="file"
      />
      {imageUrl ? (
        <div className="flex min-h-28 items-center justify-center rounded bg-slate-100 p-3 dark:bg-slate-900">
          <img alt={`${label} preview`} className="max-h-28 max-w-full object-contain" src={imageUrl} />
        </div>
      ) : (
        <div className="grid min-h-28 place-items-center rounded bg-slate-100 px-4 text-center text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          Choose an image to see its preview here
        </div>
      )}
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {previewUrl ? "New image preview" : currentImage?.url ? "Current image" : "No image uploaded yet"}
      </span>
    </label>
  );
}

export default function Settings() {
  const { data, isLoading } = useGetAdminSettingsQuery();
  const [updateSettings, { isLoading: isSaving, isSuccess }] = useUpdateAdminSettingsMutation();
  const settings = data?.data;

  async function handleSubmit(event) {
    event.preventDefault();
    await updateSettings(new FormData(event.currentTarget)).unwrap();
  }

  return (
    <AdminLayout title="Site Settings">
      {isLoading ? (
        <Loader label="Loading site settings..." />
      ) : (
        <form className="grid gap-4 rounded-lg bg-white p-5 shadow dark:border dark:border-slate-800 dark:bg-slate-950 md:grid-cols-2" onSubmit={handleSubmit}>
          <input className="rounded border px-3 py-2" defaultValue={settings?.companyName && settings.companyName !== "tanuenterprise" ? settings.companyName : "Tanushree Infrastructure"} name="companyName" placeholder="Company name" />
          <input className="rounded border px-3 py-2" defaultValue={settings?.email && !settings.email.toLowerCase().includes("@tanuenterprise.com") ? settings.email : ""} name="email" placeholder="Support email (shown in footer)" type="email" />
          <input className="rounded border px-3 py-2" defaultValue={settings?.phone && !settings.phone.includes("00000") ? settings.phone : "+91 7489887978"} name="phone" placeholder="Contact phone (shown in footer)" type="tel" />
          <input className="rounded border px-3 py-2" defaultValue={settings?.alternatePhone || ""} name="alternatePhone" placeholder="Alternate phone" />
          <input className="rounded border px-3 py-2 md:col-span-2" defaultValue={settings?.address || ""} name="address" placeholder="Address" />
          <input className="rounded border px-3 py-2" defaultValue={settings?.facebook || ""} name="facebook" placeholder="Facebook URL" />
          <input className="rounded border px-3 py-2" defaultValue={settings?.instagram || ""} name="instagram" placeholder="Instagram URL" />
          <input className="rounded border px-3 py-2" defaultValue={settings?.linkedin || ""} name="linkedin" placeholder="LinkedIn URL" />
          <input className="rounded border px-3 py-2" defaultValue={settings?.youtube || ""} name="youtube" placeholder="YouTube URL" />
          <input className="rounded border px-3 py-2" defaultValue={settings?.whatsapp || ""} name="whatsapp" placeholder="WhatsApp" />
          <input className="rounded border px-3 py-2" defaultValue={settings?.googleMapUrl || ""} name="googleMapUrl" placeholder="Google map URL" />
          <ImageUploadField currentImage={settings?.logo} label="Website logo" name="logo" />
          <ImageUploadField currentImage={settings?.favicon} label="Favicon" name="favicon" />
          <textarea className="rounded border px-3 py-2 md:col-span-2" defaultValue={settings?.footerText || ""} name="footerText" placeholder="Footer text" />
          {isSuccess ? <p className="text-sm text-green-700 dark:text-green-300 md:col-span-2">Settings updated successfully.</p> : null}
          <button className="rounded bg-primary px-4 py-2 text-white md:col-span-2 dark:bg-secondary dark:text-primary" disabled={isSaving} type="submit">
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      )}
    </AdminLayout>
  );
}
