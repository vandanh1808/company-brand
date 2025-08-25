'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Save } from 'lucide-react'

interface Company {
  _id: string
  name: string
}

export default function NewBrandPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    companyId: ''
  })
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      const data = await response.json()
      if (data.success) {
        setCompanies(data.data)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      toast.error('Failed to fetch companies')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.companyId) {
      toast.error('Please select a company')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Brand created successfully')
        router.push('/admin/brands')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create brand')
      }
    } catch (error) {
      console.error('Error creating brand:', error)
      toast.error('Error creating brand')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/brands">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Brands
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Add New Brand</h1>
            <p className="text-muted-foreground">
              Create a new brand for a company
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Brand Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Brand Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter brand name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyId">Company *</Label>
              <Select value={formData.companyId} onValueChange={(value) => setFormData({...formData, companyId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the brand"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                type="url"
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://brand.com/logo.png"
              />
            </div>

            {/* Preview */}
            {formData.logo && (
              <div className="space-y-2">
                <Label>Logo Preview</Label>
                <div className="w-32 h-32 border border-gray-200 rounded flex items-center justify-center bg-gray-50">
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Brand'}
              </Button>
              <Link href="/admin/brands">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}