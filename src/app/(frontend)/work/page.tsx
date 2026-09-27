import { WorkClient } from "./WorkClient";
import { getAllProjects } from "@/lib/contentful/projects";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Work",
  description:
    "Selected design and development case studies — websites and digital products.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getAllProjects();
  return <WorkClient projects={projects} />;
}
