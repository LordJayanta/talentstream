import Header from "@/components/core/header";
import JobSearchFeed from "@/components/job-search-feed";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <JobSearchFeed />
      </main>
    </div>
  );
}
