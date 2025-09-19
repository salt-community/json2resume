import { StyleSheet } from '@react-pdf/renderer'

// Colors matching the Sherlock Holmes design
export const COLORS = {
  primary: '#000000', // Black text
  secondary: '#4a5568', // Dark gray
  sidebarBg: '#2d3748', // Dark gray sidebar background
  sidebarText: '#ffffff', // White text on sidebar
  white: '#ffffff',
  lightGray: '#f7fafc',
  border: '#e2e8f0',
  accent: '#2b6cb0', // Subtle blue for icons/accents
}

// Layout constants
export const LAYOUT = {
  sidebarWidth: '35%',
  mainWidth: '65%',
  pageMargin: 0,
  sidebarPadding: 20,
  mainPadding: 24,
  sectionSpacing: 16,
  itemSpacing: 8,
}

export const styles = StyleSheet.create({
  // Page and main layout
  page: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    margin: LAYOUT.pageMargin,
    height: '100%',
  },

  // Sidebar (left column)
  sidebar: {
    width: LAYOUT.sidebarWidth,
    backgroundColor: COLORS.sidebarBg,
    padding: LAYOUT.sidebarPadding,
    color: COLORS.sidebarText,
    flexDirection: 'column',
  },

  sidebarSection: {
    marginBottom: LAYOUT.sectionSpacing,
  },

  // Portrait
  portrait: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
    objectFit: 'cover',
  },

  // Sidebar headings
  sidebarHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    color: COLORS.sidebarText,
  },

  // Sidebar text
  sidebarText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: COLORS.sidebarText,
    marginBottom: 4,
  },

  sidebarTextBold: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.sidebarText,
    marginBottom: 2,
  },

  // Links
  link: {
    fontSize: 8,
    color: COLORS.sidebarText,
    textDecoration: 'underline',
    marginBottom: 4,
  },

  // Reference section
  referenceItem: {
    marginBottom: 8,
  },

  // Interest/hobby list
  hobbyItem: {
    fontSize: 9,
    color: COLORS.sidebarText,
    marginBottom: 3,
    paddingLeft: 8,
  },

  hobbyBullet: {
    fontSize: 9,
    color: COLORS.sidebarText,
    marginRight: 6,
  },

  // Main content (right column)
  mainContent: {
    width: LAYOUT.mainWidth,
    padding: LAYOUT.mainPadding,
    flexDirection: 'column',
  },

  // Header section
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `1px solid ${COLORS.border}`,
  },

  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: 1,
  },

  jobTitle: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 16,
    marginTop: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  contactIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
  },

  contactText: {
    fontSize: 10,
    color: COLORS.secondary,
  },

  // Main content sections
  section: {
    marginBottom: LAYOUT.sectionSpacing,
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingBottom: 4,
    borderBottom: `1px solid ${COLORS.border}`,
  },

  // Timeline layout for work/education
  timelineContainer: {
    flexDirection: 'column',
  },

  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },

  timelineMarker: {
    width: 20,
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },

  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },

  timelineLine: {
    position: 'absolute',
    left: 4,
    top: 12,
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
  },

  timelineContent: {
    flex: 1,
  },

  // Work/Education item content
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },

  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },

  itemDate: {
    fontSize: 10,
    color: COLORS.secondary,
    textAlign: 'right',
  },

  itemSubtitle: {
    fontSize: 11,
    color: COLORS.secondary,
    marginBottom: 6,
  },

  itemLocation: {
    fontSize: 10,
    color: COLORS.secondary,
    fontStyle: 'italic',
    marginBottom: 6,
  },

  // Bullet points
  bulletList: {
    marginTop: 4,
  },

  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },

  bulletPoint: {
    fontSize: 10,
    color: COLORS.primary,
    marginRight: 6,
    marginTop: 1,
  },

  bulletText: {
    fontSize: 10,
    color: COLORS.primary,
    flex: 1,
    lineHeight: 1.3,
  },

  // Skills section
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  skillColumn: {
    flex: 1,
    minWidth: '45%',
  },

  skillItem: {
    marginBottom: 8,
  },

  skillName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  skillBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },

  skillProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },

  // Languages section
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  languageColumn: {
    flex: 1,
    minWidth: '45%',
  },

  languageItem: {
    marginBottom: 8,
  },

  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  languageBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },

  languageProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
})

// Helper function to get skill level percentage
export const getSkillLevel = (level: string): string => {
  switch (level) {
    case 'Expert':
      return '100%'
    case 'Advanced':
      return '80%'
    case 'Intermediate':
      return '60%'
    case 'Beginner':
      return '40%'
    default:
      return '50%'
  }
}

// Helper function to get language fluency percentage
export const getLanguageFluency = (fluency: string): string => {
  switch (fluency) {
    case 'Native':
      return '100%'
    case 'Full Professional':
      return '90%'
    case 'Professional Working':
      return '75%'
    case 'Limited Working':
      return '50%'
    case 'Elementary':
      return '25%'
    default:
      return '50%'
  }
}
