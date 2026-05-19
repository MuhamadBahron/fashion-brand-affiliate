'use client'

import { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  
  const categories = ['Streetwear', 'Korean Style', 'Old Money']
  const styles = ['Casual', 'Formal', 'Sporty', 'Minimalist']
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }
  
  const handleStyleChange = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    )
  }
  
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-xl transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 space-y-6 overflow-y-auto h-[calc(100%-70px)]">
          {/* Categories */}
          <div>
            <button className="flex justify-between items-center w-full py-2 font-semibold">
              Categories
              <ChevronDown size={18} />
            </button>
            <div className="mt-2 space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    className="w-4 h-4"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Price Range */}
          <div>
            <button className="flex justify-between items-center w-full py-2 font-semibold">
              Price Range
              <ChevronDown size={18} />
            </button>
            <div className="mt-4 space-y-3">
              <input
                type="range"
                min="0"
                max="1000000"
                step="50000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>Rp0</span>
                <span>Rp{priceRange[1].toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
          
          {/* Styles */}
          <div>
            <button className="flex justify-between items-center w-full py-2 font-semibold">
              Style
              <ChevronDown size={18} />
            </button>
            <div className="mt-2 flex flex-wrap gap-2">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => handleStyleChange(style)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    selectedStyles.includes(style)
                      ? 'bg-dark text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 border-t bg-white">
          <button className="w-full btn-primary">
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}