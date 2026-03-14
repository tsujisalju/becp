// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/tests/setup.ts
// Description      : Testing setup file for frontend testing using vitest
// First Written on : Saturday, 14-Mar-2026
// Last Modified on : Saturday, 14-Mar-2026

import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup();
});
