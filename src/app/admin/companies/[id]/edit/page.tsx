'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function EditCompanyPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const companyId = params.id as string

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/companies/${companyId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setFormData({
              name: data.data.name || '',
              description: data.data.description || '',
              address: data.data.address || '',
              phone: data.data.phone || '',
              email: data.data.email || '',
              website: data.data.website || '',
              logo: data.data.logo || ''
            })
          } else {
            toast.error('Failed to fetch company data')
            router.push('/admin/companies')
          }
        } else {
          toast.error('Company not found')
          router.push('/admin/companies')
        }
      } catch (error) {
        console.error('Error fetching company:', error)
        toast.error('Error loading company data')
        router.push('/admin/companies')
      } finally {
        setFetchLoading(false)
      }
    }

    if (companyId) {
      fetchCompany()
    }
  }, [companyId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Company updated successfully')
        router.push('/admin/companies')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update company')
      }
    } catch (error) {
      console.error('Error updating company:', error)
      toast.error('Error updating company')
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

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading company data...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/companies">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Company</h1>
            <p className="text-muted-foreground">
              Update company information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Update the details below to modify the company
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the company"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+84 (0)28 1234 5678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Company address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
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
                  placeholder="https://company.com/logo.png"
                />
              </div>
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
                {loading ? 'Updating...' : 'Update Company'}
              </Button>
              <Link href="/admin/companies">
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