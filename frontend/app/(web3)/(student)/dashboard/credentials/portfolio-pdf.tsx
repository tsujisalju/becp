// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/app/(web3)/(student)/dashboard/credentials/portfolio-pdf.tsx
// Description      : React-PDF document component for the student credential portfolio export.
//                    Uses @react-pdf/renderer primitives (Document, Page, View, Text) to produce
//                    a properly formatted PDF — not a browser screenshot. Must be loaded via
//                    next/dynamic with { ssr: false } as react-pdf does not support SSR.
// First Written on : Wednesday, 26-Mar-2026
// Last Modified on : Wednesday, 26-Mar-2026

import { AggregatedSkillScore, HydratedCredential, StudentStats } from "@/hooks/useStudentCredentials";
import { CATEGORY_LABELS, SKILL_LEVELS } from "@becp/shared";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

// ── Styles ────────────────────────────────────────────────────────────────────

const EMERALD = "#059669";
const SLATE = "#475569";
const LIGHT = "#f8fafc";
const BORDER = "#e2e8f0";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    borderBottomWidth: 2,
    borderBottomColor: EMERALD,
    borderBottomStyle: "solid",
    paddingBottom: 12,
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  brand: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: EMERALD,
    letterSpacing: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: SLATE,
    fontFamily: "Helvetica",
  },
  addressRow: {
    marginTop: 4,
    fontSize: 9,
    color: SLATE,
    fontFamily: "Helvetica",
  },
  generatedDate: {
    fontSize: 8,
    color: "#94a3b8",
    marginTop: 2,
  },
  // Stats bar
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: LIGHT,
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: "solid",
    borderRadius: 6,
    padding: 10,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: EMERALD,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 8,
    color: SLATE,
  },
  // Section
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderBottomStyle: "solid",
    paddingBottom: 4,
  },
  // Skills
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderBottomStyle: "solid",
  },
  skillName: {
    flex: 1,
    fontSize: 9,
  },
  skillLevel: {
    fontSize: 8,
    color: SLATE,
    width: 72,
  },
  skillScore: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    width: 48,
    textAlign: "right",
  },
  // Credentials
  credentialRow: {
    padding: 8,
    marginBottom: 6,
    backgroundColor: LIGHT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: BORDER,
    borderStyle: "solid",
  },
  credentialName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  credentialMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 3,
  },
  credentialMetaItem: {
    fontSize: 8,
    color: SLATE,
  },
  credentialSkills: {
    fontSize: 8,
    color: SLATE,
    marginTop: 2,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    borderTopStyle: "solid",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
});

// ── Props ─────────────────────────────────────────────────────────────────────

interface PortfolioPDFDocumentProps {
  displayName: string;
  address: string;
  credentials: HydratedCredential[];
  skillScores: AggregatedSkillScore[];
  stats: StudentStats;
}

// ── Document ──────────────────────────────────────────────────────────────────

export function PortfolioPDFDocument({ displayName, address, credentials, skillScores, stats }: PortfolioPDFDocumentProps) {
  const generatedDate = format(new Date(), "d MMMM yyyy");
  const topSkills = skillScores.slice(0, 10);
  const readyCredentials = credentials.filter((c) => c.metadata !== null);

  return (
    <Document
      title={`BECP Credential Portfolio — ${displayName}`}
      author="BECP Platform"
      subject="Blockchain-verified extracurricular credential portfolio"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.brand}>BECP</Text>
          </View>
          <Text style={styles.title}>{displayName}</Text>
          <Text style={styles.subtitle}>Blockchain-based Extracurricular Credential Portfolio</Text>
          <Text style={styles.addressRow}>Wallet: {address}</Text>
          <Text style={styles.generatedDate}>Generated on {generatedDate} · Optimism Blockchain</Text>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalCredentials}</Text>
            <Text style={styles.statLabel}>Credentials</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.uniqueSkillCount}</Text>
            <Text style={styles.statLabel}>Skills Tracked</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalActivityHours}h</Text>
            <Text style={styles.statLabel}>Activity Hours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {skillScores.filter((s) => s.level === "advanced" || s.level === "expert").length}
            </Text>
            <Text style={styles.statLabel}>Advanced+ Skills</Text>
          </View>
        </View>

        {/* ── Top Skills ── */}
        {topSkills.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Skill Profile</Text>
            {topSkills.map((s) => (
              <View key={s.skill.id} style={styles.skillRow}>
                <Text style={styles.skillName}>{s.skill.label}</Text>
                <Text style={styles.skillLevel}>{SKILL_LEVELS[s.level].label}</Text>
                <Text style={styles.skillScore}>{Math.round(s.totalScore)} pts</Text>
              </View>
            ))}
          </>
        )}

        {/* ── Credentials ── */}
        {readyCredentials.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Credentials ({readyCredentials.length})</Text>
            {readyCredentials.map((cred) => {
              const m = cred.metadata!;
              const skillLabels = m.becp_skills?.map((s) => s.label).join(", ") ?? "—";
              const category = m.becp_activity_category
                ? (CATEGORY_LABELS[m.becp_activity_category] ?? m.becp_activity_category)
                : null;
              return (
                <View key={cred.tokenId.toString()} style={styles.credentialRow}>
                  <Text style={styles.credentialName}>{m.name}</Text>
                  <View style={styles.credentialMeta}>
                    {category && <Text style={styles.credentialMetaItem}>{category}</Text>}
                    {m.becp_activity_date && (
                      <Text style={styles.credentialMetaItem}>{format(new Date(m.becp_activity_date), "d MMM yyyy")}</Text>
                    )}
                    {m.becp_activity_duration_hours != null && (
                      <Text style={styles.credentialMetaItem}>{m.becp_activity_duration_hours}h</Text>
                    )}
                    {m.becp_issuer_name && <Text style={styles.credentialMetaItem}>Issued by {m.becp_issuer_name}</Text>}
                  </View>
                  <Text style={styles.credentialSkills}>Skills: {skillLabels}</Text>
                </View>
              );
            })}
          </>
        )}

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Verified on the Optimism blockchain · BECP Platform</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
