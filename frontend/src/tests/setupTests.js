import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest'

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  auth: {},
  db: {},
  default: {}
}));

// Mock IntersectionObserver
class IntersectionObserver {
  constructor(callback) {
    this.callback = callback
    this.elements = new Set()
  }

  observe(element) {
    this.elements.add(element)
    this.callback([{ isIntersecting: true, target: element }], this)
  }

  unobserve(element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
  }

  takeRecords() {
    return []
  }
}

global.IntersectionObserver = global.IntersectionObserver || IntersectionObserver
