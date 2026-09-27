import { CmsReviewClient } from "@/components/cms/CmsReviewClient";
import "@/components/cms/cms-quill.css";

type Props = { params: Promise<{ id: string }> };

export default async function CmsReviewPage({ params }: Props) {
  const { id } = await params;
  return <CmsReviewClient entryId={id} />;
}
