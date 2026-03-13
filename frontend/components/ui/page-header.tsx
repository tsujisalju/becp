// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/components/ui/page-header.tsx
// Description      : Page header for showing title and description
// First Written on : Wednesday, 11-Mar-2026
// Last Modified on : Thursday, 12-Mar-2026

export default function PageHeader({ title, desc }: { title: string, desc?: string }) {
  return (
    <div>
      <h1 className="font-bold text-2xl">{title}</h1>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  )
}
