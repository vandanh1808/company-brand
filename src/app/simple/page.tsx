export default function SimplePage() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        color: '#1e40af',
        fontSize: '48px',
        marginBottom: '20px'
      }}>Simple Test Page</h1>
      
      <p style={{
        color: '#374151',
        fontSize: '18px',
        marginBottom: '30px'
      }}>
        This page uses inline styles instead of Tailwind CSS
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '40px'
      }}>
        <div style={{
          padding: '20px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ color: '#111827', marginBottom: '10px' }}>Card 1</h2>
          <p style={{ color: '#6b7280' }}>This is a test card with inline styles.</p>
        </div>
        
        <div style={{
          padding: '20px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ color: '#111827', marginBottom: '10px' }}>Card 2</h2>
          <p style={{ color: '#6b7280' }}>Another test card to verify layout.</p>
        </div>
        
        <div style={{
          padding: '20px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ color: '#111827', marginBottom: '10px' }}>Card 3</h2>
          <p style={{ color: '#6b7280' }}>Third card for testing.</p>
        </div>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <a href="/" style={{
          color: '#2563eb',
          textDecoration: 'underline',
          fontSize: '16px'
        }}>← Back to Home</a>
      </div>
    </div>
  )
}