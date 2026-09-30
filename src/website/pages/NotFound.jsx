import { Link } from "react-router-dom";
import SiteLayout from "../components/SiteLayout.jsx";

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="grid min-h-[55vh] place-items-center px-4 text-center">
        <div>
          <h1 className="text-4xl font-bold">Page not found</h1>
          <Link className="mt-4 inline-block rounded bg-slate-950 px-4 py-2 text-white" to="/">
            Go home
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
