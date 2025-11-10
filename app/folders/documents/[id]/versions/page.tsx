import { DocumentVersionsPage } from "./DocumentVersionsPage";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <DocumentVersionsPage
      params={{
        id: "",
      }}
    />
  );
}
