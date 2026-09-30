import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Image, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetAdminPageQuery,
  useUpdateAdminPageMutation
} from "../../store/websiteApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import CustomSelect from "../../components/CustomSelect.jsx";
import { getAdminToken } from "../services/authStorage.js";
import AdminLayout from "../components/AdminLayout.jsx";
import Loader from "../components/Loader.jsx";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const pageLabels = {
  home: "Home",
  about: "About",
  services: "Services",
  projects: "Projects",
  gallery: "Gallery",
  contact: "Contact"
};

class AdminImageUploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.xhr = null;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this.xhr = new XMLHttpRequest();
          this.xhr.open("POST", `${apiUrl}/admin/uploads/editor-image`, true);
          this.xhr.responseType = "json";

          const token = getAdminToken();
          if (token) this.xhr.setRequestHeader("Authorization", `Bearer ${token}`);

          this.xhr.addEventListener("error", () => reject("Image upload failed."));
          this.xhr.addEventListener("abort", () => reject("Image upload cancelled."));
          this.xhr.addEventListener("load", () => {
            const response = this.xhr.response;
            const url = response?.data?.image?.url;

            if (!response?.success || !url) {
              reject(response?.message || "Image upload failed.");
              return;
            }

            resolve({ default: url });
          });

          if (this.xhr.upload) {
            this.xhr.upload.addEventListener("progress", (event) => {
              if (event.lengthComputable) {
                this.loader.uploadTotal = event.total;
                this.loader.uploaded = event.loaded;
              }
            });
          }

          const formData = new FormData();
          formData.append("upload", file);
          this.xhr.send(formData);
        })
    );
  }

  abort() {
    if (this.xhr) this.xhr.abort();
  }
}

function adminImageUploadPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => new AdminImageUploadAdapter(loader);
}

export default function PageEditor() {
  const { slug = "about" } = useParams();
  const pageLabel = pageLabels[slug] || slug.replaceAll("-", " ");
  const defaultStatus = pageLabels[slug] ? "published" : "draft";
  const heroImageInputRef = useRef(null);
  const planningImageInputRef = useRef(null);
  const whyImageInputRef = useRef(null);
  const workflowImageInputRef = useRef(null);
  const { data, isLoading } = useGetAdminPageQuery(slug);
  const [updatePage, { isLoading: isSaving }] = useUpdateAdminPageMutation();
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(defaultStatus);
  const { showToast } = useToast();

  useEffect(() => {
    if (data?.data?.content !== undefined) setContent(data.data.content);
    if (data?.data?.status) setStatus(data.data.status);
  }, [data]);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("content", content);

    try {
      await updatePage({ slug, formData }).unwrap();
      if (heroImageInputRef.current) heroImageInputRef.current.value = "";
      if (planningImageInputRef.current) planningImageInputRef.current.value = "";
      if (whyImageInputRef.current) whyImageInputRef.current.value = "";
      if (workflowImageInputRef.current) workflowImageInputRef.current.value = "";
      showToast({ message: "Page updated successfully.", type: "success" });
    } catch (error) {
      showToast({ message: error?.data?.message || "Unable to update page.", type: "error" });
    }
  }

  const page = data?.data;

  return (
    <AdminLayout title={`Edit ${pageLabel} Page`}>
      {isLoading ? (
        <Loader label="Loading page content..." />
      ) : (
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <section className="grid gap-4 rounded-custom border border-primary/10 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-custom bg-header text-primary dark:bg-primary dark:text-secondary">
                <Image size={18} />
              </span>
              <div>
                <h3 className="text-sm font-bold text-primary dark:text-white">Page Content</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Edit title, rich text and images for this page.</p>
              </div>
            </div>

            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Page Title</span>
              <input
                className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-primary/40 focus:bg-white"
                defaultValue={page?.title || ""}
                name="title"
                placeholder="Page title"
                required
              />
            </label>

            <div className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Rich Content</span>
              <div className="cms-editor-wrap relative z-0 overflow-hidden rounded-custom border border-slate-200 dark:border-slate-700">
                <CKEditor
                  config={{
                    extraPlugins: [adminImageUploadPlugin],
                    licenseKey: "GPL",
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "imageUpload",
                      "blockQuote",
                      "insertTable",
                      "undo",
                      "redo"
                    ]
                  }}
                  data={content}
                  editor={ClassicEditor}
                  onChange={(_event, editor) => setContent(editor.getData())}
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 rounded-custom border border-primary/10 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hero Image</span>
                <input
                  accept="image/*"
                  className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white focus:border-primary/40 focus:bg-white"
                  name="heroImage"
                  ref={heroImageInputRef}
                  type="file"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</span>
                <CustomSelect
                  name="status"
                  onChange={setStatus}
                  options={["draft", "published"]}
                  value={status}
                />
              </label>
            </div>

            {page?.heroImage?.url ? (
              <img
                alt={page?.heroImage?.altText || page?.title || "Page hero"}
                className="h-44 w-full rounded-custom object-cover"
                loading="lazy"
                src={page.heroImage.url}
              />
            ) : null}

            {slug === "home" ? (
              <div className="grid gap-4 rounded-custom border border-dashed border-primary/20 bg-header/30 p-4 dark:border-secondary/20 dark:bg-slate-900">
                <div>
                  <h3 className="text-sm font-bold text-primary dark:text-white">Home Background Section Images</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    These images control the full-width background sections on the public home page.
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <label className="grid gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Planning Section Image</span>
                    <input
                      accept="image/*"
                      className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white focus:border-primary/40 focus:bg-white"
                      name="planningImage"
                      ref={planningImageInputRef}
                      type="file"
                    />
                    {page?.sectionImages?.planning?.url ? (
                      <img
                        alt={page.sectionImages.planning.altText || "Planning section"}
                        className="mt-2 h-32 w-full rounded-custom object-cover"
                        loading="lazy"
                        src={page.sectionImages.planning.url}
                      />
                    ) : null}
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Why Choose Us Image</span>
                    <input
                      accept="image/*"
                      className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white focus:border-primary/40 focus:bg-white"
                      name="whyImage"
                      ref={whyImageInputRef}
                      type="file"
                    />
                    {page?.sectionImages?.why?.url ? (
                      <img
                        alt={page.sectionImages.why.altText || "Why choose us section"}
                        className="mt-2 h-32 w-full rounded-custom object-cover"
                        loading="lazy"
                        src={page.sectionImages.why.url}
                      />
                    ) : null}
                  </label>

                  <label className="grid gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Workflow Section Image</span>
                    <input
                      accept="image/*"
                      className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white focus:border-primary/40 focus:bg-white"
                      name="workflowImage"
                      ref={workflowImageInputRef}
                      type="file"
                    />
                    {page?.sectionImages?.workflow?.url ? (
                      <img
                        alt={page.sectionImages.workflow.altText || "Workflow section"}
                        className="mt-2 h-32 w-full rounded-custom object-cover"
                        loading="lazy"
                        src={page.sectionImages.workflow.url}
                      />
                    ) : null}
                  </label>
                </div>
              </div>
            ) : null}

            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">SEO Title</span>
              <input
                className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-primary/40 focus:bg-white"
                defaultValue={page?.seoTitle || ""}
                name="seoTitle"
                placeholder="SEO title"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">SEO Description</span>
              <textarea
                className="min-h-24 rounded-custom border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-primary/40 focus:bg-white"
                defaultValue={page?.seoDescription || ""}
                name="seoDescription"
                placeholder="SEO description"
              />
            </label>

            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-custom bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              disabled={isSaving}
              type="submit"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save Page"}
            </button>
          </section>
        </form>
      )}
    </AdminLayout>
  );
}
