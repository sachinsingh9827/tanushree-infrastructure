import { Building2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useGetPageQuery, useSubmitContactMutation } from "../../store/websiteApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import CustomSelect from "../../components/CustomSelect.jsx";
import { fallbackPageContent } from "../data/staticContent.js";
import SiteLayout from "../components/SiteLayout.jsx";

const contactCards = [
  { icon: Phone, label: "Call", value: "+91 00000 00000" },
  { icon: Mail, label: "Email", value: "info@tanuenterprise.com" },
  { icon: MapPin, label: "Visit", value: "Project office, India" }
];

const customerTypes = ["Owner", "Builder", "Architect", "Contractor", "Business", "Other"];

export default function Contact() {
  const { showToast } = useToast();
  const { data, isError } = useGetPageQuery("contact");
  const [submitContact, { isLoading }] = useSubmitContactMutation();
  const page = data?.data || (isError ? fallbackPageContent.contact : null);
  const heroImage = page?.heroImage?.url || fallbackPageContent.contact.heroImage.url;

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    customerType: "Owner",
    subject: "",
    message: "",
    website: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await submitContact(formValues).unwrap();

      setFormValues({
        name: "",
        email: "",
        phone: "",
        customerType: "Owner",
        subject: "",
        message: "",
        website: ""
      });
      showToast({ message: "Contact inquiry submitted successfully", type: "success" });
    } catch (submitError) {
      const fieldMessage = submitError?.data?.errors?.[0]?.msg;
      showToast({ message: fieldMessage || submitError?.data?.message || "Submission failed", type: "error" });
    }
  }

  return (
    <SiteLayout>
      <section className="bg-header/60 py-10 transition-colors dark:bg-slate-900">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="relative min-h-[440px] overflow-hidden rounded-lg bg-primary text-white shadow">
            <img
              alt={page?.heroImage?.altText || fallbackPageContent.contact.heroImage.altText}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              src={heroImage}
            />
            <div className="absolute inset-0 bg-primary/70" />
            <div className="relative flex min-h-[440px] flex-col justify-between p-6 sm:p-8">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-secondary">
                  <Building2 size={16} />
                  Contact tanuenterprise
                </p>
                <h1 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  {page?.title || fallbackPageContent.contact.title}
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-6 text-slate-100 sm:text-base">
                  {page?.seoDescription || fallbackPageContent.contact.seoDescription}
                </p>
                {page?.content || isError ? (
                  <article
                    className="cms-content mt-5 max-w-lg text-sm leading-6 text-slate-100 [&_a]:text-secondary [&_h2]:text-white [&_h3]:text-white [&_li]:text-slate-100 [&_p]:text-slate-100"
                    dangerouslySetInnerHTML={{ __html: page?.content || fallbackPageContent.contact.content }}
                  />
                ) : null}
              </div>

              <div className="mt-8 grid gap-3">
                {contactCards.map(({ icon: Icon, label, value }) => (
                  <div className="flex items-center gap-3 rounded-custom bg-white/12 p-3 backdrop-blur" key={label}>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-custom bg-secondary text-primary">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
                      <p className="truncate text-sm font-semibold text-white">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 rounded-lg border border-primary/10 bg-white p-5 shadow transition-colors dark:border-secondary/15 dark:bg-slate-950 sm:p-7"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-tabActive dark:text-secondary">Project Enquiry</p>
              <h2 className="mt-2 text-2xl font-bold text-primary dark:text-white">Send your requirement</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Add your basic details and project message. The admin team will receive it in the contact entries table.
              </p>
            </div>

            <input className="hidden" name="website" tabIndex="-1" autoComplete="off" value={formValues.website} onChange={handleChange} />

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</span>
                <input
                  className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  name="name"
                  placeholder="Your name"
                  minLength="2"
                  maxLength="120"
                  required
                  value={formValues.name}
                  onChange={handleChange}
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</span>
                <input
                  className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  maxLength="160"
                  required
                  value={formValues.email}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Phone</span>
                <input
                  className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  name="phone"
                  inputMode="tel"
                  pattern="^(?:\\+91[\\s-]?|91[\\s-]?|0)?[6-9][0-9]{4}[\\s-]?[0-9]{5}$"
                  placeholder="+91 98765 43210"
                  required
                  title="Enter a valid Indian mobile number"
                  value={formValues.phone}
                  onChange={handleChange}
                />
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Customer Type</span>
                <CustomSelect
                  name="customerType"
                  onChange={(value) => setFormValues((current) => ({ ...current, customerType: value }))}
                  options={customerTypes}
                  value={formValues.customerType}
                />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Subject</span>
              <input
                className="rounded-custom border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-primary/40 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                name="subject"
                placeholder="Project enquiry"
                minLength="3"
                maxLength="160"
                required
                value={formValues.subject}
                onChange={handleChange}
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Message</span>
              <textarea
                className="min-h-44 resize-y rounded-custom border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-6 outline-none transition focus:border-primary/40 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                name="message"
                placeholder="Tell us about project type, location, budget range or timeline."
                minLength="10"
                maxLength="2000"
                required
                value={formValues.message}
                onChange={handleChange}
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500 dark:text-slate-400">Use an Indian mobile number. Message must be at least 10 characters.</p>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-custom bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-secondary dark:text-primary"
                disabled={isLoading}
                type="submit"
              >
                <Send size={16} />
                {isLoading ? "Submitting..." : "Submit Contact"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
