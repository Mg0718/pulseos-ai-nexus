
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Download, Eye, Shield, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  is_confidential: boolean;
  requires_acknowledgment: boolean;
  created_at: string;
  uploaded_by: string;
}

interface DocumentAcknowledgment {
  id: string;
  document_id: string;
  acknowledged_at: string;
}

const documentTypeIcons = {
  contract: FileText,
  policy: Shield,
  handbook: FileText,
  form: FileText,
  certificate: FileText,
  other: FileText,
};

const documentTypeColors = {
  contract: "bg-blue-500",
  policy: "bg-red-500",
  handbook: "bg-green-500",
  form: "bg-yellow-500",
  certificate: "bg-purple-500",
  other: "bg-gray-500",
};

export const DocumentManagement = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [acknowledgments, setAcknowledgments] = useState<DocumentAcknowledgment[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    document_type: "",
    is_confidential: false,
    requires_acknowledgment: false,
  });

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchAcknowledgments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return;
    }

    setDocuments(data || []);
  };

  const fetchAcknowledgments = async () => {
    const { data, error } = await supabase
      .from('document_acknowledgments')
      .select('*');

    if (error) {
      console.error('Error fetching acknowledgments:', error);
      return;
    }

    setAcknowledgments(data || []);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.title) {
        setFormData({...formData, title: file.name});
      }
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !user) return;

    // In a real implementation, you would upload to storage
    // For now, we'll simulate with a placeholder path
    const filePath = `documents/${user.id}/${Date.now()}-${selectedFile.name}`;

    const { error } = await supabase
      .from('documents')
      .insert({
        ...formData,
        user_id: user.id,
        uploaded_by: user.id,
        file_path: filePath,
        file_size: selectedFile.size,
        mime_type: selectedFile.type,
      });

    if (error) {
      toast.error('Failed to upload document');
      return;
    }

    toast.success('Document uploaded successfully');
    setUploadDialogOpen(false);
    setSelectedFile(null);
    setFormData({
      title: "",
      description: "",
      document_type: "",
      is_confidential: false,
      requires_acknowledgment: false,
    });
    fetchDocuments();
  };

  const handleAcknowledgeDocument = async (documentId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('document_acknowledgments')
      .insert({
        document_id: documentId,
        user_id: user.id,
      });

    if (error) {
      toast.error('Failed to acknowledge document');
      return;
    }

    toast.success('Document acknowledged');
    fetchAcknowledgments();
  };

  const isAcknowledged = (documentId: string) => {
    return acknowledgments.some(ack => ack.document_id === documentId);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  const pendingAcknowledgments = documents.filter(doc => 
    doc.requires_acknowledgment && !isAcknowledged(doc.id)
  ).length;

  return (
    <div className="space-y-6">
      {/* Documents Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Documents</p>
                <p className="text-2xl font-bold text-white">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Confidential</p>
                <p className="text-2xl font-bold text-white">
                  {documents.filter(d => d.is_confidential).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Pending Acknowledgments</p>
                <p className="text-2xl font-bold text-white">{pendingAcknowledgments}</p>
              </div>
              <Eye className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Acknowledged</p>
                <p className="text-2xl font-bold text-white">{acknowledgments.length}</p>
              </div>
              <Check className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Document Management</h2>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white">Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">File</Label>
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  className="bg-white/10 border-white/20 text-white"
                />
                {selectedFile && (
                  <p className="text-white/70 text-sm mt-1">
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Document Type</Label>
                <Select 
                  value={formData.document_type} 
                  onValueChange={(value) => setFormData({...formData, document_type: value})}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="handbook">Handbook</SelectItem>
                    <SelectItem value="form">Form</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_confidential}
                  onCheckedChange={(checked) => setFormData({...formData, is_confidential: checked})}
                />
                <Label className="text-white">Confidential Document</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.requires_acknowledgment}
                  onCheckedChange={(checked) => setFormData({...formData, requires_acknowledgment: checked})}
                />
                <Label className="text-white">Requires Acknowledgment</Label>
              </div>

              <Button 
                onClick={handleUploadDocument} 
                className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
                disabled={!selectedFile || !formData.title || !formData.document_type}
              >
                Upload Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => {
          const IconComponent = documentTypeIcons[document.document_type as keyof typeof documentTypeIcons];
          const colorClass = documentTypeColors[document.document_type as keyof typeof documentTypeColors];
          const acknowledged = isAcknowledged(document.id);

          return (
            <Card key={document.id} className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex gap-1">
                    {document.is_confidential && (
                      <Badge className="bg-red-500 text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        Confidential
                      </Badge>
                    )}
                    {document.requires_acknowledgment && (
                      <Badge className={acknowledged ? "bg-green-500" : "bg-yellow-500"}>
                        {acknowledged ? <Check className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Badge>
                    )}
                  </div>
                </div>

                <h3 className="text-white font-medium mb-2">{document.title}</h3>
                
                {document.description && (
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">{document.description}</p>
                )}

                <div className="text-white/60 text-xs mb-3">
                  <p>Type: {document.document_type}</p>
                  <p>Size: {formatFileSize(document.file_size)}</p>
                  <p>Uploaded: {new Date(document.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  
                  {document.requires_acknowledgment && !acknowledged && (
                    <Button 
                      size="sm" 
                      onClick={() => handleAcknowledgeDocument(document.id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Acknowledge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
