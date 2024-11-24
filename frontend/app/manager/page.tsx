'use client'

import { useState, useRef } from 'react'
import { Document } from '../types'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'

const initialDocuments: Document[] = [
  { id: '1', name: 'Employee Handbook', uploadDate: '2023-06-01', metadata: 'HR, Policies, Onboarding, Company Culture, Benefits, Time Off, Code of Conduct' },
  { id: '2', name: 'IT Security Guidelines', uploadDate: '2023-05-15', metadata: 'IT, Security, Passwords, Data Protection, Network Access, Cybersecurity' },
  { id: '3', name: 'Onboarding Checklist', uploadDate: '2023-05-30', metadata: 'HR, Onboarding, New Employee, Orientation, Training, Equipment Setup' },
]

export default function ManagerPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = () => {
    // In a real app, you'd clear the session/token here
    router.push('/')
  }

  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [newDocument, setNewDocument] = useState<Document>({ id: '', name: '', uploadDate: '', metadata: '' })
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [viewingMetadata, setViewingMetadata] = useState<{ id: string; metadata: string } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDelete = async (id: string) => {
    try {
      const docToDelete = documents.find(doc => doc.id === id);
      if (!docToDelete) {
        throw new Error('Document not found');
      }
      const response = await fetch('http://127.0.0.1:8000/manager/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: docToDelete.name }),
      });
      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== id));
        toast.success('Document deleted successfully');
      } else {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  }

  const handleEdit = (document: Document) => {
    setEditingDocument(document)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setNewDocument({ ...newDocument, name: file.name })
    }
  }

  const handleAdd = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', newDocument.name || selectedFile.name);
        if (newDocument.metadata) {
          formData.append('metadata', newDocument.metadata);
        }

        const response = await fetch('http://127.0.0.1:8000/manager/create', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const newDoc: Document = {
            id: data.id,
            name: data.name,
            uploadDate: data.uploadDate,
            metadata: data.metadata,
          };
          setDocuments([...documents, newDoc]);
          setNewDocument({ id: '', name: '', uploadDate: '', metadata: '' });
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          toast.success('Document uploaded successfully');
        } else {
          throw new Error('Failed to upload document');
        }
      } catch (error) {
        console.error('Error uploading document:', error);
        toast.error('Failed to upload document');
      }
    }
  }

  const handleUpdate = async () => {
    if (editingDocument) {
      try {
        const response = await fetch('http://127.0.0.1:8000/manager/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document: editingDocument.name,
            metadata: editingDocument.metadata,
          }),
        });
        if (response.ok) {
          setDocuments(documents.map(doc => doc.id === editingDocument.id ? editingDocument : doc));
          setEditingDocument(null);
          toast.success('Metadata updated successfully');
        } else {
          throw new Error('Failed to update metadata');
        }
      } catch (error) {
        console.error('Error updating metadata:', error);
        toast.error('Failed to update metadata');
      }
    }
  }

  const truncateMetadata = (metadata: string, maxLength: number = 30) => {
    return metadata.length > maxLength ? `${metadata.substring(0, maxLength)}...` : metadata
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Documents Uploaded</h1>
          <Button onClick={handleLogout} variant="ghost" className="text-white hover:text-gray-300 hover:bg-gray-700">Logout</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-white">Document Name</TableHead>
              <TableHead className="text-white">Upload Date</TableHead>
              <TableHead className="text-white">Metadata</TableHead>
              <TableHead className="text-white text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="text-white">{doc.name}</TableCell>
                <TableCell className="text-white">{doc.uploadDate}</TableCell>
                <TableCell className="text-white max-w-xs">
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal text-left text-white hover:text-blue-400"
                    onClick={() => setViewingMetadata({ id: doc.id, metadata: doc.metadata })}
                  >
                    {truncateMetadata(doc.metadata)}
                  </Button>
                </TableCell>
                <TableCell className="text-white">
                  <div className="flex items-center justify-start space-x-4">
                    <Button variant="ghost" className="text-white hover:text-gray-300 hover:bg-gray-700" onClick={() => handleEdit(doc)}>Edit Metadata</Button>
                    <Button variant="destructive" onClick={() => handleDelete(doc.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 bg-gray-800 hover:bg-gray-700 text-white">Add Document</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file-upload" className="text-right">
                  Upload File
                </Label>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf"
                      />
                      <span className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors">
                        Choose File
                      </span>
                    </label>
                    <span className="text-gray-400">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file-name" className="text-right">
                  File Name
                </Label>
                <Input
                  id="file-name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                  className="col-span-3 bg-gray-700 text-white"
                  placeholder="Enter file name (optional)"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="metadata" className="text-right pt-2">
                  Metadata (optional)
                </Label>
                <Textarea
                  id="metadata"
                  value={newDocument.metadata}
                  onChange={(e) => setNewDocument({ ...newDocument, metadata: e.target.value })}
                  className="col-span-3 bg-gray-700 text-white min-h-[100px]"
                  placeholder="Enter metadata (comma-separated)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd} disabled={!selectedFile}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {editingDocument && (
          <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
            <DialogContent className="bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Edit Document Metadata</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-metadata" className="text-right">
                    Metadata
                  </Label>
                  <Textarea
                    id="edit-metadata"
                    value={editingDocument.metadata}
                    onChange={(e) => setEditingDocument({ ...editingDocument, metadata: e.target.value })}
                    className="col-span-3 bg-gray-700 text-white min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdate}>Update Metadata</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {viewingMetadata && (
          <Dialog open={!!viewingMetadata} onOpenChange={() => setViewingMetadata(null)}>
            <DialogContent className="bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Full Metadata</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{viewingMetadata.metadata}</p>
              </div>
              <DialogFooter>
                <Button onClick={() => setViewingMetadata(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}

