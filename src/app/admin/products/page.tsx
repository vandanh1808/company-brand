'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import { Plus, Edit2, Trash2, Eye, Search, ArrowLeft } from 'lucide-react'

interface Product {
  _id: string
  name: string
  description?: string
  images?: string[]
  brandId: {
    _id: string
    name: string
    companyId: {
      _id: string
      name: string
    }
  }
  createdAt?: string
}

interface Brand {
  _id: string
  name: string
  companyId: {
    _id: string
    name: string
  }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchData()
  }, [router])

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.brandId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brandId.companyId.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const fetchData = async () => {
    try {
      const [productsResponse, brandsResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/brands')
      ])

      const [productsData, brandsData] = await Promise.all([
        productsResponse.json(),
        brandsResponse.json()
      ])

      if (productsData.success) {
        setProducts(productsData.data)
      }
      if (brandsData.success) {
        setBrands(brandsData.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter(product => product._id !== id))
        toast.success('Product deleted successfully')
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl">Loading products...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Manage Products</h1>
            <p className="text-muted-foreground">
              Add, edit, or delete products in the system
            </p>
          </div>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brands.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? 'No products match your search.' : 'No products found.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {product.images && product.images.length > 0 && (
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="font-medium">{product.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.brandId.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {product.brandId.companyId.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.description ? (
                        <div className="text-sm text-muted-foreground">
                          {product.description.length > 50
                            ? `${product.description.substring(0, 50)}...`
                            : product.description}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/products/${product._id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product._id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product._id, product.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}