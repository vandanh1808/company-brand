'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'

interface Brand {
  _id: string
  name: string
  companyId: {
    _id: string
    name: string
  }
}

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [] as string[],
    brandId: ''
  })
  const [brands, setBrands] = useState<Brand[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands')
      const data = await response.json()
      if (data.success) {
        setBrands(data.data)
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
      toast.error('Failed to fetch brands')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.brandId) {
      toast.error('Please select a brand')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Product created successfully')
        router.push('/admin/products')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Error creating product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddImage = () => {
    if (!newImageUrl) return
    
    setFormData({
      ...formData,
      images: [...formData.images, newImageUrl]
    })
    setNewImageUrl('')
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">
              Create a new product for a brand
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Fill in the details below to create a new product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandId">Brand *</Label>
              <Select value={formData.brandId} onValueChange={(value) => setFormData({...formData, brandId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand._id} value={brand._id}>
                      {brand.name} - {brand.companyId.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the product"
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label>Product Images</Label>
              <div className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <Button type="button" onClick={handleAddImage}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Image List */}
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                      <img
                        src={imageUrl}
                        alt={`Product image ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder-image.jpg'
                        }}
                      />
                      <div className="flex-1 text-sm text-muted-foreground truncate">
                        {imageUrl}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Preview Grid */}
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  <Label>Images Preview</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="aspect-square border border-gray-200 rounded flex items-center justify-center bg-gray-50 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Preview ${index + 1}`}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Product'}
              </Button>
              <Link href="/admin/products">
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