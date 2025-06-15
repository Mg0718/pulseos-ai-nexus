
import { DocumentManagement } from "@/components/people/documents/DocumentManagement";

const Documents = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Document Management</h1>
          <p className="text-white/70">Manage employee documents and policies.</p>
        </div>
        <DocumentManagement />
      </div>
    </div>
  );
};

export default Documents;
