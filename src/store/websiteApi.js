import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAdminToken } from "../private/services/authStorage.js";

const apiUrl = import.meta.env.VITE_API_URL || "https://tanuenterprise-backend.vercel.app/api";

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
}

export const websiteApi = createApi({
  reducerPath: "websiteApi",
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders(headers) {
      const token = getAdminToken();
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ["Home", "Projects", "Services", "Gallery", "Contacts", "Support", "Pages", "Settings"],
  endpoints: (builder) => ({
    getHome: builder.query({
      query: () => "/home",
      providesTags: ["Home"]
    }),
    getProjects: builder.query({
      query: (params = {}) => ({ url: "/projects", params: cleanParams(params) }),
      providesTags: ["Projects"]
    }),
    getServices: builder.query({
      query: (params = {}) => ({ url: "/services", params: cleanParams(params) }),
      providesTags: ["Services"]
    }),
    getGallery: builder.query({
      query: (params = {}) => ({ url: "/gallery", params: cleanParams(params) }),
      providesTags: ["Gallery"]
    }),
    getPage: builder.query({
      query: (slug) => `/pages/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Pages", id: slug }]
    }),
    submitContact: builder.mutation({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body
      }),
      invalidatesTags: ["Contacts"]
    }),
    submitSupport: builder.mutation({
      query: (body) => ({
        url: "/support",
        method: "POST",
        body
      }),
      invalidatesTags: ["Support"]
    }),
    adminLogin: builder.mutation({
      query: (body) => ({
        url: "/admin/auth/login",
        method: "POST",
        body
      })
    }),
    getAdminContacts: builder.query({
      query: (params = {}) => ({ url: "/admin/contacts", params: cleanParams(params) }),
      providesTags: ["Contacts"]
    }),
    updateAdminContact: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/contacts/${id}`,
        method: "PUT",
        body: { status }
      }),
      invalidatesTags: ["Contacts"]
    }),
    deleteAdminContact: builder.mutation({
      query: (id) => ({
        url: `/admin/contacts/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Contacts"]
    }),
    getAdminSupportTickets: builder.query({
      query: (params = {}) => ({ url: "/admin/support", params: cleanParams(params) }),
      providesTags: ["Support"]
    }),
    updateAdminSupportTicket: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/support/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: ["Support"]
    }),
    deleteAdminSupportTicket: builder.mutation({
      query: (id) => ({
        url: `/admin/support/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Support"]
    }),
    getAdminProjects: builder.query({
      query: (params = {}) => ({ url: "/admin/projects", params: cleanParams(params) }),
      providesTags: ["Projects"]
    }),
    deleteAdminProject: builder.mutation({
      query: (id) => ({
        url: `/admin/projects/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Projects"]
    }),
    getAdminServices: builder.query({
      query: (params = {}) => ({ url: "/admin/services", params: cleanParams(params) }),
      providesTags: ["Services"]
    }),
    deleteAdminService: builder.mutation({
      query: (id) => ({
        url: `/admin/services/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Services"]
    }),
    getAdminGallery: builder.query({
      query: (params = {}) => ({ url: "/admin/gallery", params: cleanParams(params) }),
      providesTags: ["Gallery"]
    }),
    createAdminGallery: builder.mutation({
      query: (formData) => ({
        url: "/admin/gallery",
        method: "POST",
        body: formData
      }),
      invalidatesTags: ["Gallery"]
    }),
    deleteAdminGallery: builder.mutation({
      query: (id) => ({
        url: `/admin/gallery/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Gallery"]
    }),
    getAdminPage: builder.query({
      query: (slug) => `/admin/pages/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: "Pages", id: slug }]
    }),
    updateAdminPage: builder.mutation({
      query: ({ slug, formData }) => ({
        url: `/admin/pages/${slug}`,
        method: "PUT",
        body: formData
      }),
      invalidatesTags: (_result, _error, { slug }) => [{ type: "Pages", id: slug }]
    }),
    getAdminSettings: builder.query({
      query: () => "/admin/settings",
      providesTags: ["Settings"]
    }),
    updateAdminSettings: builder.mutation({
      query: (formData) => ({
        url: "/admin/settings",
        method: "PUT",
        body: formData
      }),
      invalidatesTags: ["Settings", "Home"]
    })
  })
});

export const {
  useAdminLoginMutation,
  useCreateAdminGalleryMutation,
  useDeleteAdminContactMutation,
  useDeleteAdminGalleryMutation,
  useDeleteAdminProjectMutation,
  useDeleteAdminServiceMutation,
  useDeleteAdminSupportTicketMutation,
  useGetAdminGalleryQuery,
  useGetAdminContactsQuery,
  useGetAdminPageQuery,
  useGetAdminProjectsQuery,
  useGetAdminServicesQuery,
  useGetAdminSettingsQuery,
  useGetAdminSupportTicketsQuery,
  useGetHomeQuery,
  useGetGalleryQuery,
  useGetPageQuery,
  useGetProjectsQuery,
  useGetServicesQuery,
  useUpdateAdminContactMutation,
  useUpdateAdminPageMutation,
  useUpdateAdminSettingsMutation,
  useUpdateAdminSupportTicketMutation,
  useSubmitContactMutation,
  useSubmitSupportMutation
} = websiteApi;
