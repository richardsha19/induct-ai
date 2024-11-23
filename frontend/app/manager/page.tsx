'use client'

import { useState } from 'react'
import { Document } from '../types'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { useRouter } from 'next/navigation'

const initialDocuments: Document[] = [
  { id: '1', name: 'Employee Handbook', uploadDate: '2023-06-01', metadata: 'HR, Policies' },
  { id: '2', name: 'IT Security Guidelines', uploadDate: '2023-05-15', metadata: 'IT, Security' },
  { id: '3', name: 'Onboarding Checklist', uploadDate: '2023-05-30', metadata: 'HR, Onboarding' },
]

export default function ManagerPage() {
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, you'd clear the session/token here
    router.push('/')
  }

  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [newDocument, setNewDocument] = useState<Document>({ id: '', name: '', uploadDate: '', metadata: '' })
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const handleEdit = (document: Document) => {
    setEditingDocument(document)
  }

  const handleAdd = () => {
    if (newDocument.name && newDocument.metadata) {
      setDocuments([...documents, { ...newDocument, id: Date.now().toString(), uploadDate: new Date().toISOString().split('T')[0] }])
      setNewDocument({ id: '', name: '', uploadDate: '', metadata: '' })
    }
  }

  const handleUpdate = () => {
    if (editingDocument) {
      setDocuments(documents.map(doc => doc.id === editingDocument.id ? editingDocument : doc))
      setEditingDocument(null)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Documents Uploaded</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Document Name</TableHead>
            <TableHead className="text-white">Upload Date</TableHead>
            <TableHead className="text-white">Metadata</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="text-white">{doc.name}</TableCell>
              <TableCell className="text-white">{doc.uploadDate}</TableCell>
              <TableCell className="text-white">{doc.metadata}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEdit(doc)}>Edit Metadata</Button>
                <Button variant="destructive" onClick={() => handleDelete(doc.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Add Document</Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Add New Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                className="col-span-3 bg-gray-700 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="metadata" className="text-right">
                Metadata
              </Label>
              <Input
                id="metadata"
                value={newDocument.metadata}
                onChange={(e) => setNewDocument({ ...newDocument, metadata: e.target.value })}
                className="col-span-3 bg-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAdd}>Add Document</Button>
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
                <Input
                  id="edit-metadata"
                  value={editingDocument.metadata}
                  onChange={(e) => setEditingDocument({ ...editingDocument, metadata: e.target.value })}
                  className="col-span-3 bg-gray-700 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdate}>Update Metadata</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

